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
		return await fetch(createServiceUrl("huishoudboekje", "/journaalposten")).then(r => r.json()).then(r => r.data || []);
	},

	getJournaalpostByTransactieId: async (transactieId: number) => {
		return await fetch(createServiceUrl(`huishoudboekje`, `/journaalposten?filter_transactions[]=${transactieId}`)).then(r => r.json()).then(r => {
			return r.data.filter(j => j.transaction_id === transactieId).shift();
		});
	},

	// Banktransacties
	getBanktransactiesById: async (ids: number[]) => {
		return await fetch(createServiceUrl("banktransacties", `/banktransactions?filter_ids=${ids.join(",")}`)).then(r => r.json()).then(r => r.data || []);
	},

	getAllBanktransacties: async () => {
		return await fetch(createServiceUrl("banktransacties", "/banktransactions")).then(r => r.json()).then(r => r.data || []);
	},

	getBanktransactiesByBurgerId: async (id: number) => {
		// Get all journaalposten for one burger
		const journaalposten = await DataLoader.getJournaalpostenByBurgerId(id);

		// Remap journaalposten to transacties
		const banktransactieIds = journaalposten.map(j => j.transaction_id);
		// const ibans = journaalposten.map(j => j.tegen_rekening);

		return await DataLoader
			.getBanktransactiesById(banktransactieIds)
			.then(transacties => transacties.map(t => ({
				...t,

				// Provide afspraak_id, so that we can directly resolve the linked afspraak.
				afspraak_id: journaalposten.find(j => j.transaction_id === t.id)?.afspraak_id,
			})));
	},

	// Afdelingen (Organisatieservice)
	getAfdelingenByOrganisatieId: async (organisatieId: number): Promise<any> => {
		throw new Error("Not implemented.");
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