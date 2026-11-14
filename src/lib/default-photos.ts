import type { Media } from '@/payload-types'

/**
 * IFF's own event photographs (from the team's shared Drive folder), optimised into public/photos.
 * Used wherever nothing has been uploaded in Admin → Page photographs (or on an event);
 * an uploaded photo always takes precedence.
 */
const LOVABLE = 'https://indianfinancialforum.lovable.app/__l5e/assets-v1'

const photo = (name: string, largeWidth: number, alt: string): Media =>
  ({
    id: 0,
    url: `/photos/${name}-${largeWidth}.jpg`,
    width: largeWidth,
    alt,
    filename: `${name}-${largeWidth}.jpg`,
    sizes: { card: { url: `/photos/${name}-960.jpg`, width: 960 } },
    createdAt: '',
    updatedAt: '',
  }) as Media

export const photos = {
  communityCelebration: photo('community-celebration', 2400, 'IFF members celebrating together at a community meetup'),
  communityGroup: photo('community-group', 2400, 'Group photo of IFF members at an evening meetup'),
  membersListening: photo('members-listening', 2400, 'IFF members listening to a talk at a community evening'),
  speakerMic: photo('speaker-mic', 2400, 'A speaker addressing the IFF community'),
  networkingConversation: photo('networking-conversation', 2400, 'Members in conversation at an IFF networking evening'),
  leadershipDinner: photo('leadership-dinner', 2400, 'IFF members at a leadership dinner'),
  cricketMeetup: photo('cricket-meetup', 2400, 'IFF community cricket meetup'),
  networkingEvening: photo('networking-evening', 1600, 'Professionals networking at an IFF event'),
  leadersGathering: photo('leaders-gathering', 1600, 'BFSI leaders at an IFF gathering'),
  knowledgeSession: photo('knowledge-session', 1600, 'Audience at an IFF knowledge session'),
  panelDiscussion: photo('panel-discussion', 1280, 'Panel of speakers at an IFF session'),
  cricketTeam: photo('cricket-team', 1280, 'IFF members at a community sports day'),
}

export const lovableLogo = { id: 0, url: `${LOVABLE}/13faea95-bf22-4fe5-8cc6-a0f3f2a17859/iff-logo.svg`, alt: 'Indian Financial Forum', width: 145, height: 50, createdAt: '', updatedAt: '' } as Media

const P = photos
/** Hero / closing-banner defaults per page — only the high-resolution photos go full-width. */
export const defaultPageImages = {
  home: { hero: P.communityCelebration, banner: P.communityGroup },
  about: { hero: P.membersListening, banner: P.leadersGathering },
  professionals: { hero: P.networkingConversation, banner: P.cricketMeetup },
  organisations: { hero: P.leadershipDinner, banner: P.networkingEvening },
  events: { hero: P.cricketMeetup, banner: P.membersListening },
  knowledgeHub: { hero: P.knowledgeSession, banner: P.networkingConversation },
  jobSeekers: { hero: P.networkingEvening, banner: P.leadershipDinner },
  speaking: { hero: P.speakerMic, banner: P.communityCelebration },
  contact: { hero: P.leadersGathering, banner: P.communityGroup },
}

export const defaultFeatureImages = {
  summit: P.communityCelebration,
  organisationsFeature: P.leadersGathering,
  careersFeature: P.networkingConversation,
  aboutStory: P.panelDiscussion,
  gallery: [P.membersListening, P.cricketMeetup, P.leadershipDinner, P.panelDiscussion, P.speakerMic, P.networkingEvening, P.knowledgeSession, P.cricketTeam],
}

export const defaultEventImage: Record<string, Media> = {
  summit: P.communityCelebration,
  roundtable: P.leadershipDinner,
  webinar: P.knowledgeSession,
  networking: P.networkingEvening,
  weekly: P.leadersGathering,
}
