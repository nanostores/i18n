import { atom, onStart } from 'nanostores'

export function browser(opts) {
  let fallback = opts.fallback || 'en'

  let store = atom(fallback)

  onStart(store, () => {
    if (typeof navigator !== 'undefined') {
      let languages = navigator.languages
      if (!navigator.languages) languages = [navigator.language]

      for (let language of languages) {
        if (opts.available.includes(language)) {
          store.set(language)
          return
        }
      }
    }
  })

  return store
}
