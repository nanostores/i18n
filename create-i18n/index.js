import { atom, onMount } from 'nanostores'

export function createI18n(locale, opts) {
  let baseLocale = opts.baseLocale || 'en'
  let processors = opts.processors || []
  let mounted = []
  let requested = new Set()
  let rerenders = new Set()

  async function getTranslation(code, components) {
    let newComponents = []
    let newPrefixes = []
    for (let name of components) {
      let prefix = name.split('/')[0]
      if (!requested.has(prefix)) {
        newComponents.push(name)
        newPrefixes.push(prefix)
      }
    }
    if (newComponents.length === 0) return
    define.loading.set(true)

    for (let prefix of newPrefixes) requested.add(prefix)
    let translations = await opts.get(code, newComponents)
    if (Array.isArray(translations)) {
      translations = translations.reduce((obj, item) =>
        Object.assign(obj, item)
      )
    }
    define.cache[code] = { ...define.cache[code], ...translations }
    for (let name in translations) {
      let prefix = name.split('/')[0]
      requested.delete(prefix)
    }

    if (code === locale.get() && requested.size === 0) {
      rerenders.forEach(rerender => rerender(code))
      define.loading.set(false)
    }
  }

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
        if (import.meta && (import.meta.hot || import.meta.webpackHot)) {
          /* c8 ignore next 3 */
          for (let i in define.cache) {
            delete define.cache[i][componentName]
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            `I18n component ${componentName} was defined multiple times. ` +
              'It could lead to cache issues. Try to move i18n definition ' +
              'from component’s render function.'
          )
        }
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

    if (locale.get() !== baseLocale && define.cache[locale.get()]) {
      setTranslation(locale.get())
    } else {
      setTranslation(baseLocale)
    }

    onMount(t, () => {
      mounted.push(componentName)
      let code = locale.get()
      let isCached =
        code === baseLocale ||
        (define.cache[code] && define.cache[code][componentName])
      if (isCached) {
        setTranslation(code)
      } else {
        getTranslation(code, [componentName])
      }
      for (let i in processors) {
        processors[i].from.listen(() => {
          setTranslation(code)
        })
      }
      rerenders.add(setTranslation)
      return () => {
        mounted = mounted.filter(i => i !== componentName)
        rerenders.delete(setTranslation)
      }
    })
    return t
  }

  define.cache = {
    ...opts.cache,
    [baseLocale]: {}
  }
  define.loading = atom(false)

  locale.subscribe(code => {
    requested.clear()
    let nonCached = define.cache[code]
      ? mounted.filter(component => !define.cache[code][component])
      : mounted
    if (nonCached.length) {
      getTranslation(code, nonCached)
    } else {
      rerenders.forEach(rerender => rerender(code))
      define.loading.set(false)
    }
  })

  return define
}
