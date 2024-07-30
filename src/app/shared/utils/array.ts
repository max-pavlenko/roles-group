import {Unique} from '@/shared/models/common.model';

export function replaceUniqueArrayItem<T extends Unique>(array: T[], item: T) {
  const newArray = [...array];
  newArray[newArray.findIndex(({id}) => id === item.id)] = item;

  return newArray;
}

export function uniquify<T extends Record<string, unknown>>(array: T[]): (T & Unique)[] {
  return array.map((item) => ({...item, id: crypto.randomUUID()}));
}
