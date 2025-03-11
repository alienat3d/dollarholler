// Store can be "writable" or "readable", the difference is that the last one doesn't allow to change data in the store from outside.
import { writable } from 'svelte/store';
// And we also import the seed data we just created.
import data from '../../seed.json';

// Let’s add types using generic and say it’s a type of Invoice and it’s an array. And by default it should be an empty array, so inside of "()" we put an empty array.
export const invoices = writable<Invoice[]>([]);

// Then we create and export a function 'loadInvoices' and we’ll use this function to add data to our invoices store.
export const loadInvoices = () => {
	invoices.set(data.invoices);
};
