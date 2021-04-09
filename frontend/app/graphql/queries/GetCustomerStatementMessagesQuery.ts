import {gql} from "@apollo/client";
import {CustomerStatementMessageFragment} from "../fragments/CustomerStatementMessageFragment";

export const GetCsmsQuery = gql`
    query getCsms{
        customerStatementMessages{
            ...CustomerStatementMessage
        }
    }
    ${CustomerStatementMessageFragment}
`;