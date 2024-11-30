import type {TokenizerExtension} from 'marked'

const extensionName = 'discordServerMention'

export type mentionType = 'everyone' | 'here'
export interface ServerMentionToken {
  type: string
  raw: string
  mentionType: mentionType
}

export const discordServerMention: TokenizerExtension = {
  name: extensionName,
  level: 'inline',
  start: (input: string) => (input.includes('@everyone') || input.includes('@here')) ? 0 : -1,
  tokenizer: (input: string): ServerMentionToken | undefined => {
    const match = input.match(/^@(everyone|here)/)
    if (match) {
      const mentionType: mentionType = match[1] === 'everyone' ? 'everyone' : 'here'
      return {
        type: extensionName,
        raw: match[0],
        mentionType,
      }
    }
    return undefined
  },
}
