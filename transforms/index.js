export function strings(translation, cb) {
  if (typeof translation === 'string') {
    return cb(translation)
  } else {
    let result = {}
    for (let i in translation) {
      result[i] = strings(translation[i], cb)
    }
    return result
  }
}

export function transform(cb) {
  return input => {
    if (input.transform) {
      let prevTransform = input.transform
      input = input.input
      return {
        input,
        transform(locale, translation, args) {
          let result = cb(locale, translation, ...args)
          return (...nextArgs) => prevTransform(locale, result, nextArgs)
        }
      }
    } else {
      return {
        input,
        transform(locale, translation, args) {
          return cb(locale, translation, ...args)
        }
      }
    }
  }
}
