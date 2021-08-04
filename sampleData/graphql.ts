import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  /** Accepts dates, datetimes, ints and strings. */
  DynamicType: any;
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any;
};




export type AddAfspraakZoekterm = {
  ok?: Maybe<Scalars['Boolean']>;
  afspraak?: Maybe<Afspraak>;
  previous?: Maybe<Afspraak>;
  matchingAfspraken?: Maybe<Array<Maybe<Afspraak>>>;
};

export type AddHuishoudenBurger = {
  ok?: Maybe<Scalars['Boolean']>;
  huishouden?: Maybe<Huishouden>;
  previous?: Maybe<Huishouden>;
  burgerIds?: Maybe<Burger>;
};

/** GraphQL Afspraak model  */
export type Afspraak = {
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
  automatischeIncasso?: Maybe<Scalars['Boolean']>;
};


/** GraphQL Afspraak model  */
export type AfspraakOverschrijvingenArgs = {
  startDatum?: Maybe<Scalars['Date']>;
  eindDatum?: Maybe<Scalars['Date']>;
};

/** BankTransaction model */
export type BankTransaction = {
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

export type BankTransactionFilter = {
  OR?: Maybe<BankTransactionFilter>;
  AND?: Maybe<BankTransactionFilter>;
  isGeboekt?: Maybe<Scalars['Boolean']>;
  isCredit?: Maybe<Scalars['Boolean']>;
  id?: Maybe<ComplexFilterType>;
  bedrag?: Maybe<ComplexBedragFilterType>;
  tegenRekening?: Maybe<ComplexFilterType>;
  statementLine?: Maybe<ComplexFilterType>;
  transactieDatum?: Maybe<ComplexFilterType>;
};

export type BankTransactionsPaged = {
  banktransactions?: Maybe<Array<Maybe<BankTransaction>>>;
  pageInfo?: Maybe<PageInfo>;
};


/** Implementatie op basis van http://schema.org/Schedule */
export type Betaalinstructie = {
  byDay?: Maybe<Array<Maybe<DayOfWeek>>>;
  byMonth?: Maybe<Array<Maybe<Scalars['Int']>>>;
  byMonthDay?: Maybe<Array<Maybe<Scalars['Int']>>>;
  repeatFrequency?: Maybe<Scalars['String']>;
  exceptDates?: Maybe<Array<Maybe<Scalars['String']>>>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
};

/** Implementatie op basis van http://schema.org/Schedule */
export type BetaalinstructieInput = {
  byDay?: Maybe<Array<Maybe<DayOfWeek>>>;
  byMonth?: Maybe<Array<Maybe<Scalars['Int']>>>;
  byMonthDay?: Maybe<Array<Maybe<Scalars['Int']>>>;
  repeatFrequency?: Maybe<Scalars['String']>;
  exceptDates?: Maybe<Array<Maybe<Scalars['String']>>>;
  startDate: Scalars['String'];
  endDate?: Maybe<Scalars['String']>;
};

/** GraphQL Burger model  */
export type Burger = {
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
  huishouden?: Maybe<Huishouden>;
  bsn?: Maybe<Scalars['Int']>;
};

export type BurgerFilter = {
  OR?: Maybe<BurgerFilter>;
  AND?: Maybe<BurgerFilter>;
  id?: Maybe<ComplexFilterType>;
  telefoonnummer?: Maybe<ComplexFilterType>;
  email?: Maybe<ComplexFilterType>;
  geboortedatum?: Maybe<ComplexFilterType>;
  iban?: Maybe<ComplexFilterType>;
  achternaam?: Maybe<ComplexFilterType>;
  huisnummer?: Maybe<ComplexFilterType>;
  postcode?: Maybe<ComplexFilterType>;
  straatnaam?: Maybe<ComplexFilterType>;
  voorletters?: Maybe<ComplexFilterType>;
  voornamen?: Maybe<ComplexFilterType>;
  plaatsnaam?: Maybe<ComplexFilterType>;
  huishoudenId?: Maybe<ComplexFilterType>;
};

export type BurgersPaged = {
  burgers?: Maybe<Array<Maybe<Burger>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type ComplexBedragFilterType = {
  EQ?: Maybe<Scalars['Bedrag']>;
  NEQ?: Maybe<Scalars['Bedrag']>;
  GT?: Maybe<Scalars['Bedrag']>;
  GTE?: Maybe<Scalars['Bedrag']>;
  LT?: Maybe<Scalars['Bedrag']>;
  LTE?: Maybe<Scalars['Bedrag']>;
  IN?: Maybe<Array<Maybe<Scalars['Bedrag']>>>;
  NOTIN?: Maybe<Array<Maybe<Scalars['Bedrag']>>>;
  BETWEEN?: Maybe<Array<Maybe<Scalars['Bedrag']>>>;
};

export type ComplexFilterType = {
  EQ?: Maybe<Scalars['DynamicType']>;
  NEQ?: Maybe<Scalars['DynamicType']>;
  GT?: Maybe<Scalars['DynamicType']>;
  GTE?: Maybe<Scalars['DynamicType']>;
  LT?: Maybe<Scalars['DynamicType']>;
  LTE?: Maybe<Scalars['DynamicType']>;
  IN?: Maybe<Array<Maybe<Scalars['DynamicType']>>>;
  NOTIN?: Maybe<Array<Maybe<Scalars['DynamicType']>>>;
  BETWEEN?: Maybe<Array<Maybe<Scalars['DynamicType']>>>;
};

export type Configuratie = {
  id?: Maybe<Scalars['String']>;
  waarde?: Maybe<Scalars['String']>;
};

export type ConfiguratieInput = {
  id: Scalars['String'];
  waarde?: Maybe<Scalars['String']>;
};

export type CreateAfspraak = {
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
  validThrough?: Maybe<Scalars['String']>;
};

export type CreateBurger = {
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
  huishouden?: Maybe<HuishoudenInput>;
  bsn?: Maybe<Scalars['Int']>;
};

export type CreateBurgerRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
};

export type CreateConfiguratie = {
  ok?: Maybe<Scalars['Boolean']>;
  configuratie?: Maybe<Configuratie>;
};

export type CreateCustomerStatementMessage = {
  ok?: Maybe<Scalars['Boolean']>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
};

export type CreateExportOverschrijvingen = {
  ok?: Maybe<Scalars['Boolean']>;
  export?: Maybe<Export>;
};

export type CreateHuishouden = {
  ok?: Maybe<Scalars['Boolean']>;
  huishouden?: Maybe<Huishouden>;
};

export type CreateHuishoudenInput = {
  burgerIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

/** Create a Journaalpost with an Afspraak */
export type CreateJournaalpostAfspraak = {
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
  ok?: Maybe<Scalars['Boolean']>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
};

export type CreateOrganisatie = {
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
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
};

export type CreateRubriek = {
  ok?: Maybe<Scalars['Boolean']>;
  rubriek?: Maybe<Rubriek>;
};

/** GraphQL CustomerStatementMessage model */
export type CustomerStatementMessage = {
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
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
};

export type DeleteAfspraakZoekterm = {
  ok?: Maybe<Scalars['Boolean']>;
  afspraak?: Maybe<Afspraak>;
  previous?: Maybe<Afspraak>;
  matchingAfspraken?: Maybe<Array<Maybe<Afspraak>>>;
};

export type DeleteBurger = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Burger>;
};

export type DeleteBurgerRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rekening>;
};

