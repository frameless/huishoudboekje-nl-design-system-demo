import {Button, ButtonGroup, Icon, Box} from "@chakra-ui/react";
import React, { useState } from "react";
import {useTranslation} from "react-i18next";
import {ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

export type SortingValue = {
	orderField:string, 
    ascending: boolean
};

export const startValuesSorting : SortingValue= {orderField: "voornamen", ascending: true};

type PaymentRecordsSortingButtonsProps = {
	onClick: (sort: SortingValue) => void,
};

const PaymentRecordsSortingButtons: React.FC<PaymentRecordsSortingButtonsProps> = ({onClick}) => {
    const {t} = useTranslation(["paymentrecords"]);

    const buttons = [
        {label: 'sorting.firstname', orderField: "voornamen"},
        {label: 'sorting.lastname', orderField: "achternaam"},
        {label: 'sorting.startdate', orderField: "startDate"},
    ];

	const [activeIndex, setActiveIndex] = useState(0);


	const [ascendingPerButton, setAscendingPerButton] = useState(Array(buttons.length).fill(true));

	const handleButtonClick = (index) => {
		let ascending = ascendingPerButton[index]
		if (index == activeIndex) {
            ascending = !ascending
			setAscendingPerButton((prev) => ({
				...prev,
				[index]: ascending,
			}));
		}
		setActiveIndex(index);
        onClick({orderField: buttons[index]['orderField'], ascending: ascending});
	};
	

	return (
        <ButtonGroup>
            {buttons.map((btn, index) => (
                <Button
                    key={index}
                    onClick={() => handleButtonClick(index)}
                    borderRadius={index === 0 ? 'md 0 0 md' : index === buttons.length - 1 ? '0 md md 0' : '0'}
                    colorScheme={'primary'}
                    fontSize={"medium"}
                    bg={activeIndex === index ? "primary.50" : "transparent"}
                    variant={activeIndex === index ? "ghost" : "ghost"}>
                    <Box display="flex" alignItems="center">
                        {t(btn.label)}
                        {activeIndex === index && (
                            <Icon as={ascendingPerButton[index] ? ArrowUpIcon : ArrowDownIcon} ml={2} />
                        )}
                    </Box>
                </Button>
            ))}
        </ButtonGroup>
    );
};

export default PaymentRecordsSortingButtons;
