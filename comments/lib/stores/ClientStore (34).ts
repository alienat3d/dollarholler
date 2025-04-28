import { writable } from 'svelte/store';
import data from '../../seed.json';

export const clients = writable<Client[]>([]);

export const loadClients = () => {
  clients.set(data.clients);
};

// 34.14 Также и здесь нужно создать подобную addInvoice функцию для добавления новых клиентов.
// Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte]
export const addClient = (clientToAdd: Client) => {
  clients.update((prev: Client[]) => [...prev, clientToAdd]);
  return clientToAdd;
};