export type DeleteConfiguratie = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Configuratie>;
};

export type DeleteCustomerStatementMessage = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<CustomerStatementMessage>;
};

export type DeleteHuishouden = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Huishouden>;
};

export type DeleteHuishoudenBurger = {
  ok?: Maybe<Scalars['Boolean']>;
  huishouden?: Maybe<Array<Maybe<Huishouden>>>;
  previous?: Maybe<Huishouden>;
  burgerIds?: Maybe<Array<Maybe<Burger>>>;
};

/** Delete journaalpost by id  */
export type DeleteJournaalpost = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Journaalpost>;
};

export type DeleteOrganisatie = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Organisatie>;
};

export type DeleteOrganisatieRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rekening>;
};

export type DeleteRubriek = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rubriek>;
};


/** GraphQL Export model  */
export type Export = {
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  overschrijvingen?: Maybe<Array<Maybe<Overschrijving>>>;
  xmldata?: Maybe<Scalars['String']>;
  startDatum?: Maybe<Scalars['String']>;
  eindDatum?: Maybe<Scalars['String']>;
  sha256?: Maybe<Scalars['String']>;
};

export type Gebruiker = {
  email?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

/** GebruikersActiviteit model */
export type GebruikersActiviteit = {
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
  huishouden?: Maybe<Huishouden>;
};

export type GebruikersActiviteitMeta = {
  userAgent?: Maybe<Scalars['String']>;
  ip?: Maybe<Array<Maybe<Scalars['String']>>>;
  applicationVersion?: Maybe<Scalars['String']>;
};

export type GebruikersActiviteitSnapshot = {
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
  huishouden?: Maybe<Huishouden>;
};

export type GebruikersActiviteitenPaged = {
  gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersActiviteit>>>;
  pageInfo?: Maybe<PageInfo>;
};

/** Grootboekrekening model  */
export type Grootboekrekening = {
  id: Scalars['String'];
  naam?: Maybe<Scalars['String']>;
  referentie?: Maybe<Scalars['String']>;
  omschrijving?: Maybe<Scalars['String']>;
  credit?: Maybe<Scalars['Boolean']>;
  parent?: Maybe<Grootboekrekening>;
  children?: Maybe<Array<Maybe<Grootboekrekening>>>;
  rubriek?: Maybe<Rubriek>;
};

/** GraphQL Huishouden model  */
export type Huishouden = {
  id?: Maybe<Scalars['Int']>;
  burgers?: Maybe<Array<Maybe<Burger>>>;
};

export type HuishoudenInput = {
  id?: Maybe<Scalars['Int']>;
};

export type HuishoudensPaged = {
  huishoudens?: Maybe<Array<Maybe<Huishouden>>>;
  pageInfo?: Maybe<PageInfo>;
};

/** Journaalpost model */
export type Journaalpost = {
  id?: Maybe<Scalars['Int']>;
  afspraak?: Maybe<Afspraak>;
  transaction?: Maybe<BankTransaction>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  isAutomatischGeboekt?: Maybe<Scalars['Boolean']>;
};

/** GraphQL Organisatie model  */
export type Organisatie = {
  id?: Maybe<Scalars['Int']>;
  weergaveNaam?: Maybe<Scalars['String']>;
  rekeningen?: Maybe<Array<Maybe<Rekening>>>;
  kvkNummer?: Maybe<Scalars['String']>;
  kvkDetails?: Maybe<OrganisatieKvK>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
};

export type OrganisatieKvK = {
  nummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  huisnummer?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
};

export type Overschrijving = {
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
  count?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

/** GraphQL Rekening model */
export type Rekening = {
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
  createHuishouden?: Maybe<CreateHuishouden>;
  deleteHuishouden?: Maybe<DeleteHuishouden>;
  addHuishoudenBurger?: Maybe<AddHuishoudenBurger>;
  deleteHuishoudenBurger?: Maybe<DeleteHuishoudenBurger>;
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
  bsn?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  geboortedatum?: Maybe<Scalars['String']>;
  huishouden?: Maybe<HuishoudenInput>;
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


/** The root of all mutations  */
export type RootMutationCreateHuishoudenArgs = {
  input?: Maybe<CreateHuishoudenInput>;
};


/** The root of all mutations  */
export type RootMutationDeleteHuishoudenArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationAddHuishoudenBurgerArgs = {
  burgerIds: Array<Maybe<Scalars['Int']>>;
  huishoudenId: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteHuishoudenBurgerArgs = {
  burgerIds: Array<Maybe<Scalars['Int']>>;
  huishoudenId: Scalars['Int'];
};

/** The root of all queries  */
export type RootQuery = {
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
  gebruikersactiviteit?: Maybe<GebruikersActiviteit>;
  gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersActiviteit>>>;
  gebruikersactiviteitenPaged?: Maybe<GebruikersActiviteitenPaged>;
  gebruiker?: Maybe<Gebruiker>;
  huishouden?: Maybe<Huishouden>;
  huishoudens?: Maybe<Array<Maybe<Huishouden>>>;
  huishoudensPaged?: Maybe<HuishoudensPaged>;
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
  filters?: Maybe<BankTransactionFilter>;
};


/** The root of all queries  */
export type RootQueryBankTransactionsPagedArgs = {
  start?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  filters?: Maybe<BankTransactionFilter>;
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
export type RootQueryGebruikersactiviteitArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitenArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  burgerIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  afsprakenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  huishoudenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitenPagedArgs = {
  start?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  burgerIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  afsprakenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  huishoudenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryHuishoudenArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryHuishoudensArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  filters?: Maybe<BurgerFilter>;
};


/** The root of all queries  */
export type RootQueryHuishoudensPagedArgs = {
  start?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  filters?: Maybe<BurgerFilter>;
};

/** GraphQL Rubriek model */
export type Rubriek = {
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  grootboekrekening?: Maybe<Grootboekrekening>;
};

export type StartAutomatischBoeken = {
  ok?: Maybe<Scalars['Boolean']>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
};

export type UpdateAfspraak = {
  ok?: Maybe<Scalars['Boolean']>;
  afspraak?: Maybe<Afspraak>;
  previous?: Maybe<Afspraak>;
};

export type UpdateAfspraakBetaalinstructie = {
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
  ok?: Maybe<Scalars['Boolean']>;
  burger?: Maybe<Burger>;
  previous?: Maybe<Burger>;
};

export type UpdateConfiguratie = {
  ok?: Maybe<Scalars['Boolean']>;
  configuratie?: Maybe<Configuratie>;
  previous?: Maybe<Configuratie>;
};

/** Update a Journaalpost with a Grootboekrekening */
export type UpdateJournaalpostGrootboekrekening = {
  ok?: Maybe<Scalars['Boolean']>;
  journaalpost?: Maybe<Journaalpost>;
  previous?: Maybe<Journaalpost>;
};

export type UpdateJournaalpostGrootboekrekeningInput = {
  id: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
};

export type UpdateOrganisatie = {
  ok?: Maybe<Scalars['Boolean']>;
  organisatie?: Maybe<Organisatie>;
  previous?: Maybe<Organisatie>;
};

export type UpdateRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
  previous?: Maybe<Rekening>;
};

export type UpdateRubriek = {
  ok?: Maybe<Scalars['Boolean']>;
  rubriek?: Maybe<Rubriek>;
  previous?: Maybe<Rubriek>;
};


export type AfspraakFragment = (
  Pick<Afspraak, 'id' | 'omschrijving' | 'bedrag' | 'credit' | 'zoektermen' | 'validFrom' | 'validThrough'>
  & { betaalinstructie?: Maybe<BetaalinstructieFragment>, burger?: Maybe<(
    Pick<Burger, 'id' | 'voornamen' | 'voorletters' | 'achternaam' | 'plaatsnaam'>
    & { rekeningen?: Maybe<Array<Maybe<RekeningFragment>>> }
  )>, tegenRekening?: Maybe<RekeningFragment>, organisatie?: Maybe<(
    Pick<Organisatie, 'id' | 'weergaveNaam'>
    & { kvkDetails?: Maybe<Pick<OrganisatieKvK, 'naam' | 'plaatsnaam'>> }
  )>, rubriek?: Maybe<RubriekFragment>, matchingAfspraken?: Maybe<Array<Maybe<(
    Pick<Afspraak, 'id' | 'credit' | 'zoektermen' | 'bedrag' | 'omschrijving'>
    & { burger?: Maybe<Pick<Burger, 'voorletters' | 'voornamen' | 'achternaam'>>, tegenRekening?: Maybe<Pick<Rekening, 'id' | 'iban' | 'rekeninghouder'>> }
  )>>> }
);

export type BetaalinstructieFragment = Pick<Betaalinstructie, 'byDay' | 'byMonth' | 'byMonthDay' | 'exceptDates' | 'repeatFrequency' | 'startDate' | 'endDate'>;

export type BurgerFragment = (
  Pick<Burger, 'id' | 'email' | 'telefoonnummer' | 'voorletters' | 'voornamen' | 'achternaam' | 'geboortedatum' | 'straatnaam' | 'huisnummer' | 'postcode' | 'plaatsnaam'>
  & { rekeningen?: Maybe<Array<Maybe<RekeningFragment>>>, afspraken?: Maybe<Array<Maybe<AfspraakFragment>>> }
);

export type CustomerStatementMessageFragment = Pick<CustomerStatementMessage, 'id' | 'filename' | 'uploadDate' | 'accountIdentification' | 'closingAvailableFunds' | 'closingBalance' | 'forwardAvailableBalance' | 'openingBalance' | 'relatedReference' | 'sequenceNumber' | 'transactionReferenceNumber'>;

export type ExportFragment = (
  Pick<Export, 'id' | 'naam' | 'timestamp' | 'startDatum' | 'eindDatum' | 'sha256'>
  & { overschrijvingen?: Maybe<Array<Maybe<Pick<Overschrijving, 'id'>>>> }
);

export type GebruikerFragment = Pick<Gebruiker, 'email'>;

export type GebruikersactiviteitFragment = (
  Pick<GebruikersActiviteit, 'id' | 'timestamp' | 'gebruikerId' | 'action'>
  & { entities?: Maybe<Array<Maybe<(
    Pick<GebruikersActiviteitEntity, 'entityType' | 'entityId'>
    & { burger?: Maybe<Pick<Burger, 'id' | 'voorletters' | 'voornamen' | 'achternaam'>>, organisatie?: Maybe<Pick<Organisatie, 'id' | 'weergaveNaam'>>, afspraak?: Maybe<(
      Pick<Afspraak, 'id'>
      & { organisatie?: Maybe<Pick<Organisatie, 'id' | 'weergaveNaam'>> }
    )>, rekening?: Maybe<Pick<Rekening, 'id' | 'iban' | 'rekeninghouder'>>, customerStatementMessage?: Maybe<Pick<CustomerStatementMessage, 'id'>>, configuratie?: Maybe<Pick<Configuratie, 'id' | 'waarde'>> }
  )>>>, meta?: Maybe<Pick<GebruikersActiviteitMeta, 'userAgent' | 'ip' | 'applicationVersion'>> }
);

export type GrootboekrekeningFragment = (
  Pick<Grootboekrekening, 'id' | 'naam' | 'credit' | 'omschrijving' | 'referentie'>
  & { rubriek?: Maybe<Pick<Rubriek, 'id' | 'naam'>> }
);

export type JournaalpostFragment = Pick<Journaalpost, 'id'>;

export type OrganisatieFragment = (
  Pick<Organisatie, 'id' | 'kvkNummer' | 'weergaveNaam'>
  & { rekeningen?: Maybe<Array<Maybe<RekeningFragment>>> }
  & KvkFragment
);

export type KvkFragment = { kvkDetails?: Maybe<Pick<OrganisatieKvK, 'huisnummer' | 'naam' | 'nummer' | 'plaatsnaam' | 'postcode' | 'straatnaam'>> };

export type RekeningFragment = Pick<Rekening, 'id' | 'iban' | 'rekeninghouder'>;

export type RubriekFragment = (
  Pick<Rubriek, 'id' | 'naam'>
  & { grootboekrekening?: Maybe<GrootboekrekeningFragment> }
);

export type BankTransactionFragment = (
  Pick<BankTransaction, 'id' | 'informationToAccountOwner' | 'statementLine' | 'bedrag' | 'isCredit' | 'tegenRekeningIban' | 'transactieDatum'>
  & { tegenRekening?: Maybe<Pick<Rekening, 'iban' | 'rekeninghouder'>> }
);

export type AddAfspraakZoektermMutationVariables = Exact<{
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
}>;


export type AddAfspraakZoektermMutation = { addAfspraakZoekterm?: Maybe<(
    Pick<AddAfspraakZoekterm, 'ok'>
    & { matchingAfspraken?: Maybe<Array<Maybe<(
      Pick<Afspraak, 'id' | 'zoektermen' | 'bedrag'>
      & { burger?: Maybe<Pick<Burger, 'id' | 'voorletters' | 'voornamen' | 'achternaam'>>, tegenRekening?: Maybe<Pick<Rekening, 'rekeninghouder' | 'iban'>> }
    )>>> }
  )> };

export type CreateAfspraakMutationVariables = Exact<{
  input: CreateAfspraakInput;
}>;


export type CreateAfspraakMutation = { createAfspraak?: Maybe<(
    Pick<CreateAfspraak, 'ok'>
    & { afspraak?: Maybe<AfspraakFragment> }
  )> };

export type CreateBurgerMutationVariables = Exact<{
  input?: Maybe<CreateBurgerInput>;
}>;


export type CreateBurgerMutation = { createBurger?: Maybe<(
    Pick<CreateBurger, 'ok'>
    & { burger?: Maybe<BurgerFragment> }
  )> };

export type CreateBurgerRekeningMutationVariables = Exact<{
  burgerId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateBurgerRekeningMutation = { createBurgerRekening?: Maybe<(
    Pick<CreateBurgerRekening, 'ok'>
    & { rekening?: Maybe<RekeningFragment> }
  )> };

export type CreateConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type CreateConfiguratieMutation = { createConfiguratie?: Maybe<(
    Pick<CreateConfiguratie, 'ok'>
    & { configuratie?: Maybe<Pick<Configuratie, 'id' | 'waarde'>> }
  )> };

export type CreateCustomerStatementMessageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type CreateCustomerStatementMessageMutation = { createCustomerStatementMessage?: Maybe<(
    Pick<CreateCustomerStatementMessage, 'ok'>
    & { customerStatementMessage?: Maybe<CustomerStatementMessageFragment> }
  )> };

export type CreateExportOverschrijvingenMutationVariables = Exact<{
  startDatum: Scalars['String'];
  eindDatum: Scalars['String'];
}>;


export type CreateExportOverschrijvingenMutation = { createExportOverschrijvingen?: Maybe<(
    Pick<CreateExportOverschrijvingen, 'ok'>
    & { export?: Maybe<Pick<Export, 'id'>> }
  )> };

export type CreateJournaalpostAfspraakMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  afspraakId: Scalars['Int'];
  isAutomatischGeboekt?: Maybe<Scalars['Boolean']>;
}>;


export type CreateJournaalpostAfspraakMutation = { createJournaalpostAfspraak?: Maybe<(
    Pick<CreateJournaalpostAfspraak, 'ok'>
    & { journaalpost?: Maybe<Pick<Journaalpost, 'id'>> }
  )> };

export type CreateJournaalpostGrootboekrekeningMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
}>;


export type CreateJournaalpostGrootboekrekeningMutation = { createJournaalpostGrootboekrekening?: Maybe<(
    Pick<CreateJournaalpostGrootboekrekening, 'ok'>
    & { journaalpost?: Maybe<Pick<Journaalpost, 'id'>> }
  )> };

export type CreateOrganisatieMutationVariables = Exact<{
  huisnummer?: Maybe<Scalars['String']>;
  kvkNummer: Scalars['String'];
  naam?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  weergaveNaam: Scalars['String'];
}>;


export type CreateOrganisatieMutation = { createOrganisatie?: Maybe<(
    Pick<CreateOrganisatie, 'ok'>
    & { organisatie?: Maybe<OrganisatieFragment> }
  )> };

export type CreateOrganisatieRekeningMutationVariables = Exact<{
  orgId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateOrganisatieRekeningMutation = { createOrganisatieRekening?: Maybe<(
    Pick<CreateOrganisatieRekening, 'ok'>
    & { rekening?: Maybe<RekeningFragment> }
  )> };

export type CreateRubriekMutationVariables = Exact<{
  naam?: Maybe<Scalars['String']>;
  grootboekrekening?: Maybe<Scalars['String']>;
}>;


export type CreateRubriekMutation = { createRubriek?: Maybe<(
    Pick<CreateRubriek, 'ok'>
    & { rubriek?: Maybe<(
      Pick<Rubriek, 'id' | 'naam'>
      & { grootboekrekening?: Maybe<GrootboekrekeningFragment> }
    )> }
  )> };

export type DeleteOrganisatieMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteOrganisatieMutation = { deleteOrganisatie?: Maybe<Pick<DeleteOrganisatie, 'ok'>> };

export type DeleteAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteAfspraakMutation = { deleteAfspraak?: Maybe<Pick<DeleteAfspraak, 'ok'>> };

export type DeleteAfspraakZoektermMutationVariables = Exact<{
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
}>;


export type DeleteAfspraakZoektermMutation = { deleteAfspraakZoekterm?: Maybe<(
    Pick<DeleteAfspraakZoekterm, 'ok'>
    & { matchingAfspraken?: Maybe<Array<Maybe<(
      Pick<Afspraak, 'id' | 'zoektermen' | 'bedrag'>
      & { burger?: Maybe<Pick<Burger, 'id' | 'voorletters' | 'voornamen' | 'achternaam'>>, tegenRekening?: Maybe<Pick<Rekening, 'rekeninghouder' | 'iban'>> }
    )>>> }
  )> };

export type DeleteBurgerMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteBurgerMutation = { deleteBurger?: Maybe<Pick<DeleteBurger, 'ok'>> };

export type DeleteBurgerRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  burgerId: Scalars['Int'];
}>;


export type DeleteBurgerRekeningMutation = { deleteBurgerRekening?: Maybe<Pick<DeleteBurgerRekening, 'ok'>> };

export type DeleteConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
}>;


export type DeleteConfiguratieMutation = { deleteConfiguratie?: Maybe<Pick<DeleteConfiguratie, 'ok'>> };

export type DeleteCustomerStatementMessageMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCustomerStatementMessageMutation = { deleteCustomerStatementMessage?: Maybe<Pick<DeleteCustomerStatementMessage, 'ok'>> };

export type DeleteJournaalpostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteJournaalpostMutation = { deleteJournaalpost?: Maybe<Pick<DeleteJournaalpost, 'ok'>> };

export type DeleteOrganisatieRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  orgId: Scalars['Int'];
}>;


export type DeleteOrganisatieRekeningMutation = { deleteOrganisatieRekening?: Maybe<Pick<DeleteOrganisatieRekening, 'ok'>> };

export type EndAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  validThrough: Scalars['String'];
}>;


