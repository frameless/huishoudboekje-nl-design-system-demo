import fetch from "node-fetch";
import {createServiceUrl} from "../config/services";

const BurgerLoader = {

	findAll: async () => {
		return await fetch(createServiceUrl("burgers", "/burgers")).then(r => r.json()).then(r => r.data);
	},

	findById: async (id: number) => {
		return await fetch(createServiceUrl("burgers", `/burgers/${id}`)).then(r => r.json()).then(r => r.data);
	},

};

export default BurgerLoader;