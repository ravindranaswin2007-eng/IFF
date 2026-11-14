import type { Media } from '@/payload-types'

/**
 * Interim photographs from the original Lovable site, hot-linked from its published domain.
 * Used only where nothing has been uploaded in Admin → Page photographs (or on an event);
 * an uploaded photo always takes precedence.
 */
const LOVABLE = 'https://indianfinancialforum.lovable.app/__l5e/assets-v1'

const photo = (path: string, alt: string): Media =>
  ({ id: 0, url: `${LOVABLE}/${path}`, alt, filename: path.split('/').pop(), createdAt: '', updatedAt: '' }) as Media

export const lovable = {
  careerConversation: photo('b374f820-9464-4d15-8b4e-286acd38b5b8/career-conversation.jpg', 'Financial professionals in conversation'),
  careerMeeting: photo('406989be-fbca-439d-8240-7b35c2d04471/career-meeting.jpg', 'Executives meeting at an IFF session'),
  eventHighlight: photo('fa25de18-0410-4148-922a-4f644e46a6bf/event-highlight.jpg', 'Panel conversation at an IFF event'),
  executiveRoundtable: photo('1184ba59-cb5e-4495-82a8-8fc5c3609391/executive-roundtable.jpg', 'IFF executive roundtable discussion'),
  financialCommunity: photo('2144b896-86d1-427e-a2d1-3fff2770be21/financial-community.jpg', 'Financial leaders connecting at an IFF gathering'),
  leadershipDialogue: photo('12ad3161-3557-46af-abab-76f81bd960aa/leadership-dialogue.jpg', 'Leaders in dialogue'),
  leadershipSummit: photo('8929f2e8-5510-4ae1-987b-865a8708bcec/leadership-summit.jpg', 'Leaders at the IFF leadership summit'),
  organisationsPanel: photo('34662253-db0b-4e74-9fe2-ed4b6472dd23/organisations-panel.jpg', 'BFSI leaders on stage at an industry discussion'),
  organisationsReception: photo('349c76ce-9cf1-456b-ab4b-e29071fe8205/organisations-reception.jpg', 'Senior BFSI leaders at an evening reception'),
  organisationsRoundtable: photo('de734c76-2af0-4c29-bcdf-6f695a80ac77/organisations-roundtable.jpg', 'Senior BFSI leaders in a strategic roundtable'),
  professionalsGathering: photo('d5643369-a144-4f43-be8c-8e8e37f78f5d/professionals-gathering.jpg', 'Professionals networking at an IFF gathering'),
  professionalsSkyline: photo('9a0a1a26-a164-475e-8399-cc4df1502809/professionals-skyline.jpg', 'Professionals networking against a city skyline'),
}

export const lovableLogo = { id: 0, url: `${LOVABLE}/13faea95-bf22-4fe5-8cc6-a0f3f2a17859/iff-logo.svg`, alt: 'Indian Financial Forum', width: 145, height: 50, createdAt: '', updatedAt: '' } as Media

const L = lovable
/** Hero / closing-banner defaults per page — the larger, sharper originals go full-width. */
export const defaultPageImages = {
  home: { hero: L.professionalsGathering, banner: L.organisationsReception },
  about: { hero: L.organisationsRoundtable, banner: L.professionalsSkyline },
  professionals: { hero: L.professionalsGathering, banner: L.professionalsSkyline },
  organisations: { hero: L.organisationsRoundtable, banner: L.organisationsReception },
  events: { hero: L.organisationsPanel, banner: L.professionalsGathering },
  knowledgeHub: { hero: L.professionalsSkyline, banner: L.organisationsPanel },
  jobSeekers: { hero: L.professionalsSkyline, banner: L.organisationsRoundtable },
  speaking: { hero: L.organisationsPanel, banner: L.professionalsSkyline },
  contact: { hero: L.organisationsReception, banner: L.professionalsGathering },
}

export const defaultFeatureImages = {
  summit: L.leadershipSummit,
  organisationsFeature: L.organisationsPanel,
  careersFeature: L.careerConversation,
  aboutStory: L.leadershipDialogue,
  gallery: [L.eventHighlight, L.careerMeeting, L.executiveRoundtable, L.financialCommunity, L.leadershipSummit, L.leadershipDialogue],
}

export const defaultEventImage: Record<string, Media> = {
  summit: L.leadershipSummit,
  roundtable: L.executiveRoundtable,
  webinar: L.careerMeeting,
  networking: L.financialCommunity,
  weekly: L.eventHighlight,
}
