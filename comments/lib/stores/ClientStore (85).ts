import { writable } from 'svelte/store';
import supabase from '$lib/utils/supabase';
import { displayErrorMessage } from '$lib/utils/handleErrors';
import { snackbar } from './SnackbarStore';

export const clients = writable<Client[]>([]);

export const loadClients = async () => {
  const { data, error } = await supabase
    .from('client')
    .select('*, invoice(id, invoiceStatus, lineItems(*))');

  if (error) return console.error(error);

  clients.set(data as Client[]);
};

export const addClient = async (clientToAdd: Client) => {
  const { data, error } = await supabase
    .from('client')
    .insert([{ ...clientToAdd, clientStatus: 'active' }])
    .select();

  if (error) {
    displayErrorMessage(error as Error);
    return;
  }

  const id = data[0].id;

  clients.update((prev: Client[]) => [...prev, { ...clientToAdd, clientStatus: 'active', id }]);

  snackbar.send({
    message: 'A new client was successfully created.',
    type: 'success'
  });

  return clientToAdd;
};

// * 85.0.0 В этом уроке мы перепишем код, отвечающий за редактирование клиентов, чтобы изменения влияли непосредственно на БД в Supabase. Т.к. "clientToUpdate" содержит в себе также информацию об инвойсах, т.ч. нам нужно разделить эту информацию и информацию о клиенте деструктуризацией.
// 85.0.1 Далее в метод "update" помести "newClient", это те данные, которые мы редактируем, а в метод "eq": id, который будет браться из "newClient.id".
// 85.0.2 Ну, а метод "update" у "clients" может остаться неизменным.
export const updateClient = async (clientToUpdate: Client) => {
  const { invoice, ...newClient } = clientToUpdate;

  const { data, error } = await supabase.from('client').update(newClient).eq('id', newClient.id);

  if (error) {
    displayErrorMessage(error);
    return;
  }

  clients.update((prev: Client[]) =>
    prev.map((cur: Client) => (cur.id === clientToUpdate.id ? clientToUpdate : cur))
  );
  return clientToUpdate;
};

export const getClientById = async (id: string) => {
  const { data, error } = await supabase
    .from('client')
    .select('*, invoice(id, invoiceStatus, invoiceNumber, dueDate, client(id, name), lineItems(*))')
    .eq('id', id);

  if (error) return console.error(error);

  if (data && data[0]) return data[0] as Client;

  console.warn('Cannot find a client with id: ' + id);
};
