/**
 * Takes all the line items and adds them up
 * @param {Array | undefined} lineItems
 * @return {number}
 */
export const sumLineItems = (lineItems: LineItems[] | undefined): number => {
	if (!lineItems) return 0;

	return lineItems.reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0);
};

/**
 * Takes and returns a dollar amount (USD), formatted with commas and 2 decimal places
 * @param {number} cents
 * @return {string}
 */
export const centsToDollars = (cents: number): string => {
	const dollars = cents / 100;
	const addDecimals = twoDecimals(dollars);
	return addThousandsSeparator(addDecimals);
};

/**
 * Takes a number and returns the number with 2 decimal places
 * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
 * @param {number} myNum
 * @return {string}
 */
export const twoDecimals = (myNum: number): string => myNum.toFixed(2);

/**
 * Adds thousands separator
 * @summary RegExp is looking for third digit to put a comma after it
 * @param {string} myNum
 * @return {string}
 */
export const addThousandsSeparator = (myNum: string): string =>
	myNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * Takes all the invoices and finds the total
 * @param {Invoice} invoices
 * @return {number}
 */
export const sumInvoices = (invoices: Invoice[] | undefined): number => {
	if (!invoices) return 0;

	return invoices.reduce((previousValue, currentValue) => {
		const invoiceSum = sumLineItems(currentValue.lineItems);

		return previousValue + invoiceSum;
	}, 0);
};
