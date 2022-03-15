export const currencyFormat = new Intl.NumberFormat(
	"nl-NL", {
		style: "currency", currency: "EUR"
	});

export const currencyFormat2 = (showCurrency = true) => {
	return new Intl.NumberFormat("nl-NL", {
		style: showCurrency ? "currency" : "decimal",
		...showCurrency ? {
			currency: "EUR",
		} : {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		},
	});
};