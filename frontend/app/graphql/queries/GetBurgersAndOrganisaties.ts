import { gql } from "@apollo/client";

export const GetBurgersAndOrganisaties = gql`
query getBurgersAndOrganisaties{
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
  }
`;