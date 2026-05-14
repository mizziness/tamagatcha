import { safeParseJSON, safeParseSession, safeParseEvents, cleanUserInput } from '../utilities'
import { describe, it, expect } from '@jest/globals';

describe('utilities', () => {

  describe('safeParseJSON', () => {
    it('should return fallback for invalid JSON', () => {
      const result = safeParseJSON('invalid json', 'fallback');
      expect(result).toBe('fallback');
    });

    it('should return fallback for empty string', () => {
      const result = safeParseJSON('', 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('safeParseSession', () => {
    it('should return null for invalid JSON', () => {
      const result = safeParseSession('invalid json');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = safeParseSession('');
      expect(result).toBeNull();
    });

    it('should return parsed object for valid JSON', () => {
      const obj = { username: 'testuser' };
      const result = safeParseSession(JSON.stringify(obj));
      expect(result).toEqual(obj);
    });
  });

  describe('safeParseEvents', () => {
    it('should return empty array for invalid JSON', () => {
      const result = safeParseEvents('invalid json');
      expect(result).toEqual([]);
    });

    it('should return empty array for empty string', () => {
      const result = safeParseEvents('');
      expect(result).toEqual([]);
    });

    it('should return parsed array for valid JSON', () => {
      const arr = [{ type: 'event1' }, { type: 'event2' }];
      const result = safeParseEvents(JSON.stringify(arr));
      expect(result).toEqual(arr);
    });

    it('should return empty array if parsed value is not an array', () => {
      const result = safeParseEvents(JSON.stringify({ not: 'an array' }));
      expect(result).toEqual([]);
    });
  });

  describe('cleanUserInput', () => {
    it('should trim leading and trailing whitespace', () => {
      const result = cleanUserInput('  test  ');
      expect(result).toBe('test');
    });

    it('should collapse multiple spaces into one', () => {
      const result = cleanUserInput('test   input');
      expect(result).toBe('test input');
    });

    it('should return empty string for non-string input', () => {
      const result = cleanUserInput(123);
      expect(result).toBe('');
    });

    it('should return empty string if input is empty after cleaning', () => {
      const result = cleanUserInput('   ');
      expect(result).toBe('');
    });
  });

});
