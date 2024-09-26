import {Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement, List, ListIcon, ListItem} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {MdCheckCircle, MdReportProblem} from "react-icons/md";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, CreateAfspraakMutationVariables, GetBurgerDetailsDocument, useCreateAfspraakMutation} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import useToaster from "../../../utils/useToaster";
import BackButton from "../../shared/BackButton";
import Page from "../../shared/Page";
import SectionContainer from "../../shared/SectionContainer";
import ZoektermenList from "../../shared/ZoektermenList";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext from "../EditAfspraak/context";
import {FollowUpAfspraakFormContextType} from "./context";
import {AiOutlineTag} from "react-icons/ai";

type FollowUpAfspraakProps = {
    data,

};

const FollowUpAfspraakPage: React.FC<FollowUpAfspraakProps> = ({data}) => {
    const location = useLocation();
    const isCopy = location.pathname.endsWith("/kopie")

    const {t} = useTranslation();
    const toast = useToaster();
    const [createAfspraak] = useCreateAfspraakMutation();
    const navigate = useNavigate();
    const [termAlreadyAdded, setTermAlreadyAdded] = useState(false)

    const afspraak: Afspraak = data.afspraak;
    const [zoekterm, setZoekterm] = useState<string>();
    const [searchTerms, setSearchTerms] = useState<string[]>(afspraak.zoektermen || [])

    function onChangeInput(value) {
        setTermAlreadyAdded(false)
        setZoekterm(value)
    }

    function addAdditionalSearchTerm() {
        if (zoekterm == "" || zoekterm == undefined || zoekterm == '') {
            return;
        }

        if (searchTerms.includes(zoekterm || "")) {
            setTermAlreadyAdded(true)
            return
        }
        setSearchTerms(searchTerms.concat([zoekterm || ""]));
        setZoekterm("");
    }

    function removeFromSearchTerms(term) {
        setSearchTerms(searchTerms.filter(item => item != term))
    }


    // TODO: Make this one call when refactoring the new HHBService
    const createFollowupAfspraak = async (input: Omit<CreateAfspraakMutationVariables["input"], "burgerId">) => {
        if (!afspraak.burger?.id) {
            return;
        }

        await createAfspraak({
            variables: {
                input: {
                    burgerId: afspraak.burger.id,
                    ...input,
                    zoektermen: searchTerms
                },
            },
            refetchQueries: [{query: GetBurgerDetailsDocument, variables: {id: afspraak.burger?.id}}]
        }).then((result) => {
            toast({
                success: t("messages.createAfspraakSuccess"),
            });
            navigate(AppRoutes.ViewAfspraak(String(result.data?.createAfspraak?.afspraak?.id)), {replace: true});
        })
    }

    const validFromDay = isCopy ? d() : d(afspraak.validThrough, "YYYY-MM-DD").add(1, "day")

    const values: Partial<CreateAfspraakMutationVariables["input"]> = {
        bedrag: parseFloat(afspraak.bedrag),
        credit: afspraak.credit,
        rubriekId: afspraak.rubriek?.id,
        omschrijving: isCopy ? "KOPIE - " + afspraak.omschrijving : afspraak.omschrijving,
        afdelingId: afspraak.afdeling?.id,
        tegenRekeningId: afspraak.tegenRekening?.id,
        postadresId: afspraak.postadres?.id,
        validFrom: validFromDay.format("YYYY-MM-DD"),
    };

    const ctxValue: FollowUpAfspraakFormContextType = {
        rubrieken: data.rubrieken || [],
        organisaties: data.organisaties || [],
    };

    return (
        <Page title={isCopy ? t("afspraken.copy.title") : t("afspraken.vervolgAfspraak.title")} backButton={<BackButton to={AppRoutes.ViewAfspraak(String(afspraak.id))} />}>
            {((afspraak.zoektermen || []).length > 0 || afspraak.betaalinstructie) && (
                <SectionContainer>
                    <List spacing={2}>
                        {searchTerms && searchTerms.length > 0 && (
                            <ListItem justifyContent={"center"}>
                                <ListIcon as={MdCheckCircle} color={"green.500"} w={5} h={5} verticalAlign={"middle"} />
                                {t("afspraken.vervolgAfspraak.zoektermenHelperText")}
                                <ZoektermenList zoektermen={searchTerms || []} onClickDelete={(value) => removeFromSearchTerms(value)} />
                            </ListItem>
                        )}

                        <FormControl w={700} isInvalid={(termAlreadyAdded)}>
                            <FormLabel>{t("afspraken.zoektermen")}</FormLabel>
                            <InputGroup size={"md"}>
                                <InputLeftElement pointerEvents={"none"} color={"gray.300"} fontSize={"1.2em"}>
                                    <AiOutlineTag />
                                </InputLeftElement>
                                <Input
                                    autoComplete="no"
                                    aria-autocomplete="none"
                                    id={"zoektermen"}
                                    onChange={e => onChangeInput(e.target.value)}
                                    value={zoekterm || ""}
                                />

                                <InputRightElement width={"auto"} pr={1}>
                                    <Button type={"submit"} variant={"outline"} size={"sm"} colorScheme={"primary"} onClick={addAdditionalSearchTerm}>{t("global.actions.add")}</Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{termAlreadyAdded ? t("afspraken.vervolgAfspraak.searchTermExists") : t("afspraken.vervolgAfspraak.invalidSearchTerm")}</FormErrorMessage>
                        </FormControl>

                        {afspraak.betaalinstructie && (
                            <ListItem justifyContent={"center"}>
                                <ListIcon as={MdReportProblem} color={"orange.500"} w={5} h={5} verticalAlign={"middle"} />
                                {t("afspraken.vervolgAfspraak.betaalinstructieHelperText")}
                            </ListItem>
                        )}
                    </List>
                </SectionContainer>
            )}

            <AfspraakFormContext.Provider value={ctxValue}>
                <AfspraakForm burgerRekeningen={afspraak.burger?.rekeningen || []} organisatie={afspraak.afdeling?.organisatie} values={values} onSubmit={createFollowupAfspraak} />
            </AfspraakFormContext.Provider>
        </Page>
    );
}

export default FollowUpAfspraakPage