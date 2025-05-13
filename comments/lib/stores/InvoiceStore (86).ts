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

// 86.5 Далее займёмся добавлением новых lineItems и код для этого у нас уже есть в функции "addInvoice", т.ч. мы просто скопируем его оттуда. А ещё лучше создадим отдельную функцию под это, чтобы избежать дублирование кода.
// 86.6 И, также, как и с функцией "deleteLineItems" ниже, добавим переменную isSuccessful, которая будет сигналом для других функций, что "addLineItems" отработала без ошибок. ↓
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

// 86.1 Начнём сразу со второго удаления записей lineItems, и для этого создадим отдельную функцию снаружи "updateInvoice", в которую мы будем помещать "invoiceId". Из документации API Docs для lineItems скопируем метод для удаления записей из таблицы. И в завершающем цепочку методе "eq" мы указываем, что будем удалять ту строку, у которой в колонке "invoiceId" найдено значение, переданное в функцию "deleteLineItems" — invoiceId.
// 86.2 Теперь, что касается случаев с ошибками: т.к. функция "deleteLineItems" у нас внешняя, то надо как-то дать другим функциям, например "updateInvoice" понять, что "deleteLineItems" столкнулась с ошибкой. Для этого создадим переменную "isSuccessful" и поставим её в значение "true" по умолчанию, ну а если появилась ошибка, то будет меняться на false. А также мы вернём значение этой переменной, чтобы другие функции знали, что в "deleteLineItems" не было ошибок и можно дальше работать.
// 86.3 Ну, и для TS допишем также, что эта функция промис, т.к. она асинхронна и когда закончит выполнение, то вернёт булево значение. ↓
const deleteLineItems = async (invoiceId: string): Promise<boolean> => {
  let isSuccessful = true;

  const { error } = await supabase.from('lineItems').delete().eq('invoiceId', invoiceId);

  if (error) {
    displayErrorMessage(error as Error);
    isSuccessful = false;
  }

  return isSuccessful;
};

// * 86.0 Здесь мы будем редактировать инвойсы, чтобы они также изменялись не только в UI, но и в БД. Для начала разметим, что нам нужно сделать: редактировать клиента, удалить все записи lineItems (т.к. это самый простой путь, вместо того, чтобы пытаться выяснять какие записи были изменены, созданы или удалены), добавить новые записи lineItems, обновить invoice в Supabase и обновить также хранилище. ↑
// 86.4 Пришло время использовать новую функцию здесь. Создадим и тут переменную isSuccessful, чтобы передавать в неё булево значение и исходя из этого значения действовать дальше, а передавать внутрь мы будем id из "invoiceToUpdate". И если isSuccessful вернёт false, то мы прекращаем выполнение всей функции. ↑
// 86.7 Теперь для "addLineItems" нам требуется аргумент "lineItems", который является частью "invoiceToUpdate", т.ч. нам нужно его деструктурировать, чтобы отделить "invoiceToUpdate" от "client" и остальной части изменённого инвойса.
// 86.8 Далее к обновлению инвойса в Supabase, скопируем из доки код для "Update rows" и в его метод "update" помести "...updatedInvoice" вместе с добавлением clientId. Затем в "eq" мы уточняем какую именно строчку мы хотим отредактировать, а именно в колонке "id" должно быть значение совпадающее с тем, что передано в updatedInvoice.id.
// 86.9 Обновление хранилища берём из коммента старого кода, он остаётся неизменным.
// 86.10 А в конце функции уведомляем пользователя комп. SnackBar, что инвойс успешно отредактирован.
// 86.11.0 Всё работает, инвойсы редактируются, однако замечен баг, что сообщения комп. SnackBar почему-то дублируются, давайте разберёмся с этим.
// Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte]
// 86.14 Ну и в принципе мы приходим к тому, что обновление клиента здесь избыточно, т.к. оно уже выполняется в [src\routes\(dashboard)\invoices\InvoiceForm.svelte].
// Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte]
export const updateInvoice = async (invoiceToUpdate: Invoice) => {
  /* invoices.update((prev: Invoice[]) =>
    prev.map((cur: Invoice) => (cur.id === invoiceToUpdate.id ? invoiceToUpdate : cur))
  );
  return invoiceToUpdate; */

  const { lineItems, client, ...updatedInvoice } = invoiceToUpdate;

  // TODO: update the client
  // delete all the line items
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
