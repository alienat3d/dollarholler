import { getInvoiceById } from '$lib/stores/InvoiceStore';

interface Props {
  params: {
    id: string;
  };
}

// 81.4 Также обязательно нужно и эту функцию перевести в асинхронную, раз мы это сделали в [src\lib\stores\InvoiceStore.ts]
export async function load({ params }: Props) {
  const id = params?.id;
  const invoice = await getInvoiceById(id);

  return { invoice };
}
