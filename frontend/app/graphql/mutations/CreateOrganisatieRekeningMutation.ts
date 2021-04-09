import {gql} from "@apollo/client";
import {RekeningFragment} from "../fragments/RekeningFragment";

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