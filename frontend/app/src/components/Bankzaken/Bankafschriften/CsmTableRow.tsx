import {Td, Text, Tr} from "@chakra-ui/react";
import React from "react";
import {CsmData} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import {truncateText} from "../../../utils/things";
import DeleteConfirmButton from "../../shared/DeleteConfirmButton";

type CsmTableRowProps = {
	csm: CsmData,
	onDelete?: (id: string) => void
};

const CsmTableRow: React.FC<CsmTableRowProps> = ({csm, onDelete}) => {
	return (
		<Tr>
			<Td>
				<Text>{truncateText(csm.file?.name || "", 60)}</Text>
			</Td>
			<Td>
				<Text>{csm.transactionCount || ""}</Text>
			</Td>
			<Td>
				<Text fontSize={"sm"} color={"gray.500"}>{d.unix(csm.file?.uploadedAt).format("L LT")}</Text>
			</Td>
			{onDelete && (
				<Td style={{width: "100px", textAlign: "right"}}>
					<DeleteConfirmButton onConfirm={() => {
						if (csm.id) {
							onDelete(csm.id);
						}
					}} />
				</Td>
			)}
		</Tr>
	);
};

export default CsmTableRow;