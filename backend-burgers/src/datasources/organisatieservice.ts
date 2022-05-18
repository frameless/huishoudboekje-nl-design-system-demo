import {getServiceUrl} from "../utils/things";
import NoCacheRESTDataSource from "./NoCacheRESTDataSource";

class Organisatieservice extends NoCacheRESTDataSource {

	constructor() {
		super();
		this.baseURL = getServiceUrl("ORGANISATIESERVICE_URL", "http://localhost:8002");
	}

	public async getOrganisatieById(id: number) {
		return this
			.get(`/organisaties/${id}`)
			.then(r => r.data);
	}

	public async getOrganisatiesByIds(ids: number[]) {
		return this
			.get(`/organisaties?filter_ids=${ids.join(",")}`)
			.then(r => r.data || []);
	}

	public async getAfdelingenById(ids: number[]) {
		return this
			.get(`/afdelingen?filter_ids=${ids.join(",")}`)
			.then(r => r.data || []);
	}

}

export default Organisatieservice;