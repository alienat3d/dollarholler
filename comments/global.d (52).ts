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

// * 52.0 В этом уроке мы будем делать графы "Received" & "Balance" динамически заполняемыми и начнём с того, что обновим файлы [src\seed.json], а также внесём и сюда кое-какие изменения, а точнее добавим в тип Client тип массива Invoice, который будет опциональным.
// Go to [src\routes\(dashboard)\clients\ClientRow.svelte]
interface Client {
  clientStatus?: ClientStatus;
  city?: string;
  email: string;
  id: string;
  name: string;
  state?: string;
  street?: string;
  zip?: string;
  invoices?: Invoice[];
}

interface Settings {
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

type NotificationType = 'info' | 'warning' | 'error' | 'success';

interface Snackbar {
  id: string;
  message: string;
  type: NotificationType;
}
