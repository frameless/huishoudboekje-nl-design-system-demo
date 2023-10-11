import { gql } from "@apollo/client";

export const GetBurgersAndOrganisatiesAndRekeningen = gql`
query getBurgersAndOrganisatiesAndRekeningen{
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
  }
`;