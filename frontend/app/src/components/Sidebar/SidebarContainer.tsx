import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Stack,
	useBreakpointValue,
	useDisclosure,
} from "@chakra-ui/react";
import React, {useRef} from "react";
import {GiHamburgerMenu} from "react-icons/all";
import {DrawerContext} from "../../utils/things";
import Logo from "../Logo";
import SidebarFooter from "./SidebarFooter";

const SidebarContainer = ({children}) => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {isOpen, onOpen, onClose} = useDisclosure();
	const sidebarButtonRef = useRef(null);

	return isMobile ? (
		<>
			<Box width={"auto"} position={"absolute"} top={5} left={2}>
				<Button ref={sidebarButtonRef} onClick={onOpen}>
					<GiHamburgerMenu />
				</Button>
			</Box>

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
		<Stack justifyContent={"space-between"} p={5} maxWidth={320} minHeight="100vh" height={"100%"} width={"100%"}>
			<Box>
				<Logo mb={5} />

				<Stack width={"100%"} justifyContent={"space-between"}>
					<Stack width={"100%"} spacing={5}>
						{children}
					</Stack>
				</Stack>
			</Box>

			<Box alignSelf={"center"} p={5}>
				<SidebarFooter />
			</Box>
		</Stack>
	);
};

export default SidebarContainer;