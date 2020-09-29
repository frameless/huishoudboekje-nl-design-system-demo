module.exports = {
	docs: {
		"Documentatie": ["documentatie/aan-de-slag", "documentatie/installatie"],
	},
	developers: {
		"Developers": ["developers/local-development", "developers/minikube"],
		"Process": ["developers/review-app", {
			type: "link",
			label: "Ontwerpbeslissingen",
			href: "https://gitlab.com/commonground/huishoudboekje/app-new/-/wikis/Ontwerpbeslissingen",
		}],
	},
};
