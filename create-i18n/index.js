import { atom, onMount, computed } from 'nanostores'

export function createI18n(locale, opts) {
  let baseLocale = opts.baseLocale || 'en'
  let processors = opts.processors || []
  let loadedLocale = atom(baseLocale)
  let mounted = new Set()
  let requested = new Set()

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
    loadedLocale.set(false)

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
      loadedLocale.set(code)
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
    setTranslation(baseLocale)

    onMount(t, () => {
      mounted.add(componentName)
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
      let unbindLoaded = loadedLocale.listen(loaded => {
        if (loaded) setTranslation(loaded)
      })
      return () => {
        mounted.delete(componentName)
        unbindLoaded()
      }
    })
    return t
  }

  define.cache = {
    ...opts.cache,
    [baseLocale]: {}
  }
  define.loading = computed([locale, loadedLocale], (current, loaded) => {
    return current !== loaded
  })

  locale.subscribe(code => {
    let nonCached = Array.from(mounted).filter(
      component => !(define.cache[code] && define.cache[code][component])
    )
    requested.clear()
    if (nonCached.length) {
      getTranslation(code, nonCached)
    } else {
      loadedLocale.set(code)
    }
  })

  return define
}
