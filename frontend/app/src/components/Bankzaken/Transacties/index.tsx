import {Button, ButtonGroup, Checkbox, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {GetTransactiesDocument, useGetTransactiesQuery, useStartAutomatischBoekenMutation} from "../../../generated/graphql";
import {BanktransactieFilters} from "../../../models/models";
import {useStore} from "../../../store";
import Queryable from "../../../utils/Queryable";
import {createQueryParamsFromFilters, useReactSelectStyles} from "../../../utils/things";
import useHandleMutation from "../../../utils/useHandleMutation";
import usePagination from "../../../utils/usePagination";
import Page from "../../shared/Page";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import {defaultBanktransactieFilters} from "./defaultBanktransactieFilters";
import TransactiesList from "./TransactiesList";

const Transactions = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const [customPageSize, setCustomPageSize] = useState<number>(50);
	const {offset, total, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: customPageSize});
	const handleMutation = useHandleMutation();
	const filterModal = useDisclosure();
	const {store, updateStore} = useStore();
	const banktransactieFilters: BanktransactieFilters = store.banktransactieFilters || defaultBanktransactieFilters;

	useEffect(() => {
		// If no filters are set at all, reset to default filters.
		if (Object.keys(banktransactieFilters).length === 0) {
			updateStore("banktransactieFilters", defaultBanktransactieFilters);
		}
	}, [updateStore, banktransactieFilters]);

	const queryVariables = {
		offset,
		limit: customPageSize,
		filters: createQueryParamsFromFilters(banktransactieFilters),
	};

	const $transactions = useGetTransactiesQuery({
		fetchPolicy: "no-cache", // This "no-cache" is to make sure the list is refreshed after uploading a Bankafschrift in CsmUploadModal.tsx (24-02-2022)
		variables: queryVariables,
		onCompleted: data => {
			if (data && total !== data.bankTransactionsPaged?.pageInfo?.count) {
				setTotal(data.bankTransactionsPaged?.pageInfo?.count);
				goFirst();
			}

			updateStore("banktransactieQueryVariables", queryVariables);
		},
	});
	const [startAutomatischBoeken] = useStartAutomatischBoekenMutation({
		refetchQueries: [
			{query: GetTransactiesDocument, variables: queryVariables},
		],
	});

	const onClickStartBoekenButton = () => {
		handleMutation(startAutomatischBoeken(), t("messages.automatischBoeken.successMessage"));
	};

	const isCreditSelectOptions = [
		{key: 0, value: "all", label: t("filters.transactions.isCredit.all")},
		{key: 1, value: "income", label: t("filters.transactions.isCredit.income")},
		{key: 2, value: "expenses", label: t("filters.transactions.isCredit.expenses")},
	];

	return (
		<Page title={t("forms.bankzaken.sections.transactions.title")} right={(
			<Button size={"sm"} variant={"outline"} colorScheme={"primary"} onClick={onClickStartBoekenButton}>{t("global.actions.startBoeken")}</Button>
		)}>
			<Modal isOpen={filterModal.isOpen} onClose={filterModal.onClose}>
				<ModalOverlay />
				<ModalContent width={"100%"} maxWidth={500}>
					<ModalHeader>{t("sections.filterOptions.title")}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack>
							<FormControl>
								<FormLabel>{t("filters.transactions.type.title")}</FormLabel>
								<Checkbox isChecked={banktransactieFilters.onlyUnbooked} onChange={e => updateStore("banktransactieFilters", {
									...banktransactieFilters,
									onlyUnbooked: e.target.checked,
								})}>{t("filters.transactions.type.onlyUnbooked")}</Checkbox>
							</FormControl>

							<FormControl>
								<FormLabel>{t("filters.transactions.isCredit.title")}</FormLabel>
								<Select id={"tegenrekening"} isClearable={true} noOptionsMessage={() => t("filters.transactions.isCredit.choose")} maxMenuHeight={350}
									options={isCreditSelectOptions} value={banktransactieFilters.isCredit ? isCreditSelectOptions.find(o => o.value === banktransactieFilters.isCredit) : null}
									onChange={(result) => {
										updateStore("banktransactieFilters", {
											...banktransactieFilters,
											isCredit: result?.value as BanktransactieFilters["isCredit"],
										});
									}} styles={reactSelectStyles.default} />
							</FormControl>

							<HStack>
								<FormControl as={Stack} flex={1} justifyContent={"flex-end"}>
									<FormLabel>{t("global.period")}</FormLabel>
									<DatePicker selected={banktransactieFilters.dateRange?.from || null}
										dateFormat={"dd-MM-yyyy"} isClearable={true} selectsRange={true}
										startDate={banktransactieFilters.dateRange?.from} endDate={banktransactieFilters.dateRange?.through}
										onChange={(value: [Date, Date]) => {
											if (value) {
												const [from, through] = value;
												if (!from && !through) {
													updateStore("banktransactieFilters", {
														...banktransactieFilters,
														dateRange: undefined,
													});
												}
												else {
													updateStore("banktransactieFilters", {
														...banktransactieFilters,
														dateRange: {from, through},
													});
												}
											}
										}} customInput={(<Input />)} />
								</FormControl>
							</HStack>

							<FormControl>
								<FormLabel>{t("filters.transactions.pageSize")}</FormLabel>
								<ButtonGroup size={"sm"} isAttached>
									<Button colorScheme={customPageSize === 25 ? "primary" : "gray"} onClick={() => setCustomPageSize(25)}>25</Button>
									<Button colorScheme={customPageSize === 50 ? "primary" : "gray"} onClick={() => setCustomPageSize(50)}>50</Button>
									<Button colorScheme={customPageSize === 100 ? "primary" : "gray"} onClick={() => setCustomPageSize(100)}>100</Button>
									<Button colorScheme={customPageSize === 250 ? "primary" : "gray"} onClick={() => setCustomPageSize(250)}>250</Button>
								</ButtonGroup>
							</FormControl>
						</Stack>

					</ModalBody>
					<ModalFooter>
						<Button colorScheme={"primary"} onClick={filterModal.onClose}>{t("global.actions.close")}</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<SectionContainer>
				<Queryable query={$transactions} children={(data) => {
					const transacties = data?.bankTransactionsPaged?.banktransactions || [];
					const filtersActive = Object.values(queryVariables.filters).filter(q => ![null, undefined].includes(q as any)).length > 0;

					return (
						<Section title={t("transactionsPage.title")} helperText={t("transactionsPage.helperText")} right={(
							<HStack justify={"flex-end"} spacing={3}>
								{filtersActive && (
									<Text fontSize={"sm"}>{t("sections.filterOptions.filtersActiveWarning")}</Text>
								)}
								<Button size={"sm"} colorScheme={"primary"} variant={"outline"} onClick={() => filterModal.onOpen()}>
									{t("sections.filterOptions.title")}
								</Button>
							</HStack>
						)}>
							{transacties.length > 0 ? (
								<Stack>
									<TransactiesList transacties={transacties} />
									<HStack justify={"center"}>
										<PaginationButtons />
									</HStack>
								</Stack>
							) : (
								<Text>{t("messages.transactions.noResults")}</Text>
							)}
						</Section>
					);
				}} />
			</SectionContainer>
		</Page>
	);
};

export default Transactions;