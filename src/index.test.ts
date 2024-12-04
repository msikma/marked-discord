import {describe, it, expect} from 'vitest'
import type {Tokens} from 'marked'
import {MarkedDiscord, discordTokenNames} from './index.ts'

/**
 * Test function that parses a given Markdown string and returns the internal "paragraph" token.
 * 
 * All parsed Markdown files are wrapped in a paragraph container. Unpacking it makes it easier to test.
 * 
 * The only exception is the "discordSubtext" token, which is a block token, meaning it does not
 * have an internal paragraph inside. In that one particular case we're not unpacking it.
 */
export function getInnerTokens(inputMarkdown: string, noUnpack: boolean = false) {
  const lexer = new MarkedDiscord()
  const res = lexer.getMarkdownTokens(inputMarkdown)
  if (noUnpack) {
    return res.tokens
  }
  const innerParagraphToken = res.tokens[0] as Tokens.Paragraph
  expect(innerParagraphToken).toMatchObject({type: 'paragraph'})
  return innerParagraphToken.tokens
}

describe('public exports', () => {
  describe('MarkedDiscord', () => {
    it('exports a MarkedDiscord class', () => {
      expect(typeof MarkedDiscord).toBe('function')
      expect(discordTokenNames).toStrictEqual([
        'discordChannelMention',
        'discordRoleMention',
        'discordUserMention',
        'discordServerMention',
        'discordSpoiler',
        'discordTimestamp',
        'discordSubtext',
        'discordServerEmoji',
      ])
    })
    describe('getMarkdownTokens', () => {
      it('returns tokens and entities', () => {
        const parser = new MarkedDiscord()
        const res = parser.getMarkdownTokens(`emoji <:zergling:901461081384452187>`)
        expect(res.tokens).toStrictEqual([
          {
            type: 'paragraph',
            raw: 'emoji <:zergling:901461081384452187>',
            text: 'emoji <:zergling:901461081384452187>',
            tokens: [
              {
                type: 'text',
                raw: 'emoji ',
                text: 'emoji ',
                escaped: false
              },
              {
                type: 'discordServerEmoji',
                raw: '<:zergling:901461081384452187>',
                emojiIsAnimated: false,
                emojiName: 'zergling',
                emojiId: '901461081384452187'
              }
            ]
          }
        ])
        expect(res.entities).toStrictEqual({
          '901461081384452187': {type: 'Emoji', id: '901461081384452187', name: 'zergling', isAnimated: false},
        })
      })
      it('does not return duplicate entities', () => {
        const parser = new MarkedDiscord()
        const res = parser.getMarkdownTokens(`emoji <:hydra:901461081384452186> <:zergling:901461081384452187> <:zergling:901461081384452187> <a:animated:901461081384452189> <@532337964173230080>`)
        expect(res.entities).toStrictEqual({
          '901461081384452186': {type: 'Emoji', id: '901461081384452186', name: 'hydra', isAnimated: false},
          '901461081384452187': {type: 'Emoji', id: '901461081384452187', name: 'zergling', isAnimated: false},
          '901461081384452189': {type: 'Emoji', id: '901461081384452189', name: 'animated', isAnimated: true},
          '532337964173230080': {type: 'User', id: '532337964173230080'},
        })
      })
      it('returns entities for User, Role, TextChannel and Emoji objects', () => {
        const parser = new MarkedDiscord()
        const res = parser.getMarkdownTokens(`some entities <@901461081384452180> <@&901461081384452182> <#901461081384452181> <:zergling:901461081384452183>`)
        expect(res.entities).toStrictEqual({
          '901461081384452180': {type: 'User', id: '901461081384452180'},
          '901461081384452182': {type: 'Role', id: '901461081384452182'},
          '901461081384452181': {type: 'TextChannel', id: '901461081384452181'},
          '901461081384452183': {type: 'Emoji', id: '901461081384452183', name: 'zergling', isAnimated: false},
        })
      })
    })
  })
})
