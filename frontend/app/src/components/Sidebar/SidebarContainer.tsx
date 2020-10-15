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

			<DrawerContext.Provider value={{onClose}}>
				<Drawer isOpen={isOpen} placement="left" onClose={onClose} size={"md"}>
					<DrawerOverlay />
					<DrawerContent>
						<DrawerCloseButton />
						<DrawerHeader>
							<Logo as={Flex} maxWidth={350} marginX={"auto"} />
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
		<Stack maxWidth={300} minHeight="100vh" height={"100%"} width={"100%"} bg={"white"} justifyContent={"space-between"}>
			<Stack width={"100%"} spacing={2}>
				<Logo />
				{children}
			</Stack>

			<Box alignSelf={"center"} p={2}>
				<SidebarFooter />
			</Box>
		</Stack>
	);
};

export default SidebarContainer;