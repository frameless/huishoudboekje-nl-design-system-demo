import {CheckboxGroup, Button, HStack, Stack, Box, Stat, StatHelpText, StatNumber,FormControl, Checkbox, Skeleton, useDisclosure, AlertDialogOverlay, AlertDialog, AlertDialogContent, AlertDialogBody, AlertDialogCloseButton, AlertDialogFooter, AlertDialogHeader, Alert, AlertIcon} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Dictionary, useReactSelectStyles} from "../../../../utils/things";
import {PaymentRecord, useCreatePaymentExportMutation} from "../../../../generated/graphql";
import PaymentRecordAccordion from "./PaymentRecordAccordion";
import Section from "../../../shared/Section";
import usePagination from "../../../../utils/usePagination";
import {getCitizenWithHHBKey, getUniqueCitizenKeys, groupPaymentRecordsByCitizen, orderByCitizenField} from "../utils";
import Select from "react-select";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../../config/routes";
import PaymentRecordsSortingButtons, { SortingValue, startValuesSorting } from "../sortingButtons";
import useToaster from "../../../../utils/useToaster";

type PaymentRecordProps = {
	startDate: number | undefined,
	endDate: number | undefined,
	paymentRecords: PaymentRecord[]
	loading: boolean,
	count: number,
	inCache,
	updateInCache,
	onClickSelectAll,
	onChangeSelectedPaymentRecords,
	selectedPaymentRecords
};

