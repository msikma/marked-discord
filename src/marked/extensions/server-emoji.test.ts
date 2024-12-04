import {describe, it, expect} from 'vitest'
import {getInnerTokens} from '../../index.test.ts'

//<a:ling:901461081384452187>

describe('Marked syntax extensions', () => {
  describe('discordServerEmoji', () => {
    it('parses server emojis correctly', () => {
      const tokens = getInnerTokens(`emoji <:zergling:901461081384452187>`)
      expect(tokens).toContainEqual({
        type: 'discordServerEmoji',
        raw: '<:zergling:901461081384452187>',
        emojiIsAnimated: false,
        emojiId: '901461081384452187',
        emojiName: 'zergling',
      })
    })
    it('parses animated emojis', () => {
      const tokens = getInnerTokens(`emoji <a:zergling:901461081384452187>`)
      expect(tokens).toContainEqual({
        type: 'discordServerEmoji',
        raw: '<a:zergling:901461081384452187>',
        emojiIsAnimated: true,
        emojiId: '901461081384452187',
        emojiName: 'zergling',
      })
    })
    it('ignores invalid server emojis', () => {
      const tests = [
        // Name cannot be less than 2 characters long.
        {name: 'z', id: '901461081384452187'},
        // Name cannot contain characters other than [a-z_].
        {name: 'z%%z', id: '901461081384452187'},
        // Must be a valid ID.
        {name: 'zergling', id: '1234'},
      ]
      for (const test of tests) {
        const {name, id} = test
        const tokens = getInnerTokens(`emoji <:${name}:${id}>`)
        expect(tokens).not.toContainEqual({
          type: 'discordServerEmoji',
          raw: `<:${name}:${id}>`,
          emojiIsAnimated: false,
          emojiName: name,
          emojiId: id,
        })
        expect(tokens).toContainEqual({
          type: 'text',
          raw: `emoji <:${name}:${id}>`,
          text: `emoji <:${name}:${id}>`,
          escaped: false,
        })
      }
    })
  })
})
