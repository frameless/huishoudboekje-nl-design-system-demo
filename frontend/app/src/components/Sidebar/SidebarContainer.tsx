import React, {useRef} from "react";
import Logo from "../Logo";
import {Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Stack, useDisclosure} from "@chakra-ui/core";
import {useIsMobile} from "react-grapple";
import {GiHamburgerMenu} from "react-icons/all";
import SidebarFooter from "./SidebarFooter";
import {DrawerContext, TABLET_BREAKPOINT} from "../../utils/things";

const SidebarContainer = ({children}) => {
	const isMobile = useIsMobile(TABLET_BREAKPOINT);
	const {isOpen, onOpen, onClose} = useDisclosure();
	const sidebarButtonRef = useRef();

	return isMobile ? (
		<>
			<Flex justifyContent={"flex-end"} width={"auto"}>
				<Button ref={sidebarButtonRef} onClick={onOpen}>
					<GiHamburgerMenu />
				</Button>
			</Flex>

			<DrawerContext.Provider value={{ onClose }}>
				<Drawer isOpen={isOpen} placement="left" onClose={onClose} size={"full"}>
					<DrawerOverlay />
					<DrawerContent bg={"gray.100"}>
						<DrawerCloseButton />
						<DrawerHeader justifyContent={"center"}>
							<Logo />
						</DrawerHeader>

						<DrawerBody p={0} overflowY={"auto"}>
							{children}
						</DrawerBody>

						<DrawerFooter justifyContent={"center"}>
							<Box>
								<SidebarFooter />
							</Box>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</DrawerContext.Provider>
		</>
	) : (
		<Stack maxWidth={320} width={"100%"} bg={"gray.100"} justifyContent={"space-between"}>
			<Stack width={"100%"} overflowY={"auto"}>
				<Logo />
				{children}
			</Stack>

			<Box alignSelf={"center"} p={3}>
				<SidebarFooter />
			</Box>
		</Stack>
	);
};

export default SidebarContainer;