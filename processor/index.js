import { strings, transform } from '../transforms/index.js'

export function createProcessor(source) {
  let processor = transform((locale, translation) => {
    return strings(translation, str => {
      return str
    })[source.get()]
  })
  processor.from = source
  return processor
}
