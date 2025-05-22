import { writable } from 'svelte/store';
import supabase from '$lib/utils/supabase';
import { displayErrorMessage } from '$lib/utils/handleErrors';

// * 100.0 Займёмся заполнением страницы настроек пользователя через Supabase DB. Для этого из доки возьмём соответствующую запись "select id" и чуточку поправим её. Нам нужно выбирать методом "select" всё, т.ч. ставим внутри "*". А также нам нужен метод "single" выбирающий лишь одну запись.
// Go to [src\routes\settings\+page.svelte]
export const settings = writable<Settings>();

export const loadSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*').single();

  if (error) {
    displayErrorMessage(error as Error);
    return;
  }

  settings.set(data);
};
