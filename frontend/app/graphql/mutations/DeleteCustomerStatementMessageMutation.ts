import {gql} from "@apollo/client";

export const DeleteCustomerStatementMessageMutation = gql`
    mutation deleteCustomerStatementMessage($id: Int!){
        deleteCustomerStatementMessage(id: $id){
            ok
        }
    }
`;