import Banktransactieservice from "./datasources/banktransactieservice";
import Huishoudboekjeservice from "./datasources/huishoudboekjeservice";
import Organisatieservice from "./datasources/organisatieservice";

export type Context = {
	dataSources: {
		huishoudboekjeservice: Huishoudboekjeservice,
		organisatieservice: Organisatieservice,
		banktransactieservice: Banktransactieservice,
	}
};