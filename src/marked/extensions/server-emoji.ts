import type {DiscordEntity} from '../entity.ts'
import type {Tokens, TokenizerExtension} from 'marked'

const extensionName = 'discordServerEmoji'
const apiObject = 'Emoji'

export interface ServerEmojiToken {
  type: string
  raw: string
  emojiName: string
  emojiId: string
}

export const getDiscordEmojiEntity = (token: Tokens.Generic): DiscordEntity[] => {
  if (token.type !== extensionName) {
    return []
  }
  return [{type: apiObject, id: token.emojiId, name: token.emojiName}]
}

export const discordServerEmoji: TokenizerExtension = {
  name: extensionName,
  level: 'inline',
  start: (input: string) => input.indexOf('<:'),
  tokenizer: (input: string): ServerEmojiToken | undefined => {
    const match = input.match(/^<:([a-z_]{2,}):(\d{17,20})>/)
    if (match) {
      return {
        type: extensionName,
        raw: match[0],
        emojiName: match[1],
        emojiId: match[2],
      }
    }
    return undefined
  },
}
