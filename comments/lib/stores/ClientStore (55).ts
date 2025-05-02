import { writable } from 'svelte/store';
import data from '../../seed.json';

export const clients = writable<Client[]>([]);

export const loadClients = () => clients.set(data.clients);

// Чтобы убрать баг, что новые клиенты создаются со статусом undefined, т.к. мы нигде его не указываем в форме, то поместим "clientToAdd" в объект, добавим спред-оператор и после "," добавим "clientStatus: 'active'", который теперь будет добавляться всем новым пользователям.
export const addClient = (clientToAdd: Client) => {
  clients.update((prev: Client[]) => [...prev, { ...clientToAdd, clientStatus: 'active' }]);
  return clientToAdd;
};

// 55.3 Создаём функцию, которая будет менять данные уже существующего клиента в БД. Для этого нам нужно найти текущего клиента в БД и заменить его новой версией. Мы это сделаем методом "map", где мы назовём каждого итерируемого клиента cur типа Client. Итак, если у клиента в БД совпадает id с тем id клиента, которого получает функция, то возвращаем этого обновлённого клиента, иначе оставляем как было.
// Go to [src\routes\(dashboard)\clients\ClientRow.svelte]
export const updateClient = (clientToUpdate: Client) => {
  clients.update((prev: Client[]) =>
    prev.map((cur: Client) => (cur.id === clientToUpdate.id ? clientToUpdate : cur))
  );
  return clientToUpdate;
};
