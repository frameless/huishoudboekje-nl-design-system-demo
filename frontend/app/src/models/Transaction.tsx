import moment, {Moment} from "moment";
import {BankTransaction, CustomerStatementMessage, Journaalpost, Rekening, Rubriek} from "../generated/graphql";

export default class Transaction {

	id: number
	customerStatementMessage: CustomerStatementMessage
	statementLine: string
	informationToAccountOwner: string
	bedrag: string
	isCredit: boolean
	tegenRekening: Rekening
	tegenRekeningIban: string
	transactieDatum: Moment
	journaalpost: Journaalpost

	constructor(props: Required<BankTransaction>) {
		this.id = props.id;
		this.customerStatementMessage = props.customerStatementMessage;
		this.statementLine = props.statementLine;
		this.informationToAccountOwner = props.informationToAccountOwner;
		this.bedrag = props.bedrag;
		this.isCredit = props.isCredit;
		this.tegenRekening = props.tegenRekening;
		this.tegenRekeningIban = props.tegenRekeningIban;
		this.transactieDatum = moment(props.transactieDatum, "YYYY MM DD");
		this.journaalpost = props.journaalpost;
	}

	isBetweenDates = (startDate: Moment, endDate: Moment): boolean => this.transactieDatum.isSameOrAfter(startDate) && this.transactieDatum.isSameOrBefore(endDate);

	isBooked = (): boolean => this.journaalpost && !!(this.journaalpost.afspraak || this.journaalpost.grootboekrekening?.rubriek);

	belongsToAnyBurger = (burgerIds: number[] = []): boolean => {
		if (this.isBooked()) {
			const bookingBurgerId = this.journaalpost?.afspraak?.gebruiker?.id

			if (bookingBurgerId) {
				if (burgerIds.length === 0) {
					return true;
				}

				return this.isBooked() && burgerIds.includes(bookingBurgerId);
			}
		}

		return false;
	};

	getRubriek = (): Rubriek | undefined => {
		if (this.isBooked()) {
			return this.journaalpost.afspraak?.rubriek || this.journaalpost.grootboekrekening?.rubriek;
		}
	};

	hasAnyRubriek = (rubriekIds: number[] = []): boolean => {
		const rubriek = this.getRubriek();

		if (rubriek?.id) {
			return rubriekIds.includes(rubriek.id);
		}

		return false;
	}

}