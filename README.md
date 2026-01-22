# nano-vue-i18n

A stupidly simple yet ultra-lightweight i18n plugin for Vue 3, designed for high-frequency rendering scenarios. It’s so tiny that it doesn’t support runtime compilation or complex message formats — just straightforward `{param}` interpolation.

Instead of choosing between full-featured i18n and performance, use both: `vue-i18n` for complex translations and `nano-vue-i18n` for high-frequency updates.

---

## Features

- **Fast**: pre-flattens messages into `Map`s, `t()` is just an O(1) lookup + simple string replace
- **Tiny**: no runtime message compilation, minimal overhead
- **Simple API**: `createI18n`, `useI18n`, `$t`, `$tc` — similar to `vue-i18n` but much smaller
- **Pluralization**: supports basic pluralization with locale-aware rules for common languages
- **Global scope only**: one global i18n instance, no per-component/local scope overhead
- **TypeScript**: written in TypeScript, exported types included
- **Compatible with vue-i18n**: use both libraries together with proper configuration

Designed for scenarios like:

- Realtime map / tracking apps
- Large tables with frequent updates
- Dashboards with many rapidly-updating components

---

> [!WARNING]
>
> ## What it is not intended to do
>
> To keep the implementation tiny and predictable, this library **DOES NOT** support:
>
> - Date / number formatting
> - Local / per-component message scopes
> - Complex message formats or nested expressions
> - Runtime hot-updating of message definitions (other than reloading the app)

---

## Use with vue-i18n (Recommended)

Instead of choosing between full-featured i18n and performance, you can use both libraries together:

- **vue-i18n** for complex translations: date/number formatting, rich message formats
- **nano-vue-i18n** for performance-critical paths: high-frequency updates, large lists, real-time data

### Configuration

To avoid conflicts with vue-i18n's global properties (`$t`, `$i18n`, `$d`, etc.), configure `nano-vue-i18n` with either:

#### Option 1: Disable global injection entirely

```ts
const nanoI18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  globalInject: false  // No global properties added
});
```

#### Option 2: Use a custom prefix (recommended)

```ts
const nanoI18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  globalInjectPrefix: 'nano'  // Access as $nanoT, $nanoI18n, $nanoLocale
});
```

### Usage Example

Install both plugins in your app:

```ts
// src/main.ts
import { createApp } from 'vue';
import { createI18n as createVueI18n } from 'vue-i18n';
import { createI18n as createNanoI18n } from 'nano-vue-i18n';
import App from './App.vue';

const vueI18n = createVueI18n({ /* vue-i18n config */ });
const nanoI18n = createNanoI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { /* shared messages */ },
  globalInjectPrefix: 'nano'
});

const app = createApp(App);
app.use(vueI18n);
app.use(nanoI18n);
app.mount('#app');
```

Use both in components:

```vue
<script setup lang="ts">
import { useI18n as useVueI18n } from 'vue-i18n';
import { useI18n as useNanoI18n } from 'nano-vue-i18n';

const vue = useVueI18n();
const nano = useNanoI18n();

// Complex translations with vue-i18n
const formattedDate = vue.d(new Date(), 'long');
const pluralMessage = vue.t('messages.plural', { count: 5 });

// Fast translations for frequently updating data with nano-vue-i18n
const status = ref('online');
const statusText = computed(() =>
  nano.t('common.status', { status: status.value })
);
</script>

<template>
  <div>
    <!-- vue-i18n for complex features -->
    <p>{{ $t('messages.welcome') }}</p>
    <p>{{ $d(new Date(), 'long') }}</p>

    <!-- nano-vue-i18n for performance-critical paths -->
    <p>{{ $nanoT('common.status', { status }) }}</p>
    <div v-for="item in largeList" :key="item.id">
      {{ $nanoT('item.label', { name: item.name }) }}
    </div>
  </div>
</template>
```

---

## Installation

```bash
npm install nano-vue-i18n
# or
yarn add nano-vue-i18n
# or
pnpm add nano-vue-i18n
```

