export const searchFields = (term: string, fields: string[]) => {
	return fields.map(f => f.toLowerCase()).some(s => s.includes(term.toLowerCase()));
};

export const MOBILE_BREAKPOINT = 650;
export const TABLET_BREAKPOINT = 1000;

const ZipcodeNL = /^[1-9][0-9]{3}[A-Za-z]{2}$/i;
const PhoneNumberNL = /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/;
const MobilePhoneNL = /^(((\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i;
const IbanNL = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/;
const BsnNL = /^\d{9}$/;
const Date = /^(\d{2})-(\d{2})-(\d{4})$/;

export const Regex = {ZipcodeNL, PhoneNumberNL, MobilePhoneNL, IbanNL, BsnNL, Date};

export function fakeAsyncCall<T>(result: T | boolean = true, duration = 2000): Promise<T> {
	return new Promise<T>(resolve => {
		setTimeout(() => {
			resolve(result as T);
		}, duration);
	});
}