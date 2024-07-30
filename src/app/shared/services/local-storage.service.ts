import {Injectable} from '@angular/core';
import {LocalStorageKey} from '@/shared/models/local-storage.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(key: LocalStorageKey, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: LocalStorageKey) {
    try {
      const item = localStorage.getItem(key);
      return item ? <T>JSON.parse(item) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  removeItem(key: LocalStorageKey) {
    localStorage.removeItem(key);
  }
}
