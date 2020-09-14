import {SnapshotIn, types} from "mobx-state-tree";

const User = types.model({
	email: types.string,
	firstName: types.string,
	lastName: types.string,
	role: types.string,
});

const Session = types.model({
	user: types.union(User, types.literal(null))
}).actions(self => ({
	setUser: (user: SnapshotIn<typeof User> | null) => {
		self.user = user
	},
	reset: () => {
		console.log("RESET");
		self.user = null;
	}
}));

const RootStore = types.model({
	session: Session
});

const Store = RootStore.create({
	session: {
		user: null
	}
});

export default Store;