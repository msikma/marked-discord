import type {DiscordEntity} from '../entity.ts'
import type {Tokens, TokenizerExtension} from 'marked'

const extensionName = 'discordRoleMention'
const apiObject = 'Role'

export interface RoleMentionToken {
  type: string
  raw: string
  roleId: string
}

export const getDiscordRoleMentionEntity = (token: Tokens.Generic): DiscordEntity[] => {
  if (token.type !== extensionName) {
    return []
  }
  return [{type: apiObject, id: token.roleId}]
}

export const discordRoleMention: TokenizerExtension = {
  name: extensionName,
  level: 'inline',
  start: (input: string) => input.indexOf('<@&'),
  tokenizer: (input: string): RoleMentionToken | undefined => {
    const match = input.match(/^<@&(\d{17,20})>/)
    if (match) {
      return {
        type: extensionName,
        raw: match[0],
        roleId: match[1],
      }
    }
    return undefined
  },
}
