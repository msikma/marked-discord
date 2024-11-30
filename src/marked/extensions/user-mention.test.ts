import {describe, it, expect} from 'vitest'
import {getInnerTokens} from '../../index.test.ts'

describe('Marked syntax extensions', () => {
  describe('discordUserMention', () => {
    it('parses user mentions correctly', () => {
      const tokens = getInnerTokens(`test <@1145670275149606914>`)
      expect(tokens).toContainEqual({
        type: 'discordUserMention',
        raw: '<@1145670275149606914>',
        userId: '1145670275149606914',
      })
    })
    it('ignores invalid user mentions', () => {
      const tests = [
        // Too short.
        {id: '1234'},
        // Too long.
        {id: '901461081384452187901461081384452187'},
        // Not numeric.
        {id: 'username'},
      ]
      for (const test of tests) {
        const {id} = test
        const md = `See <@${id}> for more information.`
        const tokens = getInnerTokens(md)
        expect(tokens).not.toContainEqual({
          type: 'discordUserMention',
          raw: `<@${id}>`,
          userId: id,
        })
        expect(tokens).toContainEqual({
          type: 'text',
          raw: md,
          text: md,
          escaped: false,
        })
      }
    })
  })
})
