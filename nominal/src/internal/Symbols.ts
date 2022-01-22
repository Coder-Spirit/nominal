// We re-export, instead of directly importing from the package, for
// compatibility reasons. Typescript and NodeJS are still in very
// early stages when it comes to ES modules support.
export {
  __BaseType,
  __Properties,
  __Brand,
  __PropertyName,
  __PropertyValues,
  type __Impossible
} from '@coderspirit/nominal-symbols'
