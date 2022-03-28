import {gql} from "@apollo/client";

export const EvaluateAlarmsMutation = gql`
    mutation evaluateAlarms {
        evaluateAlarms {
            alarmTriggerResult {
                alarm {
                    id
                }
            }
        }
    }
`;