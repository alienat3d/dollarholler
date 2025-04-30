import { writable } from 'svelte/store';
import data from '../../seed.json';

export const invoices = writable<Invoice[]>([]);

export const loadInvoices = () => {
  invoices.set(data.invoices);
};

export const addInvoice = (invoiceToAdd: Invoice) => {
  invoices.update((prev: Invoice[]) => [...prev, invoiceToAdd]);
  return invoiceToAdd;
};

export const updateInvoice = (invoiceToUpdate: Invoice) => {
  invoices.update((prev: Invoice[]) =>
    prev.map((cur: Invoice) => (cur.id === invoiceToUpdate.id ? invoiceToUpdate : cur))
  );
  return invoiceToUpdate;
};

export const deleteInvoice = (invoiceToDelete: Invoice) => {
  invoices.update((prev: Invoice[]) =>
    prev.filter((cur: Invoice) => cur.id !== invoiceToDelete.id)
  );
  return invoiceToDelete;
};

// 39.7 Создадим эту функцию, которая будет передавать в [src\routes\(dashboard)\invoices\[id]\+page.ts] необходимые данные для страницы индивидуального инвойса. Она будет принимать id, которая строковый тип данных. Нам нужно пробежаться по всем данным инвойсов "data" и с помощью метода find найти нужный по id и забрать только его данные.
// Go to [src\routes\(dashboard)\invoices\[id]\+page.ts]
export const getInvoiceById = (id: string) => {
  return data.invoices.find((invoice) => invoice.id === id);
};
