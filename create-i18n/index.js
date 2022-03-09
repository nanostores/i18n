import { atom, onMount, onStop } from 'nanostores'

export function createI18n(locale, opts) {
  let baseLocale = opts.baseLocale || 'en'
  let processors = opts.processors || []
  let chunks = opts.chunks === true
  let loading = atom(true)
  let mountedComponents = []

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
    }
    setTranslation(baseLocale)

    onStop(t, () => {
      let index = mountedComponents.indexOf(t.component)
      if (~index) {
        mountedComponents.splice(index, 1)
      }
    })

    onMount(t, () => {
      if (!mountedComponents.includes(t.component)) {
        mountedComponents.push(t.component)
      }
      let currentLocale = locale.get()
      if (
        !define.cache[currentLocale]?.[t.component] &&
        currentLocale !== baseLocale
      ) {
        fetchTranslation(currentLocale)
      } else {
        loading.set(false)
        setTranslation(currentLocale)
      }
      for (let i in processors) {
        processors[i].from.listen(() => {
          setTranslation(currentLocale)
        })
      }

      let unbindLocale = locale.listen(code => {
        if (define.cache[code] && !loading.get()) {
          setTranslation(code)
        }
      })
      let unbindLoading = loading.listen(isLoading => {
        if (!isLoading) {
          setTranslation(locale.get())
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

  function fetchTranslation(code) {
    loading.set(true)
    if (chunks) {
      opts
        .get(code, mountedComponents)
        .then(promises => Promise.all(promises))
        .then(translations =>
          translations.forEach(
            translation =>
              (define.cache[code] = { ...define.cache[code], ...translation })
          )
        )
        .then(() => {
          if (code === locale.get()) loading.set(false)
        })
    } else {
      opts.get(code).then(translation => {
        define.cache[code] = translation
        if (code === locale.get()) loading.set(false)
      })
    }
  }

  locale.listen(code => {
    if (define.cache[code]) {
      let cachedComponents = Object.keys(define.cache[code])
      let isTranslationCached = mountedComponents.every(component => {
        return cachedComponents.includes(component)
      })
      if (isTranslationCached) {
        loading.set(false)
      } else {
        fetchTranslation(code)
      }
    } else {
      fetchTranslation(code)
    }
  })

  return define
}
