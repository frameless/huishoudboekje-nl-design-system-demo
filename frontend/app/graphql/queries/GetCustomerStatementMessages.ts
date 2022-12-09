import {gql} from "@apollo/client";

export const GetCsmsQuery = gql`
	query getCsms {
		customerStatementMessages {
			id
			filename
			uploadDate
			accountIdentification
			closingAvailableFunds
			closingBalance
			forwardAvailableBalance
			openingBalance
			relatedReference
			sequenceNumber
			transactionReferenceNumber
		}
	}
`;
