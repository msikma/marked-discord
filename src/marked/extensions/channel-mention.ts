import type {DiscordEntity} from '../entity.ts'
import type {Tokens, TokenizerExtension} from 'marked'

const extensionName = 'discordChannelMention'
const apiObject = 'TextChannel'

export interface ChannelMentionToken {
  type: string
  raw: string
  channelId: string
}

export const getDiscordChannelMentionEntity = (token: Tokens.Generic): DiscordEntity[] => {
  if (token.type !== extensionName) {
    return []
  }
  return [{type: apiObject, id: token.channelId}]
}

export const discordChannelMention: TokenizerExtension = {
  name: extensionName,
  level: 'inline',
  start: (input: string) => input.indexOf('<#'),
  tokenizer: (input: string): ChannelMentionToken | undefined => {
    const match = input.match(/^<#(\d{17,20})>/)
    if (match) {
      return {
        type: extensionName,
        raw: match[0],
        channelId: match[1],
      }
    }
    return undefined
  },
}
