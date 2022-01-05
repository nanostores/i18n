import { ReadableAtom } from 'nanostores'

import { TranslationJSON, TranslationFunction } from '../create-i18n/index.js'

export type ProcessInput = {
  [key: string]: TranslationJSON
}
interface Process {
  <Input extends ProcessInput>(input: Input): TranslationFunction<
    [],
    // @ts-ignore
    Input[keyof Input]
  >
}

type Source = ReadableAtom<string>

export interface Preprocessor {
  source: Source
  process: Process
}

export const createPreprocessor: (source: Source) => Preprocessor
