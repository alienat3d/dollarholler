import { writable } from 'svelte/store';
import data from '../../seed.json';

// 42.1 Инициализируем новое хранилище настроек.
export const settings = writable<Settings>();

// 42.2 Нам также понадобится функция выгрузки данных из хранилища, где мы при помощи метода "set" извлекаем данные из seed.json объекта "settings" в хранилище.
// Go to [src\routes\(dashboard)\invoices\[id]\+page.svelte]
export const loadSettings = () => {
  settings.set(data.settings);
};
