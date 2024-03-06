import { gql } from "@apollo/client";

export const GetBurgersAndOrganisatiesAndRekeningen = gql`
query getBurgersAndOrganisatiesAndRekeningen($iban: String){
    organisaties{
      id
      naam
      afdelingen{
        id
      }
    }
    burgers{
      id
      voornamen
      voorletters
      achternaam
    }
    rekeningen{
      iban
      rekeninghouder
      id
    }
    afdelingenByIban(iban: $iban){
      organisatieId
    }
  }
`;