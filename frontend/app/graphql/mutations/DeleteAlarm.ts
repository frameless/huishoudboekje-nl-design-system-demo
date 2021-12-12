import {gql} from "@apollo/client";

export const DeleteAlarmMutation = gql`
    mutation deleteAlarm($id: String!){
        deleteAlarm(id: $id){
            ok
        }
    }
`;