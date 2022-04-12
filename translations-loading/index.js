export function translationsLoading(i18n) {
  if (i18n.loading.get()) {
    return new Promise(resolve => {
      let unbindLoading = i18n.loading.listen(isLoading => {
        if (!isLoading) {
          unbindLoading()
          resolve()
        }
      })
    })
  } else {
    return Promise.resolve()
  }
}
