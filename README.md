# Nano Stores I18n

<img align="right" width="92" height="92" title="Nano Stores logo"
     src="https://nanostores.github.io/nanostores/logo.svg">

Tiny and flexible JS library to make your web application translatable.
Uses [Nano Stores] state manager and [JS Internationalization API].

* **Small.** Between 448 and 844 bytes (minified and gzipped).
  Zero dependencies.
* Works with **React**, **Preact**, **Vue**, **Svelte**, and plain JS.
* Supports **tree-shaking** and translation **on-demand download**.
* **Plain JSON** translations compatible with
  online translation services like [Weblate].
* Out of the box **TypeScript** support for translations.
* **Flexible variable translations**. You can change translation,
  for instance, depends on screen size.

```tsx
// components/post.jsx
import { params, count } from '@nanostores/i18n' // You can use own functions
import { useStore } from '@nanostores/react'
import { i18n, format } from '../stores/i18n.js'

export const messages = i18n('post', {
  title: 'Post details',
  published: params<{ at: string }>('Was published at {at}')
  posts: count({
    one: '{count} comment',
    many: '{count} comments'
  })
})

export const Post = ({ author, comments, publishedAt }) => {
  const t = useStore(messages)
  const { time } = useStore(format)
  return <article>
    <h1>{t.title}</h1>
    <p>{t.published({ at: time(publishedAt) })}</p>
    <p>{t.comments(comments.length)}</p>
  </article>
}
```

```ts
// stores/i18n.js
import { createI18n, localeFrom, browser, formatter } from '@nanostores/i18n'
import localeSettings from './locale-settings.js'

export const locale = localeFrom(
  localeSettings,                            // User’s locale from localStorage
  browser({ available: ['en', 'fr', 'ru'] }) // or browser’s locale auto-detect
)

export const format = formatter(locale)

export const i18n = createI18n({
  get (code) {
    return fetchJSON(`/translations/${code}.json`)
  }
})
```

```js
// public/translations/ru.json
{
  "post": {
    "title": "Данные о публикации",
    "published": "Опубликован {at}",
    "comments": {
      "one": "{count} комментарий",
      "few": "{count} комментария",
      "many": "{count} комментариев",
    }
  },
  // Translations for all other components
}
```

[JS Internationalization API]: https://hacks.mozilla.org/2014/12/introducing-the-javascript-internationalization-api/
[Nano Stores]: https://github.com/nanostores/nanostores
[Weblate]: https://weblate.org/ru/

<a href="https://evilmartians.com/?utm_source=nanostores-i18n">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>


## Install

```sh
npm install nanostores @nanostores/i18n
```


## Usage

We store locale, time/number formatting functions and translations
in Nano Stores’ atoms. See [Nano Stores docs] to learn how to use atoms
in your framework.

[Nano Stores docs]: https://github.com/nanostores/nanostores#guide


### Locale

Locale is a code of user’s language and dialect like `hi` (Hindi), `de-AT`
(German as used in Austria). We use [Intl locale format].

Current locale should be stored in store. We have `localeFrom()` store
builder to find user’s locale in first available source:

```js
import { localFrom } from '@nanostores/i18n'

export const locale = localeFrom(store1, store2, store3)
```

We have store with a locale from browser settings. You need to pass list
of available translations of your application. If store will not find common
locale, it will use fallback locale (`en`, but can be changed
by `fallback` option).

```js
import { localeFrom, browser } from '@nanostores/i18n'

export const locale = localeFrom(
  …,
  browser({ available: ['en', 'fr', 'ru'] })
)
```

Before `browser` store, you can put a store, which will allow user to override
locale manually. For instance, you can keep an locale’s override
in `localStorage`.

```ts
import { persistentAtom } from '@nanostores/persistent'

export const localeSettings = persistentAtom<string>('locale')

export const locale = localeFrom(
  localeSettings,
  browser({ available: ['en', 'fr', 'ru'] })
)
```

Or you can take user’s locale from URL router:

```ts
import { computed } from 'nanostores'
import { router } from './router.js'

const urlLocale = computer(router, page => page?.params.locale)

export const locale = localeFrom(
  urlLocale,
  browser({ available: ['en', 'fr', 'ru'] })
)
```

You can use locale as any Nano Store:

```jsx
import { useStore } from 'nanostores'
import { locale } from '../stores/i18n.js'

// Pure JS example
locale.listen(code => {
  console.log(`Locale was changed to ${code}`)
})

// React example
export const CurrentLocale = () => {
  let code = useStore(locale)
  return `Your current locale: ${code}`
}
```

For tests you can use simple atom:

```ts
import { atom } from 'nanostores'

const locale = atom('en')
locale.set('fr')
```

[Intl locale format]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_identification_and_negotiation


### Date & Number Format

`formatter()` creates a store with a functions to format number and time.

