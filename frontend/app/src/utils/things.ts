export const searchFields = (term: string, fields: string[]) => {
	return fields.map(f => f.toLowerCase()).some(s => s.includes(term.toLowerCase()));
};

export const MOBILE_BREAKPOINT = 650;
export const TABLET_BREAKPOINT = 1000;

export const ZIPCODE_NL_REGEX = /^[1-9][0-9]{3}[A-Za-z]{2}$/i;
export const PHONE_NL_REGEX = /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/;
export const MOBILE_NL_REGEX = /^(((\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i;
export const IBAN_NL_REGEX = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/;
export const BSN_NL_REGEX = /^\d{9}$/;