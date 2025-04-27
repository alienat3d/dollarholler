// 31.0 Создаём хранилище для клиентов по образу, как мы это делали с хранилищем записей (инвойсов)
import { writable } from 'svelte/store';
import data from '../../seed.json';

// 31.1 По умолчанию это будет пустой массив и мы укажем ему тип массива "Clients".
export const clients = writable<Client[]>([]);

// 32.2 Создаём функцию для загрузки всех клиентов.
export const loadClients = () => {
  clients.set(data.clients);
};
