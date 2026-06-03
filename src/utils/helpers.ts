/**
 * Utility Functions
 */

/**
 * 포맷팅 함수들
 */
export const formatters = {
  /**
   * 숫자를 화폐로 포맷
   */
  currency: (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  /**
   * 날짜 포맷
   */
  date: (date: Date | string, locale = 'en-US') => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale).format(d);
  },

  /**
   * 시간 포맷 (상대적)
   */
  timeAgo: (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);

    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) {
        return `${interval} ${key}${interval !== 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  },
};

/**
 * 검증 함수들
 */
export const validators = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  },

  phone: (phone: string): boolean => {
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return regex.test(phone.replace(/\s/g, ''));
  },

  password: (password: string): boolean => {
    // 최소 8자, 대문자, 소문자, 숫자 포함
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  },
};

/**
 * 문자열 유틸리티
 */
export const stringUtils = {
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),

  camelToKebab: (str: string) =>
    str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase(),

  truncate: (str: string, length: number = 50) =>
    str.length > length ? `${str.substring(0, length)}...` : str,

  slugify: (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, ''),
};

/**
 * 배열 유틸리티
 */
export const arrayUtils = {
  shuffle: <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  unique: <T,>(array: T[]): T[] => Array.from(new Set(array)),

  chunk: <T,>(array: T[], size: number): T[][] => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  flatten: <T,>(array: any[]): T[] => array.flat(Infinity),
};

/**
 * 객체 유틸리티
 */
export const objectUtils = {
  isEmpty: (obj: Record<string, any>) => Object.keys(obj).length === 0,

  pick: <T extends Record<string, any>>(obj: T, keys: (keyof T)[]) =>
    keys.reduce(
      (result, key) => {
        result[key] = obj[key];
        return result;
      },
      {} as Pick<T, typeof keys[number]>
    ),

  omit: <T extends Record<string, any>>(obj: T, keys: (keyof T)[]) =>
    Object.keys(obj).reduce(
      (result, key) => {
        if (!keys.includes(key as keyof T)) {
          (result as Record<string, any>)[key] = obj[key];
        }
        return result;
      },
      {} as Partial<T>
    ),
};

/**
 * 디바운스 함수
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 쓰로틀 함수
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
