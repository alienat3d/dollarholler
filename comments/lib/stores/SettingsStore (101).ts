import { writable } from 'svelte/store';
import supabase from '$lib/utils/supabase';
import { displayErrorMessage } from '$lib/utils/handleErrors';
import { snackbar } from './SnackbarStore';

export const settings = writable<Settings>();

export const loadSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*').single();

  if (error) {
    displayErrorMessage(error as Error);
    return;
  }

  settings.set(data);
};

// 101.4 Здесь мы создадим функцию для обновления данных профиля пользователя. Скопируем из доки по ключ. словам "UPDATE ROWS" спец. метод "update". Мы будем помещать внутрь функцию весь объект "newSettings" и с помощью "eq" убедимся, что обновляется запись, где в колонке "id" данные совпадают с "id" в переданном объекте "newSettings".
// 101.5 Также, как и раньше мы проверяем на ошибку, и если она есть будем выводить текст ошибки.
// 101.6 Затем нам надо обновить хранилище "settings" методом "update". И раньше мы использовали для обновления определённую часть хранилища, но вообще-то мы можем просто передать обновлённый объект newSettings целиком.
// 101.7 Также, было бы здорово, если бы при сохранении изменений SnackBar нам сообщал об этом.
// Go to [src\routes\settings\+page.svelte]
export const updateSettings = async (newSettings: Settings) => {
  const { error } = await supabase.from('settings').update(newSettings).eq('id', newSettings.id);

  if (error) {
    displayErrorMessage(error as Error);
    return;
  }

  snackbar.send({
    message: 'Settings were successfully updated.',
    type: 'success'
  });

  settings.update(() => newSettings);
};
