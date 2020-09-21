import Store from "../config/store";

export const useStore = () => {
	return Store;
}

export const useSession = () => {
	const store = useStore();
	return store.session;
}