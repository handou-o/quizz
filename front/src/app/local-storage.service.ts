import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  get(key: string, parse?: boolean): any {
    return !parse
      ? window.localStorage.getItem(key)
      : JSON.parse(window.localStorage.getItem(key));
  }

  set(key, data, stringify?: boolean): void {
    window.localStorage.setItem(key, stringify ? JSON.stringify(data) : data);
  }

  del(key): void {
    window.localStorage.removeItem(key);
  }
}