export type EndAfspraakMutation = { updateAfspraak?: Maybe<(
    Pick<UpdateAfspraak, 'ok'>
    & { afspraak?: Maybe<AfspraakFragment> }
  )> };

export type StartAutomatischBoekenMutationVariables = Exact<{ [key: string]: never; }>;


export type StartAutomatischBoekenMutation = { startAutomatischBoeken?: Maybe<(
    Pick<StartAutomatischBoeken, 'ok'>
    & { journaalposten?: Maybe<Array<Maybe<Pick<Journaalpost, 'id'>>>> }
  )> };

export type UpdateAfspraakBetaalinstructieMutationVariables = Exact<{
  id: Scalars['Int'];
  betaalinstructie: BetaalinstructieInput;
}>;


export type UpdateAfspraakBetaalinstructieMutation = { updateAfspraakBetaalinstructie?: Maybe<Pick<UpdateAfspraakBetaalinstructie, 'ok'>> };

export type UpdateAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateAfspraakInput;
}>;


export type UpdateAfspraakMutation = { updateAfspraak?: Maybe<(
    Pick<UpdateAfspraak, 'ok'>
    & { afspraak?: Maybe<AfspraakFragment> }
  )> };

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


export type UpdateBurgerMutation = { updateBurger?: Maybe<(
    Pick<UpdateBurger, 'ok'>
    & { burger?: Maybe<BurgerFragment> }
  )> };

