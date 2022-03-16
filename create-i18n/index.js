import { atom, onMount } from 'nanostores'

export function createI18n(locale, opts) {
  let baseLocale = opts.baseLocale || 'en'
  let processors = opts.processors || []
  let loading = atom(true)
  let mountedComponents = new Set()

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

    onMount(t, () => {
      mountedComponents.add(t.component)
      let currentLocale = locale.get()
      let isTranslationCached =
        currentLocale === baseLocale ||
        define.cache[currentLocale]?.[t.component]
      if (isTranslationCached) {
        setTranslation(currentLocale)
      } else {
        getTranslation(currentLocale)
      }
      for (let i in processors) {
        processors[i].from.listen(() => {
          setTranslation(currentLocale)
        })
      }
      let unbindLoading = loading.listen(isLoading => {
        if (!isLoading) {
          setTranslation(locale.get())
        }
      })
      return () => {
        mountedComponents.delete(t.component)
        unbindLoading()
      }
    })
    return t
  }

  define.cache = {
    [baseLocale]: {}
  }
  define.loading = loading

  async function getTranslation(code) {
    loading.set(true)
    let nonCachedComponents = Array.from(mountedComponents).filter(
      component => !define.cache[code]?.[component]
    )
    let translations = await opts.get(code, nonCachedComponents)
    if (Array.isArray(translations)) {
      translations = translations.reduce((obj, item) =>
        Object.assign(obj, item)
      )
    }
    define.cache[code] = { ...define.cache[code], ...translations }
    if (code === locale.get()) loading.set(false)
  }

  locale.listen(code => {
    if (define.cache[code]) {
      let isTranslationsCached = Array.from(mountedComponents).every(
        component => !!define.cache[code][component]
      )
      if (isTranslationsCached) {
        loading.set(false)
      } else {
        getTranslation(code)
      }
    } else {
      getTranslation(code)
    }
  })

  loading.set(false)
  return define
}
