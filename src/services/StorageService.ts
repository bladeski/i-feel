import { EmotionEntryType } from "../types";

export class StorageService {
  static get(key: string) {
    if (this.isChromeExtension) {
      return this.getFromChromeStorage(key);
    } else {
      return this.getFromLocalStorage(key);
    }
  }

  static getEmotionHistory() {
    if (this.isChromeExtension) {
      return this.getEmotionHistoryFromChromeStorage();
    } else {
      return this.getEmotionHistoryFromLocalStorage();
    }
  }

  private static getEmotionHistoryFromChromeStorage(): Promise<{ [key: string]: EmotionEntryType }> {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (result) => {
        resolve(result);
      });
    });
  }

  private static getEmotionHistoryFromLocalStorage(): Promise<{ [key: string]: EmotionEntryType }> {
    return new Promise((resolve) => {
      const allItems: { [key: string]: EmotionEntryType } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('emotion-')) {
          const id = key.split('emotion-')[1];
          allItems[id] = JSON.parse(localStorage.getItem(key) || '{}') as EmotionEntryType;
        }
      }
      resolve(allItems);
    });
  }

  private static getFromChromeStorage(key: string): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key]);
      });
    });
  }

  private static getFromLocalStorage(key: string): Promise<any> {
    return new Promise((resolve) => {
      resolve(JSON.parse(localStorage.getItem(key) || '{}'));
    });
  }

  private static get isChromeExtension() {
    return chrome?.storage;
  }

  static save(key: string, value: EmotionEntryType | string | number) {
    if (this.isChromeExtension) {
      return this.saveToChromeStorage(key, value);
    } else {
      return this.saveToLocalStorage(key, value);
    }
  }

  static saveEmotion(emotion: EmotionEntryType) {
    return this.save(`emotion-${Date.now()}`, emotion);
  }

  private static saveToChromeStorage(key: string, value: EmotionEntryType | string | number): Promise<void> {
    return chrome.storage.local.set({ [key]: value });
  }

  private static saveToLocalStorage(key: string, value: EmotionEntryType | string | number): Promise<void> {
    return new Promise((resolve) => {
      resolve(localStorage.setItem(key, JSON.stringify(value)));
    });
  }
}