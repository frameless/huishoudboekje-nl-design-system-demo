import {gql} from "@apollo/client";

const BanktransactieFragment = gql`
    fragment Banktransactie on Banktransactie {
        id
        bedrag
        isCredit
        tegenrekeningIban
        transactiedatum
        informationToAccountOwner
        tegenrekening {
            id
            iban
            rekeninghouder
        }
        journaalpost {
            id
            afspraak {
                id
            }
        }
    }
`;

export default BanktransactieFragment;