import { localeFrom, browser, createI18n, params, count } from '../index.js'

let locale = localeFrom(
  browser({
    available: ['en', 'ru'] as const
  })
)

function testString(arg: string): void {
  console.log(arg)
}

let i18n1 = createI18n(locale, {
  baseLocale: 'ru',
  async get() {
    return {
      post: {
        title: 'Title'
      }
    }
  }
})

let messages1 = i18n1('post', {
  title: 'Заголовок'
})
console.log(messages1.get().title)

let i18n2 = createI18n(locale, {
  async get() {
    return {}
  }
})

let messages2 = i18n2('post', {
  title: params('Title: {name}'),
  posts: count({
    one: '1 post',
    many: '{count} posts'
  }),
  pages: params<{ category: number }>(
    count({
      one: 'One page in {category}',
      many: '{count} pages in {category}'
    })
  )
})
let t = messages2.get()
testString(t.title({ name: 'Post' }))
testString(t.posts(5))
testString(t.pages({ category: 10 })(5))
