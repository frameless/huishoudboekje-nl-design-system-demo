import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Bedrag: any;
  JSON: any;
};

export type Afdeling = {
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  organisatie?: Maybe<Organisatie>;
};

export type Afspraak = {
  bedrag?: Maybe<Scalars['String']>;
  betaalinstructie?: Maybe<Betaalinstructie>;
  credit?: Maybe<Scalars['Boolean']>;
  /** Een unique identifier voor een afspraak in het systeem. */
  id?: Maybe<Scalars['Int']>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  omschrijving?: Maybe<Scalars['String']>;
  tegenrekening?: Maybe<Rekening>;
  validFrom?: Maybe<Scalars['String']>;
  validThrough?: Maybe<Scalars['String']>;
};

export type Banktransactie = {
  bedrag?: Maybe<Scalars['Bedrag']>;
  id?: Maybe<Scalars['Int']>;
  informationToAccountOwner?: Maybe<Scalars['String']>;
  isCredit?: Maybe<Scalars['Boolean']>;
  journaalpost?: Maybe<Journaalpost>;
  tegenrekening?: Maybe<Rekening>;
  tegenrekeningIban?: Maybe<Scalars['String']>;
  transactiedatum?: Maybe<Scalars['String']>;
};

export type Betaalinstructie = {
  byDay?: Maybe<Array<Maybe<DayOfWeek>>>;
  byMonth?: Maybe<Array<Maybe<Scalars['Int']>>>;
  byMonthDay?: Maybe<Array<Maybe<Scalars['Int']>>>;
  endDate?: Maybe<Scalars['String']>;
  exceptDates?: Maybe<Array<Maybe<Scalars['String']>>>;
  repeatFrequency?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
};

/** Een burger is een deelnemer. */
export type Burger = {
  achternaam?: Maybe<Scalars['String']>;
  afspraak?: Maybe<Afspraak>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  banktransacties?: Maybe<Array<Maybe<Banktransactie>>>;
  banktransactiesPaged?: Maybe<PagedBanktransactie>;
  /** Het burgerservicenummer. */
  bsn?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  geboortedatum?: Maybe<Scalars['String']>;
  huisnummer?: Maybe<Scalars['String']>;
  /** Dit is een unique identifier voor een burger in het systeem. */
  id?: Maybe<Scalars['Int']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  rekeningen?: Maybe<Array<Maybe<Rekening>>>;
  straatnaam?: Maybe<Scalars['String']>;
  telefoonnummer?: Maybe<Scalars['String']>;
  voorletters?: Maybe<Scalars['String']>;
  voornamen?: Maybe<Scalars['String']>;
};


/** Een burger is een deelnemer. */
export type BurgerAfspraakArgs = {
  id: Scalars['Int'];
};


/** Een burger is een deelnemer. */
export type BurgerBanktransactiesPagedArgs = {
  limit: Scalars['Int'];
  start: Scalars['Int'];
};

export enum DayOfWeek {
  Friday = 'Friday',
  Monday = 'Monday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
  Thursday = 'Thursday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday'
}

export type Journaalpost = {
  afspraak?: Maybe<Afspraak>;
  banktransactie?: Maybe<Banktransactie>;
  id?: Maybe<Scalars['Int']>;
};

export type Organisatie = {
  id?: Maybe<Scalars['Int']>;
  kvknummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
  vestigingsnummer?: Maybe<Scalars['String']>;
};

export type PageInfo = {
  count?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
};

export type PagedBanktransactie = {
  banktransacties?: Maybe<Array<Maybe<Banktransactie>>>;
  pageInfo?: Maybe<PageInfo>;
};

/** GraphQL Query */
export type Query = {
  banktransactie?: Maybe<Banktransactie>;
  banktransacties?: Maybe<Array<Maybe<Banktransactie>>>;
  burger?: Maybe<Burger>;
  burgers?: Maybe<Array<Maybe<Burger>>>;
  organisaties?: Maybe<Array<Maybe<Organisatie>>>;
};


/** GraphQL Query */
export type QueryBanktransactieArgs = {
  id: Scalars['Int'];
};


/** GraphQL Query */
export type QueryBurgerArgs = {
  bsn?: InputMaybe<Scalars['Int']>;
};


/** GraphQL Query */
export type QueryOrganisatiesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type Rekening = {
  /** De afdeling waar deze rekening bij hoort. */
  afdelingen?: Maybe<Array<Maybe<Afdeling>>>;
  /** Dit is een IBAN. */
  iban?: Maybe<Scalars['String']>;
  /** Een unique identifier voor een rekening in het systeem. */
  id?: Maybe<Scalars['Int']>;
  /** De naam van de houder van de rekening. */
  rekeninghouder?: Maybe<Scalars['String']>;
};

