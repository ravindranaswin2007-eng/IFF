import type { Metadata } from 'next'
import { ApplicationForm, Callout, Hero, Section } from '@/components/iff'
import { slot } from '@/lib/default-photos'
import { getPageImages, mediaUrl } from '@/lib/payload'

export const metadata: Metadata = { title: 'Grow Your Career', description: 'Discover career connections, hiring partners and community-led opportunities across the IFF network.' }

export default async function Careers() {
  const { hero } = await getPageImages('jobSeekers')
  return <><Hero eyebrow="CAREERS AT IFF / Job Seekers" title={<>Grow Your Career with<br />the IFF Network</>} description="Discover career opportunities, connect with hiring partners and become part of a growing network of BFSI professionals." image={mediaUrl(hero) ?? slot.jobSeekersHero} caption="Executive Career Pipeline" action="Submit Your Profile" to="/job-seekers" stats={ [['500+', 'BFSI Institutions'], ['C-Suite', 'Leadership Reach'], ['Direct', 'Partner Introductions']] } /><Section id="profile" eyebrow="DIRECT NETWORK INFLOW" title="Submit Your Profile" description="Share your details with IFF to be considered for relevant career opportunities and introductions through our network."><div className="form-width"><ApplicationForm kind="career" sourcePage="/job-seekers" /></div></Section><Callout title="Ready for what comes next?" text="Your next role, connection or opportunity may already be closer than you think." action="Submit Your Profile" to="/job-seekers" /></>
}
