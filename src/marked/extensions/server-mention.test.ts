import {describe, it, expect} from 'vitest'
import {getInnerTokens} from '../../index.test.ts'

describe('Marked syntax extensions', () => {
  describe('discordServerMention', () => {
    it('parses server mentions correctly', () => {
      const tokens = getInnerTokens(`hey @everyone @here`)
      expect(tokens).toContainEqual({
        type: 'discordServerMention',
        raw: '@everyone',
        mentionType: 'everyone',
      })
      expect(tokens).toContainEqual({
        type: 'discordServerMention',
        raw: '@here',
        mentionType: 'here',
      })
    })
    it('parses a server mention with a suffix', () => {
      const tokens = getInnerTokens(`hey @everyonee`)
      expect(tokens).toContainEqual({
        type: 'discordServerMention',
        raw: '@everyone',
        mentionType: 'everyone',
      })
      expect(tokens).toContainEqual({
        type: 'text',
        raw: 'e',
        text: 'e',
        escaped: false,
      })
    })
    it('ignores invalid mentions', () => {
      const tests = [
        {mention: 'ahere'},
      ]
      for (const test of tests) {
        const {mention} = test
        const tokens = getInnerTokens(`hey @${mention}`)
        expect(tokens).not.toContainEqual({
          type: 'discordServerMention',
          raw: `@${mention}`,
          mentionType: mention,
        })
        expect(tokens).toContainEqual({
          type: 'text',
          raw: `hey @${mention}`,
          text: `hey @${mention}`,
          escaped: false,
        })
      }
    })
  })
})
