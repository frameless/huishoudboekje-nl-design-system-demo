import { Button, HStack, Skeleton, Stack} from "@chakra-ui/react";
import SectionContainer from "../../shared/SectionContainer";
import { useTranslation } from "react-i18next";


const PaymentExportOverviewSkeleton = () => {
	const {t} = useTranslation();
    const skeletonHeight = "15px"
    const skeletonnWidth = "300px"
    const skeletonnWidthLarge = "600px"

	const fields: JSX.Element[] = [];
		for (let i = 1; i <= 3; i++) {
		fields.push(
            <HStack justify={"space-between"}>
                <Stack flex={2} spacing={2}>
                    <Skeleton height={skeletonHeight} width={skeletonnWidth}/>
                    <Skeleton height={skeletonHeight} width={skeletonnWidth}/>
                    <Skeleton height={skeletonHeight} width={skeletonnWidth}/>
                    <Skeleton height={skeletonHeight} width={skeletonnWidth}/>
                    <Skeleton height={skeletonHeight} width={skeletonnWidth}/>
                    <Skeleton height={skeletonHeight} width={skeletonnWidthLarge}/>
                </Stack>
                <Skeleton>
                    <Button size={"sm"}>{t("global.actions.download")}</Button>
                </Skeleton>
            </HStack>
		);
		}

	return (
        <SectionContainer>
            {fields}
        </SectionContainer>
	);
};

export default PaymentExportOverviewSkeleton;
