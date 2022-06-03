import {getServiceUrl} from "../utils/things";
import Huishoudboekjeservice from "./huishoudboekjeservice";
import NoCacheRESTDataSource from "./NoCacheRESTDataSource";

class Banktransactieservice extends NoCacheRESTDataSource {

	constructor() {
		super();
		this.baseURL = getServiceUrl("BANKTRANSACTIESERVICE_URL", "http://localhost:8003");
	}

	public async getBanktransactieById(id: number) {
		return await this
			.get(`/banktransactions/${id}`)
			.then(r => r.data);
	}

	public async getBanktransactiesByIds(ids: number[]) {
		return await this
			.get(`/banktransactions?filter_ids=${ids.join(",")}&sortingColumn=transactie_datum&desc=desc`)
			.then(r => r.data || []);
	}

	public async getBanktransactiesByIdsPaged(ids: number[], start: number, limit: number) {
		return await this
			.get(`/banktransactions?filter_ids=${ids.join(",")}&start=${start}&limit=${limit}&sortingColumn=transactie_datum&desc=desc`);
	}

	public async getAllBanktransacties() {
		return await this
			.get("/banktransactions?sortingColumn=transactie_datum&desc=desc")
			.then(r => r.data || []);
	}

	public async getBanktransactiesByBurgerIdPaged(burgerId: number, options: {start: number, limit: number}) {
		const {start, limit} = options;
		if (!start || !limit) {
			throw new Error("Start and limit are required");
		}

		const hhbsvc = new Huishoudboekjeservice();

		const afspraken = await hhbsvc.getAfsprakenByBurgerIds([burgerId]);
		const afpraakIds = afspraken.reduce((list, a) => [...list, a.id], []);

		const journaalposten = await hhbsvc.getJournaalpostenByAfspraakId(afpraakIds);
		const banktransactieIds = journaalposten.reduce((list, j) => [...list, j.transaction_id], []);

		const result = await this.getBanktransactiesByIdsPaged(banktransactieIds, start, limit);
		const {count, data: banktransacties} = result;

		return {
			banktransacties,
			pageInfo: {start, limit, count},
		};
	}

}

export default Banktransactieservice;