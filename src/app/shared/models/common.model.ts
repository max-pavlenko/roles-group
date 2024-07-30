export interface Named<T = string> {
  name: T;
}

export interface Unique<T = PropertyKey> {
  id: T;
}

export function isUnique(obj: unknown): obj is Unique {
  return obj !== null && typeof obj === 'object' && 'id' in obj;
}
export function isUniqueArray(obj: unknown): obj is Unique[] {
  return Array.isArray(obj) && obj.every(isUnique);
}

export interface UniqueEntity<T = string> extends Unique, Named<T> {}

export enum OffsetSize {
  Three = 3,
  Five = 5,
  All = 10000
}

export interface SearchablePagination {
  searchQuery: string;
  offset: OffsetSize;
  page: number;
}

