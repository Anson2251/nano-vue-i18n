import { describe, it, expect } from 'vitest';
import { useI18n } from '../src/index';

describe('useI18n', () => {
    it('should throw error when i18n is not installed', () => {
        expect(() => useI18n()).toThrow('I18n instance not found. Did you forget to install the i18n plugin?');
    });
});
