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
import { useStore } from 'nanostores'
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
  browser({ available: ['en', 'fr', 'ru'] }) // or browser’s locale autodetect
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
  }
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

*Under construction*


#### Pluralization

*Under construction*


#### Parameters

*Under construction*


#### Custom Variable Translations

*Under construction*


### Translation Process

*Under construction*
