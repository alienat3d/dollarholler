// In this file we can set the values (also string-values) to the types, which are expected at one place or another. Let’s make this for the Invoice Status, so the tags only allowed to have values we write in otherwise it will throw an error.
export enum InvoiceStatus {
	draft = 'draft',
	sent = 'sent',
	paid = 'paid'
}

export enum ClientStatus {
	active = 'active',
	archived = 'archived'
}
