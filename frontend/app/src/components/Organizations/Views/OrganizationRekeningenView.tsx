import React, {useContext} from "react";
import {Box, BoxProps, Button, Divider, Heading, Stack} from "@chakra-ui/core";
import {FormLeft, FormRight, Label} from "../../Forms/FormLeftRight";
import RekeningList from "../../Rekeningen/RekeningList";
import RekeningForm from "../../Rekeningen/RekeningForm";
import {IOrganisatie} from "../../../models";
import {useIsMobile, useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {OrganizationDetailContext} from "../OrganizationDetail";
import {useMutation} from "@apollo/client";
import {CreateOrganizationRekeningMutation} from "../../../services/graphql/mutations";

const OrganizationRekeningenView: React.FC<BoxProps & { organization: IOrganisatie }> = ({organization, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const {refresh} = useContext(OrganizationDetailContext);
	const [showForm, toggleForm] = useToggle(false);
	const [createRekeningForOrg] = useMutation(CreateOrganizationRekeningMutation);
	const onSaveRekening = (rekening, resetForm) => {
		createRekeningForOrg({
			variables: {
				orgId: organization.id,
				rekening
			}
		}).then(() => {
			resetForm();
			toggleForm(false);
			refresh();
		});
	};

	return (
		<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5} {...props}>
			<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
				<FormLeft>
					<Heading display={"box"} size={"md"}>{t("forms.organizations.sections.rekeningen.title")}</Heading>
					<Label>{t("forms.organizations.sections.rekeningen.detailText")}</Label>
				</FormLeft>
				<FormRight justifyContent={"center"}>
					<RekeningList rekeningen={organization.rekeningen} onChange={() => refresh()} organization={organization} />
					{showForm ? (<>
						{organization.rekeningen.length > 0 && <Divider />}

						<RekeningForm rekening={{
							rekeninghouder: organization.weergaveNaam
						}} onSave={onSaveRekening} onCancel={() => toggleForm(false)} />
					</>) : (
						<Box>
							<Button leftIcon={"add"} variantColor={"primary"} size={"sm"} onClick={() => toggleForm(true)}>{t("actions.add")}</Button>
						</Box>
					)}
				</FormRight>
			</Stack>
		</Stack>
	);
};

export default OrganizationRekeningenView;