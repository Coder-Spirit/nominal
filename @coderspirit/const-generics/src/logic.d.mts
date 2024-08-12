export type And<A extends boolean, B extends boolean> = {
	'false&false': false
	'false&true': false
	'true&false': false
	'true&true': true
}[`${A}&${B}`]

export type Or<A extends boolean, B extends boolean> = {
	'false|false': false
	'false|true': true
	'true|false': true
	'true|true': true
}[`${A}|${B}`]

export type Not<A extends boolean> = {
	false: true
	true: false
}[`${A}`]

export type Xor<A extends boolean, B extends boolean> = {
	'false^false': false
	'false^true': true
	'true^false': true
	'true^true': false
}[`${A}^${B}`]

export type Nand<A extends boolean, B extends boolean> = {
	'false*false': true
	'false*true': true
	'true*false': true
	'true*true': false
}[`${A}*${B}`]

export type Nor<A extends boolean, B extends boolean> = {
	'false*false': true
	'false*true': false
	'true*false': false
	'true*true': false
}[`${A}*${B}`]

export type Xnor<A extends boolean, B extends boolean> = {
	'false*false': true
	'false*true': false
	'true*false': false
	'true*true': true
}[`${A}*${B}`]
