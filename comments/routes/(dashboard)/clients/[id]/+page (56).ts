import { getClientById } from '$lib/stores/ClientStore.js';

// 56.3 Создадим для params interface, чтобы TS понимал с каким типом он имеет дело и не вызывал ошибок.
// Go to [src\routes\(dashboard)\clients\[id]\+page.svelte]
interface Props {
  params: {
    id: string;
  };
}

// 56.2 Теперь к этому файлу, который будет загружать данные для [src\routes\(dashboard)\clients\[id]\+page.svelte] перед рендером вёрстки. Здесь понадобится функция загрузки данных "load". В ней мы деструктурируем params, которые будем использовать. Мы получим id из params в константу. А в константу client мы уже сохраняем клиента, которого ищем по этому id. Затем нужно передать эти данные в [src\routes\(dashboard)\clients\[id]\+page.svelte] и для этого возвращаем объект client.
export function load({ params }: Props) {
  const id = params?.id;
  const client = getClientById(id);

  return { client };
}