export type UpdateConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type UpdateConfiguratieMutation = { updateConfiguratie?: Maybe<(
    Pick<UpdateConfiguratie, 'ok'>
    & { configuratie?: Maybe<Pick<Configuratie, 'id' | 'waarde'>> }
  )> };

export type UpdateJournaalpostGrootboekrekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
}>;


export type UpdateJournaalpostGrootboekrekeningMutation = { updateJournaalpostGrootboekrekening?: Maybe<Pick<UpdateJournaalpostGrootboekrekening, 'ok'>> };

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


export type UpdateOrganisatieMutation = { updateOrganisatie?: Maybe<(
    Pick<UpdateOrganisatie, 'ok'>
    & { organisatie?: Maybe<OrganisatieFragment> }
  )> };

export type UpdateRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  iban?: Maybe<Scalars['String']>;
  rekeninghouder?: Maybe<Scalars['String']>;
}>;


export type UpdateRekeningMutation = { updateRekening?: Maybe<Pick<UpdateRekening, 'ok'>> };

export type GetAfspraakFormDataQueryVariables = Exact<{
  afspraakId: Scalars['Int'];
}>;


export type GetAfspraakFormDataQuery = { afspraak?: Maybe<AfspraakFragment>, rubrieken?: Maybe<Array<Maybe<(
    { grootboekrekening?: Maybe<Pick<Grootboekrekening, 'id' | 'naam' | 'credit'>> }
    & RubriekFragment
  )>>>, organisaties?: Maybe<Array<Maybe<OrganisatieFragment>>> };

