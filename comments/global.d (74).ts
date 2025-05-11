// ? 74.0 Теперь нам нужно создать таблицы в БД на Supabase. И нам практически нужно занести туда всё, что у нас уже указано в этом файле, кроме "NotificationType", "SnackBar", т.к. они не требуют сохранения. Более наглядна структура показа на диаграмме на этом скриншоте [comments\DB_diagram.jpg]. Итак у нас будет 5 таблиц в ДБ: Invoice, Client, LineItems, Settings и Auth. Главный смысл так расписывать структуру это, чтобы не повторять данные. Например, мы не указали в таблице "Invoice" имя клиента, а вместо этого оно в таблице "Client" и мы передаём из "Invoice" в "Client" ID клиента. Такой подход также позволяет намного проще поддерживать и не придётся искать и менять данные в разных таблицах БД. Также, если одни и те же данные в разных местах, то вероятность ошибки возрастает.
// 74.1 Но, не смотря на то, что этот файл очень похож по структуре с тем, как будет выглядеть наша БД на Supabase, есть также некоторые отличия: у ID (помечено ключиком в диаграмме) есть спец. фича "Primary Key" - это для того, чтобы идентифицировать каждую запись как уникальную. Ведь, когда мы работали с TS то у нас были лишь числа и строки, а в БД есть несколько доп. опций того, как данные должны храниться.
// Кстати, вот отличная статья о разных типах данных в Supabase: https://dev.to/femolacaster/understanding-data-types-in-supabase-1p93
// 74.2 И на нашей диаграмме уже указаны типы данных для всех записей, согласно тем, которыми располагает Supabase. А также стрелки на ней указывают связь данных от таблицы к таблице. К примеру,"clientId" в таблице "Invoice" ссылается на "id" в таблице "Client". Т.к. поле "id" это уникальный номер клиента, то мы можем использовать его, чтобы связать эти две таблицы вместе.
/* ? 74.3 Всего три типа связи данных между таблицами: one-to-one, one-to-many и many-to-many:
	- one-to-one: означает, что есть только одна запись в одной таблице, которая имеет связь с одной записью в другой таблице (как пример в таблицах "Settings" & "Auth", чтобы связать их между собой мы используем запись "userId" в "Settings" и передаём уникальный id в поле "user_uuid" в табл. "Auth", чтобы синхронизировать их данные);
	- one-to-many: одна запись в одной табл. имеет связь с множеством записей в другой (как пример у нас 1 клиент в табл. "Client", у которого может быть много инвойсов в табл. "Invoice" или в табл. "Invoice" одна запись может иметь множество полей в "LineItems");
	- many-to-many: связь множества полей с множеством полей (в нашем примере этого не потребовалось, но на скриншоте смоделирован случай, где такая взаимосвязь полей разных таблиц может пригодится [comments\DB_diagram_many-to-many_case.jpg]. Представим, что нам нужно создать разные категории наших LineItems и мы создадим новую табл. "LineItemsCategories", чтобы хранить в ней все доступные категории). Эти категории могут быть взаимосвязаны с множеством записей в табл. "LineItems" и наоборот множество записей в "LineItems" могут быть связаны с различными категориями в "LineItemsCategories". И чтобы их связать мы создадим ещё 3-ью таблицу "LineItemsCategories_LineItems" (тут надо сказать, что не всегда такая вспомогательная табл. имеет поле "id", т.к. комбинация полей "lineItemId" и "categoryId" сама по себе уникальна, однако если создавать это в Supabase, то API заставляет нас создавать поле ID, поэтому оно всё же на диаграмме).)
*/
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
