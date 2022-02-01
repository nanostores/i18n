import { atom, onMount } from 'nanostores'

export function createI18n(locale, opts) {
  let baseLocale = opts.baseLocale || 'en'
  let processors = opts.processors || []
  let loading = atom(true)

  let define = (componentName, base) => {
    let transforms = {}
    let baseTranslation = {}
    for (let i in base) {
      if (base[i].transform) {
        transforms[i] = base[i].transform
        baseTranslation[i] = base[i].input
      } else {
        baseTranslation[i] = base[i]
      }
    }

    let t = atom()
    if (process.env.NODE_ENV !== 'production') {
      t.component = componentName
      t.base = base
      if (define.cache[baseLocale][componentName]) {
        throw new Error(
          `I18n component ${componentName} was defined multiple times. ` +
            'It could lead to cache issues. Try to move i18n definition from ' +
            'component’s render function.'
        )
      }
    }

    define.cache[baseLocale][componentName] = baseTranslation

    let waiting = false
    function setTranslation(code) {
      let translations = {
        ...define.cache[baseLocale][componentName],
        ...define.cache[code][componentName]
      }
      for (let i in transforms) {
        let nodeTransform = transforms[i]
        let input = translations[i]
        translations[i] = (...args) => nodeTransform(code, input, args)
      }
      t.set(translations)
      waiting = false
    }
    setTranslation(baseLocale)

    onMount(t, () => {
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
      for (let i in processors) {
        processors[i].from.listen(() => {
          setTranslation(locale.get())
        })
      }
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
