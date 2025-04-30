// 39.1 Код в этом файле позволяет нам загружать данные до того, как страница отрендерится. Т.е. в этом случае загрузится вся информация об индивидуальном отчёте инвойсов и затем передастся в [src\routes\(dashboard)\invoices\[id]\+page.svelte]. (page.js, если мы используем JavaScript вместо TypeScript)
// Go to [src\routes\(dashboard)\invoices\[id]\+layout@.svelte]
// 39.6.0 Итак приступим к заполнению этого файла, который должен проверить URL, забрать соответствующие данные из хранилища и отправить их в [src\routes\(dashboard)\invoices\[id]\+page.svelte].
// 39.6.1 Для начала, следуя документации, нам нужно создать функцию "load", которая будет загружать нужные данные. По умолчанию функция load получает данные, но мы можем деструктурировать их в объект params. Далее помещаем id из params в переменную id, если будет найдено там, а также в invoice поместим данные, которые будут получены по id функцией "getInvoiceById", которую мы сейчас создадим в хранилище.
import { getInvoiceById } from '$lib/stores/InvoiceStore';

// 39.8 Но нам также нужно создать interface для params, т.к. TS ругается на то, что он не может определить тип params.
interface Props {
  params: {
    id: string;
  };
}

// Go to [src\lib\stores\InvoiceStore.ts]
export function load({ params }: Props) {
  const id = params?.id;
  const invoice = getInvoiceById(id);
  console.log(invoice); /* чтобы проверить работает ли наш функционал */

  return invoice;
}
