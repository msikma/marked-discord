import type {DiscordEntity} from '../entity.ts'
import type {Tokens, TokenizerExtension} from 'marked'

const extensionName = 'discordUserMention'
const apiObject = 'User'

export interface UserMentionToken {
  type: string
  raw: string
  userId: string
}

export const getDiscordUserMentionEntity = (token: Tokens.Generic): DiscordEntity[] => {
  if (token.type !== extensionName) {
    return []
  }
  return [{type: apiObject, id: token.userId}]
}

export const discordUserMention: TokenizerExtension = {
  name: extensionName,
  level: 'inline',
  start: (input: string) => input.indexOf('<@'),
  tokenizer: (input: string): UserMentionToken | undefined => {
    // Note: the ! does not do or change anything.
    const match = input.match(/^<@!?(\d{17,20})>/)
    if (match) {
      return {
        type: extensionName,
        raw: match[0],
        userId: match[1],
      }
    }
    return undefined
  },
}
