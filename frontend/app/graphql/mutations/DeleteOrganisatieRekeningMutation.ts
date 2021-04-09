import {gql} from "@apollo/client";

export const DeleteOrganisatieRekeningMutation = gql`
    mutation deleteOrganisatieRekening(
        $id: Int!
        $orgId: Int!
    ){
        deleteOrganisatieRekening(organisatieId: $orgId, rekeningId: $id){
            ok
        }
    }
`;