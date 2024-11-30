import {describe, it, expect} from 'vitest'
import type {Token} from 'marked'
import type {TimestampToken} from './timestamp.ts'
import {getInnerTokens} from '../../index.test.ts'

function expectDateTime(ts: Token[]) {
  expect(ts).toContainEqual(expect.objectContaining({
    timestampOptions: expect.objectContaining({
      type: 'DateTimeFormat',
    }),
  }))
}

function expectRelativeTime(ts: Token[]) {
  expect(ts).toContainEqual(expect.objectContaining({
    timestampOptions: expect.objectContaining({
      type: 'RelativeTimeFormat',
    }),
  }))
}

function tsDateTimeString(ts: Token[]): string | undefined {
  const tsToken = ts[0] as TimestampToken
  const {unixTime, timestampOptions} = tsToken
  const type = timestampOptions.type
  const options = timestampOptions.options as object
  if (type === 'DateTimeFormat') {
    return Intl.DateTimeFormat('en-US', options).format(unixTime * 1000)
  }
}

describe('Marked syntax extensions', () => {
  describe('discordTimestamp', () => {
    it('parses timestamps correctly', () => {
      const ts_d = getInnerTokens(`<t:1722528000:d>`)
      expect(tsDateTimeString(ts_d)).toBe('8/1/24')
      expectDateTime(ts_d)
      expect(ts_d).toContainEqual(expect.objectContaining({
        type: 'discordTimestamp',
        unixTime: 1722528000,
        timestampType: 'd',
      }))
      const ts_D = getInnerTokens(`<t:1722528000:D>`)
      expect(tsDateTimeString(ts_D)).toBe('August 1, 2024')
      expectDateTime(ts_D)
      expect(ts_D).toContainEqual(expect.objectContaining({
        type: 'discordTimestamp',
        unixTime: 1722528000,
        timestampType: 'D',
      }))
      const ts_t = getInnerTokens(`<t:1722528000:t>`)
      expect(tsDateTimeString(ts_t)).toBe('6:00 PM')
      expectDateTime(ts_t)
      expect(ts_t).toContainEqual(expect.objectContaining({
        type: 'discordTimestamp',
        unixTime: 1722528000,
        timestampType: 't',
      }))
      const ts_T = getInnerTokens(`<t:1722528000:T>`)
      expect(tsDateTimeString(ts_T)).toBe('6:00:00 PM')
      expectDateTime(ts_T)
      expect(ts_T).toContainEqual(expect.objectContaining({
        type: 'discordTimestamp',
        unixTime: 1722528000,
        timestampType: 'T',
      }))
      const ts_f = getInnerTokens(`<t:1722528000:f>`)
      expect(tsDateTimeString(ts_f)).toBe('August 1, 2024 at 6:00 PM')
      expectDateTime(ts_f)
      expect(ts_f).toContainEqual(expect.objectContaining({
        type: 'discordTimestamp',
        unixTime: 1722528000,
        timestampType: 'f',
      }))
      const ts_F = getInnerTokens(`<t:1722528000:F>`)
      expect(tsDateTimeString(ts_F)).toBe('Thursday, August 1, 2024 at 6:00 PM')
      expectDateTime(ts_F)
      expect(ts_F).toContainEqual(expect.objectContaining({
        type: 'discordTimestamp',
        unixTime: 1722528000,
        timestampType: 'F',
      }))
      const ts_R = getInnerTokens(`<t:1722528000:R>`)
      expectRelativeTime(ts_R)
      expect(ts_R).toContainEqual(expect.objectContaining({
        type: 'discordTimestamp',
        unixTime: 1722528000,
        timestampType: 'R',
      }))
    })
    it('defaults to "f" (short date/time)', () => {
      const tsImplicit = getInnerTokens(`<t:1722528000>`)
      const tsExplicit = getInnerTokens(`<t:1722528000:f>`)
      // These will be identical except for the "raw" property.
      expect({...tsImplicit[0], raw: null}).toStrictEqual({...tsExplicit[0], raw: null})
    })
    it('ignores invalid timestamp types', () => {
      const tests = [
        // Invalid type.
        {type: ':x'},
        // Valid type but not one character.
        {type: ':RR'},
        // Superfluous separator character.
        {type: ':'},
        // TODO: timestamps actually are not supposed to render if the time is very far off.
      ]
      for (const test of tests) {
        const {type} = test
        const tokens = getInnerTokens(`<t:1722528000${type}>`)
        expect(tokens).not.toContainEqual(expect.objectContaining({
          type: 'discordTimestamp'
        }))
      }
    })
  })
})
