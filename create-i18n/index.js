import { atom, onMount } from 'nanostores'

export function createI18n(locale, opts) {
  let baseLocale = opts.baseLocale || 'en'
  let processors = opts.processors || []
  let loading = atom(true)
  let mounted = new Set()
  let requested = new Set()

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
        let prefix = componentName.split('/')[0]
        if (!requested.has(prefix)) {
          requested.add(prefix)
          getTranslation(code, [componentName]).then(() => {
            requested.delete(prefix)
          })
        }
      }
      for (let i in processors) {
        processors[i].from.listen(() => {
          setTranslation(code)
        })
      }
      let unbindLoading = loading.listen(isLoading => {
        if (!isLoading) {
          setTranslation(locale.get())
        }
      })
      return () => {
        mounted.delete(componentName)
        unbindLoading()
      }
    })
    return t
  }

  define.cache = {
    [baseLocale]: {}
  }
  define.loading = loading

  async function getTranslation(code, components) {
    loading.set(true)
    let translations = await opts.get(code, components)
    if (Array.isArray(translations)) {
      translations = translations.reduce((obj, item) =>
        Object.assign(obj, item)
      )
    }
    define.cache[code] = { ...define.cache[code], ...translations }
    if (code === locale.get()) loading.set(false)
  }

  locale.listen(code => {
    let nonCached = Array.from(mounted).filter(
      component => !(define.cache[code] && define.cache[code][component])
    )
    if (nonCached.length) {
      getTranslation(code, nonCached)
    } else {
      loading.set(false)
    }
  })

  loading.set(false)
  return define
}