export type GetAfsprakenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAfsprakenQuery = { afspraken?: Maybe<Array<Maybe<AfspraakFragment>>> };

export type GetBurgerAfsprakenQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerAfsprakenQuery = { burger?: Maybe<{ afspraken?: Maybe<Array<Maybe<AfspraakFragment>>> }> };

export type GetBurgerGebeurtenissenQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetBurgerGebeurtenissenQuery = { gebruikersactiviteitenPaged?: Maybe<{ gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersactiviteitFragment>>>, pageInfo?: Maybe<Pick<PageInfo, 'count'>> }> };

export type GetBurgerQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerQuery = { burger?: Maybe<BurgerFragment> };

export type GetBurgersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBurgersQuery = { burgers?: Maybe<Array<Maybe<BurgerFragment>>> };

export type GetConfiguratieQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConfiguratieQuery = { configuraties?: Maybe<Array<Maybe<Pick<Configuratie, 'id' | 'waarde'>>>> };

export type GetCreateAfspraakFormDataQueryVariables = Exact<{
  burgerId: Scalars['Int'];
}>;


export type GetCreateAfspraakFormDataQuery = { burger?: Maybe<{ rekeningen?: Maybe<Array<Maybe<RekeningFragment>>> }>, rubrieken?: Maybe<Array<Maybe<(
    { grootboekrekening?: Maybe<Pick<Grootboekrekening, 'id' | 'naam' | 'credit'>> }
    & RubriekFragment
  )>>>, organisaties?: Maybe<Array<Maybe<OrganisatieFragment>>> };

export type GetCsmsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCsmsQuery = { customerStatementMessages?: Maybe<Array<Maybe<CustomerStatementMessageFragment>>> };

export type GetExportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExportsQuery = { exports?: Maybe<Array<Maybe<ExportFragment>>> };

export type GetGebeurtenissenQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetGebeurtenissenQuery = { gebruikersactiviteitenPaged?: Maybe<{ gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersactiviteitFragment>>>, pageInfo?: Maybe<Pick<PageInfo, 'count'>> }> };

export type GetGebruikerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGebruikerQuery = { gebruiker?: Maybe<GebruikerFragment> };

export type GetAfspraakQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetAfspraakQuery = { afspraak?: Maybe<AfspraakFragment> };

export type GetOrganisatieQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetOrganisatieQuery = { organisatie?: Maybe<OrganisatieFragment> };

export type GetOrganisatiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganisatiesQuery = { organisaties?: Maybe<Array<Maybe<(
    Pick<Organisatie, 'id'>
    & OrganisatieFragment
  )>>> };

export type GetReportingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReportingDataQuery = { burgers?: Maybe<Array<Maybe<BurgerFragment>>>, bankTransactions?: Maybe<Array<Maybe<(
    { journaalpost?: Maybe<(
      Pick<Journaalpost, 'id' | 'isAutomatischGeboekt'>
      & { afspraak?: Maybe<(
        { rubriek?: Maybe<Pick<Rubriek, 'id' | 'naam'>> }
        & AfspraakFragment
      )>, grootboekrekening?: Maybe<(
        { rubriek?: Maybe<Pick<Rubriek, 'id' | 'naam'>> }
        & GrootboekrekeningFragment
      )> }
    )> }
    & BankTransactionFragment
  )>>>, rubrieken?: Maybe<Array<Maybe<Pick<Rubriek, 'id' | 'naam'>>>> };

export type GetRubriekenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRubriekenQuery = { rubrieken?: Maybe<Array<Maybe<(
    { grootboekrekening?: Maybe<Pick<Grootboekrekening, 'id' | 'naam'>> }
    & RubriekFragment
  )>>> };

export type GetTransactionItemFormDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTransactionItemFormDataQuery = { rubrieken?: Maybe<Array<Maybe<(
    { grootboekrekening?: Maybe<Pick<Grootboekrekening, 'id' | 'naam'>> }
    & RubriekFragment
  )>>>, afspraken?: Maybe<Array<Maybe<AfspraakFragment>>> };

export type GetTransactiesQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  filters?: Maybe<BankTransactionFilter>;
}>;


