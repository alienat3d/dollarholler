/**
 * Takes all the line items and adds them up
 * @param {Array|undefined} lineItems
 * @returns {number}
 */
export const sumLineItems = (lineItems: LineItem[] | undefined): number => {
  if (!lineItems) return 0;
  return lineItems.reduce((prevValue, curValue) => prevValue + curValue.amount, 0);
};

// 36.5 Также мы обнаружили баг, что общая сумма считает немного неправильно не учитывая дисконт, мы исправим это новой функцией, которая будет принимать сумму всех полей функцией sumLineItems и потом, если у нас есть discount, то будем из суммы вычитать значение скидки найденное по формуле, а если нет, то просто возвращать сумму инвойсов.
// Go to [src\lib\components\Button.svelte]
/**
 * Takes the lineItems and discount and determines the invoice total
 * @param {Array|undefined} lineItems
 * @param {number|undefined} discount
 * @returns {number}
 */
export const invoiceTotal = (
  lineItems: LineItem[] | undefined,
  discount: number | undefined
): number => {
  const lineItemsSum = sumLineItems(lineItems);

  if (discount) {
    const invoiceDiscount = lineItemsSum * (discount / 100);
    return lineItemsSum - invoiceDiscount;
  }
  return lineItemsSum;
};

/**
 * Takes and returns a dollar amount (USD), formatted with commas and 2 decimals places
 * @param {number} cents
 * @returns {string}
 */
export const centsToDollars = (cents: number): string => {
  const dollars = cents / 100;
  const addDecimals = twoDecimals(dollars);
  return addThousandsSeparator(addDecimals);
};

/**
 * Takes a dollar amount and converts it to cents.
 * @param {number} dollars
 * @returns  {number}
 */
export const dollarsToCents = (dollars: number): number => {
  return dollars * 100;
};

/**
 * Takes a number and returns the number with 2 decimal places
 * @param {number} myNum
 * @returns {string}
 */
export const twoDecimals = (myNum: number): string => {
  return myNum.toFixed(2);
};

/**
 * Adds a thousands separator
 * @param {string} myNum
 * @returns {string}
 */
export const addThousandsSeparator = (myNum: string): string => {
  return myNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Takes all the invoices and finds the total
 * @param {Invoice} invoices
 * @returns {number}
 */
export const sumInvoices = (invoices: Invoice[] | undefined): number => {
  if (!invoices) return 0;
  return invoices.reduce((prevValue, curValue) => {
    const invoiceSum = sumLineItems(curValue.lineItems);
    return prevValue + invoiceSum;
  }, 0);
};
