import fetch from "node-fetch";
import {createServiceUrl} from "../config/services";

// Todo: return types (result types from the APIs)
// Todo we need make sure that based on the Burger that is requesting this, we never return any Afspraken that are not linked to other burgers.

const DataLoader = {

	// Burgers
	getAllBurgers: async () => { // Todo: remove when going to production.
		return await fetch(createServiceUrl("huishoudboekje", "/burgers")).then(r => r.json()).then(r => r.data || []);
	},

	getBurgerById: async (id: number) => {
		return await fetch(createServiceUrl("huishoudboekje", `/burgers/${id}`)).then(r => r.json()).then(r => r.data);
	},

	getBurgersByBsn: async (bsn: number) => {
		return await fetch(createServiceUrl("huishoudboekje", `/burgers?filter_bsn=${bsn}`)).then(r => r.json()).then(r => r.data || []);
	},

	// Afspraken
	getAfsprakenByBurgerId: async (id: number) => {
		return await fetch(createServiceUrl("huishoudboekje", `/afspraken?filter_burgers=${id}`)).then(r => r.json()).then(r => r.data || []);
	},

	getAfsprakenById: async (ids: number) => {
		return await fetch(createServiceUrl("huishoudboekje", `/afspraken?filter_ids=${ids}`)).then(r => r.json()).then(r => r.data);
	},

	// Rekeningen
	getRekeningenByBurgerId: async (id: number) => {
		return await fetch(createServiceUrl("huishoudboekje", `/burgers/${id}/rekeningen`)).then(r => r.json()).then(r => r.data || []);
	},

	getRekeningenByIds: async (ids: number[] = []) => {
		// Todo we need make sure that based on the Burger that is requesting this, we never return any Afspraken that are not linked to other burgers.
		return await fetch(createServiceUrl("huishoudboekje", `/rekeningen/?filter_ids=${ids.join(",")}`)).then(r => r.json()).then(r => r.data);
	},

	getRekeningenByIbans: async (ibans: string[] = []) => {
		// Todo we need make sure that based on the Burger that is requesting this, we never return any Afspraken that are not linked to other burgers.
		return await fetch(createServiceUrl("huishoudboekje", `/rekeningen/?filter_ibans=${ibans.join(",")}`)).then(r => r.json()).then(r => r.data || []);
	},

	// Journaalposten
	getJournaalpostenByBurgerId: async (id: number) => {
		return await fetch(createServiceUrl("huishoudboekje", `/journaalposten?filter_burgers=${id}`)).then(r => r.json()).then(r => r.data || []);
	},

	getJournaalpostenByAfspraakId: async (afspraakId: number) => {
		// Todo we need make sure that based on the Burger that is requesting this, we never return any Afspraken that are not linked to other burgers.
		return await fetch(createServiceUrl("huishoudboekje", `/journaalposten?filter_afspraken=${afspraakId}`)).then(r => r.json()).then(r => r.data || []);
	},

	getJournaalpostenByTransactieId: async (transactieIds: number) => {
		return await fetch(createServiceUrl(`huishoudboekje`, `/journaalposten?filter_transactions=${transactieIds}`)).then(r => r.json()).then(r => r.data || []);
	},

	// Banktransacties
	getBanktransactiesById: async (ids: number[]) => {
		return await fetch(createServiceUrl("banktransacties", `/banktransactions?filter_ids=${ids.join(",")}&sortingColumn=transactie_datum&desc=desc`)).then(r => r.json()).then(r => r.data || []);
	},

	getBanktransactiesByIdPaged: async (ids: number[], start: number, limit: number) => {
		return await fetch(createServiceUrl("banktransacties", `/banktransactions?filter_ids=${ids.join(",")}&start=${start}&limit=${limit}&sortingColumn=transactie_datum&desc=desc`)).then(r => r.json());
	},

	getAllBanktransacties: async () => {
		return await fetch(createServiceUrl("banktransacties", "/banktransactions?sortingColumn=transactie_datum&desc=desc")).then(r => r.json()).then(r => r.data || []);
	},

	getBanktransactiesByBurgerId: async (burgerId: number) => {
		// get all afspraken by burgerId
		const afspraken = await DataLoader.getAfsprakenByBurgerId(burgerId);
		const afpraakIds = afspraken.reduce((list, a) => [...list, a.id], []);

		// get all journaalposten bij afspraak
		const journaalposten = await DataLoader.getJournaalpostenByAfspraakId(afpraakIds);
		const banktransactieIds = journaalposten.reduce((list, j) => [...list, j.transaction_id], []);

		// get all related banktransacties
		const transacties = await DataLoader.getBanktransactiesById(banktransactieIds);
		console.table(transacties.map(t => t.id));

		return await DataLoader.getBanktransactiesById(banktransactieIds);
	},

	getBanktransactiesByBurgerIdPaged: async (burgerId: number, options: {start: number, limit: number}) => {
		// get all afspraken by burgerId
		const afspraken = await DataLoader.getAfsprakenByBurgerId(burgerId);
		const afpraakIds = afspraken.reduce((list, a) => [...list, a.id], []);

		// get all journaalposten bij afspraak
		const journaalposten = await DataLoader.getJournaalpostenByAfspraakId(afpraakIds);
		const banktransactieIds = journaalposten.reduce((list, j) => [...list, j.transaction_id], []);

		const {start, limit} = options;
		if (!start || !limit) {
			throw new Error("Start and limit are required");
		}

		// get all related banktransacties
		const result = await DataLoader.getBanktransactiesByIdPaged(banktransactieIds, start, limit);
		const {count, data: banktransacties} = result;

		return {
			banktransacties,
			pageInfo: {start, limit, count},
		};
	},

	// Afdelingen (Organisatieservice)
	getAfdelingenById: async (ids?: number[]) => {
		let filters = "";
		if (ids && ids.length > 0) {
			filters = `?filter_ids=${ids.join(",")}`;
		}
		return await fetch(createServiceUrl("organisaties", `/afdelingen` + filters)).then(r => r.json()).then(r => r.data || []);
	},

	// Organisatie (Organisatieservice)
	getOrganisatiesById: async (ids?: number[]) => {
		let filters = "";
		if (ids && ids.length > 0) {
			filters = `?filter_ids=${ids.join(",")}`;
		}
		return await fetch(createServiceUrl("organisaties", `/organisaties` + filters)).then(r => r.json()).then(r => r.data || []);
	},

	// Betaalinstructie (Huishoudboekjeservice)
	getBetaalinstructieByAfspraakId: async (afspraakId: number): Promise<any> => {
		throw new Error("Not implemented.");
	},

};

export default DataLoader;