export type GetTransactiesQuery = { bankTransactionsPaged?: Maybe<{ banktransactions?: Maybe<Array<Maybe<(
      { journaalpost?: Maybe<(
        Pick<Journaalpost, 'id' | 'isAutomatischGeboekt'>
        & { afspraak?: Maybe<(
          { rubriek?: Maybe<Pick<Rubriek, 'id' | 'naam'>> }
          & AfspraakFragment
        )>, grootboekrekening?: Maybe<(
          { rubriek?: Maybe<Pick<Rubriek, 'id' | 'naam'>> }
          & GrootboekrekeningFragment
        )> }
      )>, suggesties?: Maybe<Array<Maybe<AfspraakFragment>>> }
      & BankTransactionFragment
    )>>>, pageInfo?: Maybe<Pick<PageInfo, 'count' | 'limit' | 'start'>> }> };

export const RekeningFragmentDoc = gql`
    fragment Rekening on Rekening {
  id
  iban
  rekeninghouder
}
    `;
export const BetaalinstructieFragmentDoc = gql`
    fragment Betaalinstructie on Betaalinstructie {
  byDay
  byMonth
  byMonthDay
  exceptDates
  repeatFrequency
  startDate
  endDate
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
  bedrag
  credit
  betaalinstructie {
    ...Betaalinstructie
  }
  zoektermen
  validFrom
  validThrough
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
    tegenRekening {
      id
      iban
      rekeninghouder
    }
  }
}
    ${BetaalinstructieFragmentDoc}
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
}
    `;
export const ExportFragmentDoc = gql`
    fragment Export on Export {
  id
  naam
  timestamp
  startDatum
  eindDatum
  sha256
  overschrijvingen {
    id
  }
}
    `;
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
export const CreateRubriekDocument = gql`
    mutation createRubriek($naam: String, $grootboekrekening: String) {
  createRubriek(naam: $naam, grootboekrekeningId: $grootboekrekening) {
    ok
    rubriek {
      id
      naam
      grootboekrekening {
        ...Grootboekrekening
      }
    }
  }
}
    ${GrootboekrekeningFragmentDoc}`;
export const DeleteOrganisatieDocument = gql`
    mutation deleteOrganisatie($id: Int!) {
  deleteOrganisatie(id: $id) {
    ok
  }
}
    `;
export const DeleteAfspraakDocument = gql`
    mutation deleteAfspraak($id: Int!) {
  deleteAfspraak(id: $id) {
    ok
  }
}
    `;
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
export const DeleteBurgerDocument = gql`
    mutation deleteBurger($id: Int!) {
  deleteBurger(id: $id) {
    ok
  }
}
    `;
export const DeleteBurgerRekeningDocument = gql`
    mutation deleteBurgerRekening($id: Int!, $burgerId: Int!) {
  deleteBurgerRekening(id: $id, burgerId: $burgerId) {
    ok
  }
}
    `;
export const DeleteConfiguratieDocument = gql`
    mutation deleteConfiguratie($key: String!) {
  deleteConfiguratie(id: $key) {
    ok
  }
}
    `;
export const DeleteCustomerStatementMessageDocument = gql`
    mutation deleteCustomerStatementMessage($id: Int!) {
  deleteCustomerStatementMessage(id: $id) {
    ok
  }
}
    `;
export const DeleteJournaalpostDocument = gql`
    mutation deleteJournaalpost($id: Int!) {
  deleteJournaalpost(id: $id) {
    ok
  }
}
    `;
export const DeleteOrganisatieRekeningDocument = gql`
    mutation deleteOrganisatieRekening($id: Int!, $orgId: Int!) {
  deleteOrganisatieRekening(organisatieId: $orgId, rekeningId: $id) {
    ok
  }
}
    `;
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
export const UpdateJournaalpostGrootboekrekeningDocument = gql`
    mutation updateJournaalpostGrootboekrekening($id: Int!, $grootboekrekeningId: String!) {
  updateJournaalpostGrootboekrekening(
    input: {id: $id, grootboekrekeningId: $grootboekrekeningId}
  ) {
    ok
  }
}
    `;
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
export const GetAfsprakenDocument = gql`
    query getAfspraken {
  afspraken {
    ...Afspraak
  }
}
    ${AfspraakFragmentDoc}`;
export const GetBurgerAfsprakenDocument = gql`
    query getBurgerAfspraken($id: Int!) {
  burger(id: $id) {
    afspraken {
      ...Afspraak
    }
  }
}
    ${AfspraakFragmentDoc}`;
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
export const GetBurgerDocument = gql`
    query getBurger($id: Int!) {
  burger(id: $id) {
    ...Burger
  }
}
    ${BurgerFragmentDoc}`;
export const GetBurgersDocument = gql`
    query getBurgers {
  burgers {
    ...Burger
  }
}
    ${BurgerFragmentDoc}`;
export const GetConfiguratieDocument = gql`
    query getConfiguratie {
  configuraties {
    id
    waarde
  }
}
    `;
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
export const GetCsmsDocument = gql`
    query getCsms {
  customerStatementMessages {
    ...CustomerStatementMessage
  }
}
    ${CustomerStatementMessageFragmentDoc}`;
export const GetExportsDocument = gql`
    query getExports {
  exports {
    ...Export
  }
}
    ${ExportFragmentDoc}`;
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
export const GetGebruikerDocument = gql`
    query getGebruiker {
  gebruiker {
    ...Gebruiker
  }
}
    ${GebruikerFragmentDoc}`;
export const GetAfspraakDocument = gql`
    query getAfspraak($id: Int!) {
  afspraak(id: $id) {
    ...Afspraak
  }
}
    ${AfspraakFragmentDoc}`;
export const GetOrganisatieDocument = gql`
    query getOrganisatie($id: Int!) {
  organisatie(id: $id) {
    ...Organisatie
  }
}
    ${OrganisatieFragmentDoc}`;