export type BanktransactieFragment = { id?: number, bedrag?: any, isCredit?: boolean, tegenrekeningIban?: string, transactiedatum?: string, informationToAccountOwner?: string, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string }, journaalpost?: { id?: number } };

export type BurgerFragment = { id?: number, bsn?: string, voorletters?: string, voornamen?: string, achternaam?: string, banktransacties?: Array<{ id?: number, bedrag?: any, isCredit?: boolean, informationToAccountOwner?: string, tegenrekeningIban?: string, transactiedatum?: string, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string } }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, bedrag?: string, credit?: boolean, omschrijving?: string, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, startDate?: string, endDate?: string }, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string, afdelingen?: Array<{ organisatie?: { id?: number, naam?: string } }> } }> };

export type GetBurgerQueryVariables = Exact<{
  bsn: Scalars['Int'];
}>;


export type GetBurgerQuery = { burger?: { id?: number, bsn?: string, voorletters?: string, voornamen?: string, achternaam?: string, banktransacties?: Array<{ id?: number, bedrag?: any, isCredit?: boolean, informationToAccountOwner?: string, tegenrekeningIban?: string, transactiedatum?: string, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string } }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, bedrag?: string, credit?: boolean, omschrijving?: string, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, startDate?: string, endDate?: string }, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string, afdelingen?: Array<{ organisatie?: { id?: number, naam?: string } }> } }> } };

export type GetPagedBanktransactiesQueryVariables = Exact<{
  bsn: Scalars['Int'];
  start: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type GetPagedBanktransactiesQuery = { burger?: { banktransactiesPaged?: { banktransacties?: Array<{ id?: number, bedrag?: any, isCredit?: boolean, tegenrekeningIban?: string, transactiedatum?: string, informationToAccountOwner?: string, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string }, journaalpost?: { id?: number } }>, pageInfo?: { count?: number, limit?: number, start?: number } } } };

export type GetBanktransactieQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBanktransactieQuery = { banktransactie?: { id?: number, bedrag?: any, isCredit?: boolean, tegenrekeningIban?: string, transactiedatum?: string, informationToAccountOwner?: string, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string }, journaalpost?: { id?: number } } };

export type GetBanktransactiesForAfspraakQueryVariables = Exact<{
  bsn: Scalars['Int'];
  afspraakId: Scalars['Int'];
}>;


export type GetBanktransactiesForAfspraakQuery = { burger?: { afspraak?: { journaalposten?: Array<{ banktransactie?: { id?: number, bedrag?: any, isCredit?: boolean, tegenrekeningIban?: string, transactiedatum?: string, informationToAccountOwner?: string, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string }, journaalpost?: { id?: number } } }> } } };

export const BanktransactieFragmentDoc = gql`
    fragment Banktransactie on Banktransactie {
  id
  bedrag
  isCredit
  tegenrekeningIban
  transactiedatum
  informationToAccountOwner
  tegenrekening {
    id
    iban
    rekeninghouder
  }
  journaalpost {
    id
  }
}
    `;
export const BurgerFragmentDoc = gql`
    fragment Burger on Burger {
  id
  bsn
  voorletters
  voornamen
  achternaam
  banktransacties {
    id
    bedrag
    isCredit
    informationToAccountOwner
    tegenrekening {
      id
      iban
      rekeninghouder
    }
    tegenrekeningIban
    transactiedatum
  }
  rekeningen {
    id
    iban
    rekeninghouder
  }
  afspraken {
    id
    betaalinstructie {
      byDay
      byMonth
      byMonthDay
      startDate
      endDate
    }
    bedrag
    credit
    omschrijving
    tegenrekening {
      id
      iban
      rekeninghouder
      afdelingen {
        organisatie {
          id
          naam
        }
      }
    }
  }
}
    `;
export const GetBurgerDocument = gql`
    query getBurger($bsn: Int!) {
  burger(bsn: $bsn) {
    ...Burger
  }
}
    ${BurgerFragmentDoc}`;

/**
 * __useGetBurgerQuery__
 *
 * To run a query within a React component, call `useGetBurgerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBurgerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBurgerQuery({
 *   variables: {
 *      bsn: // value for 'bsn'
 *   },
 * });
 */
export function useGetBurgerQuery(baseOptions: Apollo.QueryHookOptions<GetBurgerQuery, GetBurgerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBurgerQuery, GetBurgerQueryVariables>(GetBurgerDocument, options);
      }
export function useGetBurgerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBurgerQuery, GetBurgerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBurgerQuery, GetBurgerQueryVariables>(GetBurgerDocument, options);
        }
