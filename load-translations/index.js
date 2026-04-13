import { translationsLoading } from '../translations-loading/index.js'

export async function loadTranslations(messages) {
  let unbind = messages.listen(() => {})
  await translationsLoading(messages.i18n)
  unbind()
  return messages.get()
}
