import { Ref, Plugin } from 'vue';

/**
 * Configuration options for creating an i18n instance.
 */
interface I18nOptions {
    /**
     * The initial locale to use.
     */
    locale: string;
    /**
     * The fallback locale when translation is missing.
     */
    fallbackLocale: string;
    /**
     * Messages object with translations for different locales.
     */
    messages: Record<string, any>;
    /**
     * Whether to warn on missing translations, defaults to true.
     */
    missingWarn?: boolean;
    /**
     * Whether to inject globally in the same way as Vue I18n, defaults to true.
     */
    globalInjection?: boolean;
    /**
     * The global name to use for the i18n instance when globally injected.
     */
    globalNamePrefix?: string;
}
/**
 * The main i18n instance interface providing translation and locale management.
 */
interface I18nInstance {
    /**
     * Translates a key into the current locale's string, optionally interpolating parameters.
     * @param key - The translation key
     * @param params - Optional parameters for interpolation, can be a reactive Ref or plain object
     * @returns The translated string
     */
    t: (key: string, params?: Ref<Record<string, any>> | Record<string, any>) => string;
    /**
     * The current locale as a reactive Ref.
     */
    locale: Ref<string>;
    /**
     * Array of available locales in the messages object.
     */
    availableLocales: string[];
    /**
     * The messages object containing translations for all locales.
     */
    messages: Record<string, any>;
    /**
     * The fallback locale to use when translation is missing.
     */
    fallbackLocale: string;
}
/**
 * Creates a new i18n instance with the provided options.
 *
 * @param options - Configuration options for the i18n instance
 * @returns An I18nInstance that also implements the Vue Plugin interface
 *
 * @example
 * ```ts
 * const i18n = createI18n({
 *   locale: 'en',
 *   fallbackLocale: 'en',
 *   messages: {
 *     en: { greeting: 'Hello {name}!' },
 *     fr: { greeting: 'Bonjour {name}!' }
 *     'zh-CN': { greeting: '你好 {name}！' }
 *   }
 * })
 *
 * app.use(i18n)
 * ```
 */
declare function createI18n(options: I18nOptions): I18nInstance & Plugin;
/**
 * Retrieves the i18n instance from the Vue injection context.
 *
 * @returns The I18nInstance provided by the nearest createI18n ancestor
 * @throws Error if called before the i18n plugin is installed via app.use()
 *
 * @example
 * ```ts
 * const { t, locale } = useI18n()
 * console.log(t('greeting', { name: 'World' }))
 * ```
 */
declare function useI18n(): I18nInstance;

export { type I18nInstance, createI18n, useI18n };
