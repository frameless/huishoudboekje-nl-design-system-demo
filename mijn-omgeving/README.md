# Mijn Omgeving-component

This is a React-component that can be used in any other React-app with the purpose of showing data for one burger based on their BSN (Burgerservicenummer).

## Prerequisites

This component is not hosted on npm, but in a public npm registry. To use it, you will need to tell your package manager that it should look for this package in another registry:

For **npm**:

```shell
echo @huishoudboekje:registry=https://gitlab.com/api/v4/projects/20352213/packages/npm/ >> .npmrc
```

For **yarn**:

```shell
echo \"@huishoudboekje:registry\" \"https://gitlab.com/api/v4/projects/20352213/packages/npm/\" >> .yarnrc
```

## Installation

You can just install it as any other npm package.

For **npm**:

```shell
npm i @huishoudboekje/mijn-omgeving
```

For **yarn**:

```shell
yarn add @huishoudboekje/mijn-omgeving
```

## Usage

Import the component.

```jsx
import {Huishoudboekje} from "@huishoudboekje/mijn-omgeving"
```

This component need two props:

1. The current user that is logged in. It needs at least a field `bsn`, so that it can query a burger by their bsn.

2. A config with a field `apiUrl` pointing to your instance of the Huishoudboekje Burger API.

```jsx
<Huishoudboekje user={{bsn: "123456789"}} config={{
	apiUrl: "https://<your-huishoudboekje-api>"
}} />
```