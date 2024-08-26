import {gql} from "@apollo/client";

export const UploadCustomerStatementMessageMutation = gql`
    mutation UploadCustomerStatementMessage($input: CSMUploadRequest!){
        CSM_Upload(input: $input){
            id
            name
        }
    }
`;