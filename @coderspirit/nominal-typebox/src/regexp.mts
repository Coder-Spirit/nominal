import type { FastBrand } from '@coderspirit/nominal'
import type { Kind, RegExpOptions, TSchema } from '@sinclair/typebox'
import { RegExp as TBRegExp } from '@sinclair/typebox'

export interface BrandedRegExpSchema<B extends string> extends TSchema {
	// Copied from TRegExp
	[Kind]: 'RegExp'
	type: 'RegExp'
	source: string
	flags: string

	// Our sauce
	static: FastBrand<string, B>
}

function brandedRegExp<const B extends string>(
	regex: RegExp,
	options?: RegExpOptions,
): BrandedRegExpSchema<B>
function brandedRegExp<const B extends string>(
	regex: string,
	options?: RegExpOptions,
): BrandedRegExpSchema<B>
function brandedRegExp<const B extends string>(
	pattern: string | RegExp,
	options?: RegExpOptions,
): BrandedRegExpSchema<B> {
	return TBRegExp(pattern as string, options) as BrandedRegExpSchema<B>
}

export { brandedRegExp }
