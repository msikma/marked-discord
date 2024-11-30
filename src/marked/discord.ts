import {discordChannelMention, getDiscordChannelMentionEntity} from './extensions/channel-mention.ts'
import {discordRoleMention, getDiscordRoleMentionEntity} from './extensions/role-mention.ts'
import {discordUserMention, getDiscordUserMentionEntity} from './extensions/user-mention.ts'
import {discordServerMention} from './extensions/server-mention.ts'
import {discordTimestamp} from './extensions/timestamp.ts'
import {discordSpoiler} from './extensions/spoiler.ts'
import {discordSubtext} from './extensions/subtext.ts'
import {discordServerEmoji, getDiscordEmojiEntity} from './extensions/server-emoji.ts'

export const discordEntityFunctions = [
  getDiscordChannelMentionEntity,
  getDiscordRoleMentionEntity,
  getDiscordUserMentionEntity,
  getDiscordEmojiEntity,
]

export const discordExtensions = [
  discordChannelMention,
  discordRoleMention,
  discordUserMention,
  discordServerMention,
  discordSpoiler,
  discordTimestamp,
  discordSubtext,
  discordServerEmoji,
]
