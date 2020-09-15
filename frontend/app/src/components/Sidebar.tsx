/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useRef} from 'react';
import Logo from "./Logo";
import {Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Link, Stack, useDisclosure} from "@chakra-ui/core";
import {useIsMobile} from "react-grapple";
import VersionTag from "./VersionTag";

const SidebarContent = (props) => {
	return (
		<Stack p={5} {...props}>
			<Link>Link</Link>
			<Link>Link</Link>
			<Link>Link</Link>
			<Link>Link</Link>
			<Link>Link</Link>
			<Link>Link</Link>
			<Link>Link</Link>
			<Link>Link</Link>
		</Stack>
	)
}

const Sidebar = () => {
	const isMobile = useIsMobile();
	const {isOpen, onOpen, onClose} = useDisclosure(true);
	const sidebarButtonRef = useRef();

	return isMobile ? (
		<>
			<Button ref={sidebarButtonRef} variantColor="teal" onClick={onOpen}>
				Toggle sidebar
			</Button>
			<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>
						<Logo />
					</DrawerHeader>

					<DrawerBody p={0}>
						<SidebarContent />
					</DrawerBody>

					<DrawerFooter>
						<VersionTag />
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	) : (
		<Stack width={250} height={"100%"} bg={"gray.100"}>
			<Flex direction={"column"} height={"100%"} justifyContent={"space-between"}>
				<Stack>
					<Logo />
					<SidebarContent />
				</Stack>

				<Box alignSelf={"flex-end"} justifySelf={"flex-end"} p={3}>
					<VersionTag />
				</Box>
			</Flex>
		</Stack>
	);
};

export default Sidebar;