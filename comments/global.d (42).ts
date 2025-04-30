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

// * 42.0 Создадим хранилище настроек, чтобы заполнять из него нашу личную информацию (для генерации индивидуальных инвойсов, например). Затем мы перенесём эти настройки в отдельный блок "settings" в [src\seed.json].
// Go to [src\lib\stores\SettingsStore.ts]
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
