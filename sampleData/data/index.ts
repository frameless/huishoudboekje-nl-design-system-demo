import {Burger, Configuratie, CreateRubriekMutationVariables, Huishouden, Organisatie} from "../graphql";

export const configuraties: Required<Configuratie>[] = require("./configuraties.json");
export const burgers: Required<Burger>[] = require("./burgers.json");
export const rubrieken: Required<CreateRubriekMutationVariables>[] = require("./rubrieken.json");
export const organisaties: Required<Organisatie>[] = require("./organisaties.json");
export const huishoudens: Required<Huishouden>[] = require("./huishoudens.json");
