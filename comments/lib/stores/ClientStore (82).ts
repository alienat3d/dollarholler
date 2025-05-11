import { writable } from 'svelte/store';
import supabase from '$lib/utils/supabase';

export const clients = writable<Client[]>([]);

// * 82.0 Хотя здесь все изменения очень похожи на те, что мы делали в [src\lib\stores\InvoiceStore.ts] на прошлом уроке, но всё же есть некоторые изменения. Обратим внимание, что здесь мы добавляем "lineItems" внутрь скобок "invoice", т.к. "lineItems" имеет связь с табл. "invoice", но не с табл. "client". ↓
export const loadClients = async () => {
  const { data, error } = await supabase
    .from('client')
    .select('*, invoice(id, invoiceStatus, lineItems(*))');

  if (error) return console.error(error);

  clients.set(data as Client[]);
};

export const addClient = (clientToAdd: Client) => {
  clients.update((prev: Client[]) => [...prev, { ...clientToAdd, clientStatus: 'active' }]);
  return clientToAdd;
};

export const updateClient = (clientToUpdate: Client) => {
  clients.update((prev: Client[]) =>
    prev.map((cur: Client) => (cur.id === clientToUpdate.id ? clientToUpdate : cur))
  );
  return clientToUpdate;
};

// 82.1 Здесь нам в select нужно ещё добавить поля "invoiceNumber" и "dueDate". А также, что может показаться на первый взгляд странным, по тому, как наши данные смоделированы, нам требуется также положить информацию о клиенте также и в объект "invoice".
export const getClientById = async (id: string) => {
  const { data, error } = await supabase
    .from('client')
    .select('*, invoice(id, invoiceStatus, invoiceNumber, dueDate, client(id, name), lineItems(*))')
    .eq('id', id);

  if (error) return console.error(error);

  if (data && data[0]) return data[0] as Client;

  console.warn('Cannot find a client with id: ' + id);
};
