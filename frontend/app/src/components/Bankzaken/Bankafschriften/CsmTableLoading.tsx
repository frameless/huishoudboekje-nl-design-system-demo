import { Skeleton, Td, Tr , Text, Tbody, Table, Thead, FormLabel, Th, Stack} from "@chakra-ui/react";
import { truncateText } from "../../../utils/things";
import { useTranslation } from "react-i18next";
import { DeleteIcon } from "@chakra-ui/icons";


const CsmTableLoading = () => {
	const {t} = useTranslation();

	const fields: JSX.Element[] = [];
		for (let i = 1; i <= 5; i++) {
		fields.push(
			<Tr>
				<Td>
					<Skeleton>
						<Text>{truncateText( "loading", 60)}</Text>
					</Skeleton>
				</Td>
				<Td>
					<Skeleton>
						<Text>{"loading"}</Text>
					</Skeleton>
				</Td>
				<Td>
					<Skeleton>
						<Text fontSize={"sm"}>{"loading"}</Text>
					</Skeleton>
				</Td>
				<Td>
					<Skeleton>
						<DeleteIcon />
					</Skeleton>
				</Td>
			</Tr>
		);
		}

	return (
		<Stack direction={["column", "row"]} spacing={5}>
			<Table variant={"noLeftPadding"} size={"sm"}>
				<Thead >
					<Tr>
						<Th>
							<FormLabel>{t("forms.bankzaken.sections.customerStatementMessages.filename")}</FormLabel>
						</Th>
						<Th>
							<FormLabel>{t("forms.bankzaken.sections.customerStatementMessages.transactionCount")}</FormLabel>
						</Th>
						<Th>
							<FormLabel>{t("global.time")}</FormLabel>
						</Th>
						<Th isNumeric />
					</Tr>
				</Thead>
				<Tbody>
					{fields}
				</Tbody>
			</Table>
		</Stack>
	);
};

export default CsmTableLoading;
