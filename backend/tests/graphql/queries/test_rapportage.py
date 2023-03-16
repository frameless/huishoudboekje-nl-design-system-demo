import requests_mock
from hhb_backend.graphql import settings

def test_burger_rapportage(client):
    with requests_mock.Mocker() as rm:
        #ARRANGE
        rapportage_service_mock_data = {"data": {
            "burger_id" : 1,
            "start_datum": "2022-12-01",
            "eind_datum": "2022-12-01",
            "totaal": "752.88",
            "totaal_uitgaven": "-820.96",
            "totaal_inkomsten": "1573.84",
            "inkomsten": [
                {
                "rubriek": "Uitkeringen",
                "transacties": [
                    {
                    "bedrag": "147.84",
                    "transactie_datum": "2020-01-07T00:00:00",
                    "rekeninghouder": "GEMEENTE UTRECHT"
                    }
                ]
                },
                {
                "rubriek": "Toeslagen",
                "transacties": [
                    {
                    "bedrag": "322",
                    "transactie_datum": "2019-12-20T00:00:00",
                    "rekeninghouder": "Belastingdienst"
                    },
                    {
                    "bedrag": "322",
                    "transactie_datum": "2020-01-20T00:00:00",
                    "rekeninghouder": "Belastingdienst"
                    }
                ]
                }
            ],
            "uitgaven": [
                {
                "rubriek": "Gas en elektriciteit",
                "transacties": [
                    {
                    "bedrag": "-41.61",
                    "transactie_datum": "2020-01-01T00:00:00",
                    "rekeninghouder": "VITENS NV"
                    },
                    {
                    "bedrag": "-132",
                    "transactie_datum": "2020-01-01T00:00:00",
                    "rekeninghouder": "ENGIE Nederland RETAIL B.V."
                    }
                ]
                },
                {
                "rubriek": "Huur of hypotheek",
                "transacties": [
                    {
                    "bedrag": "-647.35",
                    "transactie_datum": "2020-01-04T00:00:00",
                    "rekeninghouder": "Portaal"
                    }
                ]
                }
            ]
            }
        }
        burger_mock_data = {"data": [{
                "achternaam": "pieterson",
                "bsn": 285278939,
                "email": None,
                "geboortedatum": None,
                "huishouden_id": 1,
                "huisnummer": None,
                "iban": None,
                "id": 1,
                "plaatsnaam": None,
                "postcode": None,
                "straatnaam": None,
                "telefoonnummer": None,
                "voorletters": None,
                "voornamen": "piet pieter"
            }]}

        rm.get(f"{settings.RAPPORTAGE_SERVICE_URL}/rapportage/1?startDate=2022-12-01&endDate=2022-12-01", json=rapportage_service_mock_data)
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1",json=burger_mock_data)
        rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        #ACT
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test($burger:Int!,$start:Date!,$end:Date!) {
                    burgerRapportage(burgerId:$burger, startDate:$start, endDate:$end){
                        burger{
                            voornamen
                        }
                        startDatum
                        eindDatum
                        totaal
                        totaalUitgaven
                        totaalInkomsten
                        inkomsten {
                            rubriek
                            transacties{
                                bedrag
                                transactieDatum
                                rekeninghouder        
                            }
                        }
                        uitgaven{
                            rubriek
                            transacties{
                                bedrag
                                transactieDatum
                                rekeninghouder
                            }
                        }
                    }
                }
                ''',
                "variables": {"burger": 1, "start":"2022-12-01", "end":"2022-12-01"}
            },
            content_type='application/json'
        )

        #ASSERT
        assert response.json == {"data": {"burgerRapportage": {
            "burger": {
                "voornamen": "piet pieter"
            },
            "startDatum": "2022-12-01",
            "eindDatum": "2022-12-01",
            "totaal": "752.88",
            "totaalUitgaven": "-820.96",
            "totaalInkomsten": "1573.84",
            "inkomsten": [
                {
                "rubriek": "Uitkeringen",
                "transacties": [
                    {
                    "bedrag": "147.84",
                    "transactieDatum": "2020-01-07T00:00:00",
                    "rekeninghouder": "GEMEENTE UTRECHT"
                    }
                ]
                },
                {
                "rubriek": "Toeslagen",
                "transacties": [
                    {
                    "bedrag": "322",
                    "transactieDatum": "2019-12-20T00:00:00",
                    "rekeninghouder": "Belastingdienst"
                    },
                    {
                    "bedrag": "322",
                    "transactieDatum": "2020-01-20T00:00:00",
                    "rekeninghouder": "Belastingdienst"
                    }
                ]
                }
            ],
            "uitgaven": [
                {
                "rubriek": "Gas en elektriciteit",
                "transacties": [
                    {
                    "bedrag": "-41.61",
                    "transactieDatum": "2020-01-01T00:00:00",
                    "rekeninghouder": "VITENS NV"
                    },
                    {
                    "bedrag": "-132",
                    "transactieDatum": "2020-01-01T00:00:00",
                    "rekeninghouder": "ENGIE Nederland RETAIL B.V."
                    }
                ]
                },
                {
                "rubriek": "Huur of hypotheek",
                "transacties": [
                    {
                    "bedrag": "-647.35",
                    "transactieDatum": "2020-01-04T00:00:00",
                    "rekeninghouder": "Portaal"
                    }
                ]
                }
            ]
            }
        }}