import {describe, it, expect} from 'vitest'
import type {SpoilerToken} from './spoiler.ts'
import {getInnerTokens} from '../../index.test.ts'

describe('Marked syntax extensions', () => {
  describe('discordSpoiler', () => {
    it('parses spoiler tags correctly', () => {
      const tokens = getInnerTokens(`spoiler: ||aeris dies||`)
      expect(tokens).toContainEqual(expect.objectContaining({
        type: 'discordSpoiler',
        raw: '||aeris dies||',
        text: 'aeris dies',
      }))
      const spoiler = tokens[1] as SpoilerToken
      expect(spoiler.tokens).toContainEqual(expect.objectContaining({
        type: 'text',
        raw: 'aeris dies',
        text: 'aeris dies',
        escaped: false,
      }))
    })
    it('parses nested tags inside', () => {
      const tokens = getInnerTokens(`spoiler: ||aeris **really** dies||`)
      expect(tokens).toContainEqual(expect.objectContaining({
        type: 'discordSpoiler',
        raw: '||aeris **really** dies||',
        text: 'aeris **really** dies',
      }))
      const spoiler = tokens[1] as SpoilerToken
      expect(spoiler.tokens).toContainEqual(expect.objectContaining({
        type: 'strong',
        text: 'really',
        raw: '**really**',
      }))
    })
  })
})
