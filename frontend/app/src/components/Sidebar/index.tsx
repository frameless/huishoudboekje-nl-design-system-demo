import {Box, Divider, HStack, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {BsFillHouseDoorFill} from "react-icons/bs";
import {FaRegBuilding} from "react-icons/fa";
import {FiActivity, FiBell} from "react-icons/fi";
import {MdCreditCard} from "react-icons/md";
import {RiBarChartFill} from "react-icons/ri";
import {TiCog} from "react-icons/ti";
import {useLocation} from "react-router-dom";
import {RouteNames} from "../../config/routes";
import {Signaal, useGetSignalenQuery} from "../../generated/graphql";
import {useFeatureFlag} from "../../utils/features";
import Queryable from "../../utils/Queryable";
import NumberBadge from "../shared/NumberBadge";
import SidebarLink from "./SidebarLink";

const Sidebar = () => {
	const {t} = useTranslation();
	const location = useLocation();
	const cleanPathname = location.pathname.substring(1);

	const isSignalenEnabled = useFeatureFlag("signalen");
	const $signalen = useGetSignalenQuery({
		pollInterval: 300 * 1000, // Every 5 minutes
		skip: !isSignalenEnabled, // Do not execute when signalen featureflag is off.
	});

	return (
		<Stack spacing={5} p={5} alignSelf={"center"} borderRadius={5} bg={"white"} divider={<Divider />} width={"100%"}>
			<Stack spacing={5}>
				{isSignalenEnabled && (
					<SidebarLink to={RouteNames.signalen} icon={FiBell} isActive={cleanPathname.startsWith(RouteNames.signalen)}>
						<HStack justify={"space-between"} w={"100%"}>
							<Text>{t("sidebar.signalen")}</Text>
							<Queryable query={$signalen} loading={false} error={false}>
								{(data) => {
									const signalen: Signaal[] = data.signalen;
									const nActiveSignalen = signalen.filter(s => s.isActive).length;
									return nActiveSignalen > 0 ? (
										<NumberBadge count={nActiveSignalen} />
									) : null;
								}}
							</Queryable>
						</HStack>
					</SidebarLink>
				)}
				<Stack>
					<SidebarLink to={RouteNames.huishoudens} icon={BsFillHouseDoorFill} isActive={cleanPathname.startsWith(RouteNames.huishoudens) && !cleanPathname.includes(RouteNames.overzicht)}>{t("sidebar.huishoudens")}</SidebarLink>
					<Box pl={"27px"}>
						<Stack spacing={1} borderLeft={"1px solid"} borderLeftColor={"gray.400"} pl={"21px"}>
							<SidebarLink size={"sm"} to={RouteNames.burgers} isActive={cleanPathname.startsWith(RouteNames.burgers)}>{t("sidebar.burgers")}</SidebarLink>
							<SidebarLink size={"sm"} to={`${RouteNames.huishoudens}/${RouteNames.overzicht}`} isActive={cleanPathname.includes(RouteNames.overzicht)}>{t("sidebar.overview")}</SidebarLink>
						</Stack>
					</Box>
				</Stack>
				<SidebarLink to={RouteNames.organisaties} icon={FaRegBuilding} isActive={cleanPathname.startsWith(RouteNames.organisaties)}>{t("sidebar.organisaties")}</SidebarLink>
				<Stack>
					<SidebarLink to={RouteNames.bankzaken} icon={MdCreditCard}>{t("sidebar.bankzaken")}</SidebarLink>
					<Box pl={"27px"}>
						<Stack spacing={1} borderLeft={"1px solid"} borderLeftColor={"gray.400"} pl={"21px"}>
							<SidebarLink size={"sm"} to={`${RouteNames.bankzaken}/${RouteNames.transacties}`} isActive={cleanPathname.includes(RouteNames.transacties)}>{t("sidebar.transacties")}</SidebarLink>
							<SidebarLink size={"sm"} to={`${RouteNames.bankzaken}/${RouteNames.bankafschriften}`} isActive={cleanPathname.includes(RouteNames.bankafschriften)}>{t("sidebar.bankafschriften")}</SidebarLink>
							<SidebarLink size={"sm"} to={`${RouteNames.bankzaken}/${RouteNames.betaalinstructies}`} isActive={cleanPathname.includes(RouteNames.betaalinstructies)}>{t("sidebar.betaalinstructies")}</SidebarLink>
						</Stack>
					</Box>
				</Stack>
				<SidebarLink to={RouteNames.rapportage} icon={RiBarChartFill} isActive={cleanPathname.startsWith(RouteNames.rapportage)}>{t("sidebar.rapportage")}</SidebarLink>
				<SidebarLink to={RouteNames.gebeurtenissen} icon={FiActivity} isActive={cleanPathname.startsWith(RouteNames.gebeurtenissen)}>{t("sidebar.gebeurtenissen")}</SidebarLink>
				<SidebarLink to={RouteNames.configuratie} icon={TiCog} isActive={cleanPathname.startsWith(RouteNames.configuratie)}>{t("sidebar.configuratie")}</SidebarLink>
			</Stack>
		</Stack>
	);
};

export default Sidebar;
