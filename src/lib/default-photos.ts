/**
 * IFF's own event photographs (from the team's shared Drive folder), optimised into public/photos.
 * They fill the client's image slots wherever nothing has been uploaded in
 * Admin → Page photographs (or on an event / Knowledge Hub item). Uploads always take precedence.
 */
const p = (name: string, size: number) => `/photos/${name}-${size}.jpg`

export const photo = {
  communityCelebration: p('community-celebration', 2400),
  communityGroup: p('community-group', 960),
  cricketMeetup: p('cricket-meetup', 960),
  cricketTeam: p('cricket-team', 960),
  knowledgeSession: p('knowledge-session', 960),
  leadersGathering: p('leaders-gathering', 960),
  leadersGatheringLarge: p('leaders-gathering', 1600),
  leadershipDinner: p('leadership-dinner', 960),
  leadershipDinnerLarge: p('leadership-dinner', 2400),
  membersListening: p('members-listening', 960),
  networkingConversation: p('networking-conversation', 960),
  networkingConversationLarge: p('networking-conversation', 2400),
  networkingEvening: p('networking-evening', 960),
  panelDiscussion: p('panel-discussion', 960),
  panelDiscussionLarge: p('panel-discussion', 1280),
  speakerMic: p('speaker-mic', 960),
}

/** Default photo for each image slot in the client's design. */
export const slot = {
  aboutHero: photo.communityGroup,
  eventsHero: photo.membersListening,
  eventsSummit: photo.communityCelebration,
  eventsStrip: [
    { src: photo.cricketMeetup, alt: 'IFF community cricket meetup' },
    { src: photo.networkingEvening, alt: 'Professionals networking at an IFF event' },
    { src: photo.knowledgeSession, alt: 'Audience at an IFF knowledge session' },
    { src: photo.speakerMic, alt: 'A speaker addressing the IFF community' },
    { src: photo.cricketTeam, alt: 'IFF members at a community sports day' },
  ],
  jobSeekersHero: photo.networkingEvening,
  speakingHero: photo.speakerMic,
  professionalsHero: photo.networkingConversationLarge,
  professionalsBanner: photo.communityCelebration,
  organisationsHero: photo.leadershipDinnerLarge,
  organisationsFeature: photo.panelDiscussionLarge,
  organisationsBanner: photo.leadersGatheringLarge,
  knowledgeBlogs: [photo.networkingConversation, photo.panelDiscussion, photo.membersListening, photo.leadersGathering],
  knowledgeWebinars: [photo.knowledgeSession, photo.speakerMic, photo.leadershipDinner, photo.cricketMeetup],
}

/** Default photo for an event, by category, when the event has no image of its own. */
export const eventPhoto: Record<string, string> = {
  summit: photo.communityCelebration,
  roundtable: photo.leadershipDinner,
  webinar: photo.knowledgeSession,
  networking: photo.networkingEvening,
  weekly: photo.leadersGathering,
}

export const lovableLogo = {
  id: 0,
  url: 'https://indianfinancialforum.lovable.app/__l5e/assets-v1/13faea95-bf22-4fe5-8cc6-a0f3f2a17859/iff-logo.svg',
  alt: 'Indian Financial Forum',
  width: 145,
  height: 50,
  createdAt: '',
  updatedAt: '',
}
