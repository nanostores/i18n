export function messagesToJSON(...components) {
  let result = {}
  for (let messages of components) {
    let translations = {}
    for (let key in messages.base) {
      let message = messages.base[key]
      if (typeof message === 'object' && message.transform) {
        translations[key] = message.input
      } else {
        translations[key] = message
      }
    }
    result[messages.component] = translations
  }
  return result
}
