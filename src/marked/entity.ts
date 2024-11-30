export interface DiscordEntity {
  type: 'TextChannel' | 'User' | 'Role' | 'Emoji'
  name?: string
  id: string
}
