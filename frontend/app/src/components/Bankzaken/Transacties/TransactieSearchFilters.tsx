import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Stack, VStack, FormControl, Button, ButtonGroup, FormLabel, RadioGroup, Radio } from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import { BankTransactionSearchFilter } from "../../../generated/graphql";

const TransactionsSearchFilters = (setPageSize, setFilters: (filters: BankTransactionSearchFilter) => void, currentFilters: BankTransactionSearchFilter, currentPageSize: number) => {
	const {t} = useTranslation();





    
	return (
        <h1>rgae</h1>
	);
};

export default TransactionsSearchFilters;

// {filterModal.isOpen && (
//     <Modal title={t("sections.filterOptions.title")} onClose={filterModal.onClose}>
//         <form onSubmit={(e) => {
//             e.preventDefault();
//             filterModal.onClose();
//         }}>
//             <Stack>
//                 <FormControl>
//                     <FormLabel>{t("filters.transactions.type.title")}</FormLabel>
//                     <Checkbox isChecked={banktransactieFilters.onlyUnbooked} onChange={e => setBanktransactieFilters({
//                         ...banktransactieFilters,
//                         onlyUnbooked: e.target.checked,
//                     })}>{t("filters.transactions.type.onlyUnbooked")}</Checkbox>
//                 </FormControl>

//                 <FormControl>
//                     <FormLabel>{t("filters.transactions.isCredit.title")}</FormLabel>
//                     <Select id={"tegenrekening"} isClearable={true} noOptionsMessage={() => t("filters.transactions.isCredit.choose")} maxMenuHeight={350}
//                         options={isCreditSelectOptions} value={banktransactieFilters.isCredit ? isCreditSelectOptions.find(o => o.value === banktransactieFilters.isCredit) : null}
//                         onChange={(result) => {
//                             setBanktransactieFilters({
//                                 ...banktransactieFilters,
//                                 isCredit: result?.value as BanktransactieFilters["isCredit"],
//                             });
//                         }} styles={reactSelectStyles.default} />
//                 </FormControl>



//                 <FormControl>
//                     <FormLabel>{t("filters.transactions.pageSize")}</FormLabel>
//                     <ButtonGroup size={"sm"} isAttached>
//                         <Button colorScheme={customPageSize === 25 ? "primary" : "gray"} onClick={() => setCustomPageSize(25)}>25</Button>
//                         <Button colorScheme={customPageSize === 50 ? "primary" : "gray"} onClick={() => setCustomPageSize(50)}>50</Button>
//                         <Button colorScheme={customPageSize === 100 ? "primary" : "gray"} onClick={() => setCustomPageSize(100)}>100</Button>
//                         <Button colorScheme={customPageSize === 250 ? "primary" : "gray"} onClick={() => setCustomPageSize(250)}>250</Button>
//                     </ButtonGroup>
//                 </FormControl>

//                 <Flex justify={"flex-end"}>
//                     <Button type={"submit"} colorScheme={"primary"}>{t("global.actions.save")}</Button>
//                 </Flex>
//             </Stack>
//         </form>
//     </Modal>
// )}