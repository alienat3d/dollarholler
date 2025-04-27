import { format, isBefore } from 'date-fns';

// * 33.0 Итак, у нас теперь стоит задача: при создании инвойса у нас есть поля с датами и по клике на них появляется HTML-календарь, в котором мы хотим сделать ряд улучшений. Например нам нужно запретить выбирать какую-то дату раньше сегодняшнего дня. Для этого сперва создадим новую переменную, куда помести сегодняшнюю дату в нужном нам формате для этой задачи. Библиотека "Date FNS" упростит нам задачу. А также экспортируем эту переменную для дальнейшего использования в других частях приложения.
// Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte]
export const today = format(new Date(), 'yyyy-MM-dd');

/**
 * This takes yyyy-mm-dd and returns m-d-yyyy
 * @param {string} myDate
 * @returns {string} m-d-yyyy
 */
export const convertDate = (myDate: string): string => {
  // break apart the date
  const [year, month, date] = splitDate(myDate);
  // return it in the correct format
  return `${parseInt(month)} /  ${parseInt(date)} / ${year}`;
};

/**
 * Determines whether a date is before today (meaning it's late!)
 * @param {string} myDate
 * @returns {boolean}
 */
export const isLate = (myDate: string): boolean => {
  const [year, month, date] = splitDate(myDate);
  const dueDate = new Date(parseInt(year), parseInt(month), parseInt(date));
  const today = new Date();
  return isBefore(dueDate, today);
};

/**
 * Takes a date yyyy-mm-dd and splits it into an array
 * @param {string} myDate
 * @returns {Array} [yyyy, mm, dd]
 */
export const splitDate = (myDate: string): Array<string> => {
  return myDate.split('-');
};
