import { describe, it, expect, vi } from 'vitest';
import { createI18n } from '../src/index';

describe('createI18n', () => {
    const messages = {
        en: {
            greeting: 'Hello {name}!',
            farewell: 'Goodbye',
            nested: {
                message: 'Nested message'
            }
        },
        fr: {
            greeting: 'Bonjour {name}!',
            farewell: 'Au revoir'
        },
        'zh-CN': {
            greeting: '你好 {name}！'
        }
    };

    it('should create an i18n instance with correct initial locale', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages
        });

        expect(i18n.locale.value).toBe('en');
    });

    it('should return available locales', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages
        });

        expect(i18n.availableLocales).toEqual(['en', 'fr', 'zh-CN']);
    });

    it('should translate keys in the current locale', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages
        });

        expect(i18n.t('greeting')).toBe('Hello {name}!');
        expect(i18n.t('farewell')).toBe('Goodbye');
        expect(i18n.t('nested.message')).toBe('Nested message');
    });

    it('should switch translations when locale changes', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages
        });

        expect(i18n.t('greeting')).toBe('Hello {name}!');

        i18n.locale.value = 'fr';

        expect(i18n.t('greeting')).toBe('Bonjour {name}!');
    });

    it('should fall back to fallbackLocale when translation is missing', () => {
        const i18n = createI18n({
            locale: 'fr',
            fallbackLocale: 'en',
            messages
        });

        expect(i18n.t('farewell')).toBe('Au revoir');
        expect(i18n.t('nonexistent')).toBe('nonexistent');
    });

    it('should interpolate parameters', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages
        });

        expect(i18n.t('greeting', { name: 'World' })).toBe('Hello World!');
        expect(i18n.t('greeting', { name: 'John' })).toBe('Hello John!');
    });

    it('should handle Ref parameters', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages
        });

        const nameRef = { name: 'Alice' };
        expect(i18n.t('greeting', nameRef)).toBe('Hello Alice!');

        nameRef.name = 'Bob';
        expect(i18n.t('greeting', nameRef)).toBe('Hello Bob!');
    });

    it('should return the key itself when translation is missing', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages
        });

        expect(i18n.t('completely.nonexistent.key')).toBe('completely.nonexistent.key');
    });

    it('should handle locale without translations in messages object', () => {
        const i18n = createI18n({
            locale: 'de',
            fallbackLocale: 'en',
            messages: {
                de: {},
                en: {
                    greeting: 'Hello {name}!'
                }
            }
        });

        expect(i18n.locale.value).toBe('de');
        expect(i18n.t('greeting')).toBe('Hello {name}!');
    });

    it('should not warn when missingWarn is false', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages,
            missingWarn: false
        });

        i18n.t('nonexistent');

        expect(warnSpy).not.toHaveBeenCalled();

        warnSpy.mockRestore();
    });

    it('should warn by default when translation is missing', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages
        });

        i18n.t('nonexistent');

        expect(warnSpy).toHaveBeenCalledWith('[i18n] Missing translation for key: nonexistent');

        warnSpy.mockRestore();
    });

    it('should handle globalNamePrefix', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages,
            globalNamePrefix: 'myI18n'
        });

        expect(i18n.locale.value).toBe('en');
    });
});
