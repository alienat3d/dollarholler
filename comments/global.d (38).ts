// 34.9 Мы также забыли добавить discount (он будет опциональным, поэтому с "?") в тип Invoice, поэтому сделаем это.
// Go to [src\routes\(dashboard)\invoices\LineItemRows.svelte]
interface Invoice {
  client: Client;
  createdAt: string;
  discount?: number;
  dueDate: string;
  id: string;
  invoiceNumber: string;
  invoiceStatus: InvoiceStatus;
  issueDate: string;
  lineItems?: LineItem[];
  notes?: string;
  subject?: string;
  terms?: string;
}

interface LineItem {
  amount: number;
  description: string;
  id: string;
  quantity: number;
}

interface Client {
  clientStatus?: ClientStatus;
  city?: string;
  email: string;
  id: string;
  name: string;
  state?: string;
  street?: string;
  zip?: string;
}

type NotificationType = 'info' | 'warning' | 'error' | 'success';

// 38.6 Создадим также здесь интерфейс для нового хранилища Snackbar. Каждое такое сообщение будет состоять из id, message и type (которому мы напишем отдельно тип выше).
// Go to [src\lib\stores\SnackbarStore.ts]
interface Snackbar {
  id: string;
  message: string;
  type: NotificationType;
}
