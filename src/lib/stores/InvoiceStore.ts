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

// 35.8 Создаём функцию для изменения данный инвойса, которая возьмёт массив инвойса и с помощью метода map пройдётся по всему его содержимому и каждое отдельное содержимое назовём "cur" с типом Invoice. И если cur.id равен invoiceToUpdate.id (которое мы редактируем) то возвращаем invoiceToUpdate иначе cur.
// Go to [src\routes\(dashboard)\invoices\ConfirmDelete.svelte]
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
