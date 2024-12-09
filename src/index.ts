import {Marked} from 'marked'
import type {Token, Tokens} from 'marked'
import type {DiscordEntity} from './marked/entity.ts'
import {discordExtensions, discordEntityFunctions} from './marked/discord.ts'
import keyBy from 'lodash.keyby'

// All valid Discord token names.
export const discordTokenNames = discordExtensions.map(extension => extension.name)

// Object containing id: DiscordEntity pairs.
export interface DiscordEntityObject {
  [id: string]: DiscordEntity
}

// The primary parse result the user receives.
export interface ParseResult {
  tokens: Token[]
  entities: DiscordEntityObject
}

// Export type for entities and pass on the Token type from Marked.
export type {DiscordEntity, Token}

export class MarkedDiscord {
  // Our base parser is the Github flavored Markdown parser.
  private marked: Marked = new Marked({
    extensions: discordExtensions,
    gfm: true,
    pedantic: false
  })

  /**
   * Converts a "codespan" token to a "code" token if applicable.
   * 
   * This is necessary because Discord actually allows code blocks to appear inline.
   * So for example, a line like "hello ```world```" should actually parse as a "code" token,
   * rather than an inline "codespan" token which would be more typical way to parse it.
   * 
   * To get Discord's behavior, we walk all the tokens and manually convert them.
   */
  _convertCodeSpanToBlock(token: Token): Token {
    // Return the original token if not applicable.
    if (token.type !== 'codespan' || !token.raw.startsWith('```')) {
      return token
    }

    const fToken = {...token} as Tokens.Code
    
    // Check if this is a multiline code block. If not, cancel conversion.
    const match = token.raw.match(/^```(.+?)\n([\s\S]*)```|^```\n?([\s\S]*)```/)
    if (!match) {
      return fToken
    }

    fToken.type = 'code'

    if (match[1] !== undefined) {
      // Attach the language tag if it's set.
      fToken.lang = match[1]
      fToken.text = match[2]
    }
    else {
      // If not, just set the content.
      fToken.text = match[3]
    }

    return fToken
  }

  /**
   * Covnerts a "blockquote" token to a "paragraph" token if applicable.
   * 
   * Unlike most other Markdown flavors, Discord does not recognize blockquotes if there is
   * no whitespace between the > character and the text. In that case it renders as regular text.
   */
  _convertBlockquoteToParagraph(token: Token): Token {
    // Return the original token if not applicable.
    if (token.type !== 'blockquote' || token.raw.match(/^>\s/) || !token.tokens) {
      return token
    }

    // If we have an applicable blockquote token that should be regular text,
    // the fix is actually very simple: there's always a single "paragraph"
    // token inside that should be the returned token instead.
    // There's one single caveat: we need to put the > character back in,
    // as it was removed to create the blockquote token.
    const fToken = {...token.tokens[0]} as Tokens.Paragraph

    fToken.text = `>${fToken.text}`
    fToken.raw = `>${fToken.raw}`

    // Finally, we need to fix the nested tokens to add the > character back as well.
    // We then need to do one of the following:
    //   if it's not a "text" token, add an additional "text" token with the > character before it.
    let childTokens: Token[] = []
    const firstChildToken = {...fToken.tokens[0]}

    if (firstChildToken.type === 'text') {
      // If the first child token is a text token, add the > character to it.
      firstChildToken.raw = `>${firstChildToken.raw}`
      firstChildToken.text = `>${firstChildToken.text}`
      childTokens = [firstChildToken, ...fToken.tokens.slice(1)]
    }
    else {
      // If it's any other type of token, insert a text token in front of it.
      const newTextToken: Token = {
        type: 'text',
        raw: '>',
        text: '>',
        escaped: false
      }
      childTokens = [newTextToken, ...fToken.tokens]
    }
    
    return {...fToken, tokens: childTokens}
  }

  /**
   * Walks the token tree and fixes Markdown syntax issues that occur after parsing.
   * 
   * This makes a few small adjustments to the syntax tree that comes out of Marked,
   * to make the output more compatible with actual Discord flavored Markdown.
   * 
   * We can't use the regular walkTokens() hook, as this only gets called when parsing,
   * and not just when lexing.
   */
  _fixTokens(tokens: Token[]): Token[] {
    const fixedTokens: Token[] = []
    for (const token of tokens) {
      let fToken = {...token} as Tokens.Generic
      if (fToken.tokens) {
        fToken.tokens = this._fixTokens(fToken.tokens)
      }

      // Run token fixes one after another. If not applicable, the original token is returned.
      fToken = this._convertCodeSpanToBlock(fToken)
      fToken = this._convertBlockquoteToParagraph(fToken)

      fixedTokens.push(fToken)
    }
    return fixedTokens
  }

  /**
   * Reduces the entities down to unique items.
   */
  getUniqueEntities(entities: DiscordEntity[]) {
    return keyBy(entities, 'id')
  }

  /**
   * Walks the token tree and finds all entities.
   */
  getEntitiesFromTokens(tokens: Token[]): DiscordEntity[] {
    const entities = []

    for (const _token of tokens) {
      const token = _token as Tokens.Generic
      if (token.tokens) {
        entities.push(...this.getEntitiesFromTokens(token.tokens))
      }
      for (const entityFunction of discordEntityFunctions) {
        entities.push(...entityFunction(token))
      }
    }

    return entities
  }

  /**
   * Parses the input and returns an abstract syntax tree.
   * 
   * This applies our custom fixes on the generated ast.
   */
  getSyntaxTree(input: string) {
    const tokens = this.marked.lexer(input)
    return this._fixTokens(tokens)
  }

  /**
   * Parses the input and returns Markdown tokens for rendering.
   * 
   * This includes a list of entities that need to be resolved for rendering to take place.
   */
  getMarkdownTokens(input: string): ParseResult {
    const tokens = this.getSyntaxTree(input)
    const entities = this.getUniqueEntities(this.getEntitiesFromTokens(tokens)) as DiscordEntityObject
    return {
      tokens,
      entities
    }
  }
}
