import {gql} from "@apollo/client";

export const DeleteCustomerStatementMessageMutation = gql`
    mutation deleteCustomerStatementMessage($input: CSMDeleteRequest!){
        CSM_Delete(input: $input){
            deleted
        }
    }
`;