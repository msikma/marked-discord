import type {DiscordEntity} from '../entity.ts'
import type {Tokens, TokenizerExtension} from 'marked'

const extensionName = 'discordServerEmoji'
const apiObject = 'Emoji'

export interface ServerEmojiToken {
  type: string
  raw: string
  emojiIsAnimated: boolean
  emojiName: string
  emojiId: string
}

export const getDiscordEmojiEntity = (token: Tokens.Generic): DiscordEntity[] => {
  if (token.type !== extensionName) {
    return []
  }
  return [{
    type: apiObject,
    id: token.emojiId,
    name: token.emojiName,
    isAnimated: token.emojiIsAnimated
  }]
}

export const discordServerEmoji: TokenizerExtension = {
  name: extensionName,
  level: 'inline',
  start: (input: string) => input.indexOf('<:') || input.indexOf('<a:'),
  tokenizer: (input: string): ServerEmojiToken | undefined => {
    const match = input.match(/^<(a?):([a-z_]{2,}):(\d{17,20})>/)
    if (match) {
      return {
        type: extensionName,
        raw: match[0],
        emojiIsAnimated: match[1] === 'a',
        emojiName: match[2],
        emojiId: match[3],
      }
    }
    return undefined
  },
}
