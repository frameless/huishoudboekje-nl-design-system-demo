import {gql} from "@apollo/client";

export const SignalSetIsActiveMutation = gql`
    mutation signalSetIsActive($input: SetIsActiveRequest!){
        Signals_SetIsActive(input: $input){
            id
            isActive
        }
    }
`;