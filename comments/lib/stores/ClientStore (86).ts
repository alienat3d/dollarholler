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

  // 86.15.1 Вместо того, чтобы просто возвращать "clientToAdd", в котором нет id, завернём это всё в объект и добавим также id.
  // Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte]
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
