import Store from "../config/store";

export const useStore = () => {
	return Store;
}

export const useSession = () => {
	const store = useStore();
	return store.session;
}

export const useSampleData = () => {
	return {
		users: require("../config/sampleData/users.json"),
		citizens: require("../config/sampleData/citizens.json"),
	}
}