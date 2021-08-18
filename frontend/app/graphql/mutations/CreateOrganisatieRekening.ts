import {gql} from "@apollo/client";
import {RekeningFragment} from "../fragments/Rekening";

export const CreateOrganisatieRekeningMutation = gql`
    mutation createOrganisatieRekening(
        $orgId: Int!
        $rekening: RekeningInput!
    ){
        createOrganisatieRekening(organisatieId: $orgId, rekening: $rekening){
            ok
            rekening{
                ...Rekening
            }
        }
    }
    ${RekeningFragment}
`;