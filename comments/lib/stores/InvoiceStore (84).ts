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

// * 84.0 Итак, здесь мы будем переписывать функцию добавления новых инвойсов, чтобы она работала уже с БД Supabase. И начнём с того, что деструктурируем "invoiceToAdd", чтобы вытащить оттуда сущности, которые нам понадобятся — "lineItems", "client" и данные нового инвойса.
export const addInvoice = async (invoiceToAdd: Invoice) => {
  const { lineItems, client, ...newInvoice } = invoiceToAdd;

  // 84.1 Здесь, помимо данных нового инвойса, нам нужно также вставить "clientId".
  // 84.2.0 Если мы посмотрим на "{ data, error }" - это деструктуризация сущностей результата, который возвращается от посыла запроса к Supabase. И когда у нас множество обращений к БД, то эти общие названия могут начать конфликтовать друг с другом. Но мы также можем взять весь этот объект и переименовать в "invoiceResults"...
  // add the invoice to Supabase
  // const { data, error } = await supabase
  const invoiceResults = await supabase
    .from('invoice')
    .insert([{ ...newInvoice, clientId: client.id }])
    .select();

  // 84.2.1 И теперь, когда мы проверяем на ошибки, то мы укажем "invoiceResults.error" вместо "error", как раньше в примере в [src\lib\stores\ClientStore.ts].
  // 84.3.0 Однако, этот кусок кода очень напоминает такой же в [src\lib\stores\ClientStore.ts], а значит можно вынести его в отдельную функцию [src\lib\utils\handleErrors.ts], чтобы не повторяться.
  // Go to [src\lib\utils\handleErrors.ts]
  // 84.4 Теперь мы можем и здесь и в [src\lib\stores\ClientStore.ts] передавать вызов функции  "displayErrorMessage()"
  if (invoiceResults.error) {
    displayErrorMessage(invoiceResults.error as Error);
    return;
  }

  // 84.5 Здесь мы присвоим id свежесозданного инвойса в переменную "invoiceId", т.к. она находится в первом элементе массива "data".
  // get the invoice ID
  const invoiceId = invoiceResults.data[0].id;

  // 84.6 Здесь мы будем, используя метод "map" пробегать по всему массиву записей и добавлять их ID, но сперва нам нужна проверка существуют ли они и их больше 1-го, т.к. если их нет или 1, то мы остановим скрипт. Затем мы пробежимся этим циклом по всем "lineItems" и в каждой итерации будем возвращать lineItem с добавленным к нему id инвойса.
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
      return;
    }
  }

  // 84.7 При добавлении инвойса нам нужно также добавить и поле "id", у которого значением будет "invoiceId".
  // Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte]
  // update the store
  invoices.update((prev: Invoice[]) => [...prev, { ...invoiceToAdd, id: invoiceId }]);

  // 84.8.1 Теперь оно будет находиться здесь.
  snackbar.send({
    message: 'Your invoice was successfully created.',
    type: 'success'
  });

  return invoiceToAdd;
  /* invoices.update((prev: Invoice[]) => [...prev, invoiceToAdd]);
  return invoiceToAdd; */
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

  if (error) return console.error(error);

  if (data && data[0]) return data[0] as Invoice;

  console.warn('Cannot find an invoice with id: ' + id);
};
