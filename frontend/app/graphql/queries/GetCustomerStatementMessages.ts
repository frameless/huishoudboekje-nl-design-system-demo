import {gql} from "@apollo/client";
import {CustomerStatementMessageFragment} from "../fragments/CustomerStatementMessage";

export const GetCsmsQuery = gql`
    query getCsms{
        customerStatementMessages{
            ...CustomerStatementMessage
        }
    }
    ${CustomerStatementMessageFragment}
`;