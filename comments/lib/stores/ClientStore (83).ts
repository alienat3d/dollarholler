import { writable } from 'svelte/store';
import supabase from '$lib/utils/supabase';
import { snackbar } from './SnackbarStore';

export const clients = writable<Client[]>([]);

export const loadClients = async () => {
  const { data, error } = await supabase
    .from('client')
    .select('*, invoice(id, invoiceStatus, lineItems(*))');

  if (error) return console.error(error);

  clients.set(data as Client[]);
};

// * 83.0 Функция добавления клиента должна быть изменена в соответствии с документацией Supabase, чтобы иметь возможность добавлять новых пользователей в БД через интерфейс.
// 83.1 Нужно оговориться, что при создании нового пользователя мы можем ввести все поля таблицы client кроме одного "clientStatus" и эту проблему можно решить двумя способами: 1) задать в самой таблице на сайте Supabase этому полю значение по умолчанию, либо: 2) сделать это прямо здесь в коде, что мы и сделаем. В метод "insert" мы помести массив с объектом внутри, где развернём объект clientToAdd с помощью спред-оператора, а затем через запятую добавим clientStatus с указанным значением. Но нам также нужно получить уникальный id пользователя, который создаст Supabase при создании, для этого мы добавим цепочкой метод "select".
// 83.2 А также не забываем делать проверку, что если выскочила ошибка, то мы выводим её в консоль. Однако, было бы хорошо также уведомить и пользователя об ошибке и здесь мы снова обратимся к комп. SnackBar, точнее его методу "send" и передадим туда сообщение об ошибке.
// 83.3 Итак, а если ошибок никаких не было, то мы передадим в константу id клиента, который только что был создан, т.е. первый элемент в массиве "data", а точнее значение по ключу "id".
// 83.4 Далее мы обновим предыдущий массив хранилища с помощью метода "update", который возьмёт предыдущее состояние хранилища, разложит спред-оператором и добавит объект с новым клиентом, где мы ещё добавим полученный "id: id" (или скор. "id")
export const addClient = async (clientToAdd: Client) => {
  const { data, error } = await supabase
    .from('client')
    .insert([{ ...clientToAdd, clientStatus: 'active' }])
    .select();

  if (error) {
    console.error(error);
    snackbar.send({
      message: error.message,
      type: 'error'
    });
    return;
  }

  const id = data[0].id;

  clients.update((prev: Client[]) => [...prev, { ...clientToAdd, clientStatus: 'active', id }]);
  return clientToAdd;
};

export const updateClient = (clientToUpdate: Client) => {
  clients.update((prev: Client[]) =>
    prev.map((cur: Client) => (cur.id === clientToUpdate.id ? clientToUpdate : cur))
  );
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
