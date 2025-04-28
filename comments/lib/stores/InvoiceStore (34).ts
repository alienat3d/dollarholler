import { writable } from 'svelte/store';
import data from '../../seed.json';

export const invoices = writable<Invoice[]>([]);

export const loadInvoices = () => {
  invoices.set(data.invoices);
};

// 34.12 Добавим сюда также функцию, которая будет добавлять новые инвойсы в хранилище. С помощью метода "update" мы возьмём старое хранилище "prev" типа массива "Invoice" и с помощью спред-оператора объединим с новыми данными "invoiceToAdd" в один массив.
// Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte]
export const addInvoice = (invoiceToAdd: Invoice) => {
  invoices.update((prev: Invoice[]) => [...prev, invoiceToAdd]);
  return invoiceToAdd;
};

export const deleteInvoice = (invoiceToDelete: Invoice) => {
  invoices.update((prev: Invoice[]) =>
    prev.filter((cur: Invoice) => cur.id !== invoiceToDelete.id)
  );
  return invoiceToDelete;
};
