import {describe, it, expect} from 'vitest'
import type {Tokens} from 'marked'
import {getInnerTokens} from '../../index.test.ts'

describe('Marked syntax extensions', () => {
  describe('discordSubtext', () => {
    it('parses subtext tags correctly', () => {
      const tokens = getInnerTokens(`-# test`, true)
      expect(tokens).toContainEqual(expect.objectContaining({
        type: 'discordSubtext',
        raw: '-# test',
        text: 'test',
      }))
      const inner = tokens[0] as Tokens.Text
      expect(inner.tokens).toContainEqual({
        type: 'text',
        raw: 'test',
        text: 'test',
        escaped: false,
      })
    })
    it('ignores invalid tags', () => {
      const tokens = getInnerTokens(`-#test`, true)
      expect(tokens).not.toContainEqual(expect.objectContaining({
        type: 'discordSubtext',
        raw: '-#test',
        text: '-#test',
      }))
      expect(tokens).toContainEqual(expect.objectContaining({
        type: 'paragraph',
        raw: '-#test',
        text: '-#test',
      }))
    })
    it('functions as a block level element', () => {
      const tokens = getInnerTokens(`-# A\nB`, true)
      expect(tokens).toContainEqual(expect.objectContaining({
        type: 'discordSubtext',
        raw: '-# A\n',
        text: 'A',
      }))
      expect(tokens).toContainEqual(expect.objectContaining({
        type: 'paragraph',
        raw: 'B',
        text: 'B',
      }))
    })
    it('parses nested tags inside', () => {
      const tokens = getInnerTokens(`-# a **b**`, true)
      expect(tokens).toContainEqual(expect.objectContaining({
        type: 'discordSubtext',
        raw: '-# a **b**',
        text: 'a **b**',
      }))
      const inner = tokens[0] as Tokens.Text
      expect(inner.tokens).toContainEqual({
        type: 'text',
        raw: 'a ',
        text: 'a ',
        escaped: false
      })
      expect(inner.tokens).toContainEqual(expect.objectContaining({
        type: 'strong',
        raw: '**b**',
        text: 'b'
      }))
    })
  })
})
