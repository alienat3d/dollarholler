// ? This file is a definition of the TypeScript types and by default TypeScript will pick up on this, so we don’t have to export/import types from this file.

// We’ll list all the data, which associated with the Invoice.
// Inside of "lineItems" object we actually don’t need "unitPrice", as we can calculate it out of "quantity" & "amount".
// The same goes for "amount" in "Invoice" object, as we can calculate invoice amount dynamically based on the line items.
// We can identify objects as "interface" or "type". They're similar but with some nuances, most of the time we want to go for "interface" tho.
// For client we can make a separate interface and put it as a value into "client". Same goes for lineItems. But the difference between those two is that we can have only one client (he is unique) and we can have multiple lineItems, so we’ll make it an array with "[]".
// What if some of those shouldn’t be required? Then we up a "?" after it’s name. For example "lineItems" shouldn't be required, same as some others.
// As we just created enum for invoiceStatus here [src\enums.ts], lets assign it to 'invoiceStatus' as well.
interface Invoice {
	client: Client;
	createdAt: string;
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

// Client also can have diff. status, so let’s add it here too and add it to enums.ts too.
interface Client {
	clientStatus: ClientStatus;
	city: string;
	email: string;
	id: string;
	name: string;
	state: string;
	street: string;
	zipCode: string;
}

interface LineItem {
	amount: number;
	description: string;
	id: string;
	quantity: number;
}
