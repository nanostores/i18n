import { atom, onMount } from 'nanostores'

export function createI18n(locale, opts = {}) {
  let baseLocale = opts.baseLocale || 'en'
  let loading = atom(true)

  let define = (componentName, baseTranslation) => {
    define.cache[baseLocale][componentName] = baseTranslation
    let t = atom(baseTranslation)

    onMount(t, () => {
      let waiting = false

      function setTranslation(code) {
        t.set({
          ...define.cache[baseLocale][componentName],
          ...define.cache[code][componentName]
        })
        waiting = false
      }

      let unbindLocale = locale.subscribe(code => {
        if (define.cache[code]) {
          setTranslation(code)
          waiting = false
        } else {
          waiting = true
        }
      })
      let unbindLoading = loading.subscribe(isLoading => {
        if (waiting && !isLoading) {
          setTranslation(locale.get())
          waiting = false
        }
      })
      return () => {
        unbindLocale()
        unbindLoading()
      }
    })

    return t
  }

  define.cache = {
    [baseLocale]: {}
  }
  define.loading = loading

  locale.subscribe(code => {
    if (define.cache[code]) {
      loading.set(false)
    } else {
      loading.set(true)
      opts.get(code).then(translation => {
        define.cache[code] = translation
        if (code === locale.get()) loading.set(false)
      })
    }
  })

  return define
}
