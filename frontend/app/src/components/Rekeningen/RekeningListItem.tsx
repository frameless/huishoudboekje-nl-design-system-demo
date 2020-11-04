import React from "react";
import {IRekening} from "../../models";
import {Button, ButtonProps, Icon, Tooltip} from "@chakra-ui/core";
import {friendlyFormatIBAN} from "ibantools";

type RekeningListItemProps = Omit<ButtonProps, "children">;
const RekeningListItem: React.FC<RekeningListItemProps & { rekening: IRekening, onDelete?: VoidFunction }> = ({rekening, onDelete, ...props}) => {
	return (
		<Tooltip aria-label={rekening.rekeninghouder} label={rekening.rekeninghouder} placement={"top"} hasArrow={true}>
			<Button size={"sm"} mb={2} mr={2} {...props}>
				{friendlyFormatIBAN(rekening.iban)}
				{onDelete && <Icon name={"close"} onClick={onDelete} ml={2} size={"12px"} />}
			</Button>
		</Tooltip>
	)
}


export default RekeningListItem;