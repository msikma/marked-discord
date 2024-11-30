import {describe, it, expect} from 'vitest'
import {getInnerTokens} from '../../index.test.ts'

describe('Marked syntax extensions', () => {
  describe('discordChannelMention', () => {
    it('parses channel mentions correctly', () => {
      const tokens = getInnerTokens(`See <#1145667919225831445> for more information.`)
      expect(tokens).toContainEqual({
        type: 'discordChannelMention',
        raw: '<#1145667919225831445>',
        channelId: '1145667919225831445',
      })
    })
    it('ignores invalid channel mentions', () => {
      const tests = [
        // Too short.
        {id: '1234'},
        // Too long.
        {id: '11456679192258314451145667919225831445'},
      ]
      for (const test of tests) {
        const {id} = test
        const md = `See <#${id}> for more information.`
        const tokens = getInnerTokens(md)
        expect(tokens).not.toContainEqual({
          type: 'discordChannelMention',
          raw: `<#${id}>`,
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
