import {gql} from "@apollo/client";

export const CreateCustomerStatementMessageMutation = gql`
    mutation createCustomerStatementMessage($file: Upload!){
        createCustomerStatementMessage(file: $file){
            ok
        }
    }
`;