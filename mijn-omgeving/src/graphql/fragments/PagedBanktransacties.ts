import {gql} from "@apollo/client";

const PagedBanktransactiesFragment = gql`
    fragment PagedBanktransacties on PagedBanktransactie {
        banktransacties {
            id
            bedrag
            isCredit
            informationToAccountOwner
            tegenrekening {
                id
                iban
                rekeninghouder
            }
            tegenrekeningIban
            transactiedatum
        }
        pageInfo {
            start
            limit
            count
        }
    }
`;

export default PagedBanktransactiesFragment;