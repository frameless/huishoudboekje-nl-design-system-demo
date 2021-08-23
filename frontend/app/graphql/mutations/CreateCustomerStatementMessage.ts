import {gql} from "@apollo/client";
import {CustomerStatementMessageFragment} from "../fragments/CustomerStatementMessage";

export const CreateCustomerStatementMessageMutation = gql`
    mutation createCustomerStatementMessage($file: Upload!){
        createCustomerStatementMessage(file: $file){
            ok
            customerStatementMessage{
                ...CustomerStatementMessage
            }
        }
    }
    ${CustomerStatementMessageFragment}
`;