---

## Quick Start

### 1. Define your messages

```ts
// src/i18n.ts
import { createI18n } from 'nano-vue-i18n';

const messages = {
  en: {
    common: {
      hello: 'Hello, {name}!',
      status: 'Current status: {status}'
    }
  },
  zh: {
    common: {
      hello: '你好，{name}！',
      status: '当前状态：{status}'
    }
  }
};

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  missingWarn: true  // optional, should be set to false in production
});
```

### 2. Install in your Vue app

```ts
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { i18n } from './i18n';

const app = createApp(App);

app.use(i18n);

app.mount('#app');
```

### 3. Use in templates

```vue
<template>
  <div>
    <!-- simple key -->
    <p>{{ $t('common.hello', { name: 'World' }) }}</p>

    <!-- using data from script -->
    <p>{{ $t('common.status', { status }) }}</p>
  </div>
</template>

<script setup lang="ts">
const status = 'online';
</script>
```

### 4. Use in script with `useI18n`

```vue
<script setup lang="ts">
import { useI18n } from 'nano-vue-i18n';

const { t, locale, availableLocales } = useI18n();

const message = t('common.hello', { name: 'Tracker' });

function switchToZh() {
  locale.value = 'zh';
}
</script>

<template>
  <div>
    <p>{{ t('common.hello', { name: 'Tracker' }) }}</p>
    <button @click="switchToZh">中文</button>
    <div>Current locale: {{ locale }}</div>
    <div>Available: {{ availableLocales.join(', ') }}</div>
  </div>
</template>
```

---

## Pluralization

The library supports pluralization via the `tc()` method (translate with count). Define plural forms using either the pipe `|` character or an array:

### Pipe Format

```ts
const messages = {
  en: {
    apple: 'I have {n} apple|I have {n} apples',
    item: 'one item|many items'
  },
  fr: {
    apple: '{n} pomme|{n} pommes'
  },
  ru: {
    apple: '{n} яблоко|{n} яблока|{n} яблок'
  }
};
```

### Array Format

You can also define plural forms using arrays for cleaner syntax:

```ts
const messages = {
  en: {
    apple: ['I have {n} apple', 'I have {n} apples'],
    item: ['one item', 'many items', 'tons of items']
  },
  fr: {
    apple: ['{n} pomme', '{n} pommes']
  },
  ru: {
    apple: ['{n} яблоко', '{n} яблока', '{n} яблок']
  }
};
```

Both formats can be mixed in the same messages object:

```ts
const messages = {
  en: {
    apple: 'one apple|many apples',     // pipe format
    banana: ['one banana', 'many bananas']  // array format
  }
};
```

Use `tc()` with a count to get the appropriate form:

```ts
const { tc } = useI18n();

tc('apple', 1);  // => 'I have {n} apple'
tc('apple', 5);  // => 'I have {n} apples'
tc('apple', 1, { n: 1 });  // => 'I have 1 apple'
tc('apple', 5, { n: 5 });  // => 'I have 5 apples'
```

### Supported Locales

Built-in pluralization rules for:

| Locale | Rule |
| -------- | ------ |
| English (`en`) | n === 1 ? singular : plural |
| French (`fr`) | n === 0 \|\| n === 1 ? singular : plural |
| German (`de`) | n === 1 ? singular : plural |
| Spanish (`es`) | n === 1 ? singular : plural |
| Russian (`ru`) | 3 forms based on endings |
| Polish (`pl`) | 3 forms based on endings |
| Arabic (`ar`) | 6 forms |
| Chinese (`zh`) | No plural (single form) |
| Japanese (`ja`) | No plural (single form) |
| Korean (`ko`) | No plural (single form) |

### Custom Plural Rules

Define custom plural rules via the `customPluralRules` option:

```ts
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  customPluralRules: {
    en: (n) => {
      if (n === 0) return 0;
      if (n === 1) return 1;
      if (n >= 100) return 2;
      return 1;
    }
  }
});
```

### Global Injection

