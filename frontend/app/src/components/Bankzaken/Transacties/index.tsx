import {ChevronDownIcon} from "@chakra-ui/icons";
import {
	Box,
	Button,
	ButtonGroup,
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useDisclosure,
} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {GetTransactiesDocument, useGetTransactiesQuery, useStartAutomatischBoekenMutation} from "../../../generated/graphql";
import {DateRange} from "../../../models/models";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import {useReactSelectStyles} from "../../../utils/things";
import useHandleMutation from "../../../utils/useHandleMutation";
import usePagination from "../../../utils/usePagination";
import Page from "../../shared/Page";
import DeadEndPage from "../../shared/DeadEndPage";
import Section from "../../shared/Section";
import {TransactionsContext} from "./context";
import TransactiesList from "./TransactiesList";

type Filters = {
	onlyUnbooked?: boolean,
	isCredit: "income" | "expenses" | "all",
	dateRange?: DateRange,
	bedragRange?: [number, number],
	tegenrekeningIban?: string,
}

const defaultFilters: Filters = {
	onlyUnbooked: true,
	isCredit: "all",
};

/**
 * Todo: Wanneer er een filter actief is, niet de hint "Voeg transacties toe".
 */

const Transactions = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const [customPageSize, setCustomPageSize] = useState<number>(50);
	const {offset, total, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: customPageSize});
	const [filters, setFilters] = useState<Filters>(defaultFilters);
	const handleMutation = useHandleMutation();
	const filterModal = useDisclosure();

	const queryVariables = {
		offset,
		limit: customPageSize,
		filters: {
			isGeboekt: filters.onlyUnbooked ? false : undefined,
			isCredit: {
				all: undefined,
				income: true,
				expenses: false,
			}[filters.isCredit],
			...filters.dateRange && filters.dateRange.from && filters.dateRange.through && {
				transactieDatum: {
					BETWEEN: [d(filters.dateRange.from).format("YYYY-MM-DD"), d(filters.dateRange.through).format("YYYY-MM-DD") || undefined],
				},
			},
			...filters.tegenrekeningIban && {
				tegenRekening: {
					EQ: filters.tegenrekeningIban,
				},
			},
			...filters.bedragRange && {
				bedrag: {
					BETWEEN: filters.bedragRange,
				},
			},
		},
	};

	const $transactions = useGetTransactiesQuery({
		variables: queryVariables,
		onCompleted: data => {
			if (data && total !== data.bankTransactionsPaged?.pageInfo?.count) {
				setTotal(data.bankTransactionsPaged?.pageInfo?.count);
				goFirst();
			}
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
		<TransactionsContext.Provider value={{queryVariables}}>
			<Page title={t("forms.bankzaken.sections.transactions.title")} menu={(
				<Menu>
					<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
					<MenuList>
						<MenuItem onClick={onClickStartBoekenButton}>{t("global.actions.startBoeken")}</MenuItem>
					</MenuList>
				</Menu>
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
									<Checkbox isChecked={filters.onlyUnbooked} onChange={e => setFilters(f => ({
										...f,
										onlyUnbooked: e.target.checked,
									}))}>{t("filters.transactions.type.onlyUnbooked")}</Checkbox>
								</FormControl>

								<FormControl>
									<FormLabel>{t("filters.transactions.isCredit.title")}</FormLabel>
									<Select id={"tegenrekening"} isClearable={true} noOptionsMessage={() => t("filters.transactions.isCredit.choose")} maxMenuHeight={350}
										options={isCreditSelectOptions} value={filters.isCredit ? isCreditSelectOptions.find(o => o.value === filters.isCredit) : null}
										onChange={(result) => {
											setFilters(f => ({
												...f,
												isCredit: result?.value as Filters["isCredit"],
											}));
										}} styles={reactSelectStyles.default} />
								</FormControl>

								<HStack>
									<FormControl as={Stack} flex={1} justifyContent={"flex-end"}>
										<FormLabel>{t("global.period")}</FormLabel>
										<DatePicker selected={filters.dateRange?.from || null}
											dateFormat={"dd-MM-yyyy"} isClearable={true} selectsRange={true}
											startDate={filters.dateRange?.from} endDate={filters.dateRange?.through}
											onChange={(value: [Date, Date]) => {
												if (value) {
													const [from, through] = value;
													if (!from && !through) {
														setFilters(f => ({
															...f,
															dateRange: undefined,
														}));
													}
													else {
														setFilters(f => ({
															...f,
															dateRange: {from, through},
														}));
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

				<Section spacing={5}>
					<Queryable query={$transactions} children={(data) => {
						const transacties = data?.bankTransactionsPaged?.banktransactions || [];
						const nFiltersActive = Object.values(queryVariables.filters).filter(q => ![null, undefined].includes(q as any)).length;

						return (<>
							<HStack justify={"flex-end"}>
								<Button size={"sm"} colorScheme={"primary"} variant={"outline"} onClick={() => filterModal.onOpen()}>{`${t("sections.filterOptions.title")} (${nFiltersActive})`}</Button>
							</HStack>
							{transacties.length > 0 ? (
								<TransactiesList transacties={transacties} />
							) : (
								<DeadEndPage message={t("messages.transactions.noResults")} />
							)}
							<HStack justify={"center"}>
								<Box><PaginationButtons /></Box>
							</HStack>
						</>);
					}} />
				</Section>
			</Page>
		</TransactionsContext.Provider>
	);
};

export default Transactions;