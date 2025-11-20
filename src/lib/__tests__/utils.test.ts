import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('Utils - cn function', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const result = cn('base-class', false && 'hidden-class', true && 'visible-class');
    expect(result).toBe('base-class visible-class');
  });

  it('should merge tailwind conflicting classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4'); // tailwind-merge should keep the last px value
  });

  it('should handle undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'another-class');
    expect(result).toBe('base-class another-class');
  });

  it('should handle array inputs', () => {
    const result = cn(['class-1', 'class-2'], 'class-3');
    expect(result).toBe('class-1 class-2 class-3');
  });

  it('should handle object inputs', () => {
    const result = cn({
      'active-class': true,
      'inactive-class': false,
      'another-class': true,
    });
    expect(result).toBe('active-class another-class');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle complex mixed inputs', () => {
    const isActive = true;
    const result = cn(
      'base-class',
      ['array-class-1', 'array-class-2'],
      { 'conditional-class': isActive },
      isActive && 'active-class',
      undefined
    );
    expect(result).toContain('base-class');
    expect(result).toContain('array-class-1');
    expect(result).toContain('conditional-class');
    expect(result).toContain('active-class');
  });
});
