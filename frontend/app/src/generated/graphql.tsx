import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Decimaal Scalar Description */
  Bedrag: any;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any;
};




export type AddAfspraakZoekterm = {
  __typename?: 'AddAfspraakZoekterm';
  ok?: Maybe<Scalars['Boolean']>;
  afspraak?: Maybe<Afspraak>;
  previous?: Maybe<Afspraak>;
  matchingAfspraken?: Maybe<Array<Maybe<Afspraak>>>;
};

/** GraphQL Afspraak model  */
export type Afspraak = {
  __typename?: 'Afspraak';
  id?: Maybe<Scalars['Int']>;
  burger?: Maybe<Burger>;
  omschrijving?: Maybe<Scalars['String']>;
  tegenRekening?: Maybe<Rekening>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  credit?: Maybe<Scalars['Boolean']>;
  zoektermen?: Maybe<Array<Maybe<Scalars['String']>>>;
  betaalinstructie?: Maybe<Betaalinstructie>;
  organisatie?: Maybe<Organisatie>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  rubriek?: Maybe<Rubriek>;
  overschrijvingen?: Maybe<Array<Maybe<Overschrijving>>>;
  matchingAfspraken?: Maybe<Array<Maybe<Afspraak>>>;
  validFrom?: Maybe<Scalars['Date']>;
  validThrough?: Maybe<Scalars['Date']>;
  /** @deprecated use betaalinstructie instead */
  interval?: Maybe<Interval>;
  /** @deprecated use betaalinstructie instead */
  aantalBetalingen?: Maybe<Scalars['Int']>;
  /** @deprecated use omschrijving instead */
  beschrijving?: Maybe<Scalars['String']>;
  /** @deprecated use betaalinstructie instead */
  automatischeIncasso?: Maybe<Scalars['Boolean']>;
};


/** GraphQL Afspraak model  */
export type AfspraakOverschrijvingenArgs = {
  startDatum?: Maybe<Scalars['Date']>;
  eindDatum?: Maybe<Scalars['Date']>;
};

/** BankTransaction model */
export type BankTransaction = {
  __typename?: 'BankTransaction';
  id?: Maybe<Scalars['Int']>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  statementLine?: Maybe<Scalars['String']>;
  informationToAccountOwner?: Maybe<Scalars['String']>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  isCredit?: Maybe<Scalars['Boolean']>;
  tegenRekening?: Maybe<Rekening>;
  tegenRekeningIban?: Maybe<Scalars['String']>;
  transactieDatum?: Maybe<Scalars['Date']>;
  isGeboekt?: Maybe<Scalars['Boolean']>;
  journaalpost?: Maybe<Journaalpost>;
  suggesties?: Maybe<Array<Maybe<Afspraak>>>;
};

export type BankTransactionsPaged = {
  __typename?: 'BankTransactionsPaged';
  banktransactions?: Maybe<Array<Maybe<BankTransaction>>>;
  pageInfo?: Maybe<PageInfo>;
};


