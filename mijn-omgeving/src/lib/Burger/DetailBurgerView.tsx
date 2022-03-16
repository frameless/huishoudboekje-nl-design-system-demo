import React from "react";
import {useTranslation} from "react-i18next";
import Queryable from "../Queryable";
import {useGetBurgerQuery} from "../../generated/graphql";
import "@gemeente-denhaag/design-tokens-components";
import {Heading4} from "@gemeente-denhaag/components-react";
import {Stack, Table, Tbody, Td, Tr} from "@chakra-ui/react";
import {Heading2} from "@gemeente-denhaag/typography";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import PrettyIban from "../PrettyIban";
import {Link} from "@gemeente-denhaag/link";


const DetailBurgerView: React.FC<{ bsn: number }> = ({bsn}) => {
	const {t} = useTranslation();
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<Queryable query={$burger} render={data => {
			const {rekeningen = []} = data.burger || {};

			return (
				<div>
					<Link href={"/"} icon={<ArrowLeftIcon />} iconAlign={"start"}>{t("title")}</Link>
					<Heading2>{t("detailBurger.title")}</Heading2>
					{rekeningen.map((rekening, i) => {
						return (
							<Stack>
								<Heading4>{t("detailBurger.rekening")}</Heading4>
								<Table variant={"simple"} key={i}>
									<Tbody>
										<Tr>
											<Td fontWeight={"bold"}>{t("detailBurger.rekeninghouden")}</Td>
											<Td>{rekening.rekeninghouder}</Td>
										</Tr>
										<Tr>
											<Td fontWeight={"bold"}>{t("detailBurger.iban")}</Td>
											<Td> <PrettyIban iban={rekening.iban} /></Td>
										</Tr>
									</Tbody>
								</Table>
							</Stack>
						)
					})}
				</div>
			)
		}} />
	)
};

export default DetailBurgerView;