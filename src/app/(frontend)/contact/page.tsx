import type { Metadata } from 'next'
import { ApplicationForm, Hero, Section } from '@/components/iff'

export const metadata: Metadata = { title: 'Contact & Partnerships', description: 'Start a membership, institutional partnership or executive dialogue with the Indian Financial Forum.' }

const interestMap: Record<string, string> = { membership: 'Membership', partnership: 'Institutional Partnership', 'Institutional Partnership': 'Institutional Partnership', roundtable: 'Executive Roundtables', speaking: 'Speaking Opportunities' }

export default async function Contact({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const interest = sp.interest ? interestMap[sp.interest] ?? sp.interest : undefined
  return <><Hero eyebrow="PARTNERSHIP & INQUIRIES" title={<>Let’s start something<br /><em>meaningful.</em></>} description="Whether you want to join the IFF ecosystem, explore an enterprise partnership, or collaborate with the BFSI community, tell us about yourself and we’ll connect you with the right team." action="Get In Touch" /><Section id="contact-form"><div className="contact-grid"><div><h2>Get In Touch With Us</h2><p className="intro-copy">Fill in the details below to initiate an executive consultation or partnership dialogue.</p><ApplicationForm defaultInterest={interest} event={sp.event} sourcePage="/contact" /></div></div></Section></>
}
