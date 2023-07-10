import { i18n, locale, localeSetting } from './i18n.js'

let currentLocale = document.querySelector('strong')
let changeLocale = document.querySelector('select')
let clearLocale = document.querySelector('button')
let loading = document.querySelector('#loading')

locale.subscribe(code => {
  currentLocale.innerText = code
  changeLocale.value = code
})

changeLocale.addEventListener('change', () => {
  localeSetting.set(changeLocale.value)
})

clearLocale.addEventListener('click', () => {
  localStorage.clear()
})

i18n.loading.subscribe(isLoading => {
  loading.classList.toggle('is-hidden', !isLoading)
})
