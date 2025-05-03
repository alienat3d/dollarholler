import { getClientById } from '$lib/stores/ClientStore.js';

interface Props {
  params: {
    id: string;
  };
}

export function load({ params }: Props) {
  const id = params?.id;
  const client = getClientById(id);

  return { client };
}