```ts
import { formatter } from '@nanostores/i18n'

export const format = formatter(locale)
```

This store will have `time()` and `number()` functions.

```js
import { useStore } from 'nanostores'
import { format } from '../stores/i18n.js'

export Date = (date) => {
  let { time } = useStore(format)
  return time(date)
}
```

These functions accepts options
of [`Intl.DateTimeFormat`] and [`Intl.NumberFormat`].

```ts
time(date, {
  hour12: false,
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
}) //=> "November 1, 01:56:33"
```

[`Intl.DateTimeFormat`]: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
[`Intl.NumberFormat`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat


### I18n Object

I18n objects is used to define new component and download translations
on locale changes.

```ts
import { createI18n } from '@nanostores/i18n'

export const i18n = createI18n(locale, {
  async get (code) {
    return await fetchJSON(`/translations/${code}.json`)
  }
})
```

In every component you will have base translation with functions and types.
This translation will not be download from the server. By default, you should
use English. You can change base locale in components with `baseLocale` option.


### Translations

We have 2 types of translations:

**Base translation.** Developers write it in component sources. It is used
for TypeScript types and translation functions (`count()`, `params()`, etc).

```ts
export const messages = i18n('post', {
  title: 'Post details',
  published: params<{ at: string }>('Was published at {at}')
  posts: count({
    one: '{count} comment',
    many: '{count} comments'
  })
})
```

**Other translations** They use JSON format and will be created by translators.

```json
{
  "post": {
    "title": "Данные о публикации",
    "published": "Опубликован {at}",
    "comments": {
      "one": "{count} комментарий",
      "few": "{count} комментария",
      "many": "{count} комментариев",
    }
  }
}
```


#### Parameters

`params()` translation transform replaces parameters in translation string.

```js
import { params } from '@nanostores/i18n'

export const messages = i18n('hi', {
  hello: params<{ name: string }>('Hello, {name}')
})

export const Robots = ({ name }) => {
  const t = useStore(messages)
  return t.hello({ name })
}
```

You can use `time()` and `number()` [formatting functions].

[formatting functions]: https://github.com/nanostores/i18n/#date--number-format


#### Pluralization

In many languages, text could be different depends on items count.
Compare `1 robot`/`2 robots` in English with
`1 робот`/`2 робота`/`3 робота`/`21 робот` in Russian.

We hide this complexity with `count()` translation transform:

```js
import { count } from '@nanostores/i18n'

export const messages = i18n('robots', {
  howMany: count({
    one: '{count} robot',
    many: '{count} robots'
  })
})

export const Robots = ({ robots }) => {
  const t = useStore(messages)
  return t.howMany(robots.length)
}
```

```json
{
  "robots": {
    "howMany": {
      "one": "{count} робот",
      "few": "{count} робота",
      "many": "{count} роботов",
    }
  }
}
```

`count()` uses [`Intl.PluralRules`] to get pluralization rules for each locale.

[`Intl.PluralRules`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules


#### Custom Variable Translations

In additional to `params()` and `count()` you can define your own translation
transforms. Or you can change pluralization or parameters syntax by replacing
`count()` and `params()`.

```js
import { transform, strings } from '@nanostores/i18n'

// Add parameters syntax like hello: "Hi, %1"
export const paramsList = transform((locale, translation, ...args) => {
  return strings(translation, str => {
    return str.replace(/%\d/g, pattern => args[pattern.slice(1)])
  })
})
```

```ts
import { paramsList } from '../lib/paramsList.ts'

export const messages = i18n('hi', {
  hello: paramsList('Hello, %1')
})
```


### Translation Process

The good I18n support is not about the I18n library,
but about translation process.

1. Developer creates base translation in component’s source.
2. CI runs script to extract base translation to JSON.

   ```ts
   import { messagesToJSON } from '@nanostores/i18n'

   const files = await glob('src/*.tsx')
   const components = await Promise.all(files.map(file => {
     return (await import(file).messages)
   }))
   const json = messagesToJSON(...components)
   ```

3. CI uploads JSON with base translation to online translation service.
4. Translators translate application on this service.
5. CI or translation service download translation JSONs to the project.


### Server-Side Rendering

For SSR you may want to use own `locale` store and custom `i18n` instance
with another way to load translations.

```js
import { locale } from 'nanostores'

let locale, i18n

if (isServer) {
  locale = atom(db.getUser(userId).locale || parseHttpLocaleHeader())
  i18n = createI18n(locale, {
    async get (code) {
      return JSON.parse(await readFile(`public/translations/${code}.json`))
    }
  })
} else {
  …
}

export { locale, i18n }
```

You may need to wait for translation loading before rendering the HTML.

```js
await new Promise(resolve => {
  let unbind = i18n.loading.listen(loaded => {
    if (loaded) {
      resolve()
      unbind()
    }
  })
})
const html = ReactDOMServer.renderToString(<App />)
```