export const GetOrganisatiesDocument = gql`
    query getOrganisaties {
  organisaties {
    id
    ...Organisatie
  }
}
    ${OrganisatieFragmentDoc}`;
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
export const GetTransactiesDocument = gql`
    query getTransacties($offset: Int!, $limit: Int!, $filters: BankTransactionFilter) {
  bankTransactionsPaged(start: $offset, limit: $limit, filters: $filters) {
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
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    addAfspraakZoekterm(variables: AddAfspraakZoektermMutationVariables, options?: C): Promise<AddAfspraakZoektermMutation> {
      return requester<AddAfspraakZoektermMutation, AddAfspraakZoektermMutationVariables>(AddAfspraakZoektermDocument, variables, options);
    },
    createAfspraak(variables: CreateAfspraakMutationVariables, options?: C): Promise<CreateAfspraakMutation> {
      return requester<CreateAfspraakMutation, CreateAfspraakMutationVariables>(CreateAfspraakDocument, variables, options);
    },
    createBurger(variables?: CreateBurgerMutationVariables, options?: C): Promise<CreateBurgerMutation> {
      return requester<CreateBurgerMutation, CreateBurgerMutationVariables>(CreateBurgerDocument, variables, options);
    },
    createBurgerRekening(variables: CreateBurgerRekeningMutationVariables, options?: C): Promise<CreateBurgerRekeningMutation> {
      return requester<CreateBurgerRekeningMutation, CreateBurgerRekeningMutationVariables>(CreateBurgerRekeningDocument, variables, options);
    },
    createConfiguratie(variables: CreateConfiguratieMutationVariables, options?: C): Promise<CreateConfiguratieMutation> {
      return requester<CreateConfiguratieMutation, CreateConfiguratieMutationVariables>(CreateConfiguratieDocument, variables, options);
    },
    createCustomerStatementMessage(variables: CreateCustomerStatementMessageMutationVariables, options?: C): Promise<CreateCustomerStatementMessageMutation> {
      return requester<CreateCustomerStatementMessageMutation, CreateCustomerStatementMessageMutationVariables>(CreateCustomerStatementMessageDocument, variables, options);
    },
    createExportOverschrijvingen(variables: CreateExportOverschrijvingenMutationVariables, options?: C): Promise<CreateExportOverschrijvingenMutation> {
      return requester<CreateExportOverschrijvingenMutation, CreateExportOverschrijvingenMutationVariables>(CreateExportOverschrijvingenDocument, variables, options);
    },
    createJournaalpostAfspraak(variables: CreateJournaalpostAfspraakMutationVariables, options?: C): Promise<CreateJournaalpostAfspraakMutation> {
      return requester<CreateJournaalpostAfspraakMutation, CreateJournaalpostAfspraakMutationVariables>(CreateJournaalpostAfspraakDocument, variables, options);
    },
    createJournaalpostGrootboekrekening(variables: CreateJournaalpostGrootboekrekeningMutationVariables, options?: C): Promise<CreateJournaalpostGrootboekrekeningMutation> {
      return requester<CreateJournaalpostGrootboekrekeningMutation, CreateJournaalpostGrootboekrekeningMutationVariables>(CreateJournaalpostGrootboekrekeningDocument, variables, options);
    },
    createOrganisatie(variables: CreateOrganisatieMutationVariables, options?: C): Promise<CreateOrganisatieMutation> {
      return requester<CreateOrganisatieMutation, CreateOrganisatieMutationVariables>(CreateOrganisatieDocument, variables, options);
    },
    createOrganisatieRekening(variables: CreateOrganisatieRekeningMutationVariables, options?: C): Promise<CreateOrganisatieRekeningMutation> {
      return requester<CreateOrganisatieRekeningMutation, CreateOrganisatieRekeningMutationVariables>(CreateOrganisatieRekeningDocument, variables, options);
    },
    createRubriek(variables?: CreateRubriekMutationVariables, options?: C): Promise<CreateRubriekMutation> {
      return requester<CreateRubriekMutation, CreateRubriekMutationVariables>(CreateRubriekDocument, variables, options);
    },
    deleteOrganisatie(variables: DeleteOrganisatieMutationVariables, options?: C): Promise<DeleteOrganisatieMutation> {
      return requester<DeleteOrganisatieMutation, DeleteOrganisatieMutationVariables>(DeleteOrganisatieDocument, variables, options);
    },
    deleteAfspraak(variables: DeleteAfspraakMutationVariables, options?: C): Promise<DeleteAfspraakMutation> {
      return requester<DeleteAfspraakMutation, DeleteAfspraakMutationVariables>(DeleteAfspraakDocument, variables, options);
    },
    deleteAfspraakZoekterm(variables: DeleteAfspraakZoektermMutationVariables, options?: C): Promise<DeleteAfspraakZoektermMutation> {
      return requester<DeleteAfspraakZoektermMutation, DeleteAfspraakZoektermMutationVariables>(DeleteAfspraakZoektermDocument, variables, options);
    },
    deleteBurger(variables: DeleteBurgerMutationVariables, options?: C): Promise<DeleteBurgerMutation> {
      return requester<DeleteBurgerMutation, DeleteBurgerMutationVariables>(DeleteBurgerDocument, variables, options);
    },
    deleteBurgerRekening(variables: DeleteBurgerRekeningMutationVariables, options?: C): Promise<DeleteBurgerRekeningMutation> {
      return requester<DeleteBurgerRekeningMutation, DeleteBurgerRekeningMutationVariables>(DeleteBurgerRekeningDocument, variables, options);
    },
    deleteConfiguratie(variables: DeleteConfiguratieMutationVariables, options?: C): Promise<DeleteConfiguratieMutation> {
      return requester<DeleteConfiguratieMutation, DeleteConfiguratieMutationVariables>(DeleteConfiguratieDocument, variables, options);
    },
    deleteCustomerStatementMessage(variables: DeleteCustomerStatementMessageMutationVariables, options?: C): Promise<DeleteCustomerStatementMessageMutation> {
      return requester<DeleteCustomerStatementMessageMutation, DeleteCustomerStatementMessageMutationVariables>(DeleteCustomerStatementMessageDocument, variables, options);
    },
    deleteJournaalpost(variables: DeleteJournaalpostMutationVariables, options?: C): Promise<DeleteJournaalpostMutation> {
      return requester<DeleteJournaalpostMutation, DeleteJournaalpostMutationVariables>(DeleteJournaalpostDocument, variables, options);
    },
    deleteOrganisatieRekening(variables: DeleteOrganisatieRekeningMutationVariables, options?: C): Promise<DeleteOrganisatieRekeningMutation> {
      return requester<DeleteOrganisatieRekeningMutation, DeleteOrganisatieRekeningMutationVariables>(DeleteOrganisatieRekeningDocument, variables, options);
    },
    endAfspraak(variables: EndAfspraakMutationVariables, options?: C): Promise<EndAfspraakMutation> {
      return requester<EndAfspraakMutation, EndAfspraakMutationVariables>(EndAfspraakDocument, variables, options);
    },
    startAutomatischBoeken(variables?: StartAutomatischBoekenMutationVariables, options?: C): Promise<StartAutomatischBoekenMutation> {
      return requester<StartAutomatischBoekenMutation, StartAutomatischBoekenMutationVariables>(StartAutomatischBoekenDocument, variables, options);
    },
    updateAfspraakBetaalinstructie(variables: UpdateAfspraakBetaalinstructieMutationVariables, options?: C): Promise<UpdateAfspraakBetaalinstructieMutation> {
      return requester<UpdateAfspraakBetaalinstructieMutation, UpdateAfspraakBetaalinstructieMutationVariables>(UpdateAfspraakBetaalinstructieDocument, variables, options);
    },
    updateAfspraak(variables: UpdateAfspraakMutationVariables, options?: C): Promise<UpdateAfspraakMutation> {
      return requester<UpdateAfspraakMutation, UpdateAfspraakMutationVariables>(UpdateAfspraakDocument, variables, options);
    },
    updateBurger(variables: UpdateBurgerMutationVariables, options?: C): Promise<UpdateBurgerMutation> {
      return requester<UpdateBurgerMutation, UpdateBurgerMutationVariables>(UpdateBurgerDocument, variables, options);
    },
    updateConfiguratie(variables: UpdateConfiguratieMutationVariables, options?: C): Promise<UpdateConfiguratieMutation> {
      return requester<UpdateConfiguratieMutation, UpdateConfiguratieMutationVariables>(UpdateConfiguratieDocument, variables, options);
    },
    updateJournaalpostGrootboekrekening(variables: UpdateJournaalpostGrootboekrekeningMutationVariables, options?: C): Promise<UpdateJournaalpostGrootboekrekeningMutation> {
      return requester<UpdateJournaalpostGrootboekrekeningMutation, UpdateJournaalpostGrootboekrekeningMutationVariables>(UpdateJournaalpostGrootboekrekeningDocument, variables, options);
    },
    updateOrganisatie(variables: UpdateOrganisatieMutationVariables, options?: C): Promise<UpdateOrganisatieMutation> {
      return requester<UpdateOrganisatieMutation, UpdateOrganisatieMutationVariables>(UpdateOrganisatieDocument, variables, options);
    },
    updateRekening(variables: UpdateRekeningMutationVariables, options?: C): Promise<UpdateRekeningMutation> {
      return requester<UpdateRekeningMutation, UpdateRekeningMutationVariables>(UpdateRekeningDocument, variables, options);
    },
    getAfspraakFormData(variables: GetAfspraakFormDataQueryVariables, options?: C): Promise<GetAfspraakFormDataQuery> {
      return requester<GetAfspraakFormDataQuery, GetAfspraakFormDataQueryVariables>(GetAfspraakFormDataDocument, variables, options);
    },
    getAfspraken(variables?: GetAfsprakenQueryVariables, options?: C): Promise<GetAfsprakenQuery> {
      return requester<GetAfsprakenQuery, GetAfsprakenQueryVariables>(GetAfsprakenDocument, variables, options);
    },
    getBurgerAfspraken(variables: GetBurgerAfsprakenQueryVariables, options?: C): Promise<GetBurgerAfsprakenQuery> {
      return requester<GetBurgerAfsprakenQuery, GetBurgerAfsprakenQueryVariables>(GetBurgerAfsprakenDocument, variables, options);
    },
    GetBurgerGebeurtenissen(variables: GetBurgerGebeurtenissenQueryVariables, options?: C): Promise<GetBurgerGebeurtenissenQuery> {
      return requester<GetBurgerGebeurtenissenQuery, GetBurgerGebeurtenissenQueryVariables>(GetBurgerGebeurtenissenDocument, variables, options);
    },
    getBurger(variables: GetBurgerQueryVariables, options?: C): Promise<GetBurgerQuery> {
      return requester<GetBurgerQuery, GetBurgerQueryVariables>(GetBurgerDocument, variables, options);
    },
    getBurgers(variables?: GetBurgersQueryVariables, options?: C): Promise<GetBurgersQuery> {
      return requester<GetBurgersQuery, GetBurgersQueryVariables>(GetBurgersDocument, variables, options);
    },
    getConfiguratie(variables?: GetConfiguratieQueryVariables, options?: C): Promise<GetConfiguratieQuery> {
      return requester<GetConfiguratieQuery, GetConfiguratieQueryVariables>(GetConfiguratieDocument, variables, options);
    },
    getCreateAfspraakFormData(variables: GetCreateAfspraakFormDataQueryVariables, options?: C): Promise<GetCreateAfspraakFormDataQuery> {
      return requester<GetCreateAfspraakFormDataQuery, GetCreateAfspraakFormDataQueryVariables>(GetCreateAfspraakFormDataDocument, variables, options);
    },
    getCsms(variables?: GetCsmsQueryVariables, options?: C): Promise<GetCsmsQuery> {
      return requester<GetCsmsQuery, GetCsmsQueryVariables>(GetCsmsDocument, variables, options);
    },
    getExports(variables?: GetExportsQueryVariables, options?: C): Promise<GetExportsQuery> {
      return requester<GetExportsQuery, GetExportsQueryVariables>(GetExportsDocument, variables, options);
    },
    GetGebeurtenissen(variables: GetGebeurtenissenQueryVariables, options?: C): Promise<GetGebeurtenissenQuery> {
      return requester<GetGebeurtenissenQuery, GetGebeurtenissenQueryVariables>(GetGebeurtenissenDocument, variables, options);
    },
    getGebruiker(variables?: GetGebruikerQueryVariables, options?: C): Promise<GetGebruikerQuery> {
      return requester<GetGebruikerQuery, GetGebruikerQueryVariables>(GetGebruikerDocument, variables, options);
    },
    getAfspraak(variables: GetAfspraakQueryVariables, options?: C): Promise<GetAfspraakQuery> {
      return requester<GetAfspraakQuery, GetAfspraakQueryVariables>(GetAfspraakDocument, variables, options);
    },
    getOrganisatie(variables: GetOrganisatieQueryVariables, options?: C): Promise<GetOrganisatieQuery> {
      return requester<GetOrganisatieQuery, GetOrganisatieQueryVariables>(GetOrganisatieDocument, variables, options);
    },
    getOrganisaties(variables?: GetOrganisatiesQueryVariables, options?: C): Promise<GetOrganisatiesQuery> {
      return requester<GetOrganisatiesQuery, GetOrganisatiesQueryVariables>(GetOrganisatiesDocument, variables, options);
    },
    getReportingData(variables?: GetReportingDataQueryVariables, options?: C): Promise<GetReportingDataQuery> {
      return requester<GetReportingDataQuery, GetReportingDataQueryVariables>(GetReportingDataDocument, variables, options);
    },
    getRubrieken(variables?: GetRubriekenQueryVariables, options?: C): Promise<GetRubriekenQuery> {
      return requester<GetRubriekenQuery, GetRubriekenQueryVariables>(GetRubriekenDocument, variables, options);
    },
    getTransactionItemFormData(variables?: GetTransactionItemFormDataQueryVariables, options?: C): Promise<GetTransactionItemFormDataQuery> {
      return requester<GetTransactionItemFormDataQuery, GetTransactionItemFormDataQueryVariables>(GetTransactionItemFormDataDocument, variables, options);
    },
    getTransacties(variables: GetTransactiesQueryVariables, options?: C): Promise<GetTransactiesQuery> {
      return requester<GetTransactiesQuery, GetTransactiesQueryVariables>(GetTransactiesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;