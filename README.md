# i18next-locales-sync

![CI](https://github.com/felixmosh/i18next-locales-sync/workflows/CI/badge.svg)
[![npm](https://img.shields.io/npm/v/i18next-locales-sync.svg)](https://www.npmjs.com/package/i18next-locales-sync)

Syncs [i18next](https://github.com/i18next/i18next) locale resource files against a primary language.

## Installation

```sh
$ npm install --save-dev i18next-locales-sync
```

## Features

1. Supports [namespaces](https://www.i18next.com/principles/namespaces).
2. Full plural support, based on the real [i18next pluralResolver](https://github.com/felixmosh/i18next-locales-sync/blob/master/src/i18next/PluralResolver.ts).
3. Supports JSON v4
4. Sorting secondary locale keys by primary language order.
5. Supports multiple locale folder structure, `{lng}/{namespace}`, `{namespace}/{lng}`.
6. Creates missing locale files.
7. Allows overriding plural rules.

## Usage

### 1. CLI

```sh
$ npx i18next-locales-sync -p he -s en de ja -l path/to/locales/folder --spaces 2
```

or using config file

```js
// localesSync.config.js
module.exports = {
  primaryLanguage: 'he',
  secondaryLanguages: ['en', 'de', 'ja'],
  localesFolder: './path/to/locales/folder',
  overridePluralRules: (pluralResolver) =>
    pluralResolver.addRule('he', pluralResolver.getRule('en')), // This is available only when using config file
  spaces: 2,
};
```

```sh
$ npx i18next-locales-sync -c ./localesSync.config.js
```

### 2. Node

```js
import { syncLocales } from 'i18next-locales-sync';
import path from 'path';

syncLocales({
  primaryLanguage: 'en',
  secondaryLanguages: ['en', 'de', 'ja'],
  localesFolder: path.resolve('./path/to/locales/folder'),
  overridePluralRules: (pluralResolver) =>
    pluralResolver.addRule('he', pluralResolver.getRule('en')),
});
```

## Options

| Key                 | Type                                                  | Default value   |
| ------------------- |-------------------------------------------------------|-----------------|
| primaryLanguage     | `string`                                              |                 |
| secondaryLanguages  | `string[]`                                            |                 |
| localesFolder       | `string`                                              |                 |
| outputFolder        | `string?`                                             | `localesFolder` |
| overridePluralRules | `(pluralResolver: PluralResolver)? => PluralResolver` |                 |
| useEmptyString      | `boolean`                                             | `false`         |
| spaces              | `number`                                              | `2`             |
| compatibilityJSON   | `string`                                              | `v4`            |

Currently, the lib supports only `.json` locale files, PRs are welcome :].

## Example

Given these files:

```sh
examples
├── en
│   └── namespace.json
├── he
│   └── namespace.json
└── ja
    └── namespace.json
```

```json
// en/namespace.json
{
  "foo_male": "bar-male-en",
  "room_one": "room",
  "room_other": "rooms"
}
```

```json
// he/namespace.json
{
  "room": "חדר",
  "foo_male": "bar-male-he",
  "room_few": "חדרים"
}
```

```json
// ja/namespace.json
{
  "foo_male": "bar-male-ja",
  "room": "部屋",
  "room_other": "部屋"
}
```

Syncying `he` & `ja` against `en`

```sh
$ npx i18next-locales-sync -p en -s he ja -l ./examples/
```

Will result with

```json
// en/namespace.json

// `en` remains untouched
{
  "foo_male": "bar-male-en",
  "room_one": "room",
  "room_other": "rooms"
}
```

```json
// he/namespace.json

// sorted based on the primary lang file
// keeps existing plural form (room_3)
// added missing plural forms
{
  "foo_male": "bar-male-he",
  "room_one": "חדר",
  "room_two": "חדרים",
  "room_few": "rooms",
  "room_many": "rooms",
  "room_other": "rooms"
}
```

```json
// ja/namespace.json

// keeps exising fields
// removed plural form since there is no plural form in Japanese
{
  "foo_male": "bar-male-ja",
  "room": "部屋"
}
```

### Prior art

1. [i18next-json-sync](https://github.com/jwbay/i18next-json-sync)
