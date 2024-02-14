import {useTranslation} from "react-i18next";
import { Afdeling, Afspraak, Burger, GetTransactieDocument, Organisatie, Rekening, useCreateJournaalpostAfspraakMutation, useGetBurgersAndOrganisatiesAndRekeningenQuery } from "../../../../generated/graphql";
import Queryable, { Loading } from "../../../../utils/Queryable";
import { Stack, Table, Thead, Tr, Th, Tbody, HStack, Text } from "@chakra-ui/react";
import SelectAfspraakOption from "../../../shared/SelectAfspraakOption";
import useToaster from "../../../../utils/useToaster";
import usePagination from "../../../../utils/usePagination";
import React, { useState } from "react";
import BookingSectionAfspraakFilters from "./BookingSectionAfsrpaakFilters";

// commented this for if we need it in future use
//
// export function isSuggestie(suggestie: Afspraak, transaction: BankTransaction): boolean {
// 	//Only check on zoektermen because the backend checks on iban (on organisation level)
// 	if (suggestie.zoektermen?.every(zoekterm => transaction.informationToAccountOwner?.includes(zoekterm))) {
// 		return true
// 	}
// 	return false
// }

const BookingSectionAfspraak = ({transaction}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [isLoading, setIsLoading] = React.useState(true);
    const onPaginationClick = () => {
        setIsLoading(true)
    }
    const {offset, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: 25}, onPaginationClick);

    const reset = ()=>{
        setIsLoading(true)
        goFirst()
    }

	const [afspraken, setAfspraken] = useState<Afspraak[]>([]);
	const updateAfspraken = (newAfspraken: Afspraak[], total) =>{
		setAfspraken(newAfspraken)
        setTotal(total)
        setIsLoading(false)
	}

    const [createJournaalpostAfspraak] = useCreateJournaalpostAfspraakMutation({
		refetchQueries: [
			{query: GetTransactieDocument, variables: {id: transaction.id}},
		],
	});

	const onSelectAfspraak = (afspraak: Afspraak) => {
		const transactionId = transaction?.id;
		const afspraakId = afspraak.id;

		if (transactionId && afspraakId) {
			createJournaalpostAfspraak({
				variables: {transactionId, afspraakId},
			}).then(() => {
				toast({success: t("messages.journals.createSuccessMessage")});
			}).catch(err => {
				console.error(err);
                if(err.message.includes("(some) transactions have unknown ibans ")){
                    toast({error: t("messages.journals.errors.unknownTransactionIban")})
                } else {
                    toast({error: err.message});
                }
			});
		}
	};

    const $filter_data = useGetBurgersAndOrganisatiesAndRekeningenQuery({
        variables: {iban: transaction.tegenRekeningIban},
        onCompleted: () => {
			setIsLoading(false)
		},
    })

	return (
		<Queryable query={$filter_data} options={{hidePreviousResults: true}} children={(data) => {
            const burgers: Burger[] = data.burgers || [];
            const organisaties: Organisatie[] = data.organisaties || [];
            const rekeningen: Rekening[] = data.rekeningen || [];
            const expectedTransactionAfdeling: Afdeling[] = data.afdelingenByIban || []
            const expectedTransactionOrganisationsIds: number[] = Array.from(new Set(expectedTransactionAfdeling.map(afdeing => afdeing.organisatieId ?? -1)))
            return (
                <Stack spacing={2}>
                    <BookingSectionAfspraakFilters organisaties={organisaties} burgers={burgers} rekeningen={rekeningen} updateAfspraken={updateAfspraken} reset={reset}offset={offset} expectedTransactionOrganisation={expectedTransactionOrganisationsIds}></BookingSectionAfspraakFilters>
                    {
                        isLoading ? (
                            <Loading></Loading>
                        ) : (
                            afspraken.length === 0 ? (
                                <Text>{t("bookingSection.noResults")}</Text>
                            ) : (
                                <Table size={"sm"}>
                                    <Thead>
                                        <Tr>
                                            <Th>{t("burger")}</Th>
                                            <Th>{t("afspraken.omschrijving")}</Th>
                                            <Th>{t("afspraken.zoekterm")}</Th>
                                            <Th />
                                            <Th>{t("bedrag")}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {afspraken.map(afspraak => (
                                            <SelectAfspraakOption key={afspraak.id} afspraak={afspraak} onClick={() => onSelectAfspraak(afspraak)} />
                                        ))}
                                    </Tbody>
                                </Table>
                            )
                        )
                    }
                    <HStack justify={"center"}>
                        <PaginationButtons />
                    </HStack>
                </Stack>
            );
        }} />
	);
};

export default BookingSectionAfspraak;
