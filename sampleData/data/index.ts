import {Burger, Configuratie, CreateRubriekMutationVariables, Organisatie} from "../graphql";

export const configuraties: Required<Configuratie>[] = require("./configuraties.json");
export const burgers: Required<Burger>[] = require("./burgers.json");
export const rubrieken: Required<CreateRubriekMutationVariables>[] = require("./rubrieken.json");
export const organisaties: Required<Organisatie>[] = require("./organisaties.json");