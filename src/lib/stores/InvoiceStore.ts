import { writable } from 'svelte/store';
import supabase from '$lib/utils/supabase';

export const invoices = writable<Invoice[]>([]);

export const loadInvoices = async () => {
  const { data, error } = await supabase
    .from('invoice')
    .select('*, client(id, name), lineItems(*)');

  if (error) return console.error(error);

  invoices.set(data as Invoice[]);
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

export const getInvoiceById = async (id: string) => {
  const { data, error } = await supabase
    .from('invoice')
    .select('*, client(id, name), lineItems(*)')
    .eq('id', id);

  if (error) console.error(error);

  if (data && data[0]) return data[0] as Invoice;

  console.warn('Cannot find invoice with id: ' + id);
};
