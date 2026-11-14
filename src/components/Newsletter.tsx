'use client'

import { useActionState } from 'react'
import { ArrowRight } from 'lucide-react'
import { subscribe, type FormState } from '@/app/(frontend)/actions'

export function Newsletter() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { status: 'idle' })
  return (
    <>
      <form className="newsletter" action={action}>
        <label className="sr-only" htmlFor="newsletter-email">Business email</label>
        <input id="newsletter-email" name="email" type="email" required placeholder="Your business email" autoComplete="email" />
        <input className="hp" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden />
        <button className="btn btn-gold btn-sm" disabled={pending}>{pending ? 'Sending…' : 'Subscribe'} <ArrowRight /></button>
      </form>
      <p className="newsletter-status" role="status">{state.status !== 'idle' ? state.message : ''}</p>
    </>
  )
}
