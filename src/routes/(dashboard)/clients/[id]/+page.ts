import { getClientById } from '$lib/stores/ClientStore.js';

interface Props {
  params: {
    id: string;
  };
}

export async function load({ params }: Props) {
  const id = params?.id;
  const client = await getClientById(id);

  return { client };
}
