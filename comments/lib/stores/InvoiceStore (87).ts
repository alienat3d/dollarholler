import { writable } from 'svelte/store';
import supabase from '$lib/utils/supabase';
import { displayErrorMessage } from '$lib/utils/handleErrors';
import { snackbar } from './SnackbarStore';

export const invoices = writable<Invoice[]>([]);

export const loadInvoices = async () => {
  const { data, error } = await supabase
    .from('invoice')
    .select('*, client(id, name), lineItems(*)');

  if (error) return console.error(error);

  invoices.set(data as Invoice[]);
};

export const addInvoice = async (invoiceToAdd: Invoice) => {
  const { lineItems, client, ...newInvoice } = invoiceToAdd;

  // add the invoice to Supabase
  const invoiceResults = await supabase
    .from('invoice')
    .insert([{ ...newInvoice, clientId: client.id }])
    .select();

  if (invoiceResults.error) {
    displayErrorMessage(invoiceResults.error as Error);
    return;
  }

  // get the invoice ID
  const invoiceId = invoiceResults.data[0].id;

  const isSuccessful = await addLineItems(lineItems, invoiceId);

  if (!isSuccessful) return;

  // update the store
  invoices.update((prev: Invoice[]) => [...prev, { ...invoiceToAdd, id: invoiceId }]);

  snackbar.send({
    message: 'Your invoice was successfully created.',
    type: 'success'
  });

  return invoiceToAdd;
};

const addLineItems = async (
  lineItems: LineItem[] | undefined,
  invoiceId: string
): Promise<boolean> => {
  let isSuccessful = true;

  // loop over all the line items and add the invoice ID
  if (lineItems && lineItems.length > 0) {
    const newLineItems = lineItems.map((lineItem: LineItem) => ({
      ...lineItem,
      invoiceId: invoiceId
    }));

    // add the line items to Supabase
    const lineItemsResults = await supabase.from('lineItems').insert(newLineItems);

    if (lineItemsResults.error) {
      displayErrorMessage(lineItemsResults.error as Error);
      isSuccessful = false;
    }
  }

  return isSuccessful;
};

const deleteLineItems = async (invoiceId: string): Promise<boolean> => {
  let isSuccessful = true;

  const { error } = await supabase.from('lineItems').delete().eq('invoiceId', invoiceId);

  if (error) {
    displayErrorMessage(error as Error);
    isSuccessful = false;
  }

  return isSuccessful;
};

export const updateInvoice = async (invoiceToUpdate: Invoice) => {
  const { lineItems, client, ...updatedInvoice } = invoiceToUpdate;

  let isSuccessful = await deleteLineItems(invoiceToUpdate.id);

  if (!isSuccessful) return;

  // add new line items
  isSuccessful = await addLineItems(lineItems, invoiceToUpdate.id);

  if (!isSuccessful) return;

  // update the invoice within Supabase
  const { error } = await supabase
    .from('invoice')
    .update({ ...updatedInvoice, clientId: client.id })
    .eq('id', updatedInvoice.id)
    .select();

  if (error) {
    displayErrorMessage(error as Error);
    return;
  }

  // update the store
  invoices.update((prev: Invoice[]) =>
    prev.map((cur: Invoice) => (cur.id === invoiceToUpdate.id ? invoiceToUpdate : cur))
  );

  // display a success message
  snackbar.send({
    message: 'Your invoice was successfully updated.',
    type: 'success'
  });

  return invoiceToUpdate;
};

// * 87.0 Здесь мы будем переписывать функцию удаления инвойса, чтобы он также удалялся и из БД. И начнём, как и в прошлые разы, с написания псевдокода, указывая пункты, которые требуется сделать: удалить все lineItems (Если мы этого не сделаем, то получим ошибку, когда захотим удалить какой-то инвойс, которая сообщит, что есть зависимости на этом инвойсе и он не может быть удалён. Происходит это потому, что «под капотом» у Supabase Postgres, который в свою очередь имеет т.н. "delete cascade", эта фича позволяет удалить, например, инвойс и всё что связанно с ним []), удалить инвойс и обновить хранилище.
// 87.1 И, чтобы реализовать первый пункт, используем уже созданную в прошлых занятия для "editInvoice" функцию "deleteLineItems". А передавать аргументом мы будем id из "invoiceToDelete". Нам также нужно, чтобы эта функция ожидала выполнения, т.ч. добавим ей "await". Она будет возвращать булево значение, которые мы помести в "isSuccessful", чтобы ниже сделать проверку, если isSuccessful содержит false, то мы выходим из выполнения функции "deleteInvoice".
// 87.2 Далее мы найдём в доке Supabase "Delete rows" и скопируем оттуда код. В "eq" мы уточним, что мы ищем в колонке "id" значение, которое соответствует значению "invoiceToDelete.id".
// 87.3 Также сделаем, уже привычную, проверку на ошибки и если ошибка есть, то вызовем функцию, запускающую SnackBar, который покажет текст ошибки, а затем сразу прекратить выполнение этой функции с помощью "return".
// 87.4 Ну, и наконец, обновляем хранилище тем же кодом, что был здесь изначально.
// 87.5 Также, нам нужно оповестить пользователей об успешном удалении инвойса.
// Go to [src\routes\(dashboard)\invoices\InvoiceRow.svelte]
export const deleteInvoice = async (invoiceToDelete: Invoice) => {
  /* invoices.update((prev: Invoice[]) =>
    prev.filter((cur: Invoice) => cur.id !== invoiceToDelete.id)
  );
  return invoiceToDelete; */

  // delete all the line items
  const isSuccessful = await deleteLineItems(invoiceToDelete.id);

  if (!isSuccessful) return;

  // delete the invoice
  const { error } = await supabase.from('invoice').delete().eq('id', invoiceToDelete.id);

  if (error) {
    displayErrorMessage(error as Error);
    return;
  }

  // update store
  invoices.update((prev: Invoice[]) =>
    prev.filter((cur: Invoice) => cur.id !== invoiceToDelete.id)
  );

  // display a success message
  snackbar.send({
    message: 'Your invoice was successfully deleted.',
    type: 'success'
  });

  return invoiceToDelete;
};

export const getInvoiceById = async (id: string) => {
  const { data, error } = await supabase
    .from('invoice')
    .select('*, client(id, name), lineItems(*)')
    .eq('id', id);

  if (error) return console.error(error);

  if (data && data[0]) return data[0] as Invoice;

  console.warn('Cannot find an invoice with id: ' + id);
};
