import {gql} from "@apollo/client";

export const EvaluateAlarmMutation = gql`
    mutation evaluateAlarm($id: String!) {
        evaluateAlarm(id: $id) {
            alarmTriggerResult {
                alarm {
                    id
                }
            }
        }
    }
`;
