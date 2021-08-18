import {gql} from "@apollo/client";
import {ExportFragment} from "../fragments/Export";

export const GetExportsQuery = gql`
    query getExports {
        exports {
            ...Export
        }
    }
    ${ExportFragment}
`;