/** Implementatie op basis van http://schema.org/Schedule */
export type Betaalinstructie = {
  __typename?: 'Betaalinstructie';
  startDate?: Maybe<Scalars['Date']>;
  endDate?: Maybe<Scalars['Date']>;
  repeatCount?: Maybe<Scalars['Int']>;
  byDay?: Maybe<Array<Maybe<DayOfWeek>>>;
  byMonthDay?: Maybe<Scalars['Int']>;
  byMonth?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

/** Implementatie op basis van http://schema.org/Schedule */
export type BetaalinstructieInput = {
  startDate: Scalars['Date'];
  endDate?: Maybe<Scalars['Date']>;
  repeatCount?: Maybe<Scalars['Int']>;
  byDay?: Maybe<Array<Maybe<DayOfWeek>>>;
  byMonthDay?: Maybe<Scalars['Int']>;
  byMonth?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

/** GraphQL Burger model  */
export type Burger = {
  __typename?: 'Burger';
  id?: Maybe<Scalars['Int']>;
  telefoonnummer?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  geboortedatum?: Maybe<Scalars['String']>;
  /** @deprecated Please use 'rekeningen' */
  iban?: Maybe<Scalars['String']>;
  achternaam?: Maybe<Scalars['String']>;
  huisnummer?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  voorletters?: Maybe<Scalars['String']>;
  voornamen?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  rekeningen?: Maybe<Array<Maybe<Rekening>>>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersActiviteit>>>;
};

export type BurgersPaged = {
  __typename?: 'BurgersPaged';
  burgers?: Maybe<Array<Maybe<Burger>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type Configuratie = {
  __typename?: 'Configuratie';
  id?: Maybe<Scalars['String']>;
  waarde?: Maybe<Scalars['String']>;
};

export type ConfiguratieInput = {
  id: Scalars['String'];
  waarde?: Maybe<Scalars['String']>;
};

export type CreateAfspraak = {
  __typename?: 'CreateAfspraak';
  ok?: Maybe<Scalars['Boolean']>;
  afspraak?: Maybe<Afspraak>;
};

export type CreateAfspraakInput = {
  burgerId: Scalars['Int'];
  credit: Scalars['Boolean'];
  organisatieId?: Maybe<Scalars['Int']>;
  tegenRekeningId: Scalars['Int'];
  rubriekId: Scalars['Int'];
  omschrijving: Scalars['String'];
  bedrag: Scalars['Bedrag'];
  validFrom?: Maybe<Scalars['String']>;
};

export type CreateBurger = {
  __typename?: 'CreateBurger';
  ok?: Maybe<Scalars['Boolean']>;
  burger?: Maybe<Burger>;
};

export type CreateBurgerInput = {
  email?: Maybe<Scalars['String']>;
  geboortedatum?: Maybe<Scalars['Date']>;
  telefoonnummer?: Maybe<Scalars['String']>;
  rekeningen?: Maybe<Array<Maybe<RekeningInput>>>;
  achternaam?: Maybe<Scalars['String']>;
  huisnummer?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  voorletters?: Maybe<Scalars['String']>;
  voornamen?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
};

export type CreateBurgerRekening = {
  __typename?: 'CreateBurgerRekening';
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
};

export type CreateConfiguratie = {
  __typename?: 'CreateConfiguratie';
  ok?: Maybe<Scalars['Boolean']>;
  configuratie?: Maybe<Configuratie>;
};

export type CreateCustomerStatementMessage = {
  __typename?: 'CreateCustomerStatementMessage';
  ok?: Maybe<Scalars['Boolean']>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
};

export type CreateExportOverschrijvingen = {
  __typename?: 'CreateExportOverschrijvingen';
  ok?: Maybe<Scalars['Boolean']>;
  export?: Maybe<Export>;
};

/** Create a Journaalpost with an Afspraak */
export type CreateJournaalpostAfspraak = {
  __typename?: 'CreateJournaalpostAfspraak';
  ok?: Maybe<Scalars['Boolean']>;
  journaalpost?: Maybe<Journaalpost>;
};

export type CreateJournaalpostAfspraakInput = {
  transactionId: Scalars['Int'];
  afspraakId: Scalars['Int'];
  isAutomatischGeboekt: Scalars['Boolean'];
};

/** Create a Journaalpost with a Grootboekrekening */
export type CreateJournaalpostGrootboekrekening = {
  __typename?: 'CreateJournaalpostGrootboekrekening';
  ok?: Maybe<Scalars['Boolean']>;
  journaalpost?: Maybe<Journaalpost>;
};

export type CreateJournaalpostGrootboekrekeningInput = {
  transactionId: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
  isAutomatischGeboekt: Scalars['Boolean'];
};

/** Create a Journaalpost with an Afspraak */
export type CreateJournaalpostPerAfspraak = {
  __typename?: 'CreateJournaalpostPerAfspraak';
  ok?: Maybe<Scalars['Boolean']>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
};

export type CreateOrganisatie = {
  __typename?: 'CreateOrganisatie';
  ok?: Maybe<Scalars['Boolean']>;
  organisatie?: Maybe<Organisatie>;
};

export type CreateOrganisatieInput = {
  kvkNummer: Scalars['String'];
  weergaveNaam: Scalars['String'];
  rekeningen?: Maybe<Array<Maybe<RekeningInput>>>;
  naam?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  huisnummer?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
};

export type CreateOrganisatieRekening = {
  __typename?: 'CreateOrganisatieRekening';
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
};

export type CreateRubriek = {
  __typename?: 'CreateRubriek';
  ok?: Maybe<Scalars['Boolean']>;
  rubriek?: Maybe<Rubriek>;
};

/** GraphQL CustomerStatementMessage model */
export type CustomerStatementMessage = {
  __typename?: 'CustomerStatementMessage';
  id?: Maybe<Scalars['Int']>;
  uploadDate?: Maybe<Scalars['DateTime']>;
  filename?: Maybe<Scalars['String']>;
  transactionReferenceNumber?: Maybe<Scalars['String']>;
  relatedReference?: Maybe<Scalars['String']>;
  accountIdentification?: Maybe<Scalars['String']>;
  sequenceNumber?: Maybe<Scalars['String']>;
  openingBalance?: Maybe<Scalars['Int']>;
  closingBalance?: Maybe<Scalars['Int']>;
  closingAvailableFunds?: Maybe<Scalars['Int']>;
  forwardAvailableBalance?: Maybe<Scalars['Int']>;
  bankTransactions?: Maybe<Array<Maybe<BankTransaction>>>;
};



/** http://schema.org/DayOfWeek implementation */
export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

export type DeleteAfspraak = {
  __typename?: 'DeleteAfspraak';
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
};

export type DeleteAfspraakZoekterm = {
  __typename?: 'DeleteAfspraakZoekterm';
  ok?: Maybe<Scalars['Boolean']>;
  afspraak?: Maybe<Afspraak>;
  previous?: Maybe<Afspraak>;
  matchingAfspraken?: Maybe<Array<Maybe<Afspraak>>>;
};

export type DeleteBurger = {
  __typename?: 'DeleteBurger';
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Burger>;
};

export type DeleteBurgerRekening = {
  __typename?: 'DeleteBurgerRekening';
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rekening>;
};

export type DeleteConfiguratie = {
  __typename?: 'DeleteConfiguratie';
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Configuratie>;
};

export type DeleteCustomerStatementMessage = {
  __typename?: 'DeleteCustomerStatementMessage';
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<CustomerStatementMessage>;
};

/** Delete journaalpost by id  */
export type DeleteJournaalpost = {
  __typename?: 'DeleteJournaalpost';
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Journaalpost>;
};

export type DeleteOrganisatie = {
  __typename?: 'DeleteOrganisatie';
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Organisatie>;
};

export type DeleteOrganisatieRekening = {
  __typename?: 'DeleteOrganisatieRekening';
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rekening>;
};

export type DeleteRubriek = {
  __typename?: 'DeleteRubriek';
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rubriek>;
};

/** GraphQL Export model  */
export type Export = {
  __typename?: 'Export';
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  overschrijvingen?: Maybe<Array<Maybe<Overschrijving>>>;
  xmldata?: Maybe<Scalars['String']>;
  startDatum?: Maybe<Scalars['String']>;
  eindDatum?: Maybe<Scalars['String']>;
};

export type Gebruiker = {
  __typename?: 'Gebruiker';
  email?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

/** GebruikersActiviteit model */
export type GebruikersActiviteit = {
  __typename?: 'GebruikersActiviteit';
  id?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  gebruikerId?: Maybe<Scalars['String']>;
  action?: Maybe<Scalars['String']>;
  entities?: Maybe<Array<Maybe<GebruikersActiviteitEntity>>>;
  snapshotBefore?: Maybe<GebruikersActiviteitSnapshot>;
  snapshotAfter?: Maybe<GebruikersActiviteitSnapshot>;
  meta?: Maybe<GebruikersActiviteitMeta>;
};

export type GebruikersActiviteitEntity = {
  __typename?: 'GebruikersActiviteitEntity';
  entityType?: Maybe<Scalars['String']>;
  entityId?: Maybe<Scalars['String']>;
  afspraak?: Maybe<Afspraak>;
  burger?: Maybe<Burger>;
  configuratie?: Maybe<Configuratie>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  export?: Maybe<Export>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  journaalpost?: Maybe<Journaalpost>;
  organisatie?: Maybe<Organisatie>;
  rekening?: Maybe<Rekening>;
  rubriek?: Maybe<Rubriek>;
  transaction?: Maybe<BankTransaction>;
};

export type GebruikersActiviteitMeta = {
  __typename?: 'GebruikersActiviteitMeta';
  userAgent?: Maybe<Scalars['String']>;
  ip?: Maybe<Array<Maybe<Scalars['String']>>>;
  applicationVersion?: Maybe<Scalars['String']>;
};

export type GebruikersActiviteitSnapshot = {
  __typename?: 'GebruikersActiviteitSnapshot';
  afspraak?: Maybe<Afspraak>;
  burger?: Maybe<Burger>;
  configuratie?: Maybe<Configuratie>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  export?: Maybe<Export>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  journaalpost?: Maybe<Journaalpost>;
  organisatie?: Maybe<Organisatie>;
  rubriek?: Maybe<Rubriek>;
  transaction?: Maybe<BankTransaction>;
};

export type GebruikersActiviteitenPaged = {
  __typename?: 'GebruikersActiviteitenPaged';
  gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersActiviteit>>>;
  pageInfo?: Maybe<PageInfo>;
};

/** Grootboekrekening model  */
export type Grootboekrekening = {
  __typename?: 'Grootboekrekening';
  id: Scalars['String'];
  naam?: Maybe<Scalars['String']>;
  referentie?: Maybe<Scalars['String']>;
  omschrijving?: Maybe<Scalars['String']>;
  credit?: Maybe<Scalars['Boolean']>;
  parent?: Maybe<Grootboekrekening>;
  children?: Maybe<Array<Maybe<Grootboekrekening>>>;
  rubriek?: Maybe<Rubriek>;
};

export type Interval = {
  __typename?: 'Interval';
  jaren?: Maybe<Scalars['Int']>;
  maanden?: Maybe<Scalars['Int']>;
  weken?: Maybe<Scalars['Int']>;
  dagen?: Maybe<Scalars['Int']>;
};

/** Journaalpost model */
export type Journaalpost = {
  __typename?: 'Journaalpost';
  id?: Maybe<Scalars['Int']>;
  afspraak?: Maybe<Afspraak>;
  transaction?: Maybe<BankTransaction>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  isAutomatischGeboekt?: Maybe<Scalars['Boolean']>;
};

/** GraphQL Organisatie model  */
export type Organisatie = {
  __typename?: 'Organisatie';
  id?: Maybe<Scalars['Int']>;
  weergaveNaam?: Maybe<Scalars['String']>;
  rekeningen?: Maybe<Array<Maybe<Rekening>>>;
  kvkNummer?: Maybe<Scalars['String']>;
  kvkDetails?: Maybe<OrganisatieKvK>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
};

export type OrganisatieKvK = {
  __typename?: 'OrganisatieKvK';
  nummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  huisnummer?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
};

export type Overschrijving = {
  __typename?: 'Overschrijving';
  id?: Maybe<Scalars['Int']>;
  afspraak?: Maybe<Afspraak>;
  export?: Maybe<Export>;
  datum?: Maybe<Scalars['String']>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  bankTransaction?: Maybe<BankTransaction>;
  status?: Maybe<OverschrijvingStatus>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
};

export enum OverschrijvingStatus {
  Gereed = 'GEREED',
  InBehandeling = 'IN_BEHANDELING',
  Verwachting = 'VERWACHTING'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  count?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type PlannedOverschijvingenQueryInput = {
  betaalinstructie: BetaalinstructieInput;
  bedrag: Scalars['Bedrag'];
  startDatum?: Maybe<Scalars['Date']>;
  eindDatum?: Maybe<Scalars['Date']>;
};

/** GraphQL Rekening model */
export type Rekening = {
  __typename?: 'Rekening';
  id?: Maybe<Scalars['Int']>;
  iban?: Maybe<Scalars['String']>;
  rekeninghouder?: Maybe<Scalars['String']>;
  burgers?: Maybe<Array<Maybe<Burger>>>;
  organisaties?: Maybe<Array<Maybe<Organisatie>>>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
};

export type RekeningInput = {
  iban?: Maybe<Scalars['String']>;
  rekeninghouder?: Maybe<Scalars['String']>;
};

/** The root of all mutations  */
export type RootMutation = {
  __typename?: 'RootMutation';
  createBurger?: Maybe<CreateBurger>;
  deleteBurger?: Maybe<DeleteBurger>;
  updateBurger?: Maybe<UpdateBurger>;
  createAfspraak?: Maybe<CreateAfspraak>;
  updateAfspraak?: Maybe<UpdateAfspraak>;
  deleteAfspraak?: Maybe<DeleteAfspraak>;
  updateAfspraakBetaalinstructie?: Maybe<UpdateAfspraakBetaalinstructie>;
  addAfspraakZoekterm?: Maybe<AddAfspraakZoekterm>;
  deleteAfspraakZoekterm?: Maybe<DeleteAfspraakZoekterm>;
  createOrganisatie?: Maybe<CreateOrganisatie>;
  updateOrganisatie?: Maybe<UpdateOrganisatie>;
  deleteOrganisatie?: Maybe<DeleteOrganisatie>;
  createBurgerRekening?: Maybe<CreateBurgerRekening>;
  deleteBurgerRekening?: Maybe<DeleteBurgerRekening>;
  createOrganisatieRekening?: Maybe<CreateOrganisatieRekening>;
  deleteOrganisatieRekening?: Maybe<DeleteOrganisatieRekening>;
  updateRekening?: Maybe<UpdateRekening>;
  deleteCustomerStatementMessage?: Maybe<DeleteCustomerStatementMessage>;
  createCustomerStatementMessage?: Maybe<CreateCustomerStatementMessage>;
  /** Create a Journaalpost with an Afspraak */
  createJournaalpostAfspraak?: Maybe<CreateJournaalpostAfspraak>;
  /** Create a Journaalpost with an Afspraak */
  createJournaalpostPerAfspraak?: Maybe<CreateJournaalpostPerAfspraak>;
  /** Create a Journaalpost with a Grootboekrekening */
  createJournaalpostGrootboekrekening?: Maybe<CreateJournaalpostGrootboekrekening>;
  /** Update a Journaalpost with a Grootboekrekening */
  updateJournaalpostGrootboekrekening?: Maybe<UpdateJournaalpostGrootboekrekening>;
  /** Delete journaalpost by id  */
  deleteJournaalpost?: Maybe<DeleteJournaalpost>;
  createRubriek?: Maybe<CreateRubriek>;
  updateRubriek?: Maybe<UpdateRubriek>;
  deleteRubriek?: Maybe<DeleteRubriek>;
  createConfiguratie?: Maybe<CreateConfiguratie>;
  updateConfiguratie?: Maybe<UpdateConfiguratie>;
  deleteConfiguratie?: Maybe<DeleteConfiguratie>;
  createExportOverschrijvingen?: Maybe<CreateExportOverschrijvingen>;
  startAutomatischBoeken?: Maybe<StartAutomatischBoeken>;
};


/** The root of all mutations  */
export type RootMutationCreateBurgerArgs = {
  input?: Maybe<CreateBurgerInput>;
};


/** The root of all mutations  */
export type RootMutationDeleteBurgerArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationUpdateBurgerArgs = {
  achternaam?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  geboortedatum?: Maybe<Scalars['String']>;
  huisnummer?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  telefoonnummer?: Maybe<Scalars['String']>;
  voorletters?: Maybe<Scalars['String']>;
  voornamen?: Maybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationCreateAfspraakArgs = {
  input: CreateAfspraakInput;
};


/** The root of all mutations  */
export type RootMutationUpdateAfspraakArgs = {
  id: Scalars['Int'];
  input: UpdateAfspraakInput;
};


/** The root of all mutations  */
export type RootMutationDeleteAfspraakArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationUpdateAfspraakBetaalinstructieArgs = {
  afspraakId: Scalars['Int'];
  betaalinstructie: BetaalinstructieInput;
};


/** The root of all mutations  */
export type RootMutationAddAfspraakZoektermArgs = {
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
};


/** The root of all mutations  */
export type RootMutationDeleteAfspraakZoektermArgs = {
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
};


/** The root of all mutations  */
export type RootMutationCreateOrganisatieArgs = {
  input?: Maybe<CreateOrganisatieInput>;
};


/** The root of all mutations  */
export type RootMutationUpdateOrganisatieArgs = {
  huisnummer?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  kvkNummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  weergaveNaam?: Maybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationDeleteOrganisatieArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationCreateBurgerRekeningArgs = {
  burgerId: Scalars['Int'];
  rekening: RekeningInput;
};


/** The root of all mutations  */
export type RootMutationDeleteBurgerRekeningArgs = {
  burgerId: Scalars['Int'];
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationCreateOrganisatieRekeningArgs = {
  organisatieId: Scalars['Int'];
  rekening: RekeningInput;
};


/** The root of all mutations  */
export type RootMutationDeleteOrganisatieRekeningArgs = {
  organisatieId: Scalars['Int'];
  rekeningId: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationUpdateRekeningArgs = {
  id: Scalars['Int'];
  rekening: RekeningInput;
};


/** The root of all mutations  */
export type RootMutationDeleteCustomerStatementMessageArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationCreateCustomerStatementMessageArgs = {
  file: Scalars['Upload'];
};


/** The root of all mutations  */
export type RootMutationCreateJournaalpostAfspraakArgs = {
  input?: Maybe<CreateJournaalpostAfspraakInput>;
};


/** The root of all mutations  */
export type RootMutationCreateJournaalpostPerAfspraakArgs = {
  input: Array<Maybe<CreateJournaalpostAfspraakInput>>;
};


/** The root of all mutations  */
export type RootMutationCreateJournaalpostGrootboekrekeningArgs = {
  input?: Maybe<CreateJournaalpostGrootboekrekeningInput>;
};


/** The root of all mutations  */
export type RootMutationUpdateJournaalpostGrootboekrekeningArgs = {
  input?: Maybe<UpdateJournaalpostGrootboekrekeningInput>;
};


/** The root of all mutations  */
export type RootMutationDeleteJournaalpostArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationCreateRubriekArgs = {
  grootboekrekeningId?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationUpdateRubriekArgs = {
  grootboekrekeningId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  naam?: Maybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationDeleteRubriekArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationCreateConfiguratieArgs = {
  input?: Maybe<ConfiguratieInput>;
};


/** The root of all mutations  */
export type RootMutationUpdateConfiguratieArgs = {
  input?: Maybe<ConfiguratieInput>;
};


/** The root of all mutations  */
export type RootMutationDeleteConfiguratieArgs = {
  id: Scalars['String'];
};


/** The root of all mutations  */
export type RootMutationCreateExportOverschrijvingenArgs = {
  eindDatum?: Maybe<Scalars['String']>;
  startDatum?: Maybe<Scalars['String']>;
};

/** The root of all queries  */
export type RootQuery = {
  __typename?: 'RootQuery';
  afspraak?: Maybe<Afspraak>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  bankTransaction?: Maybe<BankTransaction>;
  bankTransactions?: Maybe<Array<Maybe<BankTransaction>>>;
  bankTransactionsPaged?: Maybe<BankTransactionsPaged>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  customerStatementMessages?: Maybe<Array<Maybe<CustomerStatementMessage>>>;
  export?: Maybe<Export>;
  exports?: Maybe<Array<Maybe<Export>>>;
  burger?: Maybe<Burger>;
  burgers?: Maybe<Array<Maybe<Burger>>>;
  burgersPaged?: Maybe<BurgersPaged>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  grootboekrekeningen?: Maybe<Array<Maybe<Grootboekrekening>>>;
  journaalpost?: Maybe<Journaalpost>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  organisatie?: Maybe<Organisatie>;
  organisaties?: Maybe<Array<Maybe<Organisatie>>>;
  rekening?: Maybe<Rekening>;
  rekeningen?: Maybe<Array<Maybe<Rekening>>>;
  rubriek?: Maybe<Rubriek>;
  rubrieken?: Maybe<Array<Maybe<Rubriek>>>;
  configuratie?: Maybe<Configuratie>;
  configuraties?: Maybe<Array<Maybe<Configuratie>>>;
  plannedOverschrijvingen?: Maybe<Array<Maybe<Overschrijving>>>;
  gebruikersactiviteit?: Maybe<GebruikersActiviteit>;
  gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersActiviteit>>>;
  gebruikersactiviteitenPaged?: Maybe<GebruikersActiviteitenPaged>;
  gebruiker?: Maybe<Gebruiker>;
};


/** The root of all queries  */
export type RootQueryAfspraakArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryAfsprakenArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryBankTransactionArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryBankTransactionsArgs = {
  csms?: Maybe<Array<Maybe<Scalars['Int']>>>;
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryBankTransactionsPagedArgs = {
  start?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  csms?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryCustomerStatementMessageArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryCustomerStatementMessagesArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryExportArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryExportsArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  startDatum?: Maybe<Scalars['Date']>;
  eindDatum?: Maybe<Scalars['Date']>;
};


/** The root of all queries  */
export type RootQueryBurgerArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryBurgersArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryBurgersPagedArgs = {
  start?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


/** The root of all queries  */
export type RootQueryGrootboekrekeningArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQueryGrootboekrekeningenArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** The root of all queries  */
export type RootQueryJournaalpostArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryJournaalpostenArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryOrganisatieArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryOrganisatiesArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryRekeningArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryRekeningenArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryRubriekArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQueryRubriekenArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** The root of all queries  */
export type RootQueryConfiguratieArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQueryConfiguratiesArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** The root of all queries  */
export type RootQueryPlannedOverschrijvingenArgs = {
  input: PlannedOverschijvingenQueryInput;
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitenArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  burgerIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  afsprakenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitenPagedArgs = {
  start?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  burgerIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  afsprakenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

/** GraphQL Rubriek model */
export type Rubriek = {
  __typename?: 'Rubriek';
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  grootboekrekening?: Maybe<Grootboekrekening>;
};

export type StartAutomatischBoeken = {
  __typename?: 'StartAutomatischBoeken';
  ok?: Maybe<Scalars['Boolean']>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
};

export type UpdateAfspraak = {
  __typename?: 'UpdateAfspraak';
  ok?: Maybe<Scalars['Boolean']>;
  afspraak?: Maybe<Afspraak>;
  previous?: Maybe<Afspraak>;
};

export type UpdateAfspraakBetaalinstructie = {
  __typename?: 'UpdateAfspraakBetaalinstructie';
  ok?: Maybe<Scalars['Boolean']>;
  afspraak?: Maybe<Afspraak>;
  previous?: Maybe<Afspraak>;
};

export type UpdateAfspraakInput = {
  burgerId?: Maybe<Scalars['Int']>;
  credit?: Maybe<Scalars['Boolean']>;
  organisatieId?: Maybe<Scalars['Int']>;
  tegenRekeningId?: Maybe<Scalars['Int']>;
  rubriekId?: Maybe<Scalars['Int']>;
  omschrijving?: Maybe<Scalars['String']>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  validThrough?: Maybe<Scalars['String']>;
};

export type UpdateBurger = {
  __typename?: 'UpdateBurger';
  ok?: Maybe<Scalars['Boolean']>;
  burger?: Maybe<Burger>;
  previous?: Maybe<Burger>;
};

export type UpdateConfiguratie = {
  __typename?: 'UpdateConfiguratie';
  ok?: Maybe<Scalars['Boolean']>;
  configuratie?: Maybe<Configuratie>;
  previous?: Maybe<Configuratie>;
};

/** Update a Journaalpost with a Grootboekrekening */
export type UpdateJournaalpostGrootboekrekening = {
  __typename?: 'UpdateJournaalpostGrootboekrekening';
  ok?: Maybe<Scalars['Boolean']>;
  journaalpost?: Maybe<Journaalpost>;
  previous?: Maybe<Journaalpost>;
};

export type UpdateJournaalpostGrootboekrekeningInput = {
  id: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
};

export type UpdateOrganisatie = {
  __typename?: 'UpdateOrganisatie';
  ok?: Maybe<Scalars['Boolean']>;
  organisatie?: Maybe<Organisatie>;
  previous?: Maybe<Organisatie>;
};

export type UpdateRekening = {
  __typename?: 'UpdateRekening';
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
  previous?: Maybe<Rekening>;
};

export type UpdateRubriek = {
  __typename?: 'UpdateRubriek';
  ok?: Maybe<Scalars['Boolean']>;
  rubriek?: Maybe<Rubriek>;
  previous?: Maybe<Rubriek>;
};


export type AfspraakFragment = (
  { __typename?: 'Afspraak' }
  & Pick<Afspraak, 'id' | 'omschrijving' | 'bedrag' | 'credit' | 'zoektermen'>
  & { interval?: Maybe<(
    { __typename?: 'Interval' }
    & Pick<Interval, 'dagen' | 'weken' | 'maanden' | 'jaren'>
  )>, burger?: Maybe<(
    { __typename?: 'Burger' }
    & Pick<Burger, 'id' | 'voornamen' | 'voorletters' | 'achternaam' | 'plaatsnaam'>
    & { rekeningen?: Maybe<Array<Maybe<(
      { __typename?: 'Rekening' }
      & RekeningFragment
    )>>> }
  )>, tegenRekening?: Maybe<(
    { __typename?: 'Rekening' }
    & RekeningFragment
  )>, organisatie?: Maybe<(
    { __typename?: 'Organisatie' }
    & Pick<Organisatie, 'id' | 'weergaveNaam'>
    & { kvkDetails?: Maybe<(
      { __typename?: 'OrganisatieKvK' }
      & Pick<OrganisatieKvK, 'naam' | 'plaatsnaam'>
    )> }
  )>, rubriek?: Maybe<(
    { __typename?: 'Rubriek' }
    & RubriekFragment
  )>, matchingAfspraken?: Maybe<Array<Maybe<(
    { __typename?: 'Afspraak' }
    & Pick<Afspraak, 'id' | 'credit' | 'zoektermen' | 'bedrag' | 'omschrijving'>
    & { burger?: Maybe<(
      { __typename?: 'Burger' }
      & Pick<Burger, 'voorletters' | 'voornamen' | 'achternaam'>
    )>, interval?: Maybe<(
      { __typename?: 'Interval' }
      & Pick<Interval, 'dagen' | 'weken' | 'maanden' | 'jaren'>
    )>, tegenRekening?: Maybe<(
      { __typename?: 'Rekening' }
      & Pick<Rekening, 'id' | 'iban' | 'rekeninghouder'>
    )> }
  )>>> }
);

export type BurgerFragment = (
  { __typename?: 'Burger' }
  & Pick<Burger, 'id' | 'email' | 'telefoonnummer' | 'voorletters' | 'voornamen' | 'achternaam' | 'geboortedatum' | 'straatnaam' | 'huisnummer' | 'postcode' | 'plaatsnaam'>
  & { rekeningen?: Maybe<Array<Maybe<(
    { __typename?: 'Rekening' }
    & RekeningFragment
  )>>>, afspraken?: Maybe<Array<Maybe<(
    { __typename?: 'Afspraak' }
    & AfspraakFragment
  )>>> }
);

export type CustomerStatementMessageFragment = (
  { __typename?: 'CustomerStatementMessage' }
  & Pick<CustomerStatementMessage, 'id' | 'filename' | 'uploadDate' | 'accountIdentification' | 'closingAvailableFunds' | 'closingBalance' | 'forwardAvailableBalance' | 'openingBalance' | 'relatedReference' | 'sequenceNumber' | 'transactionReferenceNumber'>
  & { bankTransactions?: Maybe<Array<Maybe<(
    { __typename?: 'BankTransaction' }
    & BankTransactionFragment
  )>>> }
);

export type GebruikerFragment = (
  { __typename?: 'Gebruiker' }
  & Pick<Gebruiker, 'email'>
);

export type GebruikersactiviteitFragment = (
  { __typename?: 'GebruikersActiviteit' }
  & Pick<GebruikersActiviteit, 'id' | 'timestamp' | 'gebruikerId' | 'action'>
  & { entities?: Maybe<Array<Maybe<(
    { __typename?: 'GebruikersActiviteitEntity' }
    & Pick<GebruikersActiviteitEntity, 'entityType' | 'entityId'>
    & { burger?: Maybe<(
      { __typename?: 'Burger' }
      & Pick<Burger, 'id' | 'voorletters' | 'voornamen' | 'achternaam'>
    )>, organisatie?: Maybe<(
      { __typename?: 'Organisatie' }
      & Pick<Organisatie, 'id' | 'weergaveNaam'>
    )>, afspraak?: Maybe<(
      { __typename?: 'Afspraak' }
      & Pick<Afspraak, 'id'>
      & { organisatie?: Maybe<(
        { __typename?: 'Organisatie' }
        & Pick<Organisatie, 'id' | 'weergaveNaam'>
      )> }
    )>, rekening?: Maybe<(
      { __typename?: 'Rekening' }
      & Pick<Rekening, 'id' | 'iban' | 'rekeninghouder'>
    )>, customerStatementMessage?: Maybe<(
      { __typename?: 'CustomerStatementMessage' }
      & Pick<CustomerStatementMessage, 'id'>
    )>, configuratie?: Maybe<(
      { __typename?: 'Configuratie' }
      & Pick<Configuratie, 'id' | 'waarde'>
    )> }
  )>>>, meta?: Maybe<(
    { __typename?: 'GebruikersActiviteitMeta' }
    & Pick<GebruikersActiviteitMeta, 'userAgent' | 'ip' | 'applicationVersion'>
  )> }
);

export type GrootboekrekeningFragment = (
  { __typename?: 'Grootboekrekening' }
  & Pick<Grootboekrekening, 'id' | 'naam' | 'credit' | 'omschrijving' | 'referentie'>
  & { rubriek?: Maybe<(
    { __typename?: 'Rubriek' }
    & Pick<Rubriek, 'id' | 'naam'>
  )> }
);

export type JournaalpostFragment = (
  { __typename?: 'Journaalpost' }
  & Pick<Journaalpost, 'id'>
);

export type OrganisatieFragment = (
  { __typename?: 'Organisatie' }
  & Pick<Organisatie, 'id' | 'kvkNummer' | 'weergaveNaam'>
  & { rekeningen?: Maybe<Array<Maybe<(
    { __typename?: 'Rekening' }
    & RekeningFragment
  )>>> }
  & KvkFragment
);

export type KvkFragment = (
  { __typename?: 'Organisatie' }
  & { kvkDetails?: Maybe<(
    { __typename?: 'OrganisatieKvK' }
    & Pick<OrganisatieKvK, 'huisnummer' | 'naam' | 'nummer' | 'plaatsnaam' | 'postcode' | 'straatnaam'>
  )> }
);

export type RekeningFragment = (
  { __typename?: 'Rekening' }
  & Pick<Rekening, 'id' | 'iban' | 'rekeninghouder'>
);

export type RubriekFragment = (
  { __typename?: 'Rubriek' }
  & Pick<Rubriek, 'id' | 'naam'>
  & { grootboekrekening?: Maybe<(
    { __typename?: 'Grootboekrekening' }
    & GrootboekrekeningFragment
  )> }
);

export type BankTransactionFragment = (
  { __typename?: 'BankTransaction' }
  & Pick<BankTransaction, 'id' | 'informationToAccountOwner' | 'statementLine' | 'bedrag' | 'isCredit' | 'tegenRekeningIban' | 'transactieDatum'>
  & { tegenRekening?: Maybe<(
    { __typename?: 'Rekening' }
    & Pick<Rekening, 'iban' | 'rekeninghouder'>
  )> }
);

export type AddAfspraakZoektermMutationVariables = Exact<{
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
}>;


export type AddAfspraakZoektermMutation = (
  { __typename?: 'RootMutation' }
  & { addAfspraakZoekterm?: Maybe<(
    { __typename?: 'AddAfspraakZoekterm' }
    & Pick<AddAfspraakZoekterm, 'ok'>
    & { matchingAfspraken?: Maybe<Array<Maybe<(
      { __typename?: 'Afspraak' }
      & Pick<Afspraak, 'id' | 'zoektermen' | 'bedrag'>
      & { burger?: Maybe<(
        { __typename?: 'Burger' }
        & Pick<Burger, 'id' | 'voorletters' | 'voornamen' | 'achternaam'>
      )>, tegenRekening?: Maybe<(
        { __typename?: 'Rekening' }
        & Pick<Rekening, 'rekeninghouder' | 'iban'>
      )> }
    )>>> }
  )> }
);

export type CreateAfspraakMutationVariables = Exact<{
  input: CreateAfspraakInput;
}>;


export type CreateAfspraakMutation = (
  { __typename?: 'RootMutation' }
  & { createAfspraak?: Maybe<(
    { __typename?: 'CreateAfspraak' }
    & Pick<CreateAfspraak, 'ok'>
    & { afspraak?: Maybe<(
      { __typename?: 'Afspraak' }
      & AfspraakFragment
    )> }
  )> }
);

export type CreateBurgerMutationVariables = Exact<{
  input?: Maybe<CreateBurgerInput>;
}>;


export type CreateBurgerMutation = (
  { __typename?: 'RootMutation' }
  & { createBurger?: Maybe<(
    { __typename?: 'CreateBurger' }
    & Pick<CreateBurger, 'ok'>
    & { burger?: Maybe<(
      { __typename?: 'Burger' }
      & BurgerFragment
    )> }
  )> }
);

export type CreateBurgerRekeningMutationVariables = Exact<{
  burgerId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateBurgerRekeningMutation = (
  { __typename?: 'RootMutation' }
  & { createBurgerRekening?: Maybe<(
    { __typename?: 'CreateBurgerRekening' }
    & Pick<CreateBurgerRekening, 'ok'>
    & { rekening?: Maybe<(
      { __typename?: 'Rekening' }
      & RekeningFragment
    )> }
  )> }
);

export type CreateConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type CreateConfiguratieMutation = (
  { __typename?: 'RootMutation' }
  & { createConfiguratie?: Maybe<(
    { __typename?: 'CreateConfiguratie' }
    & Pick<CreateConfiguratie, 'ok'>
    & { configuratie?: Maybe<(
      { __typename?: 'Configuratie' }
      & Pick<Configuratie, 'id' | 'waarde'>
    )> }
  )> }
);

export type CreateCustomerStatementMessageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type CreateCustomerStatementMessageMutation = (
  { __typename?: 'RootMutation' }
  & { createCustomerStatementMessage?: Maybe<(
    { __typename?: 'CreateCustomerStatementMessage' }
    & Pick<CreateCustomerStatementMessage, 'ok'>
    & { customerStatementMessage?: Maybe<(
      { __typename?: 'CustomerStatementMessage' }
      & CustomerStatementMessageFragment
    )> }
  )> }
);

export type CreateExportOverschrijvingenMutationVariables = Exact<{
  startDatum: Scalars['String'];
  eindDatum: Scalars['String'];
}>;


export type CreateExportOverschrijvingenMutation = (
  { __typename?: 'RootMutation' }
  & { createExportOverschrijvingen?: Maybe<(
    { __typename?: 'CreateExportOverschrijvingen' }
    & Pick<CreateExportOverschrijvingen, 'ok'>
    & { export?: Maybe<(
      { __typename?: 'Export' }
      & Pick<Export, 'id'>
    )> }
  )> }
);

export type CreateJournaalpostAfspraakMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  afspraakId: Scalars['Int'];
  isAutomatischGeboekt?: Maybe<Scalars['Boolean']>;
}>;


export type CreateJournaalpostAfspraakMutation = (
  { __typename?: 'RootMutation' }
  & { createJournaalpostAfspraak?: Maybe<(
    { __typename?: 'CreateJournaalpostAfspraak' }
    & Pick<CreateJournaalpostAfspraak, 'ok'>
    & { journaalpost?: Maybe<(
      { __typename?: 'Journaalpost' }
      & Pick<Journaalpost, 'id'>
    )> }
  )> }
);

export type CreateJournaalpostGrootboekrekeningMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
}>;


export type CreateJournaalpostGrootboekrekeningMutation = (
  { __typename?: 'RootMutation' }
  & { createJournaalpostGrootboekrekening?: Maybe<(
    { __typename?: 'CreateJournaalpostGrootboekrekening' }
    & Pick<CreateJournaalpostGrootboekrekening, 'ok'>
    & { journaalpost?: Maybe<(
      { __typename?: 'Journaalpost' }
      & Pick<Journaalpost, 'id'>
    )> }
  )> }
);

export type CreateOrganisatieMutationVariables = Exact<{
  huisnummer?: Maybe<Scalars['String']>;
  kvkNummer: Scalars['String'];
  naam?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  weergaveNaam: Scalars['String'];
}>;


export type CreateOrganisatieMutation = (
  { __typename?: 'RootMutation' }
  & { createOrganisatie?: Maybe<(
    { __typename?: 'CreateOrganisatie' }
    & Pick<CreateOrganisatie, 'ok'>
    & { organisatie?: Maybe<(
      { __typename?: 'Organisatie' }
      & OrganisatieFragment
    )> }
  )> }
);

export type CreateOrganisatieRekeningMutationVariables = Exact<{
  orgId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateOrganisatieRekeningMutation = (
  { __typename?: 'RootMutation' }
  & { createOrganisatieRekening?: Maybe<(
    { __typename?: 'CreateOrganisatieRekening' }
    & Pick<CreateOrganisatieRekening, 'ok'>
    & { rekening?: Maybe<(
      { __typename?: 'Rekening' }
      & RekeningFragment
    )> }
  )> }
);

export type DeleteOrganisatieMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteOrganisatieMutation = (
  { __typename?: 'RootMutation' }
  & { deleteOrganisatie?: Maybe<(
    { __typename?: 'DeleteOrganisatie' }
    & Pick<DeleteOrganisatie, 'ok'>
  )> }
);

export type DeleteAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteAfspraakMutation = (
  { __typename?: 'RootMutation' }
  & { deleteAfspraak?: Maybe<(
    { __typename?: 'DeleteAfspraak' }
    & Pick<DeleteAfspraak, 'ok'>
  )> }
);

export type DeleteAfspraakZoektermMutationVariables = Exact<{
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
}>;


export type DeleteAfspraakZoektermMutation = (
  { __typename?: 'RootMutation' }
  & { deleteAfspraakZoekterm?: Maybe<(
    { __typename?: 'DeleteAfspraakZoekterm' }
    & Pick<DeleteAfspraakZoekterm, 'ok'>
    & { matchingAfspraken?: Maybe<Array<Maybe<(
      { __typename?: 'Afspraak' }
      & Pick<Afspraak, 'id' | 'zoektermen' | 'bedrag'>
      & { burger?: Maybe<(
        { __typename?: 'Burger' }
        & Pick<Burger, 'id' | 'voorletters' | 'voornamen' | 'achternaam'>
      )>, tegenRekening?: Maybe<(
        { __typename?: 'Rekening' }
        & Pick<Rekening, 'rekeninghouder' | 'iban'>
      )> }
    )>>> }
  )> }
);

export type DeleteBurgerMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteBurgerMutation = (
  { __typename?: 'RootMutation' }
  & { deleteBurger?: Maybe<(
    { __typename?: 'DeleteBurger' }
    & Pick<DeleteBurger, 'ok'>
  )> }
);

export type DeleteBurgerRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  burgerId: Scalars['Int'];
}>;


export type DeleteBurgerRekeningMutation = (
  { __typename?: 'RootMutation' }
  & { deleteBurgerRekening?: Maybe<(
    { __typename?: 'DeleteBurgerRekening' }
    & Pick<DeleteBurgerRekening, 'ok'>
  )> }
);

export type DeleteConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
}>;


export type DeleteConfiguratieMutation = (
  { __typename?: 'RootMutation' }
  & { deleteConfiguratie?: Maybe<(
    { __typename?: 'DeleteConfiguratie' }
    & Pick<DeleteConfiguratie, 'ok'>
  )> }
);

export type DeleteCustomerStatementMessageMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCustomerStatementMessageMutation = (
  { __typename?: 'RootMutation' }
  & { deleteCustomerStatementMessage?: Maybe<(
    { __typename?: 'DeleteCustomerStatementMessage' }
    & Pick<DeleteCustomerStatementMessage, 'ok'>
  )> }
);

export type DeleteJournaalpostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteJournaalpostMutation = (
  { __typename?: 'RootMutation' }
  & { deleteJournaalpost?: Maybe<(
    { __typename?: 'DeleteJournaalpost' }
    & Pick<DeleteJournaalpost, 'ok'>
  )> }
);

export type DeleteOrganisatieRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  orgId: Scalars['Int'];
}>;


export type DeleteOrganisatieRekeningMutation = (
  { __typename?: 'RootMutation' }
  & { deleteOrganisatieRekening?: Maybe<(
    { __typename?: 'DeleteOrganisatieRekening' }
    & Pick<DeleteOrganisatieRekening, 'ok'>
  )> }
);

export type EndAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  validThrough: Scalars['String'];
}>;


export type EndAfspraakMutation = (
  { __typename?: 'RootMutation' }
  & { updateAfspraak?: Maybe<(
    { __typename?: 'UpdateAfspraak' }
    & Pick<UpdateAfspraak, 'ok'>
    & { afspraak?: Maybe<(
      { __typename?: 'Afspraak' }
      & AfspraakFragment
    )> }
  )> }
);

export type StartAutomatischBoekenMutationVariables = Exact<{ [key: string]: never; }>;


export type StartAutomatischBoekenMutation = (
  { __typename?: 'RootMutation' }
  & { startAutomatischBoeken?: Maybe<(
    { __typename?: 'StartAutomatischBoeken' }
    & Pick<StartAutomatischBoeken, 'ok'>
    & { journaalposten?: Maybe<Array<Maybe<(
      { __typename?: 'Journaalpost' }
      & Pick<Journaalpost, 'id'>
    )>>> }
  )> }
);

export type UpdateAfspraakBetaalinstructieMutationVariables = Exact<{
  id: Scalars['Int'];
  betaalinstructie: BetaalinstructieInput;
}>;


export type UpdateAfspraakBetaalinstructieMutation = (
  { __typename?: 'RootMutation' }
  & { updateAfspraakBetaalinstructie?: Maybe<(
    { __typename?: 'UpdateAfspraakBetaalinstructie' }
    & Pick<UpdateAfspraakBetaalinstructie, 'ok'>
  )> }
);

export type UpdateAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateAfspraakInput;
}>;


export type UpdateAfspraakMutation = (
  { __typename?: 'RootMutation' }
  & { updateAfspraak?: Maybe<(
    { __typename?: 'UpdateAfspraak' }
    & Pick<UpdateAfspraak, 'ok'>
    & { afspraak?: Maybe<(
      { __typename?: 'Afspraak' }
      & AfspraakFragment
    )> }
  )> }
);

export type UpdateBurgerMutationVariables = Exact<{
  id: Scalars['Int'];
  voorletters?: Maybe<Scalars['String']>;
  voornamen?: Maybe<Scalars['String']>;
  achternaam?: Maybe<Scalars['String']>;
  geboortedatum?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  huisnummer?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  telefoonnummer?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
}>;


export type UpdateBurgerMutation = (
  { __typename?: 'RootMutation' }
  & { updateBurger?: Maybe<(
    { __typename?: 'UpdateBurger' }
    & Pick<UpdateBurger, 'ok'>
    & { burger?: Maybe<(
      { __typename?: 'Burger' }
      & BurgerFragment
    )> }
  )> }
);

export type UpdateConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type UpdateConfiguratieMutation = (
  { __typename?: 'RootMutation' }
  & { updateConfiguratie?: Maybe<(
    { __typename?: 'UpdateConfiguratie' }
    & Pick<UpdateConfiguratie, 'ok'>
    & { configuratie?: Maybe<(
      { __typename?: 'Configuratie' }
      & Pick<Configuratie, 'id' | 'waarde'>
    )> }
  )> }
);

export type UpdateJournaalpostGrootboekrekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
}>;


export type UpdateJournaalpostGrootboekrekeningMutation = (
  { __typename?: 'RootMutation' }
  & { updateJournaalpostGrootboekrekening?: Maybe<(
    { __typename?: 'UpdateJournaalpostGrootboekrekening' }
    & Pick<UpdateJournaalpostGrootboekrekening, 'ok'>
  )> }
);

export type UpdateOrganisatieMutationVariables = Exact<{
  id: Scalars['Int'];
  huisnummer?: Maybe<Scalars['String']>;
  kvkNummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  weergaveNaam?: Maybe<Scalars['String']>;
}>;


export type UpdateOrganisatieMutation = (
  { __typename?: 'RootMutation' }
  & { updateOrganisatie?: Maybe<(
    { __typename?: 'UpdateOrganisatie' }
    & Pick<UpdateOrganisatie, 'ok'>
    & { organisatie?: Maybe<(
      { __typename?: 'Organisatie' }
      & OrganisatieFragment
    )> }
  )> }
);

export type UpdateRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  iban?: Maybe<Scalars['String']>;
  rekeninghouder?: Maybe<Scalars['String']>;
}>;


export type UpdateRekeningMutation = (
  { __typename?: 'RootMutation' }
  & { updateRekening?: Maybe<(
    { __typename?: 'UpdateRekening' }
    & Pick<UpdateRekening, 'ok'>
  )> }
);

export type GetAfspraakFormDataQueryVariables = Exact<{
  afspraakId: Scalars['Int'];
}>;


export type GetAfspraakFormDataQuery = (
  { __typename?: 'RootQuery' }
  & { afspraak?: Maybe<(
    { __typename?: 'Afspraak' }
    & AfspraakFragment
  )>, rubrieken?: Maybe<Array<Maybe<(
    { __typename?: 'Rubriek' }
    & { grootboekrekening?: Maybe<(
      { __typename?: 'Grootboekrekening' }
      & Pick<Grootboekrekening, 'id' | 'naam' | 'credit'>
    )> }
    & RubriekFragment
  )>>>, organisaties?: Maybe<Array<Maybe<(
    { __typename?: 'Organisatie' }
    & OrganisatieFragment
  )>>> }
);

export type GetAfsprakenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAfsprakenQuery = (
  { __typename?: 'RootQuery' }
  & { afspraken?: Maybe<Array<Maybe<(
    { __typename?: 'Afspraak' }
    & AfspraakFragment
  )>>> }
);

export type GetBurgerAfsprakenQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerAfsprakenQuery = (
  { __typename?: 'RootQuery' }
  & { burger?: Maybe<(
    { __typename?: 'Burger' }
    & { afspraken?: Maybe<Array<Maybe<(
      { __typename?: 'Afspraak' }
      & AfspraakFragment
    )>>> }
  )> }
);

export type GetBurgerGebeurtenissenQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetBurgerGebeurtenissenQuery = (
  { __typename?: 'RootQuery' }
  & { gebruikersactiviteitenPaged?: Maybe<(
    { __typename?: 'GebruikersActiviteitenPaged' }
    & { gebruikersactiviteiten?: Maybe<Array<Maybe<(
      { __typename?: 'GebruikersActiviteit' }
      & GebruikersactiviteitFragment
    )>>>, pageInfo?: Maybe<(
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'count'>
    )> }
  )> }
);

export type GetBurgerQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerQuery = (
  { __typename?: 'RootQuery' }
  & { burger?: Maybe<(
    { __typename?: 'Burger' }
    & BurgerFragment
  )> }
);

export type GetBurgersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBurgersQuery = (
  { __typename?: 'RootQuery' }
  & { burgers?: Maybe<Array<Maybe<(
    { __typename?: 'Burger' }
    & BurgerFragment
  )>>> }
);

export type GetConfiguratieQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConfiguratieQuery = (
  { __typename?: 'RootQuery' }
  & { configuraties?: Maybe<Array<Maybe<(
    { __typename?: 'Configuratie' }
    & Pick<Configuratie, 'id' | 'waarde'>
  )>>> }
);

export type GetCreateAfspraakFormDataQueryVariables = Exact<{
  burgerId: Scalars['Int'];
}>;


export type GetCreateAfspraakFormDataQuery = (
  { __typename?: 'RootQuery' }
  & { burger?: Maybe<(
    { __typename?: 'Burger' }
    & { rekeningen?: Maybe<Array<Maybe<(
      { __typename?: 'Rekening' }
      & RekeningFragment
    )>>> }
  )>, rubrieken?: Maybe<Array<Maybe<(
    { __typename?: 'Rubriek' }
    & { grootboekrekening?: Maybe<(
      { __typename?: 'Grootboekrekening' }
      & Pick<Grootboekrekening, 'id' | 'naam' | 'credit'>
    )> }
    & RubriekFragment
  )>>>, organisaties?: Maybe<Array<Maybe<(
    { __typename?: 'Organisatie' }
    & OrganisatieFragment
  )>>> }
);

export type GetCsmsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCsmsQuery = (
  { __typename?: 'RootQuery' }
  & { customerStatementMessages?: Maybe<Array<Maybe<(
    { __typename?: 'CustomerStatementMessage' }
    & CustomerStatementMessageFragment
  )>>> }
);

export type GetExportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExportsQuery = (
  { __typename?: 'RootQuery' }
  & { exports?: Maybe<Array<Maybe<(
    { __typename?: 'Export' }
    & Pick<Export, 'id' | 'naam' | 'timestamp' | 'startDatum' | 'eindDatum'>
    & { overschrijvingen?: Maybe<Array<Maybe<(
      { __typename?: 'Overschrijving' }
      & Pick<Overschrijving, 'id'>
    )>>> }
  )>>> }
);

export type GetGebeurtenissenQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetGebeurtenissenQuery = (
  { __typename?: 'RootQuery' }
  & { gebruikersactiviteitenPaged?: Maybe<(
    { __typename?: 'GebruikersActiviteitenPaged' }
    & { gebruikersactiviteiten?: Maybe<Array<Maybe<(
      { __typename?: 'GebruikersActiviteit' }
      & GebruikersactiviteitFragment
    )>>>, pageInfo?: Maybe<(
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'count'>
    )> }
  )> }
);

export type GetGebruikerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGebruikerQuery = (
  { __typename?: 'RootQuery' }
  & { gebruiker?: Maybe<(
    { __typename?: 'Gebruiker' }
    & GebruikerFragment
  )> }
);

export type GetAfspraakQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetAfspraakQuery = (
  { __typename?: 'RootQuery' }
  & { afspraak?: Maybe<(
    { __typename?: 'Afspraak' }
    & AfspraakFragment
  )> }
);

export type GetOrganisatieQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetOrganisatieQuery = (
  { __typename?: 'RootQuery' }
  & { organisatie?: Maybe<(
    { __typename?: 'Organisatie' }
    & OrganisatieFragment
  )> }
);

export type GetOrganisatiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganisatiesQuery = (
  { __typename?: 'RootQuery' }
  & { organisaties?: Maybe<Array<Maybe<(
    { __typename?: 'Organisatie' }
    & Pick<Organisatie, 'id'>
    & OrganisatieFragment
  )>>> }
);

export type GetReportingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReportingDataQuery = (
  { __typename?: 'RootQuery' }
  & { burgers?: Maybe<Array<Maybe<(
    { __typename?: 'Burger' }
    & BurgerFragment
  )>>>, bankTransactions?: Maybe<Array<Maybe<(
    { __typename?: 'BankTransaction' }
    & { journaalpost?: Maybe<(
      { __typename?: 'Journaalpost' }
      & Pick<Journaalpost, 'id' | 'isAutomatischGeboekt'>
      & { afspraak?: Maybe<(
        { __typename?: 'Afspraak' }
        & { rubriek?: Maybe<(
          { __typename?: 'Rubriek' }
          & Pick<Rubriek, 'id' | 'naam'>
        )> }
        & AfspraakFragment
      )>, grootboekrekening?: Maybe<(
        { __typename?: 'Grootboekrekening' }
        & { rubriek?: Maybe<(
          { __typename?: 'Rubriek' }
          & Pick<Rubriek, 'id' | 'naam'>
        )> }
        & GrootboekrekeningFragment
      )> }
    )> }
    & BankTransactionFragment
  )>>>, rubrieken?: Maybe<Array<Maybe<(
    { __typename?: 'Rubriek' }
    & Pick<Rubriek, 'id' | 'naam'>
  )>>> }
);

export type GetRubriekenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRubriekenQuery = (
  { __typename?: 'RootQuery' }
  & { rubrieken?: Maybe<Array<Maybe<(
    { __typename?: 'Rubriek' }
    & { grootboekrekening?: Maybe<(
      { __typename?: 'Grootboekrekening' }
      & Pick<Grootboekrekening, 'id' | 'naam'>
    )> }
    & RubriekFragment
  )>>> }
);

export type GetTransactionItemFormDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTransactionItemFormDataQuery = (
  { __typename?: 'RootQuery' }
  & { rubrieken?: Maybe<Array<Maybe<(
    { __typename?: 'Rubriek' }
    & { grootboekrekening?: Maybe<(
      { __typename?: 'Grootboekrekening' }
      & Pick<Grootboekrekening, 'id' | 'naam'>
    )> }
    & RubriekFragment
  )>>>, afspraken?: Maybe<Array<Maybe<(
    { __typename?: 'Afspraak' }
    & AfspraakFragment
  )>>> }
);

export type GetTransactiesQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type GetTransactiesQuery = (
  { __typename?: 'RootQuery' }
  & { bankTransactionsPaged?: Maybe<(
    { __typename?: 'BankTransactionsPaged' }
    & { banktransactions?: Maybe<Array<Maybe<(
      { __typename?: 'BankTransaction' }
      & { journaalpost?: Maybe<(
        { __typename?: 'Journaalpost' }
        & Pick<Journaalpost, 'id' | 'isAutomatischGeboekt'>
        & { afspraak?: Maybe<(
          { __typename?: 'Afspraak' }
          & { rubriek?: Maybe<(
            { __typename?: 'Rubriek' }
            & Pick<Rubriek, 'id' | 'naam'>
          )> }
          & AfspraakFragment
        )>, grootboekrekening?: Maybe<(
          { __typename?: 'Grootboekrekening' }
          & { rubriek?: Maybe<(
            { __typename?: 'Rubriek' }
            & Pick<Rubriek, 'id' | 'naam'>
          )> }
          & GrootboekrekeningFragment
        )> }
      )>, suggesties?: Maybe<Array<Maybe<(
        { __typename?: 'Afspraak' }
        & AfspraakFragment
      )>>> }
      & BankTransactionFragment
    )>>>, pageInfo?: Maybe<(
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'count' | 'limit' | 'start'>
    )> }
  )> }
);

export const RekeningFragmentDoc = gql`
    fragment Rekening on Rekening {
  id
  iban
  rekeninghouder
}
    `;
export const GrootboekrekeningFragmentDoc = gql`
    fragment Grootboekrekening on Grootboekrekening {
  id
  naam
  credit
  omschrijving
  referentie
  rubriek {
    id
    naam
  }
}
    `;
export const RubriekFragmentDoc = gql`
    fragment Rubriek on Rubriek {
  id
  naam
  grootboekrekening {
    ...Grootboekrekening
  }
}
    ${GrootboekrekeningFragmentDoc}`;
export const AfspraakFragmentDoc = gql`
    fragment Afspraak on Afspraak {
  id
  omschrijving
  interval {
    dagen
    weken
    maanden
    jaren
  }
  burger {
    id
    voornamen
    voorletters
    achternaam
    plaatsnaam
    rekeningen {
      ...Rekening
    }
  }
  tegenRekening {
    ...Rekening
  }
  organisatie {
    id
    weergaveNaam
    kvkDetails {
      naam
      plaatsnaam
    }
  }
  bedrag
  credit
  zoektermen
  rubriek {
    ...Rubriek
  }
  matchingAfspraken {
    id
    credit
    burger {
      voorletters
      voornamen
      achternaam
    }
    zoektermen
    bedrag
    omschrijving
    interval {
      dagen
      weken
      maanden
      jaren
    }
    tegenRekening {
      id
      iban
      rekeninghouder
    }
  }
}
    ${RekeningFragmentDoc}
${RubriekFragmentDoc}`;
export const BurgerFragmentDoc = gql`
    fragment Burger on Burger {
  id
  email
  telefoonnummer
  voorletters
  voornamen
  achternaam
  geboortedatum
  straatnaam
  huisnummer
  postcode
  plaatsnaam
  rekeningen {
    ...Rekening
  }
  afspraken {
    ...Afspraak
  }
}
    ${RekeningFragmentDoc}
${AfspraakFragmentDoc}`;
export const BankTransactionFragmentDoc = gql`
    fragment BankTransaction on BankTransaction {
  id
  informationToAccountOwner
  statementLine
  bedrag
  isCredit
  tegenRekeningIban
  tegenRekening {
    iban
    rekeninghouder
  }
  transactieDatum
}
    `;
export const CustomerStatementMessageFragmentDoc = gql`
    fragment CustomerStatementMessage on CustomerStatementMessage {
  id
  filename
  uploadDate
  accountIdentification
  closingAvailableFunds
  closingBalance
  forwardAvailableBalance
  openingBalance
  relatedReference
  sequenceNumber
  transactionReferenceNumber
  bankTransactions {
    ...BankTransaction
  }
}
    ${BankTransactionFragmentDoc}`;
export const GebruikerFragmentDoc = gql`
    fragment Gebruiker on Gebruiker {
  email
}
    `;
export const GebruikersactiviteitFragmentDoc = gql`
    fragment Gebruikersactiviteit on GebruikersActiviteit {
  id
  timestamp
  gebruikerId
  action
  entities {
    entityType
    entityId
    burger {
      id
      voorletters
      voornamen
      achternaam
    }
    organisatie {
      id
      weergaveNaam
    }
    afspraak {
      id
      organisatie {
        id
        weergaveNaam
      }
    }
    rekening {
      id
      iban
      rekeninghouder
    }
    customerStatementMessage {
      id
    }
    configuratie {
      id
      waarde
    }
  }
  meta {
    userAgent
    ip
    applicationVersion
  }
}
    `;
export const JournaalpostFragmentDoc = gql`
    fragment Journaalpost on Journaalpost {
  id
}
    `;
export const KvkFragmentDoc = gql`
    fragment Kvk on Organisatie {
  kvkDetails {
    huisnummer
    naam
    nummer
    plaatsnaam
    postcode
    straatnaam
  }
}
    `;
export const OrganisatieFragmentDoc = gql`
    fragment Organisatie on Organisatie {
  id
  kvkNummer
  weergaveNaam
  rekeningen {
    ...Rekening
  }
  ...Kvk
}
    ${RekeningFragmentDoc}
${KvkFragmentDoc}`;
export const AddAfspraakZoektermDocument = gql`
    mutation addAfspraakZoekterm($afspraakId: Int!, $zoekterm: String!) {
  addAfspraakZoekterm(afspraakId: $afspraakId, zoekterm: $zoekterm) {
    ok
    matchingAfspraken {
      id
      zoektermen
      bedrag
      burger {
        id
        voorletters
        voornamen
        achternaam
      }
      tegenRekening {
        rekeninghouder
        iban
      }
    }
  }
}
    `;
export type AddAfspraakZoektermMutationFn = Apollo.MutationFunction<AddAfspraakZoektermMutation, AddAfspraakZoektermMutationVariables>;

/**
 * __useAddAfspraakZoektermMutation__
 *
 * To run a mutation, you first call `useAddAfspraakZoektermMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAfspraakZoektermMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAfspraakZoektermMutation, { data, loading, error }] = useAddAfspraakZoektermMutation({
 *   variables: {
 *      afspraakId: // value for 'afspraakId'
 *      zoekterm: // value for 'zoekterm'
 *   },
 * });
 */
export function useAddAfspraakZoektermMutation(baseOptions?: Apollo.MutationHookOptions<AddAfspraakZoektermMutation, AddAfspraakZoektermMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAfspraakZoektermMutation, AddAfspraakZoektermMutationVariables>(AddAfspraakZoektermDocument, options);
      }
export type AddAfspraakZoektermMutationHookResult = ReturnType<typeof useAddAfspraakZoektermMutation>;
export type AddAfspraakZoektermMutationResult = Apollo.MutationResult<AddAfspraakZoektermMutation>;
export type AddAfspraakZoektermMutationOptions = Apollo.BaseMutationOptions<AddAfspraakZoektermMutation, AddAfspraakZoektermMutationVariables>;
export const CreateAfspraakDocument = gql`
    mutation createAfspraak($input: CreateAfspraakInput!) {
  createAfspraak(input: $input) {
    ok
    afspraak {
      ...Afspraak
    }
  }
}
    ${AfspraakFragmentDoc}`;
export type CreateAfspraakMutationFn = Apollo.MutationFunction<CreateAfspraakMutation, CreateAfspraakMutationVariables>;

/**
 * __useCreateAfspraakMutation__
 *
 * To run a mutation, you first call `useCreateAfspraakMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAfspraakMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAfspraakMutation, { data, loading, error }] = useCreateAfspraakMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAfspraakMutation(baseOptions?: Apollo.MutationHookOptions<CreateAfspraakMutation, CreateAfspraakMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAfspraakMutation, CreateAfspraakMutationVariables>(CreateAfspraakDocument, options);
      }
export type CreateAfspraakMutationHookResult = ReturnType<typeof useCreateAfspraakMutation>;
export type CreateAfspraakMutationResult = Apollo.MutationResult<CreateAfspraakMutation>;
export type CreateAfspraakMutationOptions = Apollo.BaseMutationOptions<CreateAfspraakMutation, CreateAfspraakMutationVariables>;
export const CreateBurgerDocument = gql`
    mutation createBurger($input: CreateBurgerInput) {
  createBurger(input: $input) {
    ok
    burger {
      ...Burger
    }
  }
}
    ${BurgerFragmentDoc}`;
export type CreateBurgerMutationFn = Apollo.MutationFunction<CreateBurgerMutation, CreateBurgerMutationVariables>;

/**
 * __useCreateBurgerMutation__
 *
 * To run a mutation, you first call `useCreateBurgerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBurgerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBurgerMutation, { data, loading, error }] = useCreateBurgerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBurgerMutation(baseOptions?: Apollo.MutationHookOptions<CreateBurgerMutation, CreateBurgerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBurgerMutation, CreateBurgerMutationVariables>(CreateBurgerDocument, options);
      }
export type CreateBurgerMutationHookResult = ReturnType<typeof useCreateBurgerMutation>;
export type CreateBurgerMutationResult = Apollo.MutationResult<CreateBurgerMutation>;
export type CreateBurgerMutationOptions = Apollo.BaseMutationOptions<CreateBurgerMutation, CreateBurgerMutationVariables>;
export const CreateBurgerRekeningDocument = gql`
    mutation createBurgerRekening($burgerId: Int!, $rekening: RekeningInput!) {
  createBurgerRekening(burgerId: $burgerId, rekening: $rekening) {
    ok
    rekening {
      ...Rekening
    }
  }
}
    ${RekeningFragmentDoc}`;
export type CreateBurgerRekeningMutationFn = Apollo.MutationFunction<CreateBurgerRekeningMutation, CreateBurgerRekeningMutationVariables>;

/**
 * __useCreateBurgerRekeningMutation__
 *
 * To run a mutation, you first call `useCreateBurgerRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBurgerRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBurgerRekeningMutation, { data, loading, error }] = useCreateBurgerRekeningMutation({
 *   variables: {
 *      burgerId: // value for 'burgerId'
 *      rekening: // value for 'rekening'
 *   },
 * });
 */
export function useCreateBurgerRekeningMutation(baseOptions?: Apollo.MutationHookOptions<CreateBurgerRekeningMutation, CreateBurgerRekeningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBurgerRekeningMutation, CreateBurgerRekeningMutationVariables>(CreateBurgerRekeningDocument, options);
      }
export type CreateBurgerRekeningMutationHookResult = ReturnType<typeof useCreateBurgerRekeningMutation>;
export type CreateBurgerRekeningMutationResult = Apollo.MutationResult<CreateBurgerRekeningMutation>;
export type CreateBurgerRekeningMutationOptions = Apollo.BaseMutationOptions<CreateBurgerRekeningMutation, CreateBurgerRekeningMutationVariables>;
export const CreateConfiguratieDocument = gql`
    mutation createConfiguratie($key: String!, $value: String!) {
  createConfiguratie(input: {id: $key, waarde: $value}) {
    ok
    configuratie {
      id
      waarde
    }
  }
}
    `;
export type CreateConfiguratieMutationFn = Apollo.MutationFunction<CreateConfiguratieMutation, CreateConfiguratieMutationVariables>;

/**
 * __useCreateConfiguratieMutation__
 *
 * To run a mutation, you first call `useCreateConfiguratieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConfiguratieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConfiguratieMutation, { data, loading, error }] = useCreateConfiguratieMutation({
 *   variables: {
 *      key: // value for 'key'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useCreateConfiguratieMutation(baseOptions?: Apollo.MutationHookOptions<CreateConfiguratieMutation, CreateConfiguratieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConfiguratieMutation, CreateConfiguratieMutationVariables>(CreateConfiguratieDocument, options);
      }
export type CreateConfiguratieMutationHookResult = ReturnType<typeof useCreateConfiguratieMutation>;
export type CreateConfiguratieMutationResult = Apollo.MutationResult<CreateConfiguratieMutation>;
export type CreateConfiguratieMutationOptions = Apollo.BaseMutationOptions<CreateConfiguratieMutation, CreateConfiguratieMutationVariables>;
export const CreateCustomerStatementMessageDocument = gql`
    mutation createCustomerStatementMessage($file: Upload!) {
  createCustomerStatementMessage(file: $file) {
    ok
    customerStatementMessage {
      ...CustomerStatementMessage
    }
  }
}
    ${CustomerStatementMessageFragmentDoc}`;
export type CreateCustomerStatementMessageMutationFn = Apollo.MutationFunction<CreateCustomerStatementMessageMutation, CreateCustomerStatementMessageMutationVariables>;

/**
 * __useCreateCustomerStatementMessageMutation__
 *
 * To run a mutation, you first call `useCreateCustomerStatementMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerStatementMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerStatementMessageMutation, { data, loading, error }] = useCreateCustomerStatementMessageMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateCustomerStatementMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerStatementMessageMutation, CreateCustomerStatementMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerStatementMessageMutation, CreateCustomerStatementMessageMutationVariables>(CreateCustomerStatementMessageDocument, options);
      }
export type CreateCustomerStatementMessageMutationHookResult = ReturnType<typeof useCreateCustomerStatementMessageMutation>;
export type CreateCustomerStatementMessageMutationResult = Apollo.MutationResult<CreateCustomerStatementMessageMutation>;
export type CreateCustomerStatementMessageMutationOptions = Apollo.BaseMutationOptions<CreateCustomerStatementMessageMutation, CreateCustomerStatementMessageMutationVariables>;
export const CreateExportOverschrijvingenDocument = gql`
    mutation createExportOverschrijvingen($startDatum: String!, $eindDatum: String!) {
  createExportOverschrijvingen(startDatum: $startDatum, eindDatum: $eindDatum) {
    ok
    export {
      id
    }
  }
}
    `;
export type CreateExportOverschrijvingenMutationFn = Apollo.MutationFunction<CreateExportOverschrijvingenMutation, CreateExportOverschrijvingenMutationVariables>;

/**
 * __useCreateExportOverschrijvingenMutation__
 *
 * To run a mutation, you first call `useCreateExportOverschrijvingenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExportOverschrijvingenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExportOverschrijvingenMutation, { data, loading, error }] = useCreateExportOverschrijvingenMutation({
 *   variables: {
 *      startDatum: // value for 'startDatum'
 *      eindDatum: // value for 'eindDatum'
 *   },
 * });
 */
export function useCreateExportOverschrijvingenMutation(baseOptions?: Apollo.MutationHookOptions<CreateExportOverschrijvingenMutation, CreateExportOverschrijvingenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateExportOverschrijvingenMutation, CreateExportOverschrijvingenMutationVariables>(CreateExportOverschrijvingenDocument, options);
      }
export type CreateExportOverschrijvingenMutationHookResult = ReturnType<typeof useCreateExportOverschrijvingenMutation>;
export type CreateExportOverschrijvingenMutationResult = Apollo.MutationResult<CreateExportOverschrijvingenMutation>;
export type CreateExportOverschrijvingenMutationOptions = Apollo.BaseMutationOptions<CreateExportOverschrijvingenMutation, CreateExportOverschrijvingenMutationVariables>;
export const CreateJournaalpostAfspraakDocument = gql`
    mutation createJournaalpostAfspraak($transactionId: Int!, $afspraakId: Int!, $isAutomatischGeboekt: Boolean = false) {
  createJournaalpostAfspraak(
    input: {transactionId: $transactionId, afspraakId: $afspraakId, isAutomatischGeboekt: $isAutomatischGeboekt}
  ) {
    ok
    journaalpost {
      id
    }
  }
}
    `;
export type CreateJournaalpostAfspraakMutationFn = Apollo.MutationFunction<CreateJournaalpostAfspraakMutation, CreateJournaalpostAfspraakMutationVariables>;

/**
 * __useCreateJournaalpostAfspraakMutation__
 *
 * To run a mutation, you first call `useCreateJournaalpostAfspraakMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateJournaalpostAfspraakMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createJournaalpostAfspraakMutation, { data, loading, error }] = useCreateJournaalpostAfspraakMutation({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *      afspraakId: // value for 'afspraakId'
 *      isAutomatischGeboekt: // value for 'isAutomatischGeboekt'
 *   },
 * });
 */
export function useCreateJournaalpostAfspraakMutation(baseOptions?: Apollo.MutationHookOptions<CreateJournaalpostAfspraakMutation, CreateJournaalpostAfspraakMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateJournaalpostAfspraakMutation, CreateJournaalpostAfspraakMutationVariables>(CreateJournaalpostAfspraakDocument, options);
      }
export type CreateJournaalpostAfspraakMutationHookResult = ReturnType<typeof useCreateJournaalpostAfspraakMutation>;
export type CreateJournaalpostAfspraakMutationResult = Apollo.MutationResult<CreateJournaalpostAfspraakMutation>;
export type CreateJournaalpostAfspraakMutationOptions = Apollo.BaseMutationOptions<CreateJournaalpostAfspraakMutation, CreateJournaalpostAfspraakMutationVariables>;
export const CreateJournaalpostGrootboekrekeningDocument = gql`
    mutation createJournaalpostGrootboekrekening($transactionId: Int!, $grootboekrekeningId: String!) {
  createJournaalpostGrootboekrekening(
    input: {transactionId: $transactionId, grootboekrekeningId: $grootboekrekeningId, isAutomatischGeboekt: false}
  ) {
    ok
    journaalpost {
      id
    }
  }
}
    `;
export type CreateJournaalpostGrootboekrekeningMutationFn = Apollo.MutationFunction<CreateJournaalpostGrootboekrekeningMutation, CreateJournaalpostGrootboekrekeningMutationVariables>;

/**
 * __useCreateJournaalpostGrootboekrekeningMutation__
 *
 * To run a mutation, you first call `useCreateJournaalpostGrootboekrekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateJournaalpostGrootboekrekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createJournaalpostGrootboekrekeningMutation, { data, loading, error }] = useCreateJournaalpostGrootboekrekeningMutation({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *      grootboekrekeningId: // value for 'grootboekrekeningId'
 *   },
 * });
 */
export function useCreateJournaalpostGrootboekrekeningMutation(baseOptions?: Apollo.MutationHookOptions<CreateJournaalpostGrootboekrekeningMutation, CreateJournaalpostGrootboekrekeningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateJournaalpostGrootboekrekeningMutation, CreateJournaalpostGrootboekrekeningMutationVariables>(CreateJournaalpostGrootboekrekeningDocument, options);
      }
export type CreateJournaalpostGrootboekrekeningMutationHookResult = ReturnType<typeof useCreateJournaalpostGrootboekrekeningMutation>;
export type CreateJournaalpostGrootboekrekeningMutationResult = Apollo.MutationResult<CreateJournaalpostGrootboekrekeningMutation>;
export type CreateJournaalpostGrootboekrekeningMutationOptions = Apollo.BaseMutationOptions<CreateJournaalpostGrootboekrekeningMutation, CreateJournaalpostGrootboekrekeningMutationVariables>;
export const CreateOrganisatieDocument = gql`
    mutation createOrganisatie($huisnummer: String, $kvkNummer: String!, $naam: String, $plaatsnaam: String, $postcode: String, $straatnaam: String, $weergaveNaam: String!) {
  createOrganisatie(
    input: {huisnummer: $huisnummer, kvkNummer: $kvkNummer, naam: $naam, plaatsnaam: $plaatsnaam, postcode: $postcode, straatnaam: $straatnaam, weergaveNaam: $weergaveNaam}
  ) {
    ok
    organisatie {
      ...Organisatie
    }
  }
}
    ${OrganisatieFragmentDoc}`;
export type CreateOrganisatieMutationFn = Apollo.MutationFunction<CreateOrganisatieMutation, CreateOrganisatieMutationVariables>;

/**
 * __useCreateOrganisatieMutation__
 *
 * To run a mutation, you first call `useCreateOrganisatieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganisatieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganisatieMutation, { data, loading, error }] = useCreateOrganisatieMutation({
 *   variables: {
 *      huisnummer: // value for 'huisnummer'
 *      kvkNummer: // value for 'kvkNummer'
 *      naam: // value for 'naam'
 *      plaatsnaam: // value for 'plaatsnaam'
 *      postcode: // value for 'postcode'
 *      straatnaam: // value for 'straatnaam'
 *      weergaveNaam: // value for 'weergaveNaam'
 *   },
 * });
 */
export function useCreateOrganisatieMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganisatieMutation, CreateOrganisatieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganisatieMutation, CreateOrganisatieMutationVariables>(CreateOrganisatieDocument, options);
      }
export type CreateOrganisatieMutationHookResult = ReturnType<typeof useCreateOrganisatieMutation>;
export type CreateOrganisatieMutationResult = Apollo.MutationResult<CreateOrganisatieMutation>;
export type CreateOrganisatieMutationOptions = Apollo.BaseMutationOptions<CreateOrganisatieMutation, CreateOrganisatieMutationVariables>;
export const CreateOrganisatieRekeningDocument = gql`
    mutation createOrganisatieRekening($orgId: Int!, $rekening: RekeningInput!) {
  createOrganisatieRekening(organisatieId: $orgId, rekening: $rekening) {
    ok
    rekening {
      ...Rekening
    }
  }
}
    ${RekeningFragmentDoc}`;
export type CreateOrganisatieRekeningMutationFn = Apollo.MutationFunction<CreateOrganisatieRekeningMutation, CreateOrganisatieRekeningMutationVariables>;

/**
 * __useCreateOrganisatieRekeningMutation__
 *
 * To run a mutation, you first call `useCreateOrganisatieRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganisatieRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganisatieRekeningMutation, { data, loading, error }] = useCreateOrganisatieRekeningMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      rekening: // value for 'rekening'
 *   },
 * });
 */
export function useCreateOrganisatieRekeningMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganisatieRekeningMutation, CreateOrganisatieRekeningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganisatieRekeningMutation, CreateOrganisatieRekeningMutationVariables>(CreateOrganisatieRekeningDocument, options);
      }
export type CreateOrganisatieRekeningMutationHookResult = ReturnType<typeof useCreateOrganisatieRekeningMutation>;
export type CreateOrganisatieRekeningMutationResult = Apollo.MutationResult<CreateOrganisatieRekeningMutation>;
export type CreateOrganisatieRekeningMutationOptions = Apollo.BaseMutationOptions<CreateOrganisatieRekeningMutation, CreateOrganisatieRekeningMutationVariables>;
export const DeleteOrganisatieDocument = gql`
    mutation deleteOrganisatie($id: Int!) {
  deleteOrganisatie(id: $id) {
    ok
  }
}
    `;
export type DeleteOrganisatieMutationFn = Apollo.MutationFunction<DeleteOrganisatieMutation, DeleteOrganisatieMutationVariables>;

/**
 * __useDeleteOrganisatieMutation__
 *
 * To run a mutation, you first call `useDeleteOrganisatieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganisatieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganisatieMutation, { data, loading, error }] = useDeleteOrganisatieMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOrganisatieMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganisatieMutation, DeleteOrganisatieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganisatieMutation, DeleteOrganisatieMutationVariables>(DeleteOrganisatieDocument, options);
      }
export type DeleteOrganisatieMutationHookResult = ReturnType<typeof useDeleteOrganisatieMutation>;
export type DeleteOrganisatieMutationResult = Apollo.MutationResult<DeleteOrganisatieMutation>;
export type DeleteOrganisatieMutationOptions = Apollo.BaseMutationOptions<DeleteOrganisatieMutation, DeleteOrganisatieMutationVariables>;
export const DeleteAfspraakDocument = gql`
    mutation deleteAfspraak($id: Int!) {
  deleteAfspraak(id: $id) {
    ok
  }
}
    `;
export type DeleteAfspraakMutationFn = Apollo.MutationFunction<DeleteAfspraakMutation, DeleteAfspraakMutationVariables>;

/**
 * __useDeleteAfspraakMutation__
 *
 * To run a mutation, you first call `useDeleteAfspraakMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAfspraakMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAfspraakMutation, { data, loading, error }] = useDeleteAfspraakMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAfspraakMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAfspraakMutation, DeleteAfspraakMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAfspraakMutation, DeleteAfspraakMutationVariables>(DeleteAfspraakDocument, options);
      }
export type DeleteAfspraakMutationHookResult = ReturnType<typeof useDeleteAfspraakMutation>;
export type DeleteAfspraakMutationResult = Apollo.MutationResult<DeleteAfspraakMutation>;
export type DeleteAfspraakMutationOptions = Apollo.BaseMutationOptions<DeleteAfspraakMutation, DeleteAfspraakMutationVariables>;
export const DeleteAfspraakZoektermDocument = gql`
    mutation deleteAfspraakZoekterm($afspraakId: Int!, $zoekterm: String!) {
  deleteAfspraakZoekterm(afspraakId: $afspraakId, zoekterm: $zoekterm) {
    ok
    matchingAfspraken {
      id
      zoektermen
      bedrag
      burger {
        id
        voorletters
        voornamen
        achternaam
      }
      tegenRekening {
        rekeninghouder
        iban
      }
    }
  }
}
    `;
export type DeleteAfspraakZoektermMutationFn = Apollo.MutationFunction<DeleteAfspraakZoektermMutation, DeleteAfspraakZoektermMutationVariables>;

/**
 * __useDeleteAfspraakZoektermMutation__
 *
 * To run a mutation, you first call `useDeleteAfspraakZoektermMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAfspraakZoektermMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAfspraakZoektermMutation, { data, loading, error }] = useDeleteAfspraakZoektermMutation({
 *   variables: {
 *      afspraakId: // value for 'afspraakId'
 *      zoekterm: // value for 'zoekterm'
 *   },
 * });
 */
export function useDeleteAfspraakZoektermMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAfspraakZoektermMutation, DeleteAfspraakZoektermMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAfspraakZoektermMutation, DeleteAfspraakZoektermMutationVariables>(DeleteAfspraakZoektermDocument, options);
      }
export type DeleteAfspraakZoektermMutationHookResult = ReturnType<typeof useDeleteAfspraakZoektermMutation>;
export type DeleteAfspraakZoektermMutationResult = Apollo.MutationResult<DeleteAfspraakZoektermMutation>;
export type DeleteAfspraakZoektermMutationOptions = Apollo.BaseMutationOptions<DeleteAfspraakZoektermMutation, DeleteAfspraakZoektermMutationVariables>;
export const DeleteBurgerDocument = gql`
    mutation deleteBurger($id: Int!) {
  deleteBurger(id: $id) {
    ok
  }
}
    `;
export type DeleteBurgerMutationFn = Apollo.MutationFunction<DeleteBurgerMutation, DeleteBurgerMutationVariables>;

/**
 * __useDeleteBurgerMutation__
 *
 * To run a mutation, you first call `useDeleteBurgerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBurgerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBurgerMutation, { data, loading, error }] = useDeleteBurgerMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBurgerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBurgerMutation, DeleteBurgerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBurgerMutation, DeleteBurgerMutationVariables>(DeleteBurgerDocument, options);
      }
export type DeleteBurgerMutationHookResult = ReturnType<typeof useDeleteBurgerMutation>;
export type DeleteBurgerMutationResult = Apollo.MutationResult<DeleteBurgerMutation>;
export type DeleteBurgerMutationOptions = Apollo.BaseMutationOptions<DeleteBurgerMutation, DeleteBurgerMutationVariables>;
export const DeleteBurgerRekeningDocument = gql`
    mutation deleteBurgerRekening($id: Int!, $burgerId: Int!) {
  deleteBurgerRekening(id: $id, burgerId: $burgerId) {
    ok
  }
}
    `;
export type DeleteBurgerRekeningMutationFn = Apollo.MutationFunction<DeleteBurgerRekeningMutation, DeleteBurgerRekeningMutationVariables>;

/**
 * __useDeleteBurgerRekeningMutation__
 *
 * To run a mutation, you first call `useDeleteBurgerRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBurgerRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBurgerRekeningMutation, { data, loading, error }] = useDeleteBurgerRekeningMutation({
 *   variables: {
 *      id: // value for 'id'
 *      burgerId: // value for 'burgerId'
 *   },
 * });
 */
export function useDeleteBurgerRekeningMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBurgerRekeningMutation, DeleteBurgerRekeningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBurgerRekeningMutation, DeleteBurgerRekeningMutationVariables>(DeleteBurgerRekeningDocument, options);
      }
export type DeleteBurgerRekeningMutationHookResult = ReturnType<typeof useDeleteBurgerRekeningMutation>;
export type DeleteBurgerRekeningMutationResult = Apollo.MutationResult<DeleteBurgerRekeningMutation>;
export type DeleteBurgerRekeningMutationOptions = Apollo.BaseMutationOptions<DeleteBurgerRekeningMutation, DeleteBurgerRekeningMutationVariables>;
export const DeleteConfiguratieDocument = gql`
    mutation deleteConfiguratie($key: String!) {
  deleteConfiguratie(id: $key) {
    ok
  }
}
    `;
export type DeleteConfiguratieMutationFn = Apollo.MutationFunction<DeleteConfiguratieMutation, DeleteConfiguratieMutationVariables>;

/**
 * __useDeleteConfiguratieMutation__
 *
 * To run a mutation, you first call `useDeleteConfiguratieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteConfiguratieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteConfiguratieMutation, { data, loading, error }] = useDeleteConfiguratieMutation({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useDeleteConfiguratieMutation(baseOptions?: Apollo.MutationHookOptions<DeleteConfiguratieMutation, DeleteConfiguratieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteConfiguratieMutation, DeleteConfiguratieMutationVariables>(DeleteConfiguratieDocument, options);
      }
export type DeleteConfiguratieMutationHookResult = ReturnType<typeof useDeleteConfiguratieMutation>;
export type DeleteConfiguratieMutationResult = Apollo.MutationResult<DeleteConfiguratieMutation>;
export type DeleteConfiguratieMutationOptions = Apollo.BaseMutationOptions<DeleteConfiguratieMutation, DeleteConfiguratieMutationVariables>;
export const DeleteCustomerStatementMessageDocument = gql`
    mutation deleteCustomerStatementMessage($id: Int!) {
  deleteCustomerStatementMessage(id: $id) {
    ok
  }
}
    `;
export type DeleteCustomerStatementMessageMutationFn = Apollo.MutationFunction<DeleteCustomerStatementMessageMutation, DeleteCustomerStatementMessageMutationVariables>;

/**
 * __useDeleteCustomerStatementMessageMutation__
 *
 * To run a mutation, you first call `useDeleteCustomerStatementMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCustomerStatementMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCustomerStatementMessageMutation, { data, loading, error }] = useDeleteCustomerStatementMessageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCustomerStatementMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCustomerStatementMessageMutation, DeleteCustomerStatementMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCustomerStatementMessageMutation, DeleteCustomerStatementMessageMutationVariables>(DeleteCustomerStatementMessageDocument, options);
      }
export type DeleteCustomerStatementMessageMutationHookResult = ReturnType<typeof useDeleteCustomerStatementMessageMutation>;
export type DeleteCustomerStatementMessageMutationResult = Apollo.MutationResult<DeleteCustomerStatementMessageMutation>;
export type DeleteCustomerStatementMessageMutationOptions = Apollo.BaseMutationOptions<DeleteCustomerStatementMessageMutation, DeleteCustomerStatementMessageMutationVariables>;
export const DeleteJournaalpostDocument = gql`
    mutation deleteJournaalpost($id: Int!) {
  deleteJournaalpost(id: $id) {
    ok
  }
}
    `;
export type DeleteJournaalpostMutationFn = Apollo.MutationFunction<DeleteJournaalpostMutation, DeleteJournaalpostMutationVariables>;

/**
 * __useDeleteJournaalpostMutation__
 *
 * To run a mutation, you first call `useDeleteJournaalpostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteJournaalpostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteJournaalpostMutation, { data, loading, error }] = useDeleteJournaalpostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteJournaalpostMutation(baseOptions?: Apollo.MutationHookOptions<DeleteJournaalpostMutation, DeleteJournaalpostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteJournaalpostMutation, DeleteJournaalpostMutationVariables>(DeleteJournaalpostDocument, options);
      }
export type DeleteJournaalpostMutationHookResult = ReturnType<typeof useDeleteJournaalpostMutation>;
export type DeleteJournaalpostMutationResult = Apollo.MutationResult<DeleteJournaalpostMutation>;
export type DeleteJournaalpostMutationOptions = Apollo.BaseMutationOptions<DeleteJournaalpostMutation, DeleteJournaalpostMutationVariables>;
export const DeleteOrganisatieRekeningDocument = gql`
    mutation deleteOrganisatieRekening($id: Int!, $orgId: Int!) {
  deleteOrganisatieRekening(organisatieId: $orgId, rekeningId: $id) {
    ok
  }
}
    `;
export type DeleteOrganisatieRekeningMutationFn = Apollo.MutationFunction<DeleteOrganisatieRekeningMutation, DeleteOrganisatieRekeningMutationVariables>;

/**
 * __useDeleteOrganisatieRekeningMutation__
 *
 * To run a mutation, you first call `useDeleteOrganisatieRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganisatieRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganisatieRekeningMutation, { data, loading, error }] = useDeleteOrganisatieRekeningMutation({
 *   variables: {
 *      id: // value for 'id'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useDeleteOrganisatieRekeningMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganisatieRekeningMutation, DeleteOrganisatieRekeningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrganisatieRekeningMutation, DeleteOrganisatieRekeningMutationVariables>(DeleteOrganisatieRekeningDocument, options);
      }
export type DeleteOrganisatieRekeningMutationHookResult = ReturnType<typeof useDeleteOrganisatieRekeningMutation>;
export type DeleteOrganisatieRekeningMutationResult = Apollo.MutationResult<DeleteOrganisatieRekeningMutation>;
export type DeleteOrganisatieRekeningMutationOptions = Apollo.BaseMutationOptions<DeleteOrganisatieRekeningMutation, DeleteOrganisatieRekeningMutationVariables>;
export const EndAfspraakDocument = gql`
    mutation endAfspraak($id: Int!, $validThrough: String!) {
  updateAfspraak(id: $id, input: {validThrough: $validThrough}) {
    ok
    afspraak {
      ...Afspraak
    }
  }
}
    ${AfspraakFragmentDoc}`;
export type EndAfspraakMutationFn = Apollo.MutationFunction<EndAfspraakMutation, EndAfspraakMutationVariables>;

/**
 * __useEndAfspraakMutation__
 *
 * To run a mutation, you first call `useEndAfspraakMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEndAfspraakMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [endAfspraakMutation, { data, loading, error }] = useEndAfspraakMutation({
 *   variables: {
 *      id: // value for 'id'
 *      validThrough: // value for 'validThrough'
 *   },
 * });
 */
export function useEndAfspraakMutation(baseOptions?: Apollo.MutationHookOptions<EndAfspraakMutation, EndAfspraakMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EndAfspraakMutation, EndAfspraakMutationVariables>(EndAfspraakDocument, options);
      }
export type EndAfspraakMutationHookResult = ReturnType<typeof useEndAfspraakMutation>;
export type EndAfspraakMutationResult = Apollo.MutationResult<EndAfspraakMutation>;
export type EndAfspraakMutationOptions = Apollo.BaseMutationOptions<EndAfspraakMutation, EndAfspraakMutationVariables>;
export const StartAutomatischBoekenDocument = gql`
    mutation startAutomatischBoeken {
  startAutomatischBoeken {
    ok
    journaalposten {
      id
    }
  }
}
    `;
export type StartAutomatischBoekenMutationFn = Apollo.MutationFunction<StartAutomatischBoekenMutation, StartAutomatischBoekenMutationVariables>;

/**
 * __useStartAutomatischBoekenMutation__
 *
 * To run a mutation, you first call `useStartAutomatischBoekenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartAutomatischBoekenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startAutomatischBoekenMutation, { data, loading, error }] = useStartAutomatischBoekenMutation({
 *   variables: {
 *   },
 * });
 */
export function useStartAutomatischBoekenMutation(baseOptions?: Apollo.MutationHookOptions<StartAutomatischBoekenMutation, StartAutomatischBoekenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartAutomatischBoekenMutation, StartAutomatischBoekenMutationVariables>(StartAutomatischBoekenDocument, options);
      }
export type StartAutomatischBoekenMutationHookResult = ReturnType<typeof useStartAutomatischBoekenMutation>;
export type StartAutomatischBoekenMutationResult = Apollo.MutationResult<StartAutomatischBoekenMutation>;
export type StartAutomatischBoekenMutationOptions = Apollo.BaseMutationOptions<StartAutomatischBoekenMutation, StartAutomatischBoekenMutationVariables>;
export const UpdateAfspraakBetaalinstructieDocument = gql`
    mutation updateAfspraakBetaalinstructie($id: Int!, $betaalinstructie: BetaalinstructieInput!) {
  updateAfspraakBetaalinstructie(
    afspraakId: $id
    betaalinstructie: $betaalinstructie
  ) {
    ok
  }
}
    `;
export type UpdateAfspraakBetaalinstructieMutationFn = Apollo.MutationFunction<UpdateAfspraakBetaalinstructieMutation, UpdateAfspraakBetaalinstructieMutationVariables>;

/**
 * __useUpdateAfspraakBetaalinstructieMutation__
 *
 * To run a mutation, you first call `useUpdateAfspraakBetaalinstructieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAfspraakBetaalinstructieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAfspraakBetaalinstructieMutation, { data, loading, error }] = useUpdateAfspraakBetaalinstructieMutation({
 *   variables: {
 *      id: // value for 'id'
 *      betaalinstructie: // value for 'betaalinstructie'
 *   },
 * });
 */
export function useUpdateAfspraakBetaalinstructieMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAfspraakBetaalinstructieMutation, UpdateAfspraakBetaalinstructieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAfspraakBetaalinstructieMutation, UpdateAfspraakBetaalinstructieMutationVariables>(UpdateAfspraakBetaalinstructieDocument, options);
      }
export type UpdateAfspraakBetaalinstructieMutationHookResult = ReturnType<typeof useUpdateAfspraakBetaalinstructieMutation>;
export type UpdateAfspraakBetaalinstructieMutationResult = Apollo.MutationResult<UpdateAfspraakBetaalinstructieMutation>;
export type UpdateAfspraakBetaalinstructieMutationOptions = Apollo.BaseMutationOptions<UpdateAfspraakBetaalinstructieMutation, UpdateAfspraakBetaalinstructieMutationVariables>;
export const UpdateAfspraakDocument = gql`
    mutation updateAfspraak($id: Int!, $input: UpdateAfspraakInput!) {
  updateAfspraak(id: $id, input: $input) {
    ok
    afspraak {
      ...Afspraak
    }
  }
}
    ${AfspraakFragmentDoc}`;
export type UpdateAfspraakMutationFn = Apollo.MutationFunction<UpdateAfspraakMutation, UpdateAfspraakMutationVariables>;

/**
 * __useUpdateAfspraakMutation__
 *
 * To run a mutation, you first call `useUpdateAfspraakMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAfspraakMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAfspraakMutation, { data, loading, error }] = useUpdateAfspraakMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAfspraakMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAfspraakMutation, UpdateAfspraakMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAfspraakMutation, UpdateAfspraakMutationVariables>(UpdateAfspraakDocument, options);
      }
export type UpdateAfspraakMutationHookResult = ReturnType<typeof useUpdateAfspraakMutation>;
export type UpdateAfspraakMutationResult = Apollo.MutationResult<UpdateAfspraakMutation>;
export type UpdateAfspraakMutationOptions = Apollo.BaseMutationOptions<UpdateAfspraakMutation, UpdateAfspraakMutationVariables>;
export const UpdateBurgerDocument = gql`
    mutation updateBurger($id: Int!, $voorletters: String, $voornamen: String, $achternaam: String, $geboortedatum: String, $straatnaam: String, $huisnummer: String, $postcode: String, $plaatsnaam: String, $telefoonnummer: String, $email: String) {
  updateBurger(
    id: $id
    voorletters: $voorletters
    voornamen: $voornamen
    achternaam: $achternaam
    geboortedatum: $geboortedatum
    straatnaam: $straatnaam
    huisnummer: $huisnummer
    postcode: $postcode
    plaatsnaam: $plaatsnaam
    telefoonnummer: $telefoonnummer
    email: $email
  ) {
    ok
    burger {
      ...Burger
    }
  }
}
    ${BurgerFragmentDoc}`;
export type UpdateBurgerMutationFn = Apollo.MutationFunction<UpdateBurgerMutation, UpdateBurgerMutationVariables>;

/**
 * __useUpdateBurgerMutation__
 *
 * To run a mutation, you first call `useUpdateBurgerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBurgerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBurgerMutation, { data, loading, error }] = useUpdateBurgerMutation({
 *   variables: {
 *      id: // value for 'id'
 *      voorletters: // value for 'voorletters'
 *      voornamen: // value for 'voornamen'
 *      achternaam: // value for 'achternaam'
 *      geboortedatum: // value for 'geboortedatum'
 *      straatnaam: // value for 'straatnaam'
 *      huisnummer: // value for 'huisnummer'
 *      postcode: // value for 'postcode'
 *      plaatsnaam: // value for 'plaatsnaam'
 *      telefoonnummer: // value for 'telefoonnummer'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useUpdateBurgerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBurgerMutation, UpdateBurgerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBurgerMutation, UpdateBurgerMutationVariables>(UpdateBurgerDocument, options);
      }
export type UpdateBurgerMutationHookResult = ReturnType<typeof useUpdateBurgerMutation>;
export type UpdateBurgerMutationResult = Apollo.MutationResult<UpdateBurgerMutation>;
export type UpdateBurgerMutationOptions = Apollo.BaseMutationOptions<UpdateBurgerMutation, UpdateBurgerMutationVariables>;
export const UpdateConfiguratieDocument = gql`
    mutation updateConfiguratie($key: String!, $value: String!) {
  updateConfiguratie(input: {id: $key, waarde: $value}) {
    ok
    configuratie {
      id
      waarde
    }
  }
}
    `;
export type UpdateConfiguratieMutationFn = Apollo.MutationFunction<UpdateConfiguratieMutation, UpdateConfiguratieMutationVariables>;

/**
 * __useUpdateConfiguratieMutation__
 *
 * To run a mutation, you first call `useUpdateConfiguratieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateConfiguratieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateConfiguratieMutation, { data, loading, error }] = useUpdateConfiguratieMutation({
 *   variables: {
 *      key: // value for 'key'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateConfiguratieMutation(baseOptions?: Apollo.MutationHookOptions<UpdateConfiguratieMutation, UpdateConfiguratieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateConfiguratieMutation, UpdateConfiguratieMutationVariables>(UpdateConfiguratieDocument, options);
      }
export type UpdateConfiguratieMutationHookResult = ReturnType<typeof useUpdateConfiguratieMutation>;
export type UpdateConfiguratieMutationResult = Apollo.MutationResult<UpdateConfiguratieMutation>;
export type UpdateConfiguratieMutationOptions = Apollo.BaseMutationOptions<UpdateConfiguratieMutation, UpdateConfiguratieMutationVariables>;
export const UpdateJournaalpostGrootboekrekeningDocument = gql`
    mutation updateJournaalpostGrootboekrekening($id: Int!, $grootboekrekeningId: String!) {
  updateJournaalpostGrootboekrekening(
    input: {id: $id, grootboekrekeningId: $grootboekrekeningId}
  ) {
    ok
  }
}
    `;
export type UpdateJournaalpostGrootboekrekeningMutationFn = Apollo.MutationFunction<UpdateJournaalpostGrootboekrekeningMutation, UpdateJournaalpostGrootboekrekeningMutationVariables>;

/**
 * __useUpdateJournaalpostGrootboekrekeningMutation__
 *
 * To run a mutation, you first call `useUpdateJournaalpostGrootboekrekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateJournaalpostGrootboekrekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateJournaalpostGrootboekrekeningMutation, { data, loading, error }] = useUpdateJournaalpostGrootboekrekeningMutation({
 *   variables: {
 *      id: // value for 'id'
 *      grootboekrekeningId: // value for 'grootboekrekeningId'
 *   },
 * });
 */
export function useUpdateJournaalpostGrootboekrekeningMutation(baseOptions?: Apollo.MutationHookOptions<UpdateJournaalpostGrootboekrekeningMutation, UpdateJournaalpostGrootboekrekeningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateJournaalpostGrootboekrekeningMutation, UpdateJournaalpostGrootboekrekeningMutationVariables>(UpdateJournaalpostGrootboekrekeningDocument, options);
      }
export type UpdateJournaalpostGrootboekrekeningMutationHookResult = ReturnType<typeof useUpdateJournaalpostGrootboekrekeningMutation>;
export type UpdateJournaalpostGrootboekrekeningMutationResult = Apollo.MutationResult<UpdateJournaalpostGrootboekrekeningMutation>;
export type UpdateJournaalpostGrootboekrekeningMutationOptions = Apollo.BaseMutationOptions<UpdateJournaalpostGrootboekrekeningMutation, UpdateJournaalpostGrootboekrekeningMutationVariables>;
export const UpdateOrganisatieDocument = gql`
    mutation updateOrganisatie($id: Int!, $huisnummer: String, $kvkNummer: String, $naam: String, $plaatsnaam: String, $postcode: String, $straatnaam: String, $weergaveNaam: String) {
  updateOrganisatie(
    id: $id
    huisnummer: $huisnummer
    kvkNummer: $kvkNummer
    naam: $naam
    plaatsnaam: $plaatsnaam
    postcode: $postcode
    straatnaam: $straatnaam
    weergaveNaam: $weergaveNaam
  ) {
    ok
    organisatie {
      ...Organisatie
    }
  }
}
    ${OrganisatieFragmentDoc}`;
export type UpdateOrganisatieMutationFn = Apollo.MutationFunction<UpdateOrganisatieMutation, UpdateOrganisatieMutationVariables>;

/**
 * __useUpdateOrganisatieMutation__
 *
 * To run a mutation, you first call `useUpdateOrganisatieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganisatieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganisatieMutation, { data, loading, error }] = useUpdateOrganisatieMutation({
 *   variables: {
 *      id: // value for 'id'
 *      huisnummer: // value for 'huisnummer'
 *      kvkNummer: // value for 'kvkNummer'
 *      naam: // value for 'naam'
 *      plaatsnaam: // value for 'plaatsnaam'
 *      postcode: // value for 'postcode'
 *      straatnaam: // value for 'straatnaam'
 *      weergaveNaam: // value for 'weergaveNaam'
 *   },
 * });
 */
export function useUpdateOrganisatieMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrganisatieMutation, UpdateOrganisatieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrganisatieMutation, UpdateOrganisatieMutationVariables>(UpdateOrganisatieDocument, options);
      }
export type UpdateOrganisatieMutationHookResult = ReturnType<typeof useUpdateOrganisatieMutation>;
export type UpdateOrganisatieMutationResult = Apollo.MutationResult<UpdateOrganisatieMutation>;
export type UpdateOrganisatieMutationOptions = Apollo.BaseMutationOptions<UpdateOrganisatieMutation, UpdateOrganisatieMutationVariables>;
export const UpdateRekeningDocument = gql`
    mutation updateRekening($id: Int!, $iban: String, $rekeninghouder: String) {
  updateRekening(
    id: $id
    rekening: {iban: $iban, rekeninghouder: $rekeninghouder}
  ) {
    ok
  }
}
    `;
export type UpdateRekeningMutationFn = Apollo.MutationFunction<UpdateRekeningMutation, UpdateRekeningMutationVariables>;

/**
 * __useUpdateRekeningMutation__
 *
 * To run a mutation, you first call `useUpdateRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRekeningMutation, { data, loading, error }] = useUpdateRekeningMutation({
 *   variables: {
 *      id: // value for 'id'
 *      iban: // value for 'iban'
 *      rekeninghouder: // value for 'rekeninghouder'
 *   },
 * });
 */
export function useUpdateRekeningMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRekeningMutation, UpdateRekeningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRekeningMutation, UpdateRekeningMutationVariables>(UpdateRekeningDocument, options);
      }
export type UpdateRekeningMutationHookResult = ReturnType<typeof useUpdateRekeningMutation>;
export type UpdateRekeningMutationResult = Apollo.MutationResult<UpdateRekeningMutation>;
export type UpdateRekeningMutationOptions = Apollo.BaseMutationOptions<UpdateRekeningMutation, UpdateRekeningMutationVariables>;
export const GetAfspraakFormDataDocument = gql`
    query getAfspraakFormData($afspraakId: Int!) {
  afspraak(id: $afspraakId) {
    ...Afspraak
  }
  rubrieken {
    ...Rubriek
    grootboekrekening {
      id
      naam
      credit
    }
  }
  organisaties {
    ...Organisatie
  }
}
    ${AfspraakFragmentDoc}
${RubriekFragmentDoc}
${OrganisatieFragmentDoc}`;

/**
 * __useGetAfspraakFormDataQuery__
 *
 * To run a query within a React component, call `useGetAfspraakFormDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAfspraakFormDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAfspraakFormDataQuery({
 *   variables: {
 *      afspraakId: // value for 'afspraakId'
 *   },
 * });
 */
export function useGetAfspraakFormDataQuery(baseOptions: Apollo.QueryHookOptions<GetAfspraakFormDataQuery, GetAfspraakFormDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAfspraakFormDataQuery, GetAfspraakFormDataQueryVariables>(GetAfspraakFormDataDocument, options);
      }
export function useGetAfspraakFormDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAfspraakFormDataQuery, GetAfspraakFormDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAfspraakFormDataQuery, GetAfspraakFormDataQueryVariables>(GetAfspraakFormDataDocument, options);
        }
