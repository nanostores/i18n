import { i18n, format } from './i18n.js'
import { params } from '../index.js'

let messages = i18n('page', {
  title: 'I18n demo',
  desc: params('Today is {date}')
})

let title = document.querySelector('h1')
let desc = document.querySelector('span')

messages.subscribe(t => {
  let { time } = format.get()
  title.innerText = t.title
  desc.innerText = t.desc({
    date: time(new Date(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })
})
