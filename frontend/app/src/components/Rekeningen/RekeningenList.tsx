import React from "react";
import { useTranslation } from "react-i18next";
import { Button, FormLabel, Heading, Stack, Stat, StatGroup, StatLabel, StatNumber, Switch } from "@chakra-ui/core";
import { friendlyFormatIBAN } from "ibantools";

import { IRekening } from "../../models";
import NoItemsFound from "../Forms/NoItemsFound";
import { FormLeft, FormRight, Group, Label } from "../Forms/FormLeftRight";

type RekeningenListProps = {
	rekeningen: IRekening[]
}

const RekeningenList = ({ rekeningen }: RekeningenListProps) => {
	const { t } = useTranslation();

	const onClickAddRekening = (e) => {
		console.log("add rekening");
	};
	return (
		<Group>
			<FormLeft>
				<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.rekeningen.title")}</Heading>
				<Label>{t("forms.burgers.sections.rekeningen.detailText")}</Label>
			</FormLeft>
			<FormRight>
				{rekeningen.length === 0 && <NoItemsFound
					onClick={onClickAddRekening}
					buttonLabel={t("buttons.common.createNew")}
					hint={t("messages.rekeningen.addHint", { buttonLabel: t("buttons.common.createNew") })}
				/>}

				{rekeningen.length > 0 && <>
					<Group>
						<FormLeft />
						<FormRight>
							<Stack direction={"row"} spacing={5} justifyContent={"flex-end"}>
								<Button variantColor={"primary"}
									onClick={onClickAddRekening}>{t("actions.add")}</Button>
							</Stack>
						</FormRight>
					</Group>
					<StatGroup>
						{rekeningen.map(rekening =>
							<Stat key={rekening.id}>
								<StatLabel>{rekening.rekeninghouder}</StatLabel>
								<StatNumber>{friendlyFormatIBAN(rekening.iban)}</StatNumber>
							</Stat>,
						)}
					</StatGroup>
				</>}
			</FormRight>
		</Group>
	);
};

export default RekeningenList;