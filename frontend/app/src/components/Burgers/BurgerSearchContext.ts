import React from "react";

const BurgerSearchContext = React.createContext<[string, Function]>(["", () => null]);

export default BurgerSearchContext;