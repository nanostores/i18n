import { strings, transform } from '../transforms/index.js'

export const createPreprocessor = source => {
  return {
    process: transform((locale, translation) => {
      return strings(translation, str => {
        return str
      })[source.get()]
    }),
    source
  }
}
