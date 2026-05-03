import { safeParseJSON, safeParseSession, safeParseEvents } from '../utilities'
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

});