const PaymentRecordList: React.FC<PaymentRecordProps> = ({selectedPaymentRecords, onChangeSelectedPaymentRecords, onClickSelectAll, inCache, updateInCache, loading, startDate, endDate, paymentRecords, count}) => {
	const {t} = useTranslation(["paymentrecords"]);
	const reactSelectStyles = useReactSelectStyles();
	const navigate = useNavigate();
	const toast = useToaster();

	const {offset, total, page, pageSize, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: 25});
	
	const { isOpen, onOpen, onClose } = useDisclosure()
	const cancelRef = useRef<HTMLButtonElement | null>(null);

	const [createPaymentExport] = useCreatePaymentExportMutation();

	const [isExporting, setIsExporting] = useState(false);
	const onClickSubmit = (e) => {
		e.preventDefault();
		setIsExporting(true)
		createPaymentExport({
			variables: {
				input: {
					recordIds: selectedPaymentRecords,
					endDate: endDate,
					startDate: startDate
				}
			},
			onCompleted: () => {
				navigate(AppRoutes.Betaalinstructies)
			},
			onError: (error) => {
				if(error.message.includes("No account info set in configuration")){
					toast({error: t("error.account")});
				}else {
					toast({error: t("error.global")});
				}
				setIsExporting(false)
			}
		})
	}


	const [sortingFilter, setSortingFilter] = useState(startValuesSorting)
	const handleSortingButtonClick = (sortValue: SortingValue) => {
		setSortingFilter(sortValue)
		setGroupedPaymentRecords(getGroupedAndFilteredPaymentRecords(filterCitizen, sortValue.orderField, sortValue.ascending))
	};

	const disctinctCitizens = getUniqueCitizenKeys(paymentRecords)
	const selected: string[] = []

	const [filterCitizen, setFilterCitizen] = useState(selected)
	const [groupedPaymentRecords, setGroupedPaymentRecords] = useState(getGroupedAndFilteredPaymentRecords(filterCitizen, sortingFilter.orderField, sortingFilter.ascending))


	function onSelectCitizen(value) {
		const result: string[] = []
		value.forEach(selected => {
			result.push(selected.value)
		});
		setFilterCitizen(result)
		setGroupedPaymentRecords(getGroupedAndFilteredPaymentRecords(result, sortingFilter.orderField, sortingFilter.ascending))
	}

	function getGroupedAndFilteredPaymentRecords(filter, orderField, ascending) {
		if (filter.length == 0) {
			return groupPaymentRecordsByCitizen(paymentRecords, orderByCitizenField(orderField, ascending))
		}
		else {
			return groupPaymentRecordsByCitizen(paymentRecords.filter(record => filter.includes(getCitizenWithHHBKey(record.agreement?.burger))), orderByCitizenField(orderField, ascending))
		}
	}


	const [selectedItemsPerCitizen, setSelectedItemsPerCitizen] = useState(getInitial())


	function getInitial() {
		const keys = groupedPaymentRecords.GetKeys();
		const dict = new Dictionary<string>()
		keys.forEach((key) => {
			groupedPaymentRecords.Entries[key].forEach((record) => {
				dict.Add(key, record.id)
			})
		})
		return dict
	}

	function onSwitchAll(value) {
		if (selectedPaymentRecords.length == count) {
			setSelectedItemsPerCitizen(new Dictionary<string>())
		}
		else (
			setSelectedItemsPerCitizen(getInitial())
		)
		onClickSelectAll()
	}


	return (
		<>
			<Section>
				<HStack w={"100%"} justify={"space-between"}>
					<FormControl w={"70%"}>
						<Select onChange={onSelectCitizen} isClearable={true}
							styles={reactSelectStyles.default}
							isMulti
							options={disctinctCitizens.map(citizen => ({
								label: citizen,
								value: citizen
							}))}
							placeholder={t("filter.allBurgers")}
						/>
					</FormControl>
					<Box w={"120px"}>
						<Stat textAlign={"center"}>
							<StatHelpText>{count == selectedPaymentRecords.length ? t("creationPage.deselect.all") : t("creationPage.select.all")}</StatHelpText>
							<Checkbox data-test="checkbox.toggleAll" isChecked={count == selectedPaymentRecords.length ? true : false} onChange={onSwitchAll}></Checkbox>
						</Stat>
					</Box>


				</HStack>
				<HStack marginTop={5} justify={"space-between"}>
					<PaymentRecordsSortingButtons onClick={handleSortingButtonClick}/>
					<Box textAlign={"center"} w={"120px"}>
						<Stat size={"sm"}>
							<StatHelpText fontSize={"small"}>{t("creationPage.selected")}</StatHelpText>
							<StatNumber data-test="text.amountSelected">{selectedPaymentRecords.length} / {count}</StatNumber>
						</Stat>
					</Box>
				</HStack>
				<Stack>
					{loading &&
						<>
							<Skeleton marginBottom={2} />
							<Skeleton marginBottom={2} />
							<Skeleton marginBottom={2} />
							<Skeleton marginBottom={2} />
							<Skeleton marginBottom={2} />
						</>
					}
					{paymentRecords != undefined && !loading && paymentRecords.length > 0 &&
						<CheckboxGroup
							colorScheme="blue"
							value={selectedPaymentRecords}
							onChange={(value) => onChangeSelectedPaymentRecords(value)}>
							<PaymentRecordAccordion groupedPaymentRecords={groupedPaymentRecords} selectedItemsPerCitizen={selectedItemsPerCitizen} setSelectedItemsPerCitizen={setSelectedItemsPerCitizen}
								inCache={inCache} updateInCache={updateInCache} pageSize={pageSize} page={page} setTotal={setTotal} endDate={endDate} />
						</CheckboxGroup>
					}
				</Stack>
				<HStack marginTop={5} w="100%" justify={"end"} paddingTop={10} spacing={"4"}>
					<Button isDisabled={selectedPaymentRecords.length === 0} type={"submit"} data-test="buttonModal.submit" onClick={onOpen} colorScheme={"primary"}>{t("export.all")}</Button>
				</HStack>
			</Section >
			<HStack justify={"center"}>
				<PaginationButtons />
			</HStack>
			<AlertDialog
				motionPreset='slideInBottom'
				leastDestructiveRef={cancelRef}
				onClose={onClose}
				isOpen={isOpen}
				isCentered
			>
				<AlertDialogOverlay />
				<AlertDialogContent>
				<AlertDialogHeader>{t("confirmAlert.title")}</AlertDialogHeader>
				{filterCitizen.length !== 0 ? 
					<Alert status='info'>
						<AlertIcon />
						{t("confirmAlert.info")}
					</Alert> : null}
				<AlertDialogBody>{t("confirmAlert.message", {"selected": selectedPaymentRecords.length, "total": count})}</AlertDialogBody>
				<AlertDialogFooter>
					<HStack>
						<Button ref={cancelRef} onClick={onClose}>{t("confirmAlert.cancel")}</Button>
						<Button type={"submit"} data-test="buttonModal.confirmSubmit" isLoading={isExporting} onClick={(e) => onClickSubmit(e)} colorScheme={"primary"}>{t("confirmAlert.confirm")}</Button>
					</HStack>
				</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default PaymentRecordList;


