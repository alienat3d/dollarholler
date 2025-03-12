// Function for adding up different numbers and return it’s sum.
export const sumLineItems = (lineItems: LineItems[] | undefined): number => {
	if (!lineItems) return 0;

	return lineItems.reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0);
};

// Function that format result converting cents to dollars.
export const centsToDollars = (cents: number): string => {
	const dollars = cents / 100;
	const addDecimals = twoDecimals(dollars);
	return addThousandsSeparator(addDecimals);
};

// Function that ensures that result has two decimal places.
export const twoDecimals = (myNum: number): string => {
	return myNum.toFixed(2);
};

// Function that adds a comma after thousands (is looking for third digit to put a comma after it).
export const addThousandsSeparator = (myNum: string): string => {
	return myNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
