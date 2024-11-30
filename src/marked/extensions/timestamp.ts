import type {TokenizerExtension} from 'marked'

// Also known as a "hammertime" due to <https://hammertime.cyou/>.
const extensionName = 'discordTimestamp'

// If no type is set, the timestamp defaults to "f".
const defaultTimestampType = 'f'

export type TimestampType = 'R' | 't' | 'T' | 'd' | 'D' | 'f' | 'F'

export interface TimestampToken {
  type: string
  raw: string
  unixTime: number
  timestampType: TimestampType
  timestampOptions: {
    type: 'RelativeTimeFormat' | 'DateTimeFormat'
    options: {
      style?: string
      timeStyle?: string
      dateStyle?: string
    }
  }
}

interface RelativeTimestampType {
  type: 'RelativeTimeFormat',
  options: {
    style: 'short' | 'full'
  }
}

interface DateTimeTimestampType {
  type: 'DateTimeFormat',
  options: {
    timeStyle?: 'short' | 'medium' | 'long' | 'full'
    dateStyle?: 'short' | 'medium' | 'long' | 'full'
  }
}

// 24 seconds ago
const timestamp_R: RelativeTimestampType = {
  type: 'RelativeTimeFormat',
  options: {style: 'full'},
}
// 8:06 PM
const timestamp_t: DateTimeTimestampType = {
  type: 'DateTimeFormat',
  options: {timeStyle: 'short'},
}
// 8:06:00 PM
const timestamp_T: DateTimeTimestampType = {
  type: 'DateTimeFormat',
  options: {timeStyle: 'medium'},
}
// 28/11/2024
const timestamp_d: DateTimeTimestampType = {
  type: 'DateTimeFormat',
  options: {dateStyle: 'short'}
}
// November 28, 2024
const timestamp_D: DateTimeTimestampType = {
  type: 'DateTimeFormat',
  options: {dateStyle: 'long'}
}
// November 28, 2024 8:06 PM
const timestamp_f: DateTimeTimestampType = {
  type: 'DateTimeFormat',
  options: {dateStyle: 'long', timeStyle: 'short'}
}
// Thursday, November 28, 2024 8:06 PM
const timestamp_F: DateTimeTimestampType = {
  type: 'DateTimeFormat',
  options: {dateStyle: 'full', timeStyle: 'short'}
}

const timestampTypeOptions = {
  'R': timestamp_R,
  't': timestamp_t,
  'T': timestamp_T,
  'd': timestamp_d,
  'D': timestamp_D,
  'f': timestamp_f,
  'F': timestamp_F,
}

const timestampTypes = Object.keys(timestampTypeOptions)

function getValidatedTimestampType(type: string): TimestampType | undefined {
  if (timestampTypes.includes(type)) {
    return type as TimestampType
  }
  if (type === undefined) {
    return defaultTimestampType
  }
  return undefined
}

export const discordTimestamp: TokenizerExtension = {
  name: extensionName,
  level: 'inline',
  start: (input: string) => input.indexOf('<t:'),
  tokenizer: (input: string): TimestampToken | undefined => {
    const match = input.match(/^<t:(-?\d+)(?::(R|t|T|d|D|f|F))?>/)
    if (match) {
      const unixTime = Number(match[1])
      
      // Ensure we have a valid timestamp type. If not, don't parse this as a timestamp.
      const timestampType = getValidatedTimestampType(match[2])
      if (timestampType === undefined) {
        return undefined
      }

      const timestampOptions = timestampTypeOptions[timestampType]

      return {
        type: extensionName,
        raw: match[0],
        unixTime,
        timestampType,
        timestampOptions,
      }
    }
    return undefined
  },
}
