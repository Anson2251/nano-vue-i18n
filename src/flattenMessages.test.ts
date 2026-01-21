import { describe, it, expect } from 'vitest';
import { createI18n } from './index';

describe('createI18n - flattenMessages', () => {
    it('should flatten a simple object', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages: {
                en: {
                    hello: 'Hello',
                    world: 'World'
                }
            }
        });
        expect(i18n.t('hello')).toBe('Hello');
        expect(i18n.t('world')).toBe('World');
    });

    it('should flatten nested objects with dot notation', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages: {
                en: {
                    greeting: {
                        hello: 'Hello',
                        world: 'World'
                    }
                }
            }
        });
        expect(i18n.t('greeting.hello')).toBe('Hello');
        expect(i18n.t('greeting.world')).toBe('World');
    });

    it('should handle deeply nested objects', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages: {
                en: {
                    level1: {
                        level2: {
                            level3: {
                                deep: 'Deep value'
                            }
                        }
                    }
                }
            }
        });
        expect(i18n.t('level1.level2.level3.deep')).toBe('Deep value');
    });

    it('should ignore non-string values', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            missingWarn: false,
            messages: {
                en: {
                    valid: 'Valid string',
                    invalid: {
                        nested: 123,
                        another: null
                    }
                }
            }
        });
        expect(i18n.t('valid')).toBe('Valid string');
        expect(i18n.t('invalid.nested')).toBe('invalid.nested');
        expect(i18n.t('invalid.another')).toBe('invalid.another');
    });

    it('should handle empty messages', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            missingWarn: false,
            messages: {
                en: {}
            }
        });
        expect(i18n.t('any')).toBe('any');
    });

    it('should handle keys with special characters', () => {
        const i18n = createI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages: {
                en: {
                    'key-with-dashes': 'Dashes',
                    'key_with_underscores': 'Underscores'
                }
            }
        });
        expect(i18n.t('key-with-dashes')).toBe('Dashes');
        expect(i18n.t('key_with_underscores')).toBe('Underscores');
    });
});
