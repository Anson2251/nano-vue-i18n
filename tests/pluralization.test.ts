import { describe, it, expect, vi } from 'vitest';
import { createI18n } from '../src/index';

describe('createI18n - pluralization (tc)', () => {
    describe('English pluralization', () => {
        const messages = {
            en: {
                apple: 'I have {n} apple|I have {n} apples',
                item: 'one item|many items'
            }
        };

        it('should return singular form when count is 1', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('I have {n} apple');
        });

        it('should return plural form when count is greater than 1', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 2)).toBe('I have {n} apples');
            expect(i18n.tc('apple', 100)).toBe('I have {n} apples');
        });

        it('should return plural form when count is 0', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 0)).toBe('I have {n} apples');
        });

        it('should handle interpolation with pluralization', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1, { n: 1 })).toBe('I have 1 apple');
            expect(i18n.tc('apple', 5, { n: 5 })).toBe('I have 5 apples');
        });

        it('should return singular for negative count', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', -1)).toBe('I have {n} apple');
        });

        it('should return plural for negative count other than -1', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', -5)).toBe('I have {n} apples');
        });
    });

    describe('French pluralization', () => {
        const messages = {
            fr: {
                apple: '{n} pomme|{n} pommes',
                chat: 'un chat|des chats'
            }
        };

        it('should return singular form when count is 1', () => {
            const i18n = createI18n({
                locale: 'fr',
                fallbackLocale: 'fr',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('{n} pomme');
        });

        it('should return singular form when count is 0 or 1 (French rule returns 0 for both)', () => {
            const i18n = createI18n({
                locale: 'fr',
                fallbackLocale: 'fr',
                messages
            });
            // French rule: n === 0 || n === 1 ? 0 : 1
            expect(i18n.tc('apple', 0)).toBe('{n} pomme');
            expect(i18n.tc('apple', 1)).toBe('{n} pomme');
            expect(i18n.tc('apple', 2)).toBe('{n} pommes');
        });

        it('should handle interpolation with pluralization', () => {
            const i18n = createI18n({
                locale: 'fr',
                fallbackLocale: 'fr',
                messages
            });
            expect(i18n.tc('apple', 1, { n: 1 })).toBe('1 pomme');
            expect(i18n.tc('apple', 5, { n: 5 })).toBe('5 pommes');
        });
    });

    describe('Chinese pluralization (no plural)', () => {
        const messages = {
            'zh-CN': {
                apple: '我有{n}个苹果'
            }
        };

        it('should return the same form regardless of count', () => {
            const i18n = createI18n({
                locale: 'zh-CN',
                fallbackLocale: 'zh-CN',
                messages
            });
            expect(i18n.tc('apple', 0)).toBe('我有{n}个苹果');
            expect(i18n.tc('apple', 1)).toBe('我有{n}个苹果');
            expect(i18n.tc('apple', 5)).toBe('我有{n}个苹果');
        });

        it('should handle interpolation', () => {
            const i18n = createI18n({
                locale: 'zh-CN',
                fallbackLocale: 'zh-CN',
                messages
            });
            expect(i18n.tc('apple', 5, { n: 5 })).toBe('我有5个苹果');
        });
    });

    describe('Japanese pluralization (no plural)', () => {
        const messages = {
            ja: {
                apple: '。林檎が{n}個ある'
            }
        };

        it('should return the same form regardless of count', () => {
            const i18n = createI18n({
                locale: 'ja',
                fallbackLocale: 'ja',
                messages
            });
            expect(i18n.tc('apple', 0)).toBe('。林檎が{n}個ある');
            expect(i18n.tc('apple', 1)).toBe('。林檎が{n}個ある');
            expect(i18n.tc('apple', 5)).toBe('。林檎が{n}個ある');
        });
    });

    describe('Korean pluralization (no plural)', () => {
        const messages = {
            ko: {
                apple: '사과{n}개가 있다'
            }
        };

        it('should return the same form regardless of count', () => {
            const i18n = createI18n({
                locale: 'ko',
                fallbackLocale: 'ko',
                messages
            });
            expect(i18n.tc('apple', 0)).toBe('사과{n}개가 있다');
            expect(i18n.tc('apple', 1)).toBe('사과{n}개가 있다');
            expect(i18n.tc('apple', 5)).toBe('사과{n}개가 있다');
        });
    });

    describe('Russian pluralization', () => {
        const messages = {
            ru: {
                apple: '{n} яблоко|{n} яблока|{n} яблок',
                day: '{n} день|{n} дня|{n} дней'
            }
        };

        it('should return form 0 for n ending in 1 but not 11', () => {
            const i18n = createI18n({
                locale: 'ru',
                fallbackLocale: 'ru',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 21)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 31)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 41)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 51)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 61)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 71)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 81)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 91)).toBe('{n} яблоко');
        });

        it('should return form 1 for n ending in 2-4 but not 12-14', () => {
            const i18n = createI18n({
                locale: 'ru',
                fallbackLocale: 'ru',
                messages
            });
            expect(i18n.tc('apple', 2)).toBe('{n} яблока');
            expect(i18n.tc('apple', 3)).toBe('{n} яблока');
            expect(i18n.tc('apple', 4)).toBe('{n} яблока');
            expect(i18n.tc('apple', 22)).toBe('{n} яблока');
            expect(i18n.tc('apple', 23)).toBe('{n} яблока');
            expect(i18n.tc('apple', 24)).toBe('{n} яблока');
            expect(i18n.tc('apple', 32)).toBe('{n} яблока');
        });

        it('should return form 2 for n ending in 5-0, 11-14', () => {
            const i18n = createI18n({
                locale: 'ru',
                fallbackLocale: 'ru',
                messages
            });
            expect(i18n.tc('apple', 0)).toBe('{n} яблок');
            expect(i18n.tc('apple', 5)).toBe('{n} яблок');
            expect(i18n.tc('apple', 10)).toBe('{n} яблок');
            expect(i18n.tc('apple', 11)).toBe('{n} яблок');
            expect(i18n.tc('apple', 12)).toBe('{n} яблок');
            expect(i18n.tc('apple', 13)).toBe('{n} яблок');
            expect(i18n.tc('apple', 14)).toBe('{n} яблок');
            expect(i18n.tc('apple', 15)).toBe('{n} яблок');
            expect(i18n.tc('apple', 20)).toBe('{n} яблок');
            expect(i18n.tc('apple', 25)).toBe('{n} яблок');
        });

        it('should handle interpolation with pluralization', () => {
            const i18n = createI18n({
                locale: 'ru',
                fallbackLocale: 'ru',
                messages
            });
            expect(i18n.tc('apple', 1, { n: 1 })).toBe('1 яблоко');
            expect(i18n.tc('apple', 5, { n: 5 })).toBe('5 яблок');
            expect(i18n.tc('apple', 21, { n: 21 })).toBe('21 яблоко');
        });
    });

    describe('Polish pluralization', () => {
        const messages = {
            pl: {
                apple: '{n} jabłko|{n} jabłka|{n} jabłek'
            }
        };

        it('should return form 0 for n === 1', () => {
            const i18n = createI18n({
                locale: 'pl',
                fallbackLocale: 'pl',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('{n} jabłko');
        });

        it('should return form 1 for n ending in 2-4 but not 12-14', () => {
            const i18n = createI18n({
                locale: 'pl',
                fallbackLocale: 'pl',
                messages
            });
            expect(i18n.tc('apple', 2)).toBe('{n} jabłka');
            expect(i18n.tc('apple', 3)).toBe('{n} jabłka');
            expect(i18n.tc('apple', 4)).toBe('{n} jabłka');
            expect(i18n.tc('apple', 22)).toBe('{n} jabłka');
            expect(i18n.tc('apple', 23)).toBe('{n} jabłka');
            expect(i18n.tc('apple', 24)).toBe('{n} jabłka');
        });

        it('should return form 2 for other values', () => {
            const i18n = createI18n({
                locale: 'pl',
                fallbackLocale: 'pl',
                messages
            });
            expect(i18n.tc('apple', 0)).toBe('{n} jabłek');
            expect(i18n.tc('apple', 5)).toBe('{n} jabłek');
            expect(i18n.tc('apple', 10)).toBe('{n} jabłek');
            expect(i18n.tc('apple', 11)).toBe('{n} jabłek');
            expect(i18n.tc('apple', 12)).toBe('{n} jabłek');
            expect(i18n.tc('apple', 13)).toBe('{n} jabłek');
            expect(i18n.tc('apple', 14)).toBe('{n} jabłek');
            expect(i18n.tc('apple', 15)).toBe('{n} jabłek');
        });
    });

    describe('Arabic pluralization', () => {
        const messages = {
            ar: {
                book: '{n} كتاب|{n} كتابان|{n} كتب|{n} كتب|{n} كتب|{n} كتب'
            }
        };

        it('should return form 0 for n === 0', () => {
            const i18n = createI18n({
                locale: 'ar',
                fallbackLocale: 'ar',
                messages
            });
            expect(i18n.tc('book', 0)).toBe('{n} كتاب');
        });

        it('should return form 1 for n === 1', () => {
            const i18n = createI18n({
                locale: 'ar',
                fallbackLocale: 'ar',
                messages
            });
            expect(i18n.tc('book', 1)).toBe('{n} كتابان');
        });

        it('should return form 2 for n === 2', () => {
            const i18n = createI18n({
                locale: 'ar',
                fallbackLocale: 'ar',
                messages
            });
            expect(i18n.tc('book', 2)).toBe('{n} كتب');
        });

        it('should return form 3 for n in 3-10 range', () => {
            const i18n = createI18n({
                locale: 'ar',
                fallbackLocale: 'ar',
                messages
            });
            expect(i18n.tc('book', 3)).toBe('{n} كتب');
            expect(i18n.tc('book', 5)).toBe('{n} كتب');
            expect(i18n.tc('book', 10)).toBe('{n} كتب');
        });

        it('should return form 4 for n in 11-99 range', () => {
            const i18n = createI18n({
                locale: 'ar',
                fallbackLocale: 'ar',
                messages
            });
            expect(i18n.tc('book', 11)).toBe('{n} كتب');
            expect(i18n.tc('book', 15)).toBe('{n} كتب');
            expect(i18n.tc('book', 99)).toBe('{n} كتب');
        });

        it('should return form 5 for n >= 100', () => {
            const i18n = createI18n({
                locale: 'ar',
                fallbackLocale: 'ar',
                messages
            });
            expect(i18n.tc('book', 100)).toBe('{n} كتب');
            expect(i18n.tc('book', 1000)).toBe('{n} كتب');
        });
    });

    describe('German pluralization', () => {
        const messages = {
            de: {
                apple: '{n} Apfel|{n} Äpfel'
            }
        };

        it('should return singular form when count is 1', () => {
            const i18n = createI18n({
                locale: 'de',
                fallbackLocale: 'de',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('{n} Apfel');
        });

        it('should return plural form when count is not 1', () => {
            const i18n = createI18n({
                locale: 'de',
                fallbackLocale: 'de',
                messages
            });
            expect(i18n.tc('apple', 0)).toBe('{n} Äpfel');
            expect(i18n.tc('apple', 2)).toBe('{n} Äpfel');
        });
    });

    describe('Spanish pluralization', () => {
        const messages = {
            es: {
                apple: '{n} manzana|{n} manzanas'
            }
        };

        it('should return singular form when count is 1', () => {
            const i18n = createI18n({
                locale: 'es',
                fallbackLocale: 'es',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('{n} manzana');
        });

        it('should return plural form when count is not 1', () => {
            const i18n = createI18n({
                locale: 'es',
                fallbackLocale: 'es',
                messages
            });
            expect(i18n.tc('apple', 0)).toBe('{n} manzanas');
            expect(i18n.tc('apple', 2)).toBe('{n} manzanas');
        });
    });

    describe('Single form (no pipe)', () => {
        const messages = {
            en: {
                single: 'Only one form'
            }
        };

        it('should return the same form regardless of count', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('single', 0)).toBe('Only one form');
            expect(i18n.tc('single', 1)).toBe('Only one form');
            expect(i18n.tc('single', 100)).toBe('Only one form');
        });
    });

    describe('Fallback to fallbackLocale plural rules', () => {
        const messages = {
            'en': {
                apple: 'one apple|many apples'
            }
        };

        it('should use fallbackLocale plural rules when locale has no custom rule', () => {
            const i18n = createI18n({
                locale: 'pt',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('one apple');
            expect(i18n.tc('apple', 2)).toBe('many apples');
        });

        it('should use fallbackLocale rule when locale rule is not defined', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('one apple');
            expect(i18n.tc('apple', 2)).toBe('many apples');
        });
    });

    describe('Custom plural rules', () => {
        const messages = {
            en: {
                apple: 'one apple|many apples|tons of apples'
            }
        };

        it('should use custom plural rule when provided', () => {
            const customRule: (n: number) => number = (n) => {
                if (n === 0) return 0;
                if (n === 1) return 1;
                if (n >= 100) return 2;
                return 1;
            };

            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages,
                customPluralRules: {
                    en: customRule
                }
            });

            expect(i18n.tc('apple', 0)).toBe('one apple');
            expect(i18n.tc('apple', 1)).toBe('many apples');
            expect(i18n.tc('apple', 5)).toBe('many apples');
            expect(i18n.tc('apple', 100)).toBe('tons of apples');
            expect(i18n.tc('apple', 1000)).toBe('tons of apples');
        });
    });

    describe('NaN handling', () => {
        const messages = {
            en: {
                apple: 'one apple|many apples'
            }
        };

        it('should warn and return singular form translation when count is NaN', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });

            const result = i18n.tc('apple', NaN);

            expect(warnSpy).toHaveBeenCalledWith('[i18n (nano)] Plural parameter is NaN');
            expect(result).toBe('one apple');

            warnSpy.mockRestore();
        });

        it('should not warn when missingWarn is false and count is NaN', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages,
                missingWarn: false
            });

            i18n.tc('apple', NaN);

            expect(warnSpy).not.toHaveBeenCalled();

            warnSpy.mockRestore();
        });
    });

    describe('Missing plural key', () => {
        const messages = {
            en: {
                greeting: 'Hello'
            }
        };

        it('should return key when plural key is missing', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });

            expect(i18n.tc('nonexistent.key', 5)).toBe('nonexistent.key');

            warnSpy.mockRestore();
        });

        it('should interpolate in missing key scenario', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });

            expect(i18n.tc('nonexistent.key', 5, { name: 'World' })).toBe('nonexistent.key');

            warnSpy.mockRestore();
        });
    });

    describe('Plural forms with more options than needed', () => {
        const messages = {
            en: {
                apple: 'one apple|many apples|tons of apples|way too many apples'
            },
            ru: {
                apple: '{n} яблоко|{n} яблока|{n} яблок'
            }
        };

        it('should use second form for all non-1 counts in English (rule only returns 0 or 1)', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('one apple');
            expect(i18n.tc('apple', 5)).toBe('many apples');
            expect(i18n.tc('apple', 100)).toBe('many apples');
        });

        it('should handle extra forms for Russian correctly', () => {
            const i18n = createI18n({
                locale: 'ru',
                fallbackLocale: 'ru',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 5)).toBe('{n} яблок');
        });
    });

    describe('Whitespace handling in plural forms', () => {
        const messages = {
            en: {
                apple: '  one apple  |  many apples  ',
                trim: 'one| two| three'
            }
        };

        it('should trim whitespace from forms', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('one apple');
            expect(i18n.tc('apple', 2)).toBe('many apples');
        });

        it('should handle forms with different spacing', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('trim', 1)).toBe('one');
            expect(i18n.tc('trim', 2)).toBe('two');
        });
    });

    describe('Switching locale and pluralization', () => {
        const messages = {
            en: {
                apple: 'one apple|many apples'
            },
            fr: {
                apple: '{n} pomme|{n} pommes'
            },
            ru: {
                apple: '{n} яблоко|{n} яблока|{n} яблок'
            }
        };

        it('should change pluralization behavior when locale changes', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });

            expect(i18n.tc('apple', 0)).toBe('many apples');
            expect(i18n.tc('apple', 1)).toBe('one apple');

            i18n.locale.value = 'fr';

            // French rule: n === 0 || n === 1 ? 0 : 1
            expect(i18n.tc('apple', 0)).toBe('{n} pomme');
            expect(i18n.tc('apple', 1)).toBe('{n} pomme');
            expect(i18n.tc('apple', 2)).toBe('{n} pommes');

            i18n.locale.value = 'ru';

            expect(i18n.tc('apple', 1)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 2)).toBe('{n} яблока');
            expect(i18n.tc('apple', 5)).toBe('{n} яблок');
        });

        it('should fallback to fallbackLocale plural rules when switching to missing locale', () => {
            const messages2 = {
                en: {
                    apple: 'one apple|many apples'
                }
            };

            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages: messages2
            });

            i18n.locale.value = 'de';

            expect(i18n.tc('apple', 1)).toBe('one apple');
            expect(i18n.tc('apple', 5)).toBe('many apples');
        });
    });

    describe('Edge cases', () => {
        const messages = {
            en: {
                apple: 'one|many'
            }
        };

        it('should handle very large numbers', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('one');
            expect(i18n.tc('apple', Number.MAX_SAFE_INTEGER)).toBe('many');
        });

        it('should handle negative numbers correctly', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', -1)).toBe('one');
            expect(i18n.tc('apple', -2)).toBe('many');
        });

        it('should handle floating point numbers', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1.5)).toBe('many');
            expect(i18n.tc('apple', 0.5)).toBe('many');
        });

        it('should handle decimal values with pluralization rules', () => {
            const messages2 = {
                en: {
                    apple: 'one|many'
                }
            };

            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages: messages2
            });

            expect(i18n.tc('apple', 1.0)).toBe('one');
            expect(i18n.tc('apple', 1.1)).toBe('many');
        });
    });

    describe('Multiple interpolation params with pluralization', () => {
        const messages = {
            en: {
                apple: '{n} apples for {person}'
            }
        };

        it('should interpolate multiple parameters', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 5, { n: 5, person: 'Alice' })).toBe('5 apples for Alice');
        });

        it('should handle missing interpolation parameters gracefully', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 5, { n: 5 })).toBe('5 apples for {person}');
        });
    });

    describe('Nested key pluralization', () => {
        const messages = {
            en: {
                fruits: {
                    apple: 'one apple|many apples'
                }
            }
        };

        it('should work with nested keys', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('fruits.apple', 1)).toBe('one apple');
            expect(i18n.tc('fruits.apple', 5)).toBe('many apples');
        });
    });

    describe('Array format for plural forms', () => {
        const messages = {
            en: {
                apple: ['one apple', 'many apples'],
                item: ['one item', 'many items', 'tons of items']
            }
        };

        it('should handle array format with two forms', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('one apple');
            expect(i18n.tc('apple', 2)).toBe('many apples');
            expect(i18n.tc('apple', 0)).toBe('many apples');
        });

        it('should handle array format with three forms', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('item', 1)).toBe('one item');
            expect(i18n.tc('item', 2)).toBe('many items');
            expect(i18n.tc('item', 5)).toBe('many items');
        });

        it('should handle array format with interpolation', () => {
            const messagesWithParams = {
                en: {
                    apple: ['{n} apple', '{n} apples']
                }
            };
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages: messagesWithParams
            });
            expect(i18n.tc('apple', 1, { n: 1 })).toBe('1 apple');
            expect(i18n.tc('apple', 5, { n: 5 })).toBe('5 apples');
        });

        it('should handle nested array format', () => {
            const messages = {
                en: {
                    fruits: {
                        apple: ['one apple', 'many apples']
                    }
                }
            };
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('fruits.apple', 1)).toBe('one apple');
            expect(i18n.tc('fruits.apple', 5)).toBe('many apples');
        });

        it('should handle array format with Russian pluralization', () => {
            const messages = {
                ru: {
                    apple: ['{n} яблоко', '{n} яблока', '{n} яблок']
                }
            };
            const i18n = createI18n({
                locale: 'ru',
                fallbackLocale: 'ru',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('{n} яблоко');
            expect(i18n.tc('apple', 2)).toBe('{n} яблока');
            expect(i18n.tc('apple', 5)).toBe('{n} яблок');
        });

        it('should handle array format with French pluralization', () => {
            const messages = {
                fr: {
                    apple: ['{n} pomme', '{n} pommes']
                }
            };
            const i18n = createI18n({
                locale: 'fr',
                fallbackLocale: 'fr',
                messages
            });
            expect(i18n.tc('apple', 0)).toBe('{n} pomme');
            expect(i18n.tc('apple', 1)).toBe('{n} pomme');
            expect(i18n.tc('apple', 2)).toBe('{n} pommes');
        });
    });

    describe('Mixed pipe and array format', () => {
        it('should handle both pipe and array formats in same messages object', () => {
            const messages = {
                en: {
                    apple: 'one apple|many apples',
                    banana: ['one banana', 'many bananas'],
                    cherry: 'one cherry|many cherries|tons of cherries'
                }
            };
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });
            expect(i18n.tc('apple', 1)).toBe('one apple');
            expect(i18n.tc('apple', 2)).toBe('many apples');
            expect(i18n.tc('banana', 1)).toBe('one banana');
            expect(i18n.tc('banana', 2)).toBe('many bananas');
            expect(i18n.tc('cherry', 1)).toBe('one cherry');
            expect(i18n.tc('cherry', 2)).toBe('many cherries');
        });
    });

    describe('Ref params with pluralization', () => {
        const messages = {
            en: {
                apple: '{n} apples'
            }
        };

        it('should handle Ref params', () => {
            const i18n = createI18n({
                locale: 'en',
                fallbackLocale: 'en',
                messages
            });

            const paramsRef = { n: 5 };
            expect(i18n.tc('apple', 5, paramsRef)).toBe('5 apples');

            paramsRef.n = 10;
            expect(i18n.tc('apple', 10, paramsRef)).toBe('10 apples');
        });
    });
});
