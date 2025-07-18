function process(obj, cb) {
  let copy = { ...obj }
  for (let i in copy) {
    if (typeof copy[i] === 'string') {
      copy[i] = cb(copy[i])
    } else {
      copy[i] = process(copy[i], cb)
    }
  }
  return copy
}

export function eachMessage(cb) {
  return translation => {
    return process(translation, cb)
  }
}
