export const searchFields = (term: string, fields: string[]) => {
	return fields.map(f => f.toLowerCase()).some(s => s.includes(term.toLowerCase()));
};