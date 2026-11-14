'use server'

import { headers } from 'next/headers'
import { payloadClient } from '@/lib/payload'
import type { Submission } from '@/payload-types'

export type FormState = { status: 'idle' | 'success' | 'error'; message?: string; errors?: Record<string, string> }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MAX_RESUME = 5 * 1024 * 1024
const RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const KINDS = ['contact', 'membership', 'partnership', 'career', 'speaker', 'event'] as const
type Kind = (typeof KINDS)[number]

// Best-effort throttle per client IP (per server instance) to blunt form spam.
const hits = new Map<string, number[]>()
async function throttled() {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 8
}

const text = (fd: FormData, key: string, max = 500) => {
  const v = fd.get(key)
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function submitEnquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  if (text(fd, 'company_website')) return { status: 'success', message: 'Thank you.' } // honeypot
  if (await throttled()) return { status: 'error', message: 'Too many submissions from your network. Please try again in a few minutes.' }

  const requestedKind = text(fd, 'kind') as Kind
  const interest = text(fd, 'interest', 200)
  let kind: Kind = KINDS.includes(requestedKind) ? requestedKind : 'contact'
  if (kind === 'contact') {
    const map: Record<string, Kind> = { Membership: 'membership', 'Institutional Partnership': 'partnership', Sponsorship: 'partnership', 'Speaking Opportunities': 'speaker', 'Event participation': 'event' }
    kind = map[interest] ?? 'contact'
  }

  const data = {
    kind,
    name: text(fd, 'name', 120),
    email: text(fd, 'email', 200).toLowerCase(),
    phone: text(fd, 'phone', 40),
    organisation: text(fd, 'organisation', 200),
    designation: text(fd, 'designation', 200),
    linkedin: text(fd, 'linkedin', 300),
    city: text(fd, 'city', 100),
    interest,
    message: text(fd, 'message', 5000),
    experience: text(fd, 'experience', 5000),
    sourcePage: text(fd, 'sourcePage', 200),
  }

  const errors: Record<string, string> = {}
  if (!data.name) errors.name = 'Please enter your name.'
  if (!EMAIL.test(data.email)) errors.email = 'Please enter a valid email address.'
  for (const key of (text(fd, 'required', 300) || '').split(',').filter(Boolean)) {
    if (!(data as Record<string, string>)[key] && key !== 'resume') errors[key] = 'This field is required.'
  }
  if (data.linkedin && !/^https?:\/\//i.test(data.linkedin)) data.linkedin = `https://${data.linkedin}`

  const resume = fd.get('resume')
  const hasResume = resume instanceof File && resume.size > 0
  if (kind === 'career') {
    if (!hasResume) errors.resume = 'Please attach your résumé.'
    else if (resume.size > MAX_RESUME) errors.resume = 'Résumé must be 5 MB or smaller.'
    else if (!RESUME_TYPES.includes(resume.type)) errors.resume = 'Upload a PDF, DOC or DOCX file.'
  }
  if (Object.keys(errors).length) return { status: 'error', message: 'Please check the highlighted fields.', errors }

  try {
    const payload = await payloadClient()
    let resumeId: number | undefined
    if (kind === 'career' && hasResume) {
      try {
        const doc = await payload.create({
          collection: 'resumes',
          data: { candidate: `${data.name} <${data.email}>` },
          file: { data: Buffer.from(await resume.arrayBuffer()), mimetype: resume.type, name: resume.name.replace(/[^\w.\-]+/g, '_'), size: resume.size },
        })
        resumeId = doc.id
      } catch (err) {
        if ((err as { name?: string }).name === 'ValidationError') return { status: 'error', message: 'Please check the highlighted fields.', errors: { resume: 'We couldn’t read that file. Please upload a valid PDF, DOC or DOCX.' } }
        throw err
      }
    }
    let eventId: number | undefined
    const eventSlug = text(fd, 'event', 120)
    if (eventSlug) {
      const found = await payload.find({ collection: 'events', where: { slug: { equals: eventSlug } }, limit: 1, depth: 0 })
      eventId = found.docs[0]?.id
    }
    await payload.create({ collection: 'submissions', data: { ...data, resume: resumeId, event: eventId, status: 'new' } as Omit<Submission, 'id' | 'createdAt' | 'updatedAt'> })
    return { status: 'success' }
  } catch (err) {
    console.error('Enquiry submission failed', err)
    return { status: 'error', message: 'Something went wrong while sending your details. Please try again, or email us directly.' }
  }
}

export async function subscribe(_prev: FormState, fd: FormData): Promise<FormState> {
  if (text(fd, 'company_website')) return { status: 'success', message: 'Thank you for subscribing.' }
  const email = text(fd, 'email', 200).toLowerCase()
  if (!EMAIL.test(email)) return { status: 'error', message: 'Please enter a valid email address.' }
  if (await throttled()) return { status: 'error', message: 'Please try again in a few minutes.' }
  try {
    const payload = await payloadClient()
    const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: email } }, limit: 1, depth: 0 })
    if (!existing.docs.length) await payload.create({ collection: 'subscribers', data: { email } })
    return { status: 'success', message: 'Thank you — you’re on the list.' }
  } catch (err) {
    console.error('Newsletter subscription failed', err)
    return { status: 'error', message: 'We couldn’t subscribe you just now. Please try again.' }
  }
}
