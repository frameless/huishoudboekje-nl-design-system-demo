import {FormControl} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {GetTransactieDocument, Rubriek, useCreateJournaalpostGrootboekrekeningMutation, useGetRubriekenQuery} from "../../../../generated/graphql";
import useToaster from "../../../../utils/useToaster";
import {useReactSelectStyles} from "../../../../utils/things";
import Queryable from "../../../../utils/Queryable";

const BookingSectionRubriek = ({transaction}) => {
	const reactSelectStyles = useReactSelectStyles();
	const toast = useToaster();
	const {t} = useTranslation();

    const $rubrieken = useGetRubriekenQuery()

    const [createJournaalpostGrootboekrekening] = useCreateJournaalpostGrootboekrekeningMutation({
		refetchQueries: [
			{query: GetTransactieDocument, variables: {id: transaction.id}},
		],
	});
	
	return (
		<Queryable data-test="select.bookingSection.rubric" query={$rubrieken} children={(data => {
			const rubrieken: Rubriek[] = data.rubrieken;

            const onSelectRubriek = (val) => {
                const grootboekrekeningId = rubrieken.find(rubriek => rubriek.grootboekrekening?.id === val.value)?.grootboekrekening?.id;
                const transactionId = transaction?.id;
        
                if (transactionId && grootboekrekeningId) {
                    createJournaalpostGrootboekrekening({
                        variables: {transactionId, grootboekrekeningId},
                    }).then(() => {
                        toast({success: t("messages.journals.createSuccessMessage")});
                    }).catch(err => {
                        console.error(err);
                        toast({error: err.message});
                    });
                }
            };

            const rubrieken_select_options = rubrieken.filter(rubriek => rubriek.grootboekrekening && rubriek.grootboekrekening.id).sort((a: Rubriek, b: Rubriek) => {
                return a.naam && b.naam && a.naam < b.naam ? -1 : 1;
            }).map((rubriek: Rubriek) => ({
                key: rubriek.id,
                label: rubriek.naam,
                value: rubriek.grootboekrekening!.id,
            }))

			return (
                <FormControl>
                    <Select onChange={onSelectRubriek} options={rubrieken_select_options} isClearable={true} noOptionsMessage={() => t("select.noOptions")}
                        maxMenuHeight={350} styles={reactSelectStyles.default} />
                </FormControl>
			);
		})} />
	);
};

export default BookingSectionRubriek;