The `tc` method is also available globally as `$tc` (or `$prefixTc` with a prefix):

```vue
<template>
  <p>{{ $tc('apple', count) }}</p>
  <p>{{ $nanoTc('item', count) }}</p>
</template>
```

---

## API

### `createI18n(options)`

Creates the i18n instance and Vue plugin.

```ts
import { createI18n } from 'nano-vue-i18n';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: { /* ... */ },
    zh: { /* ... */ }
  },
  missingWarn: true // optional
});
```

#### Options

```ts
interface I18nOptions {
  locale: string;
  fallbackLocale: string;
  messages: Record<string, any>;
  /**
   * Log console warnings when a translation key is missing.
   * Default: true
   */
  missingWarn?: boolean;
  /**
   * Whether to inject global properties ($t, $i18n, $locale) on app.config.globalProperties.
   * Default: true
   */
  globalInject?: boolean;
  /**
   * Prefix for global property names (e.g., with prefix 'foo', access as $fooT, $fooI18n, $fooLocale).
   * Default: ''
   */
  globalInjectPrefix?: string;
  /**
   * Custom pluralization rules for specific locales.
   * The function should return the plural form index (0-based) based on the count.
   */
  customPluralRules?: Record<string, (n: number) => number>;
}
```

#### Global Properties

By default, `createI18n` injects `$t`, `$i18n`, and `$locale` as global properties on `app.config.globalProperties`, making them available in all components without using `useI18n`.

```ts
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  globalInject: true, // default
  globalInjectPrefix: '' // default
});
```

You can disable global injection or add a prefix:

```ts
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  globalInject: false, // disable global injection
});

// Or with a prefix:
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  globalInjectPrefix: 'nano' // access as $nanoT, $nanoI18n, $nanoLocale
});
```

