import { atom, onMount } from 'nanostores'

export function localeFrom(...stores) {
  let store = atom()

  let unbinds = Array(stores.length)
  function listener() {
    let i
    for (i = 0; i < stores.length; i++) {
      let locale = stores[i].get()
      if (!unbinds[i]) {
        unbinds[i] = stores[i].listen(listener)
      }
      if (locale) {
        store.set(locale)
        for (let j = i + 1; j < stores.length; j++) {
          if (!unbinds[j]) break
          unbinds[j]()
          unbinds[j] = undefined
        }
        return
      }
    }
  }

  onMount(store, () => {
    listener()
    return () => {
      for (let unbind of unbinds) unbind()
      unbinds = Array(stores.length)
    }
  })

  return store
}
