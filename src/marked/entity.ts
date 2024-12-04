// A DiscordEntity is an object with an id that you can look up on a Discord server (guild).
export interface DiscordEntity {
  // Note: "Channel" refers to any kind of channel that one can refer to in a Discord message.
  // E.g. TextChannel, AnnouncementChannel, etc.
  type: 'Channel' | 'User' | 'Role' | 'Emoji'
  id: string
  // "name" and "isAnimated" are only set for Emoji entities.
  name?: string
  isAnimated?: boolean
}
