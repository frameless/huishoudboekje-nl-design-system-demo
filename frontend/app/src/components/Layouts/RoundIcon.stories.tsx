import {ComponentStory} from "@storybook/react";
import React from "react";
import {FiActivity, FiLock, FiPhone, FiUser} from "react-icons/all";
import RoundIcon from "./RoundIcon";

export default {
	title: "Huishoudboekje/Componenten/RoundIcon",
	component: RoundIcon,
};

const Template: ComponentStory<typeof RoundIcon> = ({children}) => <RoundIcon>{children}</RoundIcon>;

export const Activity = Template.bind({});
Activity.args = {
	children: <FiActivity />,
};

export const User = Template.bind({});
User.args = {
	children: <FiUser />,
};

export const Phone = Template.bind({});
Phone.args = {
	children: <FiPhone />,
};

export const Lock = Template.bind({});
Lock.args = {
	children: <FiLock />,
};