export type GetBurgerQueryHookResult = ReturnType<typeof useGetBurgerQuery>;
export type GetBurgerLazyQueryHookResult = ReturnType<typeof useGetBurgerLazyQuery>;
export type GetBurgerQueryResult = Apollo.QueryResult<GetBurgerQuery, GetBurgerQueryVariables>;
export const GetPagedBanktransactiesDocument = gql`
    query getPagedBanktransacties($bsn: Int!, $start: Int!, $limit: Int!) {
  burger(bsn: $bsn) {
    banktransactiesPaged(start: $start, limit: $limit) {
      banktransacties {
        ...Banktransactie
      }
      pageInfo {
        count
        limit
        start
      }
    }
  }
}
    ${BanktransactieFragmentDoc}`;

/**
 * __useGetPagedBanktransactiesQuery__
 *
 * To run a query within a React component, call `useGetPagedBanktransactiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPagedBanktransactiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPagedBanktransactiesQuery({
 *   variables: {
 *      bsn: // value for 'bsn'
 *      start: // value for 'start'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetPagedBanktransactiesQuery(baseOptions: Apollo.QueryHookOptions<GetPagedBanktransactiesQuery, GetPagedBanktransactiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPagedBanktransactiesQuery, GetPagedBanktransactiesQueryVariables>(GetPagedBanktransactiesDocument, options);
      }
export function useGetPagedBanktransactiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPagedBanktransactiesQuery, GetPagedBanktransactiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPagedBanktransactiesQuery, GetPagedBanktransactiesQueryVariables>(GetPagedBanktransactiesDocument, options);
        }
export type GetPagedBanktransactiesQueryHookResult = ReturnType<typeof useGetPagedBanktransactiesQuery>;
export type GetPagedBanktransactiesLazyQueryHookResult = ReturnType<typeof useGetPagedBanktransactiesLazyQuery>;
export type GetPagedBanktransactiesQueryResult = Apollo.QueryResult<GetPagedBanktransactiesQuery, GetPagedBanktransactiesQueryVariables>;
export const GetBanktransactieDocument = gql`
    query getBanktransactie($id: Int!) {
  banktransactie(id: $id) {
    ...Banktransactie
  }
}
    ${BanktransactieFragmentDoc}`;

/**
 * __useGetBanktransactieQuery__
 *
 * To run a query within a React component, call `useGetBanktransactieQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBanktransactieQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBanktransactieQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBanktransactieQuery(baseOptions: Apollo.QueryHookOptions<GetBanktransactieQuery, GetBanktransactieQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBanktransactieQuery, GetBanktransactieQueryVariables>(GetBanktransactieDocument, options);
      }
export function useGetBanktransactieLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBanktransactieQuery, GetBanktransactieQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBanktransactieQuery, GetBanktransactieQueryVariables>(GetBanktransactieDocument, options);
        }
export type GetBanktransactieQueryHookResult = ReturnType<typeof useGetBanktransactieQuery>;
export type GetBanktransactieLazyQueryHookResult = ReturnType<typeof useGetBanktransactieLazyQuery>;
export type GetBanktransactieQueryResult = Apollo.QueryResult<GetBanktransactieQuery, GetBanktransactieQueryVariables>;
export const GetBanktransactiesForAfspraakDocument = gql`
    query getBanktransactiesForAfspraak($bsn: Int!, $afspraakId: Int!) {
  burger(bsn: $bsn) {
    afspraak(id: $afspraakId) {
      journaalposten {
        banktransactie {
          ...Banktransactie
        }
      }
    }
  }
}
    ${BanktransactieFragmentDoc}`;

/**
 * __useGetBanktransactiesForAfspraakQuery__
 *
 * To run a query within a React component, call `useGetBanktransactiesForAfspraakQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBanktransactiesForAfspraakQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBanktransactiesForAfspraakQuery({
 *   variables: {
 *      bsn: // value for 'bsn'
 *      afspraakId: // value for 'afspraakId'
 *   },
 * });
 */
export function useGetBanktransactiesForAfspraakQuery(baseOptions: Apollo.QueryHookOptions<GetBanktransactiesForAfspraakQuery, GetBanktransactiesForAfspraakQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBanktransactiesForAfspraakQuery, GetBanktransactiesForAfspraakQueryVariables>(GetBanktransactiesForAfspraakDocument, options);
      }
export function useGetBanktransactiesForAfspraakLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBanktransactiesForAfspraakQuery, GetBanktransactiesForAfspraakQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBanktransactiesForAfspraakQuery, GetBanktransactiesForAfspraakQueryVariables>(GetBanktransactiesForAfspraakDocument, options);
        }
export type GetBanktransactiesForAfspraakQueryHookResult = ReturnType<typeof useGetBanktransactiesForAfspraakQuery>;
export type GetBanktransactiesForAfspraakLazyQueryHookResult = ReturnType<typeof useGetBanktransactiesForAfspraakLazyQuery>;
export type GetBanktransactiesForAfspraakQueryResult = Apollo.QueryResult<GetBanktransactiesForAfspraakQuery, GetBanktransactiesForAfspraakQueryVariables>;