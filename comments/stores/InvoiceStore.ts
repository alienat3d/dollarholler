// Store can be "writable" or "readable", the difference is that the last one doesn't allow to change data in the store from outside.
import { writable } from 'svelte/store';
// And we also import the seed data we just created.
import data from '../../seed.json';

// Let’s add types using generic and say it’s a type of Invoice and it’s an array. And by default it should be an empty array, so inside of "()" we put an empty array.
export const invoices = writable<Invoice[]>([]);

// Then we create and export a function 'loadInvoices' and we’ll use this function to add data to our invoices store.
export const loadInvoices = () => {
	invoices.set(data.invoices);
	// invoices.set([]);
};

// Function deletes an invoice. In the update function it takes a previous store by default and it will be an array. In order to remove an invoice from an array we can use an array method «filter» to filter out the invoice we’re trying to delete by referencing its id.
export const deleteInvoice = (invoiceToDelete: Invoice) => {
	invoices.update((prev: Invoice[]) =>
		prev.filter((cur: Invoice) => cur.id !== invoiceToDelete.id)
	);
	// We also want to return the invoice we deleted, so that we can see what it is and use it at success message to inform user about what invoice he just deleted.
	return invoiceToDelete;
};
