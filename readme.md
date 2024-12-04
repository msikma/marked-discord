[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/@dada78641%2Fmarked-discord.svg)](https://badge.fury.io/js/@dada78641%2Fmarked-discord)

# @dada78641/marked-discord

Markdown parsing library for [Discord](https://discord.com/) flavored Markdown.

This uses the [Marked](https://github.com/markedjs/marked) library as basis and adds a number of Discord-specific extensions.

This library **only lexes the input** and **does not** do a full conversion to e.g. HTML or another language.

## Usage

To parse Markdown content, pass it as string:

```ts
import {MarkedDiscord} from '@dada78641/marked-discord'

const markdownContent = `Here's a Discord emoji: <:zergling:901461081384452187>`
const parser = new MarkedDiscord()
const res = parser.getMarkdownTokens(markdownContent)
console.log(res)
```

This will log the following data:

```ts
{
  tokens: [
    {
      type: 'paragraph',
      raw: "Here's a Discord emoji: <:zergling:901461081384452187>",
      text: "Here's a Discord emoji: <:zergling:901461081384452187>",
      tokens: [
        {
          type: 'text',
          raw: "Here's a Discord emoji: ",
          text: "Here's a Discord emoji: ",
          escaped: false
        },
        {
          type: 'discordServerEmoji',
          raw: '<:zergling:901461081384452187>',
          emojiIsAnimated: false,
          emojiName: 'zergling',
          emojiId: '901461081384452187',
        }
      ]
    }
  ],
  entities: {
    '901461081384452187': {
      type: 'Emoji',
      id: '901461081384452187',
      isAnimated: false,
      name: 'zergling'
    }
  }
}
```

## Features

This library extends the standard Marked syntax with the following Discord-specific features:

* Channel, role and user mentions
* @here and @everyone mentions
* Server emojis (not including Unicode emoji characters)
* Timestamps (aka. [HammerTime](https://hammertime.cyou/) tags)
* Spoiler tags
* Subtext

Discord flavored Markdown also has the following syntax, which is already parsed by Marked by default:

* Strikethrough
* Headings
* Code blocks
* Blockquotes

Note that there are slight differences between standard Marked syntax and Discord syntax. These differences are minor and should not lead to significant deviations in rendering for regular use cases.

## External links

* [Discord Support - Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline)
* [Marked Documentation](https://marked.js.org/)
* [Discord Markdown 201](https://github.com/ParadoxV5/Discord-Markdown)
* [Discord developer documentation - Message formatting](https://discord.com/developers/docs/reference#message-formatting)

## License

MIT licensed.
