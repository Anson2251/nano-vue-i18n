import { ref, inject, type Ref, type App, type Plugin, unref } from "vue";

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
    globalInject?: boolean;

    /**
     * The global name to use for the i18n instance when globally injected.
     */
    globalInjectPrefix?: string;
}

/**
 * The main i18n instance interface providing translation and locale management.
 */
export interface I18nInstance {
    /**
     * Translates a key into the current locale's string, optionally interpolating parameters.
     * @param key - The translation key
     * @param params - Optional parameters for interpolation, can be a reactive Ref or plain object
     * @returns The translated string
     */
    t: (
        key: string,
        params?: Ref<Record<string, any>> | Record<string, any>,
    ) => string;
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

const I18nInjectionKey = Symbol("i18n");

/**
 * Recursively flattens nested message objects into a flat map with dot-notation keys.
 *
 * @param messages - The nested messages object to flatten
 * @param prefix - Optional prefix for building dot-notation keys (used internally for recursion)
 * @returns A Map where keys are dot-notation paths and values are the translation strings
 */
function flattenMessages(messages: Record<string, any>, prefix = ""): Map<string, string> {
    const result = new Map<string, string>();

    for (const key in messages) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = messages[key];

        if (typeof value === "string") {
            result.set(fullKey, value);
        }
        else if (typeof value === "object" && value !== null) {
            const nested = flattenMessages(value, fullKey);
            for (const [nestedKey, nestedValue] of nested) {
                result.set(nestedKey, nestedValue);
            }
        }
    }

    return result;
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
export function createI18n(options: I18nOptions): I18nInstance & Plugin {
    const locale = ref(options.locale);
    const messages = options.messages;
    const fallbackLocale = options.fallbackLocale;
    const availableLocales = Object.keys(messages);
    const translationMap: Map<string, string> = flattenMessages(messages);

    function getTranslation(key: string): string {
        const translation = translationMap.get(`${locale.value}.${key}`)
            ?? translationMap.get(`${fallbackLocale}.${key}`);

        if (typeof translation !== "undefined") {
            return translation;
        }
        else {
            if (options.missingWarn !== false) {
                console.warn(`[i18n (nano)] Missing translation for key: ${key}`);
            }
            return key;
        }
    }

    const PARAM_REGEX = /\{(\w+)\}/g;

    function t(
        key: string,
        params?: Ref<Record<string, any>> | Record<string, any>,
    ): string {
        let translation = getTranslation(key);
        if (!params) return translation;

        const currentParams = unref(params);

        translation = translation.replace(
            PARAM_REGEX,
            (match, paramName: string) => {
                return paramName in currentParams
                    ? String(currentParams[paramName])
                    : match;
            },
        );

        return translation;
    }

    const instance: I18nInstance = {
        t,
        locale,
        availableLocales,
        messages: messages,
        fallbackLocale,
    };

    const plugin: Plugin = {
        install(app: App) {
            app.provide(I18nInjectionKey, instance);
            if (options.globalInject !== false) {
                if (options.globalInjectPrefix?.length) {
                    app.config.globalProperties[`$${options.globalInjectPrefix}T`] = t;
                    app.config.globalProperties[`$${options.globalInjectPrefix}I18n`] = instance;
                    app.config.globalProperties[`$${options.globalInjectPrefix}Locale`] = locale;
                }
                else {
                    app.config.globalProperties[`$t`] = t;
                    app.config.globalProperties[`$i18n`] = instance;
                    app.config.globalProperties[`$locale`] = locale;
                }
            }
        },
    };

    return Object.assign(instance, plugin);
}

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
export function useI18n(): I18nInstance {
    const i18n = inject<I18nInstance>(I18nInjectionKey);

    if (!i18n) {
        throw new Error(
            "I18n (nano) instance not found. Did you forget to install the i18n plugin?",
        );
    }

    return i18n;
}