> See [Use with vue-i18n (Recommended)](#use-with-vue-i18n-recommended) for detailed instructions on using both libraries together.

#### Returned instance

```ts
interface I18nInstance {
  t: (key: string, params?: Ref<Record<string, any>> | Record<string, any>) => string;
  tc: (key: string, count: number, params?: Ref<Record<string, any>> | Record<string, any>) => string;
  locale: Ref<string>;
  availableLocales: string[];
  messages: Record<string, any>;
  fallbackLocale: string;
}
```

It is also a Vue plugin, so you use it as:

```ts
app.use(i18n);
```

---

### `useI18n()`

Access the global i18n instance inside components.

```ts
import { useI18n } from 'nano-vue-i18n';

const { t, locale, availableLocales, messages } = useI18n();

const text = t('common.hello', { name: 'User' });

locale.value = 'zh'; // switch language
```

> Note: Only **one global instance** is supported.
> `useI18n` just injects that instance — there is no local scope or per-component messages.

---

### `t(key, params?)`

Translate a message by key.

- `key`: dot-separated path, e.g. `"common.hello"`.
- `params`: optional object or `ref` object used for `{param}` interpolation.

```ts
t('common.hello');
// => 'Hello, {name}!'

t('common.hello', { name: 'World' });
// => 'Hello, World!'

const user = ref({ name: 'Alice' });
t('common.hello', user);
// => 'Hello, Alice!'
```

Interpolation is simple:

```txt
"Hello, {name}!"
           ^---- will match params.name
```

If a placeholder is not found in `params`, it is left as-is:

```ts
t('common.hello', {});
// => 'Hello, {name}!'
```

---

### `tc(key, count, params?)`

Translate a message with pluralization based on count.

- `key`: dot-separated path, e.g. `"common.apple"`.
- `count`: the count used to select the appropriate plural form.
- `params`: optional object or `ref` object used for `{param}` interpolation.

Plural forms can be defined using either the pipe `|` character or an array:

```ts
// Pipe format
const messages = {
  en: {
    apple: 'I have {n} apple|I have {n} apples'
  }
};

// Array format
const messages = {
  en: {
    apple: ['I have {n} apple', 'I have {n} apples']
  }
};
```

```ts
tc('apple', 1);
// => 'I have {n} apple'

tc('apple', 5);
// => 'I have {n} apples'

tc('apple', 1, { n: 1 });
// => 'I have 1 apple'

tc('apple', 5, { n: 5 });
// => 'I have 5 apples'
```

The library uses locale-aware pluralization rules:

```ts
// English: n === 1 ? 0 : 1
tc('apple', 1); // singular
tc('apple', 5); // plural

// French: n === 0 || n === 1 ? 0 : 1
tc('apple', 0); // singular (French rule)
tc('apple', 1); // singular
tc('apple', 2); // plural

// Chinese: always 0 (no plural)
tc('apple', 0); // same form
tc('apple', 1); // same form
tc('apple', 5); // same form
```

---

## How It Works (High-level)

- On initialization, **all locales** in `messages` are:
  1. Flattened into `"a.b.c"` keys
  2. Stored in a `Map<key_with_locale_prefix, string>`
  3. Plural forms are pre-processed (split by `|` or joined from arrays) for fast lookups
- At runtime, `t()`:
  1. Looks up the string in the current `locale` map
  2. Falls back to `fallbackLocale` if missing
  3. Runs a simple regex `\{(\w+)\}` to replace placeholders from `params`
- For `tc()` (pluralization):
  1. Looks up the pre-processed plural forms for the key
  2. Applies locale-specific pluralization rules to select the correct form
  3. Performs the same `{param}` replacement as `t()`

There is:

- No runtime message compilation
- No AST or complex parser
- No per-call caching / performance instrumentation

So `t()` is very cheap: it’s just map lookups + string replacement.

---

## Performance Notes

This library is specifically geared towards **high-frequency render paths**, such as:

- Components in large `v-for` lists
- Realtime position updates on a map
- Rapidly updating metrics / dashboards

Compared to a full-featured i18n solution:

- ✅ Much lower overhead per `t()` call
- ✅ No local scopes or per-component instances
- ✅ No dev-only `Performance.measure` instrumentation

> [!NOTE]
>
> **Recommended approach**: Use both libraries together.
>
> - Use [`vue-i18n`](https://github.com/intlify/vue-i18n) for complex features (pluralization, rich formatting, local scopes, etc.)
> - Use `nano-vue-i18n` for performance-critical paths requiring **fast translations with simple `{param}` interpolation**
>
> See [Use with vue-i18n (Recommended)](#use-with-vue-i18n-recommended) for configuration details.

---

## License

MIT

## Why nano-vue-i18n?

This library was born out of performance pain.

In a Vue 3 app with **high‑frequency updates** (a map / tracker with rapidly changing positions), I kept running into severe frame drops and main‑thread stalls. After a lot of profiling, the hot path always pointed back to `vue-i18n`:

- `createComposer` and `compileMessageFormat` being called way too often
- Dev‑mode `Performance.measure` / `clearMarks` causing additional overhead
- Local `useI18n` usage inside `v-for` and passing large reactive objects into `t()` making everything worse

I tried to tune `vue-i18n` for quite a while — disabling performance options, avoiding local scopes, restructuring how `t()` was called — but for this specific kind of workload it still felt much heavier than what I actually needed.

At some point I realized:

> I don’t need pluralization, rich message formats or local scopes.
> I just want fast global translations with `{param}` placeholders that don’t block the main thread.
>
> *But indeed, pluralization is essential, so I bring it back.*

So instead of fighting more knobs on a general‑purpose library, I wrote the smallest thing that could possibly work for my case:

- Flatten all messages once at startup
- Store them in `Map<key_with_locale_prefix, string>`
- Make `t()` just:
  - O(1) map lookup
  - A trivial `{param}` replacement on plain strings
- Keep only a single global instance and a reactive `locale`

That’s what `nano-vue-i18n` is: a stupidly simple, predictable i18n layer that trades features for **brutal simplicity and runtime speed**. If you are also tired of tuning `vue-i18n` for a use case that only needs basic interpolation, this library might be enough.
