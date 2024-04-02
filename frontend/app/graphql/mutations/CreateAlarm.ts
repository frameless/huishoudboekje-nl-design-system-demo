import {gql} from "@apollo/client";

export const CreateAlarmMutation = gql`
    mutation createAlarm($input: CreateAlarmRequest!) {
        Alarms_Create(input: $input){
            id
        }
    }
`;