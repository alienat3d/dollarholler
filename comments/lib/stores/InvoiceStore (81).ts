import { writable } from 'svelte/store';
import supabase from '$lib/utils/supabase';
// * 81.0 Итак, изначально мы загружали данные из файла JSON, который был псевдо-БД, но теперь, когда у нас есть реальная, настроенная на Supabase, БД, то мы можем загружать данные прямо из неё. Этим мы тут и займёмся.
// 81.1 Файл JSON нам больше не нужен и его можно удалить.
// import data from '../../seed.json';

export const invoices = writable<Invoice[]>([]);

// 81.2.0 В функции "loadInvoices" мы будем получать данные из БД Supabase. И в API Docs, на сайте Supabase имеется отличная памятка какие методы и их аргументы нам нужно использовать для получения каких либо данных из БД. Но сперва нам нужно сделать эту функцию асинхронной с помощью "async...await", т.к. мы работаем уже с сервером, а не просто JSON файлом, как раньше.
export const loadInvoices = async () => {
  // invoices.set(data.invoices);

  // 81.2.1 Мы найдём там код для получения всех строк из таблицы "invoice" и поместим его сюда. Однако, хотя мы получаем данные из табл. "invoice", но мы всё равно получаем ошибку, что поле "name" не найдено, а причина тому, что оно находится в табл. client, но т.к. они уже перелинкованы, то мы может получить также и значение поля "name" из табл. "client", просто добавим через запятую в метод "select" обращение также к табл. "client" и укажем в аргументах какие поля нам требуются. И раз уж мы здесь, то добавим также данные из lineItems, которые нам потребуются
  const { data, error } = await supabase
    .from('invoice')
    .select('*, client(id, name), lineItems(*)');

  // console.log(data);

  // 81.2.2 Мы также используем условие с деструктурированным объектом "error", чтобы вывести ошибки, если они появятся.
  if (error) return console.error(error);

  // 81.2.3 Ну, а в случае успеха мы будем записывать в "invoices" данные, которые получим из Supabase DB.
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

// 81.3.0 Также нам нужно поправить код здесь, чтобы показывать страницу индивидуального инвойса, для этого нам нужно передавать из БД id определённого инвойса в качестве аргумента.
export const getInvoiceById = async (id: string) => {
  // 81.3.1 Это нам больше не нужно:
  // return data.invoices.find((invoice) => invoice.id === id);

  // 81.3.2 В принципе, мы можем скопировать код из "loadInvoices", но здесь нам уже понадобится только "id" поля, поэтому мы уточним, с помощью метода "eq", что нам нужна колонка "id" (первый аргумент) и её значение (второй аргумент).
  const { data, error } = await supabase
    .from('invoice')
    .select('*, client(id, name), lineItems(*)')
    .eq('id', id);

  // 81.3.3.0 Также добавим пару проверок: во-первых, что мы возвращаем ошибку в консоль, если она возникнет...
  if (error) console.error(error);

  // 81.3.3.1 ... а во-вторых, если данные получены и в них есть хотя бы одна позиция, то мы вернём эту позицию.
  // Go to [src\routes\(dashboard)\invoices\[id]\+page.ts]
  if (data && data[0]) return data[0] as Invoice;

  console.warn('Cannot find invoice with id: ' + id);
};
