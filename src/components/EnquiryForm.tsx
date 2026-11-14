'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useActionState, useState } from 'react'
import { AlertCircle, ArrowRight, Check, ShieldCheck, Upload } from 'lucide-react'
import { submitEnquiry, type FormState } from '@/app/(frontend)/actions'

type Field = { name: string; label: string; type?: 'text' | 'email' | 'url' | 'tel' | 'textarea' | 'select' | 'file'; required?: boolean; full?: boolean; placeholder?: string; options?: string[]; autoComplete?: string }

const presets: Record<'contact' | 'career' | 'speaker', { fields: Field[]; submit: string; success: string }> = {
  contact: {
    submit: 'Send enquiry',
    success: 'Thank you for reaching out. A member of the IFF team will get back to you shortly.',
    fields: [
      { name: 'name', label: 'Full name', required: true, autoComplete: 'name' },
      { name: 'email', label: 'Work email', type: 'email', required: true, autoComplete: 'email', placeholder: 'name@organisation.com' },
      { name: 'organisation', label: 'Organisation', required: true, autoComplete: 'organization' },
      { name: 'designation', label: 'Designation', autoComplete: 'organization-title' },
      { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
      { name: 'interest', label: 'What would you like to explore?', type: 'select', required: true, options: ['Membership', 'Institutional Partnership', 'Sponsorship', 'Executive Roundtables', 'Event participation', 'Speaking Opportunities', 'Career Connections', 'Other'] },
      { name: 'message', label: 'Message', type: 'textarea', full: true, placeholder: 'Tell us about your objectives, timelines or any specific agenda.' },
    ],
  },
  career: {
    submit: 'Submit profile',
    success: 'Your profile has been received. We’ll reach out when a relevant opportunity or introduction comes up.',
    fields: [
      { name: 'name', label: 'Full name', required: true, autoComplete: 'name' },
      { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
      { name: 'organisation', label: 'Current organisation', required: true, autoComplete: 'organization' },
      { name: 'designation', label: 'Current designation', required: true, autoComplete: 'organization-title' },
      { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
      { name: 'linkedin', label: 'LinkedIn profile', type: 'url', placeholder: 'https://www.linkedin.com/in/…' },
      { name: 'resume', label: 'Résumé', type: 'file', required: true, full: true },
      { name: 'message', label: 'Roles or functions you’re interested in', type: 'textarea', full: true },
    ],
  },
  speaker: {
    submit: 'Submit application',
    success: 'Thank you for applying. Our programming team reviews every application and will be in touch.',
    fields: [
      { name: 'name', label: 'Full name', required: true, autoComplete: 'name' },
      { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
      { name: 'organisation', label: 'Organisation', required: true, autoComplete: 'organization' },
      { name: 'designation', label: 'Designation', required: true, autoComplete: 'organization-title' },
      { name: 'linkedin', label: 'LinkedIn profile', type: 'url', required: true, placeholder: 'https://www.linkedin.com/in/…' },
      { name: 'interest', label: 'Areas of expertise', required: true, placeholder: 'e.g. Digital lending, risk, treasury' },
      { name: 'message', label: 'Short bio', type: 'textarea', required: true, full: true },
      { name: 'experience', label: 'Previous speaking experience', type: 'textarea', full: true, placeholder: 'Panels, keynotes, podcasts or publications.' },
    ],
  },
}

export function EnquiryForm({ kind, defaults = {}, event, sourcePage }: { kind: keyof typeof presets; defaults?: Record<string, string>; event?: string; sourcePage?: string }) {
  const preset = presets[kind]
  const [state, action, pending] = useActionState<FormState, FormData>(submitEnquiry, { status: 'idle' })
  const [fileName, setFileName] = useState('')
  const required = preset.fields.filter((f) => f.required).map((f) => f.name).join(',')

  return (
    <div className="form-card">
      <AnimatePresence mode="wait">
        {state.status === 'success' ? (
          <motion.div key="done" className="form-success" role="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <motion.div className="tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}><Check /></motion.div>
            <h3>Received — thank you.</h3>
            <p className="muted">{preset.success}</p>
          </motion.div>
        ) : (
          <motion.form key="form" action={action} noValidate={false} initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
            <input type="hidden" name="kind" value={kind === 'contact' ? 'contact' : kind} />
            <input type="hidden" name="required" value={required} />
            {event && <input type="hidden" name="event" value={event} />}
            {sourcePage && <input type="hidden" name="sourcePage" value={sourcePage} />}
            <input className="hp" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden />
            <div className="form-grid">
              {preset.fields.map((f) => {
                const error = state.errors?.[f.name]
                const label = <span>{f.label}{f.required ? <span className="req" aria-hidden>*</span> : <small>(optional)</small>}</span>
                const common = { id: `f-${f.name}`, name: f.name, required: f.required, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `e-${f.name}` : undefined }
                return (
                  <label key={f.name} className={`field${f.full || f.type === 'textarea' ? ' full' : ''}`} htmlFor={common.id}>
                    {label}
                    {f.type === 'textarea' ? (
                      <textarea {...common} rows={4} placeholder={f.placeholder} defaultValue={defaults[f.name]} />
                    ) : f.type === 'select' ? (
                      <select {...common} defaultValue={defaults[f.name] ?? ''}>
                        <option value="" disabled>Select an option</option>
                        {f.options!.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'file' ? (
                      <span className="upload">
                        <Upload aria-hidden />
                        <span>{fileName || 'Click or drop your résumé here'}<small>PDF, DOC or DOCX · up to 5 MB</small></span>
                        <input {...common} type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />
                      </span>
                    ) : (
                      <input {...common} type={f.type ?? 'text'} placeholder={f.placeholder} autoComplete={f.autoComplete} defaultValue={defaults[f.name]} />
                    )}
                    {error && <span className="error" id={`e-${f.name}`}>{error}</span>}
                  </label>
                )
              })}
            </div>
            {state.status === 'error' && state.message && <div className="form-alert error" role="alert"><AlertCircle />{state.message}</div>}
            <div className="form-foot">
              <span className="note"><ShieldCheck />Your details are kept confidential.</span>
              <button className="btn" disabled={pending}>{pending ? 'Sending…' : preset.submit} <ArrowRight /></button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