export type GetAfspraakFormDataQueryHookResult = ReturnType<typeof useGetAfspraakFormDataQuery>;
export type GetAfspraakFormDataLazyQueryHookResult = ReturnType<typeof useGetAfspraakFormDataLazyQuery>;
export type GetAfspraakFormDataQueryResult = Apollo.QueryResult<GetAfspraakFormDataQuery, GetAfspraakFormDataQueryVariables>;
export const GetAfsprakenDocument = gql`
    query getAfspraken {
  afspraken {
    ...Afspraak
  }
}
    ${AfspraakFragmentDoc}`;

/**
 * __useGetAfsprakenQuery__
 *
 * To run a query within a React component, call `useGetAfsprakenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAfsprakenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAfsprakenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAfsprakenQuery(baseOptions?: Apollo.QueryHookOptions<GetAfsprakenQuery, GetAfsprakenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAfsprakenQuery, GetAfsprakenQueryVariables>(GetAfsprakenDocument, options);
      }
export function useGetAfsprakenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAfsprakenQuery, GetAfsprakenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAfsprakenQuery, GetAfsprakenQueryVariables>(GetAfsprakenDocument, options);
        }
export type GetAfsprakenQueryHookResult = ReturnType<typeof useGetAfsprakenQuery>;
export type GetAfsprakenLazyQueryHookResult = ReturnType<typeof useGetAfsprakenLazyQuery>;
export type GetAfsprakenQueryResult = Apollo.QueryResult<GetAfsprakenQuery, GetAfsprakenQueryVariables>;
export const GetBurgerAfsprakenDocument = gql`
    query getBurgerAfspraken($id: Int!) {
  burger(id: $id) {
    afspraken {
      ...Afspraak
    }
  }
}
    ${AfspraakFragmentDoc}`;

/**
 * __useGetBurgerAfsprakenQuery__
 *
 * To run a query within a React component, call `useGetBurgerAfsprakenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBurgerAfsprakenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBurgerAfsprakenQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBurgerAfsprakenQuery(baseOptions: Apollo.QueryHookOptions<GetBurgerAfsprakenQuery, GetBurgerAfsprakenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBurgerAfsprakenQuery, GetBurgerAfsprakenQueryVariables>(GetBurgerAfsprakenDocument, options);
      }
export function useGetBurgerAfsprakenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBurgerAfsprakenQuery, GetBurgerAfsprakenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBurgerAfsprakenQuery, GetBurgerAfsprakenQueryVariables>(GetBurgerAfsprakenDocument, options);
        }
export type GetBurgerAfsprakenQueryHookResult = ReturnType<typeof useGetBurgerAfsprakenQuery>;
export type GetBurgerAfsprakenLazyQueryHookResult = ReturnType<typeof useGetBurgerAfsprakenLazyQuery>;
export type GetBurgerAfsprakenQueryResult = Apollo.QueryResult<GetBurgerAfsprakenQuery, GetBurgerAfsprakenQueryVariables>;
export const GetBurgerGebeurtenissenDocument = gql`
    query GetBurgerGebeurtenissen($ids: [Int!]!, $limit: Int!, $offset: Int!) {
  gebruikersactiviteitenPaged(burgerIds: $ids, start: $offset, limit: $limit) {
    gebruikersactiviteiten {
      ...Gebruikersactiviteit
    }
    pageInfo {
      count
    }
  }
}
    ${GebruikersactiviteitFragmentDoc}`;

/**
 * __useGetBurgerGebeurtenissenQuery__
 *
 * To run a query within a React component, call `useGetBurgerGebeurtenissenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBurgerGebeurtenissenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBurgerGebeurtenissenQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetBurgerGebeurtenissenQuery(baseOptions: Apollo.QueryHookOptions<GetBurgerGebeurtenissenQuery, GetBurgerGebeurtenissenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBurgerGebeurtenissenQuery, GetBurgerGebeurtenissenQueryVariables>(GetBurgerGebeurtenissenDocument, options);
      }
export function useGetBurgerGebeurtenissenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBurgerGebeurtenissenQuery, GetBurgerGebeurtenissenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBurgerGebeurtenissenQuery, GetBurgerGebeurtenissenQueryVariables>(GetBurgerGebeurtenissenDocument, options);
        }
export type GetBurgerGebeurtenissenQueryHookResult = ReturnType<typeof useGetBurgerGebeurtenissenQuery>;
export type GetBurgerGebeurtenissenLazyQueryHookResult = ReturnType<typeof useGetBurgerGebeurtenissenLazyQuery>;
export type GetBurgerGebeurtenissenQueryResult = Apollo.QueryResult<GetBurgerGebeurtenissenQuery, GetBurgerGebeurtenissenQueryVariables>;
export const GetBurgerDocument = gql`
    query getBurger($id: Int!) {
  burger(id: $id) {
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
 *      id: // value for 'id'
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
export const GetBurgersDocument = gql`
    query getBurgers {
  burgers {
    ...Burger
  }
}
    ${BurgerFragmentDoc}`;

/**
 * __useGetBurgersQuery__
 *
 * To run a query within a React component, call `useGetBurgersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBurgersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBurgersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBurgersQuery(baseOptions?: Apollo.QueryHookOptions<GetBurgersQuery, GetBurgersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBurgersQuery, GetBurgersQueryVariables>(GetBurgersDocument, options);
      }
export function useGetBurgersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBurgersQuery, GetBurgersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBurgersQuery, GetBurgersQueryVariables>(GetBurgersDocument, options);
        }
export type GetBurgersQueryHookResult = ReturnType<typeof useGetBurgersQuery>;
export type GetBurgersLazyQueryHookResult = ReturnType<typeof useGetBurgersLazyQuery>;
export type GetBurgersQueryResult = Apollo.QueryResult<GetBurgersQuery, GetBurgersQueryVariables>;
export const GetConfiguratieDocument = gql`
    query getConfiguratie {
  configuraties {
    id
    waarde
  }
}
    `;

/**
 * __useGetConfiguratieQuery__
 *
 * To run a query within a React component, call `useGetConfiguratieQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConfiguratieQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConfiguratieQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetConfiguratieQuery(baseOptions?: Apollo.QueryHookOptions<GetConfiguratieQuery, GetConfiguratieQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConfiguratieQuery, GetConfiguratieQueryVariables>(GetConfiguratieDocument, options);
      }
export function useGetConfiguratieLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConfiguratieQuery, GetConfiguratieQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConfiguratieQuery, GetConfiguratieQueryVariables>(GetConfiguratieDocument, options);
        }
export type GetConfiguratieQueryHookResult = ReturnType<typeof useGetConfiguratieQuery>;
export type GetConfiguratieLazyQueryHookResult = ReturnType<typeof useGetConfiguratieLazyQuery>;
export type GetConfiguratieQueryResult = Apollo.QueryResult<GetConfiguratieQuery, GetConfiguratieQueryVariables>;
export const GetCreateAfspraakFormDataDocument = gql`
    query getCreateAfspraakFormData($burgerId: Int!) {
  burger(id: $burgerId) {
    rekeningen {
      ...Rekening
    }
  }
  rubrieken {
    ...Rubriek
    grootboekrekening {
      id
      naam
      credit
    }
  }
  organisaties {
    ...Organisatie
  }
}
    ${RekeningFragmentDoc}
${RubriekFragmentDoc}
${OrganisatieFragmentDoc}`;

/**
 * __useGetCreateAfspraakFormDataQuery__
 *
 * To run a query within a React component, call `useGetCreateAfspraakFormDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCreateAfspraakFormDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCreateAfspraakFormDataQuery({
 *   variables: {
 *      burgerId: // value for 'burgerId'
 *   },
 * });
 */
