import {gql} from "@apollo/client";
import {ExportFragment} from "../fragments/ExportFragment";

export const GetExportsQuery = gql`
    query getExports {
        exports {
            ...Export
        }
    }
    ${ExportFragment}
`;