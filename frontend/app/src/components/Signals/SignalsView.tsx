import {useTranslation} from "react-i18next";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import SignalsFilters from "./SignalsFilters";
import { GetSignalsPagedQuery, SignalData, SignalFilter, SignalsPagedResponse, useGetSignalsPagedQuery } from "../../generated/graphql";
import { useState } from "react";
import SignalsList from "./SignalsList";
import { Box, Divider, HStack, IconButton, Spinner, Stack, Text } from "@chakra-ui/react";
import usePagination from "../../utils/usePagination";
import Queryable, { Loading } from "../../utils/Queryable";
import { ActiveSwitch } from "../Burgers/BurgerDetail/BurgerSignalenView";
import { RepeatIcon } from "@chakra-ui/icons";
import d from "../../utils/dayjs";
import ListInformationRow from "../shared/ListInformationRow";

const SignalsView = () => {
	const {t} = useTranslation();
	const pageSize = 25;
    const {offset, total, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: pageSize});
	const [loading, setLoading] = useState<boolean>(false);
	const [timeLastUpdate, setTimeLAstUpdate] = useState<Date | undefined>(undefined);

	//Filter states are here to prevent infinite re-render loop
	const [filterByActive, setFilterByActive]  = useState<ActiveSwitch>({active: true, inactive: false});
	const [filterByCitizens, setFilterByCitizens] = useState<string[]>([]);


	const buildFilter = () => {
        const filter: SignalFilter = {}
        if(filterByCitizens.length > 0){
            filter.citizenIds = filterByCitizens
        }
        if(!filterByActive.active || !filterByActive.inactive){
            if(filterByActive.active){
                filter.isActive = true
            }
            else if(filterByActive.inactive){
                filter.isActive = false
            }
        }
		return filter;
	};

	const $signals = useGetSignalsPagedQuery({
		fetchPolicy: "no-cache",
		variables: {
			input:{
				filter: buildFilter(),
				page: {
					skip: offset <= 1 ? 0 : offset,
					take: pageSize
				}
			}
		},onCompleted: (data) =>{
			setTotal(data.Signals_GetPaged?.PageInfo?.total_count)
			setTimeLAstUpdate(new Date())
		}
	});

	const onUpdate = () =>{
		goFirst()
		setLoading(true)
		$signals.refetch({
			input:{
				filter: buildFilter(),
				page: {
					skip: 0,
					take: pageSize
				}
			}
		}).then((data)=>{
			setLoading(false)
			setTotal(data.data.Signals_GetPaged?.PageInfo?.total_count)
			setTimeLAstUpdate(new Date())
		})
	}

	return (
		<Page title={t("signals.signals")}>
			<SectionContainer>
				<Section title={t("signals.title")} helperText={t("signals.helperText")} left={
					<SignalsFilters 
						goFirst={goFirst}
						filterByCitizens={filterByCitizens} 
						setFilterByCitizens={setFilterByCitizens} 
						setFilterByActive={setFilterByActive}>
					</SignalsFilters>
				}>
					<ListInformationRow
						onUpdate={onUpdate}
						message={t("signals.count")}
						noItemsMessage={t("signals.noResults")}
						total={total}
						timeLastUpdate={timeLastUpdate}
						query={$signals}
						loading={$signals.loading || loading}>
					</ListInformationRow>
					<Divider></Divider>
					{$signals.loading || loading ? <Loading/> : 
						<Queryable query={$signals} loading={$signals.loading} children={(data: GetSignalsPagedQuery) => {
								const signals: SignalData[] = data.Signals_GetPaged?.data ?? [];
								return (
									<SignalsList signals={signals} onUpdate={onUpdate} />
								);
							}} />
						}
                    <HStack justify={"center"}>
                        <PaginationButtons />
                    </HStack>
				</Section>
			</SectionContainer>
		</Page>
	);
};

export default SignalsView;