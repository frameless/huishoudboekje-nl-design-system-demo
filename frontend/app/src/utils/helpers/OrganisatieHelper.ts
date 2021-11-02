import {Organisatie} from "../../generated/graphql";

class OrganisatieHelper {
	private organisatie: Organisatie;

	constructor(organisatie: Organisatie) {
		this.organisatie = organisatie;
	}

}

export default OrganisatieHelper;