import type {TokenizerExtension} from 'marked'

const extensionName = 'discordSubtext'

export interface SubtextToken {
  type: string
  raw: string
  text: string
  tokens: []
}

export const discordSubtext: TokenizerExtension = {
  name: extensionName,
  level: 'block',
  start: (input: string) => input.indexOf('-# '),
  tokenizer(input: string): SubtextToken | undefined {
    const match = input.match(/^-# (.+?)($|\n)/)
    if (match) {
      const token = {
        type: extensionName,
        raw: match[0],
        text: match[1],
        tokens: [],
      }
      this.lexer.inline(token.text, token.tokens)
      return token as SubtextToken
    }
    return undefined
  },
}
