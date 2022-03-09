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

export type Afspraak = {
  bedrag?: Maybe<Scalars['String']>;
  betaalinstructie?: Maybe<Betaalinstructie>;
  credit?: Maybe<Scalars['String']>;
  /** Een unique identifier voor een afspraak in het systeem. */
  id?: Maybe<Scalars['Int']>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  omschrijving?: Maybe<Scalars['String']>;
  tegenrekening?: Maybe<Rekening>;
  validFrom?: Maybe<Scalars['String']>;
  validThrough?: Maybe<Scalars['String']>;
};

export type Banktransactie = {
  afspraak?: Maybe<Afspraak>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  id?: Maybe<Scalars['Int']>;
  informationToAccountOwner?: Maybe<Scalars['String']>;
  isCredit?: Maybe<Scalars['Boolean']>;
  tegenrekening?: Maybe<Rekening>;
  tegenrekeningIban?: Maybe<Scalars['String']>;
  transactiedatum?: Maybe<Scalars['String']>;
};

export type Betaalinstructie = {
  byDay?: Maybe<Array<Maybe<DayOfWeek>>>;
  byMonth?: Maybe<Array<Maybe<Scalars['Int']>>>;
  byMonthDay?: Maybe<Array<Maybe<Scalars['String']>>>;
  endDate?: Maybe<Scalars['String']>;
  exceptDates?: Maybe<Array<Maybe<Scalars['String']>>>;
  repeatFrequency?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
};

/** Een burger is een deelnemer. */
export type Burger = {
  achternaam?: Maybe<Scalars['String']>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  banktransacties?: Maybe<Array<Maybe<Banktransactie>>>;
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
  /** Een unique identifier voor een journaalpost in het systeem. */
  id?: Maybe<Scalars['Int']>;
};

export type Organisatie = {
  id?: Maybe<Scalars['Int']>;
  kvknummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
  vestigingsnummer?: Maybe<Scalars['String']>;
};

/** GraphQL Query */
export type Query = {
  burger?: Maybe<Burger>;
};


/** GraphQL Query */
export type QueryBurgerArgs = {
  bsn?: InputMaybe<Scalars['Int']>;
};

export type Rekening = {
  /** Dit is een IBAN. */
  iban?: Maybe<Scalars['String']>;
  /** Een unique identifier voor een rekening in het systeem. */
  id?: Maybe<Scalars['Int']>;
  /** De naam van de houder van de rekening. */
  rekeninghouder?: Maybe<Scalars['String']>;
};

export type BurgerFragment = { id?: number, bsn?: string, voorletters?: string, voornamen?: string, achternaam?: string, banktransacties?: Array<{ id?: number, bedrag?: any, isCredit?: boolean, informationToAccountOwner?: string, tegenrekeningIban?: string, transactiedatum?: string, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string } }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, bedrag?: string, credit?: string, omschrijving?: string, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<string>, startDate?: string, endDate?: string }, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string } }> };

export type GetBurgerQueryVariables = Exact<{
  bsn: Scalars['Int'];
}>;


export type GetBurgerQuery = { burger?: { id?: number, bsn?: string, voorletters?: string, voornamen?: string, achternaam?: string, banktransacties?: Array<{ id?: number, bedrag?: any, isCredit?: boolean, informationToAccountOwner?: string, tegenrekeningIban?: string, transactiedatum?: string, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string } }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, bedrag?: string, credit?: string, omschrijving?: string, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<string>, startDate?: string, endDate?: string }, tegenrekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } };

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