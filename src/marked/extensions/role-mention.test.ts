import {describe, it, expect} from 'vitest'
import {getInnerTokens} from '../../index.test.ts'

describe('Marked syntax extensions', () => {
  describe('discordRoleMention', () => {
    it('parses role mentions correctly', () => {
      const tokens = getInnerTokens(`test <@&1145670275149606914>`)
      expect(tokens).toContainEqual({
        type: 'discordRoleMention',
        raw: '<@&1145670275149606914>',
        roleId: '1145670275149606914',
      })
    })
    it('ignores invalid role mentions', () => {
      const tests = [
        // Too short.
        {id: '1234'},
        // Too long.
        {id: '901461081384452187901461081384452187'},
      ]
      for (const test of tests) {
        const {id} = test
        const md = `See <@&${id}> for more information.`
        const tokens = getInnerTokens(md)
        expect(tokens).not.toContainEqual({
          type: 'discordRoleMention',
          raw: `<@&${id}>`,
          roleId: id,
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
