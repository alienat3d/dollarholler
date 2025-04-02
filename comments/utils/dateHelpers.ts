import { isBefore } from 'date-fns';
/**
 * Reformatting the dates in other format than it’s in DB
 * @param {string} myDate 'yyyy-mm-dd'
 * @return {string} 'dd.mm.yyyy'
 */
export const convertDate = (myDate: string): string => {
	// Break apart the date
	const [year, month, day] = splitDate(myDate);
	// Return it in correct format. (If we don’t want leading zeros we can put the values into 'parseInt' method)
	return `${parseInt(day)}.${parseInt(month)}.${year}`;
};

/**
 * Determines wether payment is before today (meaning it’s late!).
 * @summary For this we’ll use a nice little library for dates "date-fns" (https://date-fns.org/)
 * @param {string} myDate - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
 * @return {boolean}
 */
export const isLate = (myDate: string): boolean => {
	const [year, month, day] = splitDate(myDate);
	const dueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
	const today = new Date();
	return isBefore(dueDate, today); // will compare if dueDate’s date is before today’s date
};

// But before we can apply it here we also need to convert the date to the specific format as we did at 'convertDate' above. So lets make another function for this.
/**
 * Takes a date 'yyyy-mm-dd' and splits it into an array
 * @param {string} myDate
 * @return {Array} [yyyy.mm.dd]
 */
// export const splitDate = (myDate: string): string[] => {}; Another way how to write it:
export const splitDate = (myDate: string): Array<string> => myDate.split('-');
