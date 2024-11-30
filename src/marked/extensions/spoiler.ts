import type {TokenizerExtension} from 'marked'

const extensionName = 'discordSpoiler'

export interface SpoilerToken {
  type: string
  raw: string
  text: string
  tokens: []
}

export const discordSpoiler: TokenizerExtension = {
  name: extensionName,
  level: 'inline',
  start: (input: string) => input.indexOf('||'),
  tokenizer(input: string): SpoilerToken | undefined {
    const match = input.match(/^\|\|([\s\S]+?)\|\|/)
    if (match) {
      const token =  {
        type: extensionName,
        raw: match[0],
        text: match[1],
        tokens: [],
      }
      this.lexer.inline(token.text, token.tokens)
      return token as SpoilerToken
    }
    return undefined
  },
}
