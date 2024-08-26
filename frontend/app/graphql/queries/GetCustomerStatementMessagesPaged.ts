import {gql} from "@apollo/client";

export const GetCsmsPagedQuery = gql`
	query getCsmsPaged($input: CSMPagedRequest!){
		CSM_GetPaged(input: $input){
			data{
				id
				transactionCount
				file{
					name
					id
					uploadedAt
				}
			}
			PageInfo{
				total_count
				skip
				take
			}
		}
	}
`;
