import {organisaties} from "../data";

export const testOrganisatie = organisatie => {
	const {
		naam = "",
		kvknummer,
		vestigingsnummer,
		afdelingen = [],
	} = organisatie;

	it(`Organisatie ${organisatie.naam} has a name.`, () => {
		expect(naam.length).toBeGreaterThanOrEqual(1);
	});

	it(`Organisatie ${naam} has a kvknummer.`, () => {
		expect(kvknummer.length).toBeGreaterThanOrEqual(1);
	});

	it(`Organisatie ${naam} has a vestigingsnummer.`, () => {
		expect(vestigingsnummer.length).toBeGreaterThanOrEqual(1);
	});

	it(`Organisatie ${naam} has at least one afdeling.`, () => {
		expect(afdelingen.length).toBeGreaterThanOrEqual(1);
	});

	afdelingen.forEach(afdeling => testAfdeling(afdeling));
};

export const testAfdeling = afdeling => {
	const {
		naam = "",
		postadressen = [],
		rekeningen = [],
	} = afdeling;

	it(`Afdeling ${naam} has a name.`, () => {
		expect(naam.length).toBeGreaterThanOrEqual(1);
	});

	it(`Afdeling ${naam} has at least one postadres.`, () => {
		expect(postadressen.length).toBeGreaterThanOrEqual(1);
	});

	it(`Afdeling ${naam} has at least one rekening.`, () => {
		expect(rekeningen.length).toBeGreaterThanOrEqual(1);
	});

	postadressen.forEach(testPostadres);
	rekeningen.forEach(testRekening);
};

export const testPostadres = postadres => {
	const {
		straatnaam, huisnummer, postcode, plaatsnaam,
	} = postadres;

	it("Postadres has a straatnaam, huisnummer, postcode and plaatsnaam", () => {
		expect(straatnaam.length).toBeGreaterThanOrEqual(1);
		expect(huisnummer.length).toBeGreaterThanOrEqual(1);
		expect(postcode.length).toBeGreaterThanOrEqual(1);
		expect(plaatsnaam.length).toBeGreaterThanOrEqual(1);
	});
};

export const testRekening = rekening => {
	const {iban, rekeninghouder} = rekening;

	it("Rekening has IBAN and rekeninghouder", () => {
		expect(iban.length).toBeGreaterThanOrEqual(1);
		expect(rekeninghouder.length).toBeGreaterThanOrEqual(1);
	});
};

export const testBurger = burger => {
	describe(`Burger ${burger.achternaam} is valid`, () => {
		it(`Burger has all the required fields`, () => {
			expect(burger).toHaveProperty("bsn");
			expect(burger.bsn.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("voorletters");
			expect(burger.voorletters.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("voornamen");
			expect(burger.voornamen.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("achternaam");
			expect(burger.achternaam.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("huisnummer");
			expect(burger.huisnummer.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("postcode");
			expect(burger.postcode.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("straatnaam");
			expect(burger.straatnaam.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("plaatsnaam");
			expect(burger.plaatsnaam.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("geboortedatum");
			expect(burger.geboortedatum.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("email");
			expect(burger.email.length).toBeGreaterThanOrEqual(1);
			expect(burger).toHaveProperty("telefoonnummer");
			expect(burger.telefoonnummer.length).toBeGreaterThanOrEqual(1);
		});

		it(`Burger ${burger.achternaam} has at least one rekening`, () => {
			expect(burger).toHaveProperty("rekeningen");
			expect(burger.rekeningen.length).toBeGreaterThanOrEqual(1);
		});

		burger.rekeningen.forEach(testRekening);
		burger.afspraken.forEach(testAfspraak);
	});
};

export const testAfspraak = afspraak => {
	describe(`Afspraak is valid`, () => {
		it(`Afspraak has all the data it needs`, () => {
			/*	  {
					"rubriek": {
					  "naam": "Inkomsten"
					},
					"omschrijving": "Loon",
					"organisatie": {
					  "kvknummer": "35012085"
					},
					"bedrag": 765.32,
					"credit": true,
					"validFrom": "2021-01-01",
					"zoektermen": [
					  "Loon",
					  "ZOEKTERMPERSONA1"
					]
				  },
			*/
			expect(afspraak).toHaveProperty("rubriek");
			expect(afspraak.rubriek).toHaveProperty("naam");

			// Test if rubriek exists
			expect(afspraak).toHaveProperty("omschrijving");
			expect(afspraak).toHaveProperty("bedrag");
			expect(afspraak).toHaveProperty("credit");
			expect(afspraak).toHaveProperty("validFrom");
			expect(afspraak).toHaveProperty("zoektermen");
		});

		if (afspraak.organisatie) {
			it("Afspraak has an organisatie", () => {
				expect(afspraak).toHaveProperty("organisatie");
				isKnownOrganisatie(afspraak.organisatie);
			});
		}

		// Todo
		// if (afspraak.betaalinstructie) {
		// 	expect(afspraak).toHaveProperty("betaalinstructie");
		// }
	});
};

const isKnownOrganisatie = organisatie => {
	expect(organisatie).toHaveProperty("kvknummer");
	const foundOrganisatie = organisaties.find(o => o.kvknummer === organisatie.kvknummer);
	expect(foundOrganisatie).toBeTruthy();
};