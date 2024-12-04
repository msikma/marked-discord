// A DiscordEntity is an object with an id that you can look up on a Discord server (guild).
export interface DiscordEntity {
  type: 'TextChannel' | 'User' | 'Role' | 'Emoji'
  id: string
  // "name" and "isAnimated" are only set for Emoji entities.
  name?: string
  isAnimated?: boolean
}
