import { writable } from 'svelte/store';
import supabase from '$lib/utils/supabase';
import { displayErrorMessage } from '$lib/utils/handleErrors';
import { snackbar } from './SnackbarStore';
import { deleteClientInvoices } from './InvoiceStore';

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

  return { ...clientToAdd, id };
};

export const updateClient = async (clientToUpdate: Client) => {
  const { invoice, ...newClient } = clientToUpdate;

  const { error } = await supabase.from('client').update(newClient).eq('id', newClient.id);

  if (error) {
    displayErrorMessage(error as Error);
    return;
  }

  clients.update((prev: Client[]) =>
    prev.map((cur: Client) => (cur.id === clientToUpdate.id ? clientToUpdate : cur))
  );

  snackbar.send({
    message: 'The client was successfully updated.',
    type: 'success'
  });

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

// * 88.0 И как обычно, мы начнём с перечисления того, что должна выполнять эта функция: удалить все ассоциированные с клиентом инвойсы, удалить клиента из Supabase DB, обновить хранилище и уведомить пользователя через снекбар комп.
// 88.1.0 Прежде, чем приступать к первому пункту, надо рассмотреть функцию "deleteInvoice" в [src\lib\stores\InvoiceStore.ts].
// Go to [src\lib\stores\InvoiceStore.ts]
// 88.4 Теперь, когда нужная нам функция удаления всех принадлежащих клиенту инвойсов написана, то имплементируем её здесь. Когда проверка на успешное выполнение прошла, то переходим к удалению клиента в БД. Скопируем код для таблицы "client" по ключ. словам "delete rows".
export const deleteClient = async (clientToDelete: Client) => {
  // delete the associated invoices in Supabase
  const isSuccessful = await deleteClientInvoices(clientToDelete.id);

  if (!isSuccessful) return;

  // delete the client within Supabase
  const { error } = await supabase.from('client').delete().eq('id', clientToDelete.id);

  if (error) {
    displayErrorMessage(error as Error);
    return;
  }

  // update the store
  clients.update((prev: Client[]) => prev.filter((cur: Client) => cur.id !== clientToDelete.id));

  // display a success message
  snackbar.send({
    message: 'Your client was successfully deleted.',
    type: 'success'
  });

  return;
};
