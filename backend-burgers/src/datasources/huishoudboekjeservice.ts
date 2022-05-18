import {getServiceUrl} from "../utils/things";
import NoCacheRESTDataSource from "./NoCacheRESTDataSource";

class Huishoudboekjeservice extends NoCacheRESTDataSource {

	constructor() {
		super();
		this.baseURL = getServiceUrl("HUISHOUDBOEKJESERVICE_URL", "http://localhost:8001");
	}

	public async getAllBurgers() {
		return await this
			.get("/burgers")
			.then(r => r.data || []);
	}

	public async getBurgersByBsns(bsns: number[]) {
		return await this
			.get(`/burgers?filter_bsn=${bsns.join(",")}`)
			.then(r => r.data || []);
	}

	public async getBurgersByIds(ids: number[]) {
		return await this
			.get(`/burgers?filter_id=${ids.join(",")}`)
			.then(r => r.data || []);
	}

	public async getAfspraakById(id: number) {
		return await this
			.get(`/afspraken/${id}`)
			.then(r => r.data || []);
	}

	public async getAfsprakenByBurgerIds(ids: number[]) {
		return await this
			.get(`/afspraken?filter_burgers=${ids.join(",")}`)
			.then(r => r.data || []);
	}

	public async getRekeningenByBurgerId(id: number) {
		return await this
			.get(`/burgers/${id}/rekeningen`)
			.then(r => r.data || []);
	}

	public async getRekeningById(id: number) {
		return await this
			.get(`/rekeningen/${id}`)
			.then(r => r.data);
	}

	public async getRekeningenByIds(ids: number[] = []) {
		return await this
			.get(`/rekeningen?filter_id=${ids.join(",")}`)
			.then(r => r.data);
	}

	public async getRekeningenByIbans(ibans: string[] = []) {
		return await this
			.get(`/rekeningen?filter_ibans=${ibans.join(",")}`)
			.then(r => r.data || []);
	}

	public async getJournaalpostenByAfspraakId(afspraakId: number) {
		return await this
			.get(`/journaalposten?filter_afspraken=${afspraakId}`)
			.then(r => r.data || []);
	}

	public async getJournaalpostenByTransactieIds(transactieIds: number[] = []) {
		return await this
			.get(`/journaalposten?filter_transactions=${transactieIds.join(",")}`)
			.then(r => r.data || []);
	}

}

export default Huishoudboekjeservice;