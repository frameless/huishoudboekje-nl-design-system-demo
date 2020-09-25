import {types} from "mobx-state-tree";

const User = types.model("User", {
	email: types.string,
	firstName: types.string,
	lastName: types.string,
	role: types.string,
}).views(self => ({
	get fullName() {
		return `${self.firstName} ${self.lastName}`;
	}
}));

const Session = types.model({
	user: types.maybeNull(User),
	referer: types.maybeNull(types.string),
}).actions(self => ({
	setUser: (user) => self.user = user,
	setReferer: (referer) => self.referer = referer,
	reset: () => self.user = null
}));

const RootStore = types.model({
	session: Session
});

const Store = RootStore.create({
	session: {}
});

export default Store;