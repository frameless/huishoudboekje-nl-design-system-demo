import {gql} from "@apollo/client";

const BurgerFragment = gql`
    fragment Burger on Burger {
        id
        bsn
        voorletters
        voornamen
        achternaam
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
    }
`;

export default BurgerFragment;