export function useGetCreateAfspraakFormDataQuery(baseOptions: Apollo.QueryHookOptions<GetCreateAfspraakFormDataQuery, GetCreateAfspraakFormDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCreateAfspraakFormDataQuery, GetCreateAfspraakFormDataQueryVariables>(GetCreateAfspraakFormDataDocument, options);
      }
export function useGetCreateAfspraakFormDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCreateAfspraakFormDataQuery, GetCreateAfspraakFormDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCreateAfspraakFormDataQuery, GetCreateAfspraakFormDataQueryVariables>(GetCreateAfspraakFormDataDocument, options);
        }
export type GetCreateAfspraakFormDataQueryHookResult = ReturnType<typeof useGetCreateAfspraakFormDataQuery>;
export type GetCreateAfspraakFormDataLazyQueryHookResult = ReturnType<typeof useGetCreateAfspraakFormDataLazyQuery>;
export type GetCreateAfspraakFormDataQueryResult = Apollo.QueryResult<GetCreateAfspraakFormDataQuery, GetCreateAfspraakFormDataQueryVariables>;
export const GetCsmsDocument = gql`
    query getCsms {
  customerStatementMessages {
    ...CustomerStatementMessage
  }
}
    ${CustomerStatementMessageFragmentDoc}`;

/**
 * __useGetCsmsQuery__
 *
 * To run a query within a React component, call `useGetCsmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCsmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCsmsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCsmsQuery(baseOptions?: Apollo.QueryHookOptions<GetCsmsQuery, GetCsmsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCsmsQuery, GetCsmsQueryVariables>(GetCsmsDocument, options);
      }
export function useGetCsmsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCsmsQuery, GetCsmsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCsmsQuery, GetCsmsQueryVariables>(GetCsmsDocument, options);
        }
export type GetCsmsQueryHookResult = ReturnType<typeof useGetCsmsQuery>;
export type GetCsmsLazyQueryHookResult = ReturnType<typeof useGetCsmsLazyQuery>;
export type GetCsmsQueryResult = Apollo.QueryResult<GetCsmsQuery, GetCsmsQueryVariables>;
export const GetExportsDocument = gql`
    query getExports {
  exports {
    id
    naam
    timestamp
    startDatum
    eindDatum
    overschrijvingen {
      id
    }
  }
}
    `;

/**
 * __useGetExportsQuery__
 *
 * To run a query within a React component, call `useGetExportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExportsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetExportsQuery(baseOptions?: Apollo.QueryHookOptions<GetExportsQuery, GetExportsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExportsQuery, GetExportsQueryVariables>(GetExportsDocument, options);
      }
export function useGetExportsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExportsQuery, GetExportsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExportsQuery, GetExportsQueryVariables>(GetExportsDocument, options);
        }
export type GetExportsQueryHookResult = ReturnType<typeof useGetExportsQuery>;
export type GetExportsLazyQueryHookResult = ReturnType<typeof useGetExportsLazyQuery>;
export type GetExportsQueryResult = Apollo.QueryResult<GetExportsQuery, GetExportsQueryVariables>;
export const GetGebeurtenissenDocument = gql`
    query GetGebeurtenissen($limit: Int!, $offset: Int!) {
  gebruikersactiviteitenPaged(start: $offset, limit: $limit) {
    gebruikersactiviteiten {
      ...Gebruikersactiviteit
    }
    pageInfo {
      count
    }
  }
}
    ${GebruikersactiviteitFragmentDoc}`;

/**
 * __useGetGebeurtenissenQuery__
 *
 * To run a query within a React component, call `useGetGebeurtenissenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGebeurtenissenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGebeurtenissenQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetGebeurtenissenQuery(baseOptions: Apollo.QueryHookOptions<GetGebeurtenissenQuery, GetGebeurtenissenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGebeurtenissenQuery, GetGebeurtenissenQueryVariables>(GetGebeurtenissenDocument, options);
      }
export function useGetGebeurtenissenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGebeurtenissenQuery, GetGebeurtenissenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGebeurtenissenQuery, GetGebeurtenissenQueryVariables>(GetGebeurtenissenDocument, options);
        }
export type GetGebeurtenissenQueryHookResult = ReturnType<typeof useGetGebeurtenissenQuery>;
export type GetGebeurtenissenLazyQueryHookResult = ReturnType<typeof useGetGebeurtenissenLazyQuery>;
export type GetGebeurtenissenQueryResult = Apollo.QueryResult<GetGebeurtenissenQuery, GetGebeurtenissenQueryVariables>;
export const GetGebruikerDocument = gql`
    query getGebruiker {
  gebruiker {
    ...Gebruiker
  }
}
    ${GebruikerFragmentDoc}`;

/**
 * __useGetGebruikerQuery__
 *
 * To run a query within a React component, call `useGetGebruikerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGebruikerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGebruikerQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGebruikerQuery(baseOptions?: Apollo.QueryHookOptions<GetGebruikerQuery, GetGebruikerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGebruikerQuery, GetGebruikerQueryVariables>(GetGebruikerDocument, options);
      }
export function useGetGebruikerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGebruikerQuery, GetGebruikerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGebruikerQuery, GetGebruikerQueryVariables>(GetGebruikerDocument, options);
        }
export type GetGebruikerQueryHookResult = ReturnType<typeof useGetGebruikerQuery>;
export type GetGebruikerLazyQueryHookResult = ReturnType<typeof useGetGebruikerLazyQuery>;
export type GetGebruikerQueryResult = Apollo.QueryResult<GetGebruikerQuery, GetGebruikerQueryVariables>;
export const GetAfspraakDocument = gql`
    query getAfspraak($id: Int!) {
  afspraak(id: $id) {
    ...Afspraak
  }
}
    ${AfspraakFragmentDoc}`;

/**
 * __useGetAfspraakQuery__
 *
 * To run a query within a React component, call `useGetAfspraakQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAfspraakQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAfspraakQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAfspraakQuery(baseOptions: Apollo.QueryHookOptions<GetAfspraakQuery, GetAfspraakQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAfspraakQuery, GetAfspraakQueryVariables>(GetAfspraakDocument, options);
      }
export function useGetAfspraakLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAfspraakQuery, GetAfspraakQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAfspraakQuery, GetAfspraakQueryVariables>(GetAfspraakDocument, options);
        }
export type GetAfspraakQueryHookResult = ReturnType<typeof useGetAfspraakQuery>;
export type GetAfspraakLazyQueryHookResult = ReturnType<typeof useGetAfspraakLazyQuery>;
export type GetAfspraakQueryResult = Apollo.QueryResult<GetAfspraakQuery, GetAfspraakQueryVariables>;
export const GetOrganisatieDocument = gql`
    query getOrganisatie($id: Int!) {
  organisatie(id: $id) {
    ...Organisatie
  }
}
    ${OrganisatieFragmentDoc}`;

/**
 * __useGetOrganisatieQuery__
 *
 * To run a query within a React component, call `useGetOrganisatieQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrganisatieQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrganisatieQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOrganisatieQuery(baseOptions: Apollo.QueryHookOptions<GetOrganisatieQuery, GetOrganisatieQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrganisatieQuery, GetOrganisatieQueryVariables>(GetOrganisatieDocument, options);
      }
export function useGetOrganisatieLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrganisatieQuery, GetOrganisatieQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrganisatieQuery, GetOrganisatieQueryVariables>(GetOrganisatieDocument, options);
        }
export type GetOrganisatieQueryHookResult = ReturnType<typeof useGetOrganisatieQuery>;
export type GetOrganisatieLazyQueryHookResult = ReturnType<typeof useGetOrganisatieLazyQuery>;
export type GetOrganisatieQueryResult = Apollo.QueryResult<GetOrganisatieQuery, GetOrganisatieQueryVariables>;
export const GetOrganisatiesDocument = gql`
    query getOrganisaties {
  organisaties {
    id
    ...Organisatie
  }
}
    ${OrganisatieFragmentDoc}`;

/**
 * __useGetOrganisatiesQuery__
 *
 * To run a query within a React component, call `useGetOrganisatiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrganisatiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrganisatiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOrganisatiesQuery(baseOptions?: Apollo.QueryHookOptions<GetOrganisatiesQuery, GetOrganisatiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrganisatiesQuery, GetOrganisatiesQueryVariables>(GetOrganisatiesDocument, options);
      }
export function useGetOrganisatiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrganisatiesQuery, GetOrganisatiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrganisatiesQuery, GetOrganisatiesQueryVariables>(GetOrganisatiesDocument, options);
        }
export type GetOrganisatiesQueryHookResult = ReturnType<typeof useGetOrganisatiesQuery>;
export type GetOrganisatiesLazyQueryHookResult = ReturnType<typeof useGetOrganisatiesLazyQuery>;
export type GetOrganisatiesQueryResult = Apollo.QueryResult<GetOrganisatiesQuery, GetOrganisatiesQueryVariables>;
export const GetReportingDataDocument = gql`
    query getReportingData {
  burgers {
    ...Burger
  }
  bankTransactions {
    ...BankTransaction
    journaalpost {
      id
      isAutomatischGeboekt
      afspraak {
        ...Afspraak
        rubriek {
          id
          naam
        }
      }
      grootboekrekening {
        ...Grootboekrekening
        rubriek {
          id
          naam
        }
      }
    }
  }
  rubrieken {
    id
    naam
  }
}
    ${BurgerFragmentDoc}
${BankTransactionFragmentDoc}
${AfspraakFragmentDoc}
${GrootboekrekeningFragmentDoc}`;

/**
 * __useGetReportingDataQuery__
 *
 * To run a query within a React component, call `useGetReportingDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportingDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportingDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetReportingDataQuery(baseOptions?: Apollo.QueryHookOptions<GetReportingDataQuery, GetReportingDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReportingDataQuery, GetReportingDataQueryVariables>(GetReportingDataDocument, options);
      }
export function useGetReportingDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReportingDataQuery, GetReportingDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReportingDataQuery, GetReportingDataQueryVariables>(GetReportingDataDocument, options);
        }
export type GetReportingDataQueryHookResult = ReturnType<typeof useGetReportingDataQuery>;
export type GetReportingDataLazyQueryHookResult = ReturnType<typeof useGetReportingDataLazyQuery>;
export type GetReportingDataQueryResult = Apollo.QueryResult<GetReportingDataQuery, GetReportingDataQueryVariables>;
export const GetRubriekenDocument = gql`
    query getRubrieken {
  rubrieken {
    ...Rubriek
    grootboekrekening {
      id
      naam
    }
  }
}
    ${RubriekFragmentDoc}`;

/**
 * __useGetRubriekenQuery__
 *
 * To run a query within a React component, call `useGetRubriekenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRubriekenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRubriekenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRubriekenQuery(baseOptions?: Apollo.QueryHookOptions<GetRubriekenQuery, GetRubriekenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRubriekenQuery, GetRubriekenQueryVariables>(GetRubriekenDocument, options);
      }
export function useGetRubriekenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubriekenQuery, GetRubriekenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRubriekenQuery, GetRubriekenQueryVariables>(GetRubriekenDocument, options);
        }
export type GetRubriekenQueryHookResult = ReturnType<typeof useGetRubriekenQuery>;
export type GetRubriekenLazyQueryHookResult = ReturnType<typeof useGetRubriekenLazyQuery>;
export type GetRubriekenQueryResult = Apollo.QueryResult<GetRubriekenQuery, GetRubriekenQueryVariables>;
export const GetTransactionItemFormDataDocument = gql`
    query getTransactionItemFormData {
  rubrieken {
    ...Rubriek
    grootboekrekening {
      id
      naam
    }
  }
  afspraken {
    ...Afspraak
  }
}
    ${RubriekFragmentDoc}
${AfspraakFragmentDoc}`;

/**
 * __useGetTransactionItemFormDataQuery__
 *
 * To run a query within a React component, call `useGetTransactionItemFormDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionItemFormDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionItemFormDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTransactionItemFormDataQuery(baseOptions?: Apollo.QueryHookOptions<GetTransactionItemFormDataQuery, GetTransactionItemFormDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactionItemFormDataQuery, GetTransactionItemFormDataQueryVariables>(GetTransactionItemFormDataDocument, options);
      }
export function useGetTransactionItemFormDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactionItemFormDataQuery, GetTransactionItemFormDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactionItemFormDataQuery, GetTransactionItemFormDataQueryVariables>(GetTransactionItemFormDataDocument, options);
        }
export type GetTransactionItemFormDataQueryHookResult = ReturnType<typeof useGetTransactionItemFormDataQuery>;
export type GetTransactionItemFormDataLazyQueryHookResult = ReturnType<typeof useGetTransactionItemFormDataLazyQuery>;
export type GetTransactionItemFormDataQueryResult = Apollo.QueryResult<GetTransactionItemFormDataQuery, GetTransactionItemFormDataQueryVariables>;
export const GetTransactiesDocument = gql`
    query getTransacties($offset: Int!, $limit: Int!) {
  bankTransactionsPaged(start: $offset, limit: $limit) {
    banktransactions {
      ...BankTransaction
      journaalpost {
        id
        isAutomatischGeboekt
        afspraak {
          ...Afspraak
          rubriek {
            id
            naam
          }
        }
        grootboekrekening {
          ...Grootboekrekening
          rubriek {
            id
            naam
          }
        }
      }
      suggesties {
        ...Afspraak
      }
    }
    pageInfo {
      count
      limit
      start
    }
  }
}
    ${BankTransactionFragmentDoc}
${AfspraakFragmentDoc}
${GrootboekrekeningFragmentDoc}`;

/**
 * __useGetTransactiesQuery__
 *
 * To run a query within a React component, call `useGetTransactiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactiesQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTransactiesQuery(baseOptions: Apollo.QueryHookOptions<GetTransactiesQuery, GetTransactiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactiesQuery, GetTransactiesQueryVariables>(GetTransactiesDocument, options);
      }
export function useGetTransactiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactiesQuery, GetTransactiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactiesQuery, GetTransactiesQueryVariables>(GetTransactiesDocument, options);
        }
export type GetTransactiesQueryHookResult = ReturnType<typeof useGetTransactiesQuery>;
export type GetTransactiesLazyQueryHookResult = ReturnType<typeof useGetTransactiesLazyQuery>;
export type GetTransactiesQueryResult = Apollo.QueryResult<GetTransactiesQuery, GetTransactiesQueryVariables>;