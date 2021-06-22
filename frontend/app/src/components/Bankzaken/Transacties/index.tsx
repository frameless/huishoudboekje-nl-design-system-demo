import {AddIcon, ChevronDownIcon} from "@chakra-ui/icons";
import {Button, ButtonGroup, Checkbox, FormControl, FormLabel, HStack, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Select from "react-select";
import Routes from "../../../config/routes";
import {useGetTransactiesQuery, useStartAutomatischBoekenMutation} from "../../../generated/graphql";
import {DateRange} from "../../../models/models";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import {useReactSelectStyles} from "../../../utils/things";
import useHandleMutation from "../../../utils/useHandleMutation";
import usePagination from "../../../utils/usePagination";
import DeadEndPage from "../../DeadEndPage";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import {TransactionsContext} from "./context";
import TransactiesList from "./TransactiesList";

type Filters = {
	onlyUnbooked?: boolean,
	isCredit?: "income" | "expenses" | "all",
	dateRange?: DateRange,
	bedragRange?: [number, number],
	tegenrekeningIban?: string,
}

const defaultFilters: Filters = {
	onlyUnbooked: false,
	isCredit: "all",
};

const Transactions = () => {
	const {t} = useTranslation();
	const reactSelectStyles = useReactSelectStyles();
	const [customPageSize, setCustomPageSize] = useState<number>(50);
	const {offset, total, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: customPageSize});
	const [filters, setFilters] = useState<Filters>(defaultFilters);
	const handleMutation = useHandleMutation();

	const $transactions = useGetTransactiesQuery({
		fetchPolicy: "no-cache",
		variables: {
			offset,
			limit: customPageSize,
			filters: {
				isGeboekt: filters.onlyUnbooked ? false : undefined,
				isCredit: {
					all: undefined,
					income: true,
					expenses: false,
				}[filters.isCredit || "all"],
				...filters.dateRange && {
					transactieDatum: {
						BETWEEN: [d(filters.dateRange.from).format("YYYY-MM-DD"), d(filters.dateRange.through).format("YYYY-MM-DD")],
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
		},
		onCompleted: data => {
			if (total !== data.bankTransactionsPaged?.pageInfo?.count) {
				setTotal(data.bankTransactionsPaged?.pageInfo?.count);
				goFirst();
			}
		},
	});

	const [startAutomatischBoeken] = useStartAutomatischBoekenMutation();
	const onClickStartBoekenButton = () => {
		handleMutation(startAutomatischBoeken(), t("messages.automatischBoeken.successMessage"), () => {
			$transactions.refetch();
		});
	};

	const isCreditSelectOptions = [
		{key: 0, value: "all", label: t("filters.transactions.isCredit.all")},
		{key: 1, value: "income", label: t("filters.transactions.isCredit.income")},
		{key: 2, value: "expenses", label: t("filters.transactions.isCredit.expenses")},
	];

	return (
		<TransactionsContext.Provider value={{refetch: $transactions.refetch}}>
			<Page title={t("forms.banking.sections.transactions.title")} menu={(
				<Menu>
					<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
					<MenuList>
						<MenuItem onClick={onClickStartBoekenButton}>{t("actions.startBoeken")}</MenuItem>
					</MenuList>
				</Menu>
			)}>
				<Section>
					<Stack>
						<HStack>
							<FormControl>
								<FormLabel>{t("actions.filter")}</FormLabel>
								<Checkbox isChecked={filters.onlyUnbooked} onChange={e => setFilters(f => ({
									...f,
									onlyUnbooked: e.target.checked,
								}))}>{t("filters.transactions.onlyUnbooked")}</Checkbox>
							</FormControl>

							<FormControl>
								<FormLabel>{t("filters.transactions.isCredit.title")}</FormLabel>
								<Select id="tegenrekening" isClearable={true} noOptionsMessage={() => t("filters.transactions.isCredit.choose")} maxMenuHeight={350}
									options={isCreditSelectOptions} value={filters.isCredit ? isCreditSelectOptions.find(o => o.value === filters.isCredit) : null}
									onChange={(result) => {
										setFilters(f => ({
											...f,
											isCredit: result?.value as Filters["isCredit"],
										}));
									}} styles={reactSelectStyles.default} />
							</FormControl>
						</HStack>

						<HStack>
							<FormControl as={Stack} flex={1} justifyContent={"flex-end"}>
								<FormLabel>{t("forms.common.fields.startDate")}</FormLabel>
								<DatePicker selected={d(filters.dateRange?.from).isValid() ? d(filters.dateRange?.from).toDate() : null}
									dateFormat={"dd-MM-yyyy"}
									onChange={(value: Date) => {
										if (value) {
											setFilters(f => ({
												...f,
												dateRange: {
													...f.dateRange,
													from: value,
													...filters.dateRange?.through && d(filters.dateRange.through).isBefore(value) && {
														through: value,
													},
												},
											}));
										}
									}} customInput={(<Input value={filters.dateRange?.from ? d(filters.dateRange.from).format("L") : ""} />)} />
							</FormControl>
							<FormControl as={Stack} flex={1}>
								<FormLabel>{t("forms.common.fields.endDate")}</FormLabel>
								<DatePicker selected={d(filters.dateRange?.through).isValid() ? d(filters.dateRange?.through).toDate() : null}
									dateFormat={"dd-MM-yyyy"}
									onChange={(value: Date) => {
										if (value) {
											setFilters(f => ({
												...f,
												dateRange: {
													...f.dateRange,
													through: value,
													...filters.dateRange?.from && d(filters.dateRange.from).isAfter(value) && {
														from: value,
													},
												},
											}));
										}
									}} customInput={(<Input value={filters.dateRange?.through ? d(filters.dateRange.through).format("L") : ""} />)} />
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
				</Section>

				<Section spacing={5}>
					<HStack justify={"center"}>
						<PaginationButtons />
					</HStack>
					<Queryable query={$transactions} children={(data) => {
						const transacties = data.bankTransactionsPaged?.banktransactions || [];

						/* If no transacties were found */
						if (transacties.length === 0) {
							return (
								<DeadEndPage message={t("messages.transactions.addHint")}>
									<Button size={"sm"} colorScheme={"primary"} variant={"solid"} leftIcon={<AddIcon />}
										as={NavLink} to={Routes.Bankafschriften}>{t("actions.add")}</Button>
								</DeadEndPage>
							);
						}

						return (
							<TransactiesList transacties={transacties} />
						);
					}} />
				</Section>
			</Page>
		</TransactionsContext.Provider>
	);
};

export default Transactions;