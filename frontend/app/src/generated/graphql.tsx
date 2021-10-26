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
  /** Accepts dates, datetimes, ints and strings. */
  DynamicType: any;
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any;
};

export type AddAfspraakZoekterm = {
  afspraak?: Maybe<Afspraak>;
  matchingAfspraken?: Maybe<Array<Maybe<Afspraak>>>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
};

export type AddHuishoudenBurger = {
  burgerIds?: Maybe<Burger>;
  huishouden?: Maybe<Huishouden>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Huishouden>;
};

/** GraphQL Afdeling model  */
export type Afdeling = {
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  organisatie?: Maybe<Organisatie>;
  postadressen?: Maybe<Array<Maybe<Postadres>>>;
  rekeningen?: Maybe<Array<Maybe<Rekening>>>;
};

/** GraphQL Afspraak model  */
export type Afspraak = {
  afdeling?: Maybe<Afdeling>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  betaalinstructie?: Maybe<Betaalinstructie>;
  burger?: Maybe<Burger>;
  credit?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Int']>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  matchingAfspraken?: Maybe<Array<Maybe<Afspraak>>>;
  omschrijving?: Maybe<Scalars['String']>;
  overschrijvingen?: Maybe<Array<Maybe<Overschrijving>>>;
  postadres?: Maybe<Postadres>;
  rubriek?: Maybe<Rubriek>;
  tegenRekening?: Maybe<Rekening>;
  validFrom?: Maybe<Scalars['Date']>;
  validThrough?: Maybe<Scalars['Date']>;
  zoektermen?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** GraphQL Afspraak model  */
export type AfspraakOverschrijvingenArgs = {
  eindDatum?: Maybe<Scalars['Date']>;
  startDatum?: Maybe<Scalars['Date']>;
};

/** BankTransaction model */
export type BankTransaction = {
  bedrag?: Maybe<Scalars['Bedrag']>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  id?: Maybe<Scalars['Int']>;
  informationToAccountOwner?: Maybe<Scalars['String']>;
  isCredit?: Maybe<Scalars['Boolean']>;
  isGeboekt?: Maybe<Scalars['Boolean']>;
  journaalpost?: Maybe<Journaalpost>;
  statementLine?: Maybe<Scalars['String']>;
  suggesties?: Maybe<Array<Maybe<Afspraak>>>;
  tegenRekening?: Maybe<Rekening>;
  tegenRekeningIban?: Maybe<Scalars['String']>;
  transactieDatum?: Maybe<Scalars['Date']>;
};

export type BankTransactionFilter = {
  AND?: Maybe<BankTransactionFilter>;
  OR?: Maybe<BankTransactionFilter>;
  bedrag?: Maybe<ComplexBedragFilterType>;
  id?: Maybe<ComplexFilterType>;
  isCredit?: Maybe<Scalars['Boolean']>;
  isGeboekt?: Maybe<Scalars['Boolean']>;
  statementLine?: Maybe<ComplexFilterType>;
  tegenRekening?: Maybe<ComplexFilterType>;
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
  endDate?: Maybe<Scalars['String']>;
  exceptDates?: Maybe<Array<Maybe<Scalars['String']>>>;
  repeatFrequency?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
};

/** Implementatie op basis van http://schema.org/Schedule */
export type BetaalinstructieInput = {
  byDay?: Maybe<Array<Maybe<DayOfWeek>>>;
  byMonth?: Maybe<Array<Maybe<Scalars['Int']>>>;
  byMonthDay?: Maybe<Array<Maybe<Scalars['Int']>>>;
  endDate?: Maybe<Scalars['String']>;
  exceptDates?: Maybe<Array<Maybe<Scalars['String']>>>;
  repeatFrequency?: Maybe<Scalars['String']>;
  startDate: Scalars['String'];
};

/** GraphQL Burger model  */
export type Burger = {
  achternaam?: Maybe<Scalars['String']>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  bsn?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  geboortedatum?: Maybe<Scalars['String']>;
  gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersActiviteit>>>;
  huishouden?: Maybe<Huishouden>;
  huisnummer?: Maybe<Scalars['String']>;
  /** @deprecated Please use 'rekeningen' */
  iban?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  rekeningen?: Maybe<Array<Maybe<Rekening>>>;
  straatnaam?: Maybe<Scalars['String']>;
  telefoonnummer?: Maybe<Scalars['String']>;
  voorletters?: Maybe<Scalars['String']>;
  voornamen?: Maybe<Scalars['String']>;
};

export type BurgerFilter = {
  AND?: Maybe<BurgerFilter>;
  OR?: Maybe<BurgerFilter>;
  achternaam?: Maybe<ComplexFilterType>;
  bedrag?: Maybe<ComplexBedragFilterType>;
  email?: Maybe<ComplexFilterType>;
  geboortedatum?: Maybe<ComplexFilterType>;
  huishoudenId?: Maybe<ComplexFilterType>;
  huisnummer?: Maybe<ComplexFilterType>;
  iban?: Maybe<ComplexFilterType>;
  id?: Maybe<ComplexFilterType>;
  plaatsnaam?: Maybe<ComplexFilterType>;
  postcode?: Maybe<ComplexFilterType>;
  rekeninghouder?: Maybe<ComplexFilterType>;
  straatnaam?: Maybe<ComplexFilterType>;
  tegenRekeningId?: Maybe<ComplexFilterType>;
  telefoonnummer?: Maybe<ComplexFilterType>;
  voorletters?: Maybe<ComplexFilterType>;
  voornamen?: Maybe<ComplexFilterType>;
  zoektermen?: Maybe<ComplexFilterType>;
};

export type BurgersPaged = {
  burgers?: Maybe<Array<Maybe<Burger>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type ComplexBedragFilterType = {
  BETWEEN?: Maybe<Array<Maybe<Scalars['Bedrag']>>>;
  EQ?: Maybe<Scalars['Bedrag']>;
  GT?: Maybe<Scalars['Bedrag']>;
  GTE?: Maybe<Scalars['Bedrag']>;
  IN?: Maybe<Array<Maybe<Scalars['Bedrag']>>>;
  LT?: Maybe<Scalars['Bedrag']>;
  LTE?: Maybe<Scalars['Bedrag']>;
  NEQ?: Maybe<Scalars['Bedrag']>;
  NOTIN?: Maybe<Array<Maybe<Scalars['Bedrag']>>>;
};

export type ComplexFilterType = {
  BETWEEN?: Maybe<Array<Maybe<Scalars['DynamicType']>>>;
  EQ?: Maybe<Scalars['DynamicType']>;
  GT?: Maybe<Scalars['DynamicType']>;
  GTE?: Maybe<Scalars['DynamicType']>;
  IN?: Maybe<Array<Maybe<Scalars['DynamicType']>>>;
  LT?: Maybe<Scalars['DynamicType']>;
  LTE?: Maybe<Scalars['DynamicType']>;
  NEQ?: Maybe<Scalars['DynamicType']>;
  NOTIN?: Maybe<Array<Maybe<Scalars['DynamicType']>>>;
};

export type Configuratie = {
  id?: Maybe<Scalars['String']>;
  waarde?: Maybe<Scalars['String']>;
};

export type ConfiguratieInput = {
  id: Scalars['String'];
  waarde?: Maybe<Scalars['String']>;
};

export type CreateAfdeling = {
  afdeling?: Maybe<Afdeling>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateAfdelingInput = {
  naam: Scalars['String'];
  organisatieId: Scalars['Int'];
  postadressen?: Maybe<Array<Maybe<CreatePostadresInput>>>;
  rekeningen?: Maybe<Array<Maybe<RekeningInput>>>;
};

export type CreateAfdelingRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
};

export type CreateAfspraak = {
  afspraak?: Maybe<Afspraak>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateAfspraakInput = {
  afdelingId?: Maybe<Scalars['Int']>;
  bedrag: Scalars['Bedrag'];
  burgerId: Scalars['Int'];
  credit: Scalars['Boolean'];
  omschrijving: Scalars['String'];
  postadresId?: Maybe<Scalars['String']>;
  rubriekId: Scalars['Int'];
  tegenRekeningId: Scalars['Int'];
  validFrom?: Maybe<Scalars['String']>;
  validThrough?: Maybe<Scalars['String']>;
};

export type CreateBurger = {
  burger?: Maybe<Burger>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateBurgerInput = {
  achternaam?: Maybe<Scalars['String']>;
  bsn?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  geboortedatum?: Maybe<Scalars['Date']>;
  huishouden?: Maybe<HuishoudenInput>;
  huisnummer?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  rekeningen?: Maybe<Array<Maybe<RekeningInput>>>;
  straatnaam?: Maybe<Scalars['String']>;
  telefoonnummer?: Maybe<Scalars['String']>;
  voorletters?: Maybe<Scalars['String']>;
  voornamen?: Maybe<Scalars['String']>;
};

export type CreateBurgerRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
};

export type CreateConfiguratie = {
  configuratie?: Maybe<Configuratie>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateCustomerStatementMessage = {
  customerStatementMessage?: Maybe<Array<Maybe<CustomerStatementMessage>>>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateExportOverschrijvingen = {
  export?: Maybe<Export>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateHuishouden = {
  huishouden?: Maybe<Huishouden>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateHuishoudenInput = {
  burgerIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

/** Create a Journaalpost with an Afspraak */
export type CreateJournaalpostAfspraak = {
  journaalpost?: Maybe<Journaalpost>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateJournaalpostAfspraakInput = {
  afspraakId: Scalars['Int'];
  isAutomatischGeboekt: Scalars['Boolean'];
  transactionId: Scalars['Int'];
};

/** Create a Journaalpost with a Grootboekrekening */
export type CreateJournaalpostGrootboekrekening = {
  journaalpost?: Maybe<Journaalpost>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateJournaalpostGrootboekrekeningInput = {
  grootboekrekeningId: Scalars['String'];
  isAutomatischGeboekt: Scalars['Boolean'];
  transactionId: Scalars['Int'];
};

/** Create a Journaalpost with an Afspraak */
export type CreateJournaalpostPerAfspraak = {
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateOrganisatie = {
  ok?: Maybe<Scalars['Boolean']>;
  organisatie?: Maybe<Organisatie>;
};

export type CreateOrganisatieInput = {
  kvknummer: Scalars['String'];
  naam?: Maybe<Scalars['String']>;
  vestigingsnummer?: Maybe<Scalars['String']>;
};

export type CreatePostadres = {
  afdeling?: Maybe<Afdeling>;
  ok?: Maybe<Scalars['Boolean']>;
  postadres?: Maybe<Postadres>;
};

export type CreatePostadresInput = {
  afdelingId?: Maybe<Scalars['Int']>;
  huisnummer: Scalars['String'];
  plaatsnaam: Scalars['String'];
  postcode: Scalars['String'];
  straatnaam: Scalars['String'];
};

export type CreateRubriek = {
  ok?: Maybe<Scalars['Boolean']>;
  rubriek?: Maybe<Rubriek>;
};

/** GraphQL CustomerStatementMessage model */
export type CustomerStatementMessage = {
  accountIdentification?: Maybe<Scalars['String']>;
  bankTransactions?: Maybe<Array<Maybe<BankTransaction>>>;
  closingAvailableFunds?: Maybe<Scalars['Int']>;
  closingBalance?: Maybe<Scalars['Int']>;
  filename?: Maybe<Scalars['String']>;
  forwardAvailableBalance?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  openingBalance?: Maybe<Scalars['Int']>;
  relatedReference?: Maybe<Scalars['String']>;
  sequenceNumber?: Maybe<Scalars['String']>;
  transactionReferenceNumber?: Maybe<Scalars['String']>;
  uploadDate?: Maybe<Scalars['DateTime']>;
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

export type DeleteAfdeling = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afdeling>;
};

export type DeleteAfdelingRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rekening>;
};

export type DeleteAfspraak = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
};

export type DeleteAfspraakZoekterm = {
  afspraak?: Maybe<Afspraak>;
  matchingAfspraken?: Maybe<Array<Maybe<Afspraak>>>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
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
  burgerIds?: Maybe<Array<Maybe<Burger>>>;
  huishouden?: Maybe<Array<Maybe<Huishouden>>>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Huishouden>;
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

export type DeletePostadres = {
  afdeling?: Maybe<Afdeling>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Postadres>;
};

export type DeleteRubriek = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rubriek>;
};

/** GraphQL Export model  */
export type Export = {
  eindDatum?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  overschrijvingen?: Maybe<Array<Maybe<Overschrijving>>>;
  sha256?: Maybe<Scalars['String']>;
  startDatum?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  xmldata?: Maybe<Scalars['String']>;
};

export type Gebruiker = {
  email?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

/** GebruikersActiviteit model */
export type GebruikersActiviteit = {
  action?: Maybe<Scalars['String']>;
  entities?: Maybe<Array<Maybe<GebruikersActiviteitEntity>>>;
  gebruikerId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  meta?: Maybe<GebruikersActiviteitMeta>;
  snapshotAfter?: Maybe<GebruikersActiviteitSnapshot>;
  snapshotBefore?: Maybe<GebruikersActiviteitSnapshot>;
  timestamp?: Maybe<Scalars['DateTime']>;
};

export type GebruikersActiviteitEntity = {
  afdeling?: Maybe<Afdeling>;
  afspraak?: Maybe<Afspraak>;
  burger?: Maybe<Burger>;
  configuratie?: Maybe<Configuratie>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  entityId?: Maybe<Scalars['String']>;
  entityType?: Maybe<Scalars['String']>;
  export?: Maybe<Export>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  huishouden?: Maybe<Huishouden>;
  journaalpost?: Maybe<Journaalpost>;
  organisatie?: Maybe<Organisatie>;
  postadres?: Maybe<Postadres>;
  rekening?: Maybe<Rekening>;
  rubriek?: Maybe<Rubriek>;
  transaction?: Maybe<BankTransaction>;
};

export type GebruikersActiviteitMeta = {
  applicationVersion?: Maybe<Scalars['String']>;
  ip?: Maybe<Array<Maybe<Scalars['String']>>>;
  userAgent?: Maybe<Scalars['String']>;
};

export type GebruikersActiviteitSnapshot = {
  afdeling?: Maybe<Afdeling>;
  afspraak?: Maybe<Afspraak>;
  burger?: Maybe<Burger>;
  configuratie?: Maybe<Configuratie>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  export?: Maybe<Export>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  huishouden?: Maybe<Huishouden>;
  journaalpost?: Maybe<Journaalpost>;
  organisatie?: Maybe<Organisatie>;
  postadres?: Maybe<Postadres>;
  rubriek?: Maybe<Rubriek>;
  transaction?: Maybe<BankTransaction>;
};

export type GebruikersActiviteitenPaged = {
  gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersActiviteit>>>;
  pageInfo?: Maybe<PageInfo>;
};

/** Grootboekrekening model  */
export type Grootboekrekening = {
  children?: Maybe<Array<Maybe<Grootboekrekening>>>;
  credit?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  naam?: Maybe<Scalars['String']>;
  omschrijving?: Maybe<Scalars['String']>;
  parent?: Maybe<Grootboekrekening>;
  referentie?: Maybe<Scalars['String']>;
  rubriek?: Maybe<Rubriek>;
};

/** GraphQL Huishouden model  */
export type Huishouden = {
  burgers?: Maybe<Array<Maybe<Burger>>>;
  id?: Maybe<Scalars['Int']>;
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
  afspraak?: Maybe<Afspraak>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  id?: Maybe<Scalars['Int']>;
  isAutomatischGeboekt?: Maybe<Scalars['Boolean']>;
  transaction?: Maybe<BankTransaction>;
};

/** GraphQL Organisatie model  */
export type Organisatie = {
  afdelingen?: Maybe<Array<Maybe<Afdeling>>>;
  id?: Maybe<Scalars['Int']>;
  kvknummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
  vestigingsnummer?: Maybe<Scalars['String']>;
};

export type Overschrijving = {
  afspraak?: Maybe<Afspraak>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  bankTransaction?: Maybe<BankTransaction>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  datum?: Maybe<Scalars['String']>;
  export?: Maybe<Export>;
  id?: Maybe<Scalars['Int']>;
  status?: Maybe<OverschrijvingStatus>;
};

export enum OverschrijvingStatus {
  Gereed = 'GEREED',
  InBehandeling = 'IN_BEHANDELING',
  Verwachting = 'VERWACHTING'
}

export type PageInfo = {
  count?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
};

/** GraphQL Burger model  */
export type Postadres = {
  huisnummer?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
};

/** GraphQL Rekening model */
export type Rekening = {
  afdelingen?: Maybe<Array<Maybe<Afdeling>>>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  burgers?: Maybe<Array<Maybe<Burger>>>;
  iban?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  rekeninghouder?: Maybe<Scalars['String']>;
};

export type RekeningInput = {
  iban?: Maybe<Scalars['String']>;
  rekeninghouder?: Maybe<Scalars['String']>;
};

/** The root of all mutations  */
export type RootMutation = {
  addAfspraakZoekterm?: Maybe<AddAfspraakZoekterm>;
  addHuishoudenBurger?: Maybe<AddHuishoudenBurger>;
  createAfdeling?: Maybe<CreateAfdeling>;
  createAfdelingRekening?: Maybe<CreateAfdelingRekening>;
  createAfspraak?: Maybe<CreateAfspraak>;
  createBurger?: Maybe<CreateBurger>;
  createBurgerRekening?: Maybe<CreateBurgerRekening>;
  createConfiguratie?: Maybe<CreateConfiguratie>;
  createCustomerStatementMessage?: Maybe<CreateCustomerStatementMessage>;
  createExportOverschrijvingen?: Maybe<CreateExportOverschrijvingen>;
  createHuishouden?: Maybe<CreateHuishouden>;
  /** Create a Journaalpost with an Afspraak */
  createJournaalpostAfspraak?: Maybe<CreateJournaalpostAfspraak>;
  /** Create a Journaalpost with a Grootboekrekening */
  createJournaalpostGrootboekrekening?: Maybe<CreateJournaalpostGrootboekrekening>;
  /** Create a Journaalpost with an Afspraak */
  createJournaalpostPerAfspraak?: Maybe<CreateJournaalpostPerAfspraak>;
  createOrganisatie?: Maybe<CreateOrganisatie>;
  createPostadres?: Maybe<CreatePostadres>;
  createRubriek?: Maybe<CreateRubriek>;
  deleteAfdeling?: Maybe<DeleteAfdeling>;
  deleteAfdelingRekening?: Maybe<DeleteAfdelingRekening>;
  deleteAfspraak?: Maybe<DeleteAfspraak>;
  deleteAfspraakZoekterm?: Maybe<DeleteAfspraakZoekterm>;
  deleteBurger?: Maybe<DeleteBurger>;
  deleteBurgerRekening?: Maybe<DeleteBurgerRekening>;
  deleteConfiguratie?: Maybe<DeleteConfiguratie>;
  deleteCustomerStatementMessage?: Maybe<DeleteCustomerStatementMessage>;
  deleteHuishouden?: Maybe<DeleteHuishouden>;
  deleteHuishoudenBurger?: Maybe<DeleteHuishoudenBurger>;
  /** Delete journaalpost by id  */
  deleteJournaalpost?: Maybe<DeleteJournaalpost>;
  deleteOrganisatie?: Maybe<DeleteOrganisatie>;
  deletePostadres?: Maybe<DeletePostadres>;
  deleteRubriek?: Maybe<DeleteRubriek>;
  startAutomatischBoeken?: Maybe<StartAutomatischBoeken>;
  updateAfdeling?: Maybe<UpdateAfdeling>;
  updateAfspraak?: Maybe<UpdateAfspraak>;
  updateAfspraakBetaalinstructie?: Maybe<UpdateAfspraakBetaalinstructie>;
  updateBurger?: Maybe<UpdateBurger>;
  updateConfiguratie?: Maybe<UpdateConfiguratie>;
  /** Update a Journaalpost with a Grootboekrekening */
  updateJournaalpostGrootboekrekening?: Maybe<UpdateJournaalpostGrootboekrekening>;
  updateOrganisatie?: Maybe<UpdateOrganisatie>;
  updatePostadres?: Maybe<UpdatePostadres>;
  updateRekening?: Maybe<UpdateRekening>;
  updateRubriek?: Maybe<UpdateRubriek>;
};


/** The root of all mutations  */
export type RootMutationAddAfspraakZoektermArgs = {
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
};


/** The root of all mutations  */
export type RootMutationAddHuishoudenBurgerArgs = {
  burgerIds: Array<Maybe<Scalars['Int']>>;
  huishoudenId: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationCreateAfdelingArgs = {
  input?: Maybe<CreateAfdelingInput>;
};


/** The root of all mutations  */
export type RootMutationCreateAfdelingRekeningArgs = {
  afdelingId: Scalars['Int'];
  rekening: RekeningInput;
};


/** The root of all mutations  */
export type RootMutationCreateAfspraakArgs = {
  input: CreateAfspraakInput;
};


/** The root of all mutations  */
export type RootMutationCreateBurgerArgs = {
  input?: Maybe<CreateBurgerInput>;
};


/** The root of all mutations  */
export type RootMutationCreateBurgerRekeningArgs = {
  burgerId: Scalars['Int'];
  rekening: RekeningInput;
};


/** The root of all mutations  */
export type RootMutationCreateConfiguratieArgs = {
  input?: Maybe<ConfiguratieInput>;
};


/** The root of all mutations  */
export type RootMutationCreateCustomerStatementMessageArgs = {
  file: Scalars['Upload'];
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
export type RootMutationCreateJournaalpostAfspraakArgs = {
  input?: Maybe<CreateJournaalpostAfspraakInput>;
};


/** The root of all mutations  */
export type RootMutationCreateJournaalpostGrootboekrekeningArgs = {
  input?: Maybe<CreateJournaalpostGrootboekrekeningInput>;
};


/** The root of all mutations  */
export type RootMutationCreateJournaalpostPerAfspraakArgs = {
  input: Array<Maybe<CreateJournaalpostAfspraakInput>>;
};


/** The root of all mutations  */
export type RootMutationCreateOrganisatieArgs = {
  input?: Maybe<CreateOrganisatieInput>;
};


/** The root of all mutations  */
export type RootMutationCreatePostadresArgs = {
  input?: Maybe<CreatePostadresInput>;
};


/** The root of all mutations  */
export type RootMutationCreateRubriekArgs = {
  grootboekrekeningId?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationDeleteAfdelingArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteAfdelingRekeningArgs = {
  afdelingId: Scalars['Int'];
  rekeningId: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteAfspraakArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteAfspraakZoektermArgs = {
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
};


/** The root of all mutations  */
export type RootMutationDeleteBurgerArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteBurgerRekeningArgs = {
  burgerId: Scalars['Int'];
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteConfiguratieArgs = {
  id: Scalars['String'];
};


/** The root of all mutations  */
export type RootMutationDeleteCustomerStatementMessageArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteHuishoudenArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteHuishoudenBurgerArgs = {
  burgerIds: Array<Maybe<Scalars['Int']>>;
  huishoudenId: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteJournaalpostArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteOrganisatieArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeletePostadresArgs = {
  afdelingId: Scalars['Int'];
  id: Scalars['String'];
};


/** The root of all mutations  */
export type RootMutationDeleteRubriekArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationUpdateAfdelingArgs = {
  id: Scalars['Int'];
  naam?: Maybe<Scalars['String']>;
  organisatieId?: Maybe<Scalars['Int']>;
};


/** The root of all mutations  */
export type RootMutationUpdateAfspraakArgs = {
  id: Scalars['Int'];
  input: UpdateAfspraakInput;
};


/** The root of all mutations  */
export type RootMutationUpdateAfspraakBetaalinstructieArgs = {
  afspraakId: Scalars['Int'];
  betaalinstructie: BetaalinstructieInput;
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
export type RootMutationUpdateConfiguratieArgs = {
  input?: Maybe<ConfiguratieInput>;
};


/** The root of all mutations  */
export type RootMutationUpdateJournaalpostGrootboekrekeningArgs = {
  input?: Maybe<UpdateJournaalpostGrootboekrekeningInput>;
};


/** The root of all mutations  */
export type RootMutationUpdateOrganisatieArgs = {
  id: Scalars['Int'];
  kvknummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
  vestigingsnummer?: Maybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationUpdatePostadresArgs = {
  huisnummer?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationUpdateRekeningArgs = {
  id: Scalars['Int'];
  rekening: RekeningInput;
};


/** The root of all mutations  */
export type RootMutationUpdateRubriekArgs = {
  grootboekrekeningId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  naam?: Maybe<Scalars['String']>;
};

/** The root of all queries  */
export type RootQuery = {
  afdeling?: Maybe<Afdeling>;
  afdelingen?: Maybe<Array<Maybe<Afdeling>>>;
  afspraak?: Maybe<Afspraak>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  bankTransaction?: Maybe<BankTransaction>;
  bankTransactions?: Maybe<Array<Maybe<BankTransaction>>>;
  bankTransactionsPaged?: Maybe<BankTransactionsPaged>;
  burger?: Maybe<Burger>;
  burgers?: Maybe<Array<Maybe<Burger>>>;
  burgersPaged?: Maybe<BurgersPaged>;
  configuratie?: Maybe<Configuratie>;
  configuraties?: Maybe<Array<Maybe<Configuratie>>>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  customerStatementMessages?: Maybe<Array<Maybe<CustomerStatementMessage>>>;
  export?: Maybe<Export>;
  exports?: Maybe<Array<Maybe<Export>>>;
  gebruiker?: Maybe<Gebruiker>;
  gebruikersactiviteit?: Maybe<GebruikersActiviteit>;
  gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersActiviteit>>>;
  gebruikersactiviteitenPaged?: Maybe<GebruikersActiviteitenPaged>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  grootboekrekeningen?: Maybe<Array<Maybe<Grootboekrekening>>>;
  huishouden?: Maybe<Huishouden>;
  huishoudens?: Maybe<Array<Maybe<Huishouden>>>;
  huishoudensPaged?: Maybe<HuishoudensPaged>;
  journaalpost?: Maybe<Journaalpost>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  organisatie?: Maybe<Organisatie>;
  organisaties?: Maybe<Array<Maybe<Organisatie>>>;
  postadres?: Maybe<Postadres>;
  postadressen?: Maybe<Array<Maybe<Postadres>>>;
  rekening?: Maybe<Rekening>;
  rekeningen?: Maybe<Array<Maybe<Rekening>>>;
  rubriek?: Maybe<Rubriek>;
  rubrieken?: Maybe<Array<Maybe<Rubriek>>>;
};


/** The root of all queries  */
export type RootQueryAfdelingArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryAfdelingenArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
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
  filters?: Maybe<BankTransactionFilter>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
};


/** The root of all queries  */
export type RootQueryBurgerArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryBurgersArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  search?: Maybe<Scalars['DynamicType']>;
};


/** The root of all queries  */
export type RootQueryBurgersPagedArgs = {
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
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
  eindDatum?: Maybe<Scalars['Date']>;
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  startDatum?: Maybe<Scalars['Date']>;
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitenArgs = {
  afsprakenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  burgerIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  huishoudenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitenPagedArgs = {
  afsprakenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  burgerIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  huishoudenIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
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
export type RootQueryHuishoudenArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryHuishoudensArgs = {
  filters?: Maybe<BurgerFilter>;
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryHuishoudensPagedArgs = {
  filters?: Maybe<BurgerFilter>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
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
export type RootQueryPostadresArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQueryPostadressenArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
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

/** GraphQL Rubriek model */
export type Rubriek = {
  grootboekrekening?: Maybe<Grootboekrekening>;
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
};

export type StartAutomatischBoeken = {
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type UpdateAfdeling = {
  afdeling?: Maybe<Afdeling>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afdeling>;
};

export type UpdateAfspraak = {
  afspraak?: Maybe<Afspraak>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
};

export type UpdateAfspraakBetaalinstructie = {
  afspraak?: Maybe<Afspraak>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
};

export type UpdateAfspraakInput = {
  afdelingId?: Maybe<Scalars['Int']>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  burgerId?: Maybe<Scalars['Int']>;
  credit?: Maybe<Scalars['Boolean']>;
  omschrijving?: Maybe<Scalars['String']>;
  postadresId?: Maybe<Scalars['String']>;
  rubriekId?: Maybe<Scalars['Int']>;
  tegenRekeningId?: Maybe<Scalars['Int']>;
  validThrough?: Maybe<Scalars['String']>;
};

export type UpdateBurger = {
  burger?: Maybe<Burger>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Burger>;
};

export type UpdateConfiguratie = {
  configuratie?: Maybe<Configuratie>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Configuratie>;
};

/** Update a Journaalpost with a Grootboekrekening */
export type UpdateJournaalpostGrootboekrekening = {
  journaalpost?: Maybe<Journaalpost>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Journaalpost>;
};

export type UpdateJournaalpostGrootboekrekeningInput = {
  grootboekrekeningId: Scalars['String'];
  id: Scalars['Int'];
};

export type UpdateOrganisatie = {
  ok?: Maybe<Scalars['Boolean']>;
  organisatie?: Maybe<Organisatie>;
  previous?: Maybe<Organisatie>;
};

export type UpdatePostadres = {
  ok?: Maybe<Scalars['Boolean']>;
  postadres?: Maybe<Postadres>;
  previous?: Maybe<Postadres>;
};

export type UpdateRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rekening>;
  rekening?: Maybe<Rekening>;
};

export type UpdateRubriek = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rubriek>;
  rubriek?: Maybe<Rubriek>;
};

export type AfdelingFragment = { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined };

export type AfspraakFragment = { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export type BetaalinstructieFragment = { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined };

export type BurgerFragment = { id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type CustomerStatementMessageFragment = { id?: number | null | undefined, filename?: string | null | undefined, uploadDate?: any | null | undefined, accountIdentification?: string | null | undefined, closingAvailableFunds?: number | null | undefined, closingBalance?: number | null | undefined, forwardAvailableBalance?: number | null | undefined, openingBalance?: number | null | undefined, relatedReference?: string | null | undefined, sequenceNumber?: string | null | undefined, transactionReferenceNumber?: string | null | undefined };

export type ExportFragment = { id?: number | null | undefined, naam?: string | null | undefined, timestamp?: any | null | undefined, startDatum?: string | null | undefined, eindDatum?: string | null | undefined, sha256?: string | null | undefined, overschrijvingen?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined };

export type GebruikerFragment = { email?: string | null | undefined };

export type GebruikersactiviteitFragment = { id?: number | null | undefined, timestamp?: any | null | undefined, gebruikerId?: string | null | undefined, action?: string | null | undefined, entities?: Array<{ entityType?: string | null | undefined, entityId?: string | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, organisatie?: { id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined, afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, rekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, customerStatementMessage?: { id?: number | null | undefined, filename?: string | null | undefined, bankTransactions?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined, configuratie?: { id?: string | null | undefined, waarde?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined, meta?: { userAgent?: string | null | undefined, ip?: Array<string | null | undefined> | null | undefined, applicationVersion?: string | null | undefined } | null | undefined };

export type GrootboekrekeningFragment = { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined };

export type HuishoudenFragment = { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export type JournaalpostFragment = { id?: number | null | undefined };

export type OrganisatieFragment = { id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type PostadresFragment = { id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined };

export type RekeningFragment = { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined };

export type RubriekFragment = { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined };

export type BankTransactionFragment = { id?: number | null | undefined, informationToAccountOwner?: string | null | undefined, statementLine?: string | null | undefined, bedrag?: any | null | undefined, isCredit?: boolean | null | undefined, tegenRekeningIban?: string | null | undefined, transactieDatum?: any | null | undefined, tegenRekening?: { iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined };

export type AddAfspraakZoektermMutationVariables = Exact<{
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
}>;


export type AddAfspraakZoektermMutation = { addAfspraakZoekterm?: { ok?: boolean | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, burger?: { id?: number | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { rekeninghouder?: string | null | undefined, iban?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type AddHuishoudenBurgerMutationVariables = Exact<{
  huishoudenId: Scalars['Int'];
  burgerIds: Array<Maybe<Scalars['Int']>> | Maybe<Scalars['Int']>;
}>;


export type AddHuishoudenBurgerMutation = { addHuishoudenBurger?: { ok?: boolean | null | undefined } | null | undefined };

export type CreateAfdelingMutationVariables = Exact<{
  naam: Scalars['String'];
  organisatieId: Scalars['Int'];
  postadressen?: Maybe<Array<Maybe<CreatePostadresInput>> | Maybe<CreatePostadresInput>>;
  rekeningen?: Maybe<Array<Maybe<RekeningInput>> | Maybe<RekeningInput>>;
}>;


export type CreateAfdelingMutation = { createAfdeling?: { ok?: boolean | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined };

export type CreateAfspraakMutationVariables = Exact<{
  input: CreateAfspraakInput;
}>;


export type CreateAfspraakMutation = { createAfspraak?: { ok?: boolean | null | undefined, afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined };

export type CreateBurgerMutationVariables = Exact<{
  input?: Maybe<CreateBurgerInput>;
}>;


export type CreateBurgerMutation = { createBurger?: { ok?: boolean | null | undefined, burger?: { id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined } | null | undefined };

export type CreateBurgerRekeningMutationVariables = Exact<{
  burgerId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateBurgerRekeningMutation = { createBurgerRekening?: { ok?: boolean | null | undefined, rekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined };

export type CreateConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type CreateConfiguratieMutation = { createConfiguratie?: { ok?: boolean | null | undefined, configuratie?: { id?: string | null | undefined, waarde?: string | null | undefined } | null | undefined } | null | undefined };

export type CreateCustomerStatementMessageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type CreateCustomerStatementMessageMutation = { createCustomerStatementMessage?: { ok?: boolean | null | undefined, customerStatementMessage?: Array<{ id?: number | null | undefined, filename?: string | null | undefined, uploadDate?: any | null | undefined, accountIdentification?: string | null | undefined, closingAvailableFunds?: number | null | undefined, closingBalance?: number | null | undefined, forwardAvailableBalance?: number | null | undefined, openingBalance?: number | null | undefined, relatedReference?: string | null | undefined, sequenceNumber?: string | null | undefined, transactionReferenceNumber?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type CreateExportOverschrijvingenMutationVariables = Exact<{
  startDatum: Scalars['String'];
  eindDatum: Scalars['String'];
}>;


export type CreateExportOverschrijvingenMutation = { createExportOverschrijvingen?: { ok?: boolean | null | undefined, export?: { id?: number | null | undefined } | null | undefined } | null | undefined };

export type CreateHuishoudenMutationVariables = Exact<{
  burgerIds?: Maybe<Array<Maybe<Scalars['Int']>> | Maybe<Scalars['Int']>>;
}>;


export type CreateHuishoudenMutation = { createHuishouden?: { ok?: boolean | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined };

export type CreateJournaalpostAfspraakMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  afspraakId: Scalars['Int'];
  isAutomatischGeboekt?: Maybe<Scalars['Boolean']>;
}>;


export type CreateJournaalpostAfspraakMutation = { createJournaalpostAfspraak?: { ok?: boolean | null | undefined, journaalpost?: { id?: number | null | undefined } | null | undefined } | null | undefined };

export type CreateJournaalpostGrootboekrekeningMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
}>;


export type CreateJournaalpostGrootboekrekeningMutation = { createJournaalpostGrootboekrekening?: { ok?: boolean | null | undefined, journaalpost?: { id?: number | null | undefined } | null | undefined } | null | undefined };

export type CreateOrganisatieMutationVariables = Exact<{
  kvknummer: Scalars['String'];
  vestigingsnummer: Scalars['String'];
  naam?: Maybe<Scalars['String']>;
}>;


export type CreateOrganisatieMutation = { createOrganisatie?: { ok?: boolean | null | undefined, organisatie?: { id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined };

export type CreateAfdelingRekeningMutationVariables = Exact<{
  afdelingId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateAfdelingRekeningMutation = { createAfdelingRekening?: { ok?: boolean | null | undefined, rekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined };

export type CreateAfdelingPostadresMutationVariables = Exact<{
  afdelingId: Scalars['Int'];
  huisnummer: Scalars['String'];
  plaatsnaam: Scalars['String'];
  postcode: Scalars['String'];
  straatnaam: Scalars['String'];
}>;


export type CreateAfdelingPostadresMutation = { createPostadres?: { ok?: boolean | null | undefined, postadres?: { id?: string | null | undefined } | null | undefined } | null | undefined };

export type CreateRubriekMutationVariables = Exact<{
  naam?: Maybe<Scalars['String']>;
  grootboekrekening?: Maybe<Scalars['String']>;
}>;


export type CreateRubriekMutation = { createRubriek?: { ok?: boolean | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined } | null | undefined };

export type DeleteOrganisatieMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteOrganisatieMutation = { deleteOrganisatie?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteAfdelingMutationVariables = Exact<{
  afdelingId: Scalars['Int'];
}>;


export type DeleteAfdelingMutation = { deleteAfdeling?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteAfdelingPostadresMutationVariables = Exact<{
  id: Scalars['String'];
  afdelingId: Scalars['Int'];
}>;


export type DeleteAfdelingPostadresMutation = { deletePostadres?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteAfspraakMutation = { deleteAfspraak?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteAfspraakZoektermMutationVariables = Exact<{
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
}>;


export type DeleteAfspraakZoektermMutation = { deleteAfspraakZoekterm?: { ok?: boolean | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, burger?: { id?: number | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { rekeninghouder?: string | null | undefined, iban?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type DeleteBurgerMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteBurgerMutation = { deleteBurger?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteBurgerRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  burgerId: Scalars['Int'];
}>;


export type DeleteBurgerRekeningMutation = { deleteBurgerRekening?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
}>;


export type DeleteConfiguratieMutation = { deleteConfiguratie?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteCustomerStatementMessageMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCustomerStatementMessageMutation = { deleteCustomerStatementMessage?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteHuishoudenBurgerMutationVariables = Exact<{
  huishoudenId: Scalars['Int'];
  burgerIds: Array<Maybe<Scalars['Int']>> | Maybe<Scalars['Int']>;
}>;


export type DeleteHuishoudenBurgerMutation = { deleteHuishoudenBurger?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteJournaalpostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteJournaalpostMutation = { deleteJournaalpost?: { ok?: boolean | null | undefined } | null | undefined };

export type DeleteAfdelingRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  afdelingId: Scalars['Int'];
}>;


export type DeleteAfdelingRekeningMutation = { deleteAfdelingRekening?: { ok?: boolean | null | undefined } | null | undefined };

export type EndAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  validThrough: Scalars['String'];
}>;


export type EndAfspraakMutation = { updateAfspraak?: { ok?: boolean | null | undefined, afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined };

export type StartAutomatischBoekenMutationVariables = Exact<{ [key: string]: never; }>;


export type StartAutomatischBoekenMutation = { startAutomatischBoeken?: { ok?: boolean | null | undefined, journaalposten?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type UpdateAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateAfspraakInput;
}>;


export type UpdateAfspraakMutation = { updateAfspraak?: { ok?: boolean | null | undefined, afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined };

export type UpdateAfspraakBetaalinstructieMutationVariables = Exact<{
  id: Scalars['Int'];
  betaalinstructie: BetaalinstructieInput;
}>;


export type UpdateAfspraakBetaalinstructieMutation = { updateAfspraakBetaalinstructie?: { ok?: boolean | null | undefined } | null | undefined };

export type UpdateBurgerMutationVariables = Exact<{
  id: Scalars['Int'];
  bsn?: Maybe<Scalars['Int']>;
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


export type UpdateBurgerMutation = { updateBurger?: { ok?: boolean | null | undefined, burger?: { id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined } | null | undefined };

export type UpdateConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type UpdateConfiguratieMutation = { updateConfiguratie?: { ok?: boolean | null | undefined, configuratie?: { id?: string | null | undefined, waarde?: string | null | undefined } | null | undefined } | null | undefined };

export type UpdateJournaalpostGrootboekrekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
}>;


export type UpdateJournaalpostGrootboekrekeningMutation = { updateJournaalpostGrootboekrekening?: { ok?: boolean | null | undefined } | null | undefined };

export type UpdateOrganisatieMutationVariables = Exact<{
  id: Scalars['Int'];
  kvknummer?: Maybe<Scalars['String']>;
  vestigingsnummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
}>;


export type UpdateOrganisatieMutation = { updateOrganisatie?: { ok?: boolean | null | undefined, organisatie?: { id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined };

export type UpdatePostadresMutationVariables = Exact<{
  id: Scalars['String'];
  straatnaam?: Maybe<Scalars['String']>;
  huisnummer?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
}>;


export type UpdatePostadresMutation = { updatePostadres?: { ok?: boolean | null | undefined } | null | undefined };

export type UpdateRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  iban?: Maybe<Scalars['String']>;
  rekeninghouder?: Maybe<Scalars['String']>;
}>;


export type UpdateRekeningMutation = { updateRekening?: { ok?: boolean | null | undefined } | null | undefined };

export type GetAfspraakFormDataQueryVariables = Exact<{
  afspraakId: Scalars['Int'];
}>;


export type GetAfspraakFormDataQuery = { afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, rubrieken?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined, organisaties?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type GetAfsprakenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAfsprakenQuery = { afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type GetBurgerQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerQuery = { burger?: { id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined };

export type GetBurgerAfsprakenQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerAfsprakenQuery = { burger?: { afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type GetBurgerGebeurtenissenQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetBurgerGebeurtenissenQuery = { gebruikersactiviteitenPaged?: { gebruikersactiviteiten?: Array<{ id?: number | null | undefined, timestamp?: any | null | undefined, gebruikerId?: string | null | undefined, action?: string | null | undefined, entities?: Array<{ entityType?: string | null | undefined, entityId?: string | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, organisatie?: { id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined, afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, rekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, customerStatementMessage?: { id?: number | null | undefined, filename?: string | null | undefined, bankTransactions?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined, configuratie?: { id?: string | null | undefined, waarde?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined, meta?: { userAgent?: string | null | undefined, ip?: Array<string | null | undefined> | null | undefined, applicationVersion?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, pageInfo?: { count?: number | null | undefined } | null | undefined } | null | undefined };

export type GetBurgersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBurgersQuery = { burgers?: Array<{ id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export type GetBurgersSearchQueryVariables = Exact<{
  search?: Maybe<Scalars['DynamicType']>;
}>;


export type GetBurgersSearchQuery = { burgers?: Array<{ id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export type GetConfiguratieQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConfiguratieQuery = { configuraties?: Array<{ id?: string | null | undefined, waarde?: string | null | undefined } | null | undefined> | null | undefined };

export type GetCreateAfspraakFormDataQueryVariables = Exact<{
  burgerId: Scalars['Int'];
}>;


export type GetCreateAfspraakFormDataQuery = { burger?: { rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, rubrieken?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined, organisaties?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type GetCsmsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCsmsQuery = { customerStatementMessages?: Array<{ id?: number | null | undefined, filename?: string | null | undefined, uploadDate?: any | null | undefined, accountIdentification?: string | null | undefined, closingAvailableFunds?: number | null | undefined, closingBalance?: number | null | undefined, forwardAvailableBalance?: number | null | undefined, openingBalance?: number | null | undefined, relatedReference?: string | null | undefined, sequenceNumber?: string | null | undefined, transactionReferenceNumber?: string | null | undefined } | null | undefined> | null | undefined };

export type GetExportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExportsQuery = { exports?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, timestamp?: any | null | undefined, startDatum?: string | null | undefined, eindDatum?: string | null | undefined, sha256?: string | null | undefined, overschrijvingen?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type GetGebeurtenissenQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetGebeurtenissenQuery = { gebruikersactiviteitenPaged?: { gebruikersactiviteiten?: Array<{ id?: number | null | undefined, timestamp?: any | null | undefined, gebruikerId?: string | null | undefined, action?: string | null | undefined, entities?: Array<{ entityType?: string | null | undefined, entityId?: string | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, organisatie?: { id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined, afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, rekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, customerStatementMessage?: { id?: number | null | undefined, filename?: string | null | undefined, bankTransactions?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined, configuratie?: { id?: string | null | undefined, waarde?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined, meta?: { userAgent?: string | null | undefined, ip?: Array<string | null | undefined> | null | undefined, applicationVersion?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, pageInfo?: { count?: number | null | undefined } | null | undefined } | null | undefined };

export type GetGebruikerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGebruikerQuery = { gebruiker?: { email?: string | null | undefined } | null | undefined };

export type GetHuishoudenQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetHuishoudenQuery = { huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type GetHuishoudensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHuishoudensQuery = { huishoudens?: Array<{ id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type GetAfspraakQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetAfspraakQuery = { afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type GetOrganisatieQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetOrganisatieQuery = { organisatie?: { id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type GetOrganisatiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganisatiesQuery = { organisaties?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, afdelingen?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type GetRekeningQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetRekeningQuery = { rekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined };

export type GetReportingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReportingDataQuery = { burgers?: Array<{ id?: number | null | undefined, bsn?: number | null | undefined, email?: string | null | undefined, telefoonnummer?: string | null | undefined, voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined, geboortedatum?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, huishouden?: { id?: number | null | undefined, burgers?: Array<{ id?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined } | null | undefined> | null | undefined, bankTransactions?: Array<{ id?: number | null | undefined, informationToAccountOwner?: string | null | undefined, statementLine?: string | null | undefined, bedrag?: any | null | undefined, isCredit?: boolean | null | undefined, tegenRekeningIban?: string | null | undefined, transactieDatum?: any | null | undefined, journaalpost?: { id?: number | null | undefined, isAutomatischGeboekt?: boolean | null | undefined, afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, tegenRekening?: { iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, rubrieken?: Array<{ id?: number | null | undefined, naam?: string | null | undefined } | null | undefined> | null | undefined };

export type GetRubriekenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRubriekenQuery = { rubrieken?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export type GetTransactionItemFormDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTransactionItemFormDataQuery = { rubrieken?: Array<{ id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined, afspraken?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type GetTransactiesQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  filters?: Maybe<BankTransactionFilter>;
}>;


export type GetTransactiesQuery = { bankTransactionsPaged?: { banktransactions?: Array<{ id?: number | null | undefined, informationToAccountOwner?: string | null | undefined, statementLine?: string | null | undefined, bedrag?: any | null | undefined, isCredit?: boolean | null | undefined, tegenRekeningIban?: string | null | undefined, transactieDatum?: any | null | undefined, journaalpost?: { id?: number | null | undefined, isAutomatischGeboekt?: boolean | null | undefined, afspraak?: { id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, suggesties?: Array<{ id?: number | null | undefined, omschrijving?: string | null | undefined, bedrag?: any | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, validFrom?: any | null | undefined, validThrough?: any | null | undefined, betaalinstructie?: { byDay?: Array<DayOfWeek | null | undefined> | null | undefined, byMonth?: Array<number | null | undefined> | null | undefined, byMonthDay?: Array<number | null | undefined> | null | undefined, exceptDates?: Array<string | null | undefined> | null | undefined, repeatFrequency?: string | null | undefined, startDate?: string | null | undefined, endDate?: string | null | undefined } | null | undefined, burger?: { id?: number | null | undefined, voornamen?: string | null | undefined, voorletters?: string | null | undefined, achternaam?: string | null | undefined, plaatsnaam?: string | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, afdeling?: { id?: number | null | undefined, naam?: string | null | undefined, organisatie?: { id?: number | null | undefined, kvknummer?: string | null | undefined, vestigingsnummer?: string | null | undefined, naam?: string | null | undefined } | null | undefined, postadressen?: Array<{ id?: string | null | undefined, straatnaam?: string | null | undefined, huisnummer?: string | null | undefined, postcode?: string | null | undefined, plaatsnaam?: string | null | undefined } | null | undefined> | null | undefined, rekeningen?: Array<{ id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined, grootboekrekening?: { id: string, naam?: string | null | undefined, credit?: boolean | null | undefined, omschrijving?: string | null | undefined, referentie?: string | null | undefined, rubriek?: { id?: number | null | undefined, naam?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, matchingAfspraken?: Array<{ id?: number | null | undefined, credit?: boolean | null | undefined, zoektermen?: Array<string | null | undefined> | null | undefined, bedrag?: any | null | undefined, omschrijving?: string | null | undefined, burger?: { voorletters?: string | null | undefined, voornamen?: string | null | undefined, achternaam?: string | null | undefined } | null | undefined, tegenRekening?: { id?: number | null | undefined, iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined, tegenRekening?: { iban?: string | null | undefined, rekeninghouder?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, pageInfo?: { count?: number | null | undefined, limit?: number | null | undefined, start?: number | null | undefined } | null | undefined } | null | undefined };

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
export const PostadresFragmentDoc = gql`
    fragment Postadres on Postadres {
  id
  straatnaam
  huisnummer
  postcode
  plaatsnaam
}
    `;
export const RekeningFragmentDoc = gql`
    fragment Rekening on Rekening {
  id
  iban
  rekeninghouder
}
    `;
export const AfdelingFragmentDoc = gql`
    fragment Afdeling on Afdeling {
  id
  naam
  organisatie {
    id
    kvknummer
    vestigingsnummer
    naam
  }
  postadressen {
    ...Postadres
  }
  rekeningen {
    ...Rekening
  }
}
    ${PostadresFragmentDoc}
${RekeningFragmentDoc}`;
export const OrganisatieFragmentDoc = gql`
    fragment Organisatie on Organisatie {
  id
  naam
  kvknummer
  vestigingsnummer
  afdelingen {
    ...Afdeling
  }
}
    ${AfdelingFragmentDoc}`;
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
  afdeling {
    ...Afdeling
  }
  tegenRekening {
    ...Rekening
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
${AfdelingFragmentDoc}
${RubriekFragmentDoc}`;
export const GebruikersactiviteitFragmentDoc = gql`
    fragment Gebruikersactiviteit on GebruikersActiviteit {
  id
  timestamp
  gebruikerId
  action
  entities {
    entityType
    entityId
    huishouden {
      id
      burgers {
        id
        voorletters
        voornamen
        achternaam
      }
    }
    burger {
      id
      voorletters
      voornamen
      achternaam
    }
    organisatie {
      ...Organisatie
    }
    afspraak {
      ...Afspraak
    }
    rekening {
      id
      iban
      rekeninghouder
    }
    customerStatementMessage {
      id
      filename
      bankTransactions {
        id
      }
    }
    configuratie {
      id
      waarde
    }
    rubriek {
      id
      naam
      grootboekrekening {
        naam
      }
    }
  }
  meta {
    userAgent
    ip
    applicationVersion
  }
}
    ${OrganisatieFragmentDoc}
${AfspraakFragmentDoc}`;
export const BurgerFragmentDoc = gql`
    fragment Burger on Burger {
  id
  bsn
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
  huishouden {
    id
    burgers {
      id
    }
  }
}
    ${RekeningFragmentDoc}
${AfspraakFragmentDoc}`;
export const HuishoudenFragmentDoc = gql`
    fragment Huishouden on Huishouden {
  id
  burgers {
    ...Burger
  }
}
    ${BurgerFragmentDoc}`;
export const JournaalpostFragmentDoc = gql`
    fragment Journaalpost on Journaalpost {
  id
}
    `;
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
export const AddHuishoudenBurgerDocument = gql`
    mutation addHuishoudenBurger($huishoudenId: Int!, $burgerIds: [Int]!) {
  addHuishoudenBurger(huishoudenId: $huishoudenId, burgerIds: $burgerIds) {
    ok
  }
}
    `;
export type AddHuishoudenBurgerMutationFn = Apollo.MutationFunction<AddHuishoudenBurgerMutation, AddHuishoudenBurgerMutationVariables>;

/**
 * __useAddHuishoudenBurgerMutation__
 *
 * To run a mutation, you first call `useAddHuishoudenBurgerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddHuishoudenBurgerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addHuishoudenBurgerMutation, { data, loading, error }] = useAddHuishoudenBurgerMutation({
 *   variables: {
 *      huishoudenId: // value for 'huishoudenId'
 *      burgerIds: // value for 'burgerIds'
 *   },
 * });
 */
export function useAddHuishoudenBurgerMutation(baseOptions?: Apollo.MutationHookOptions<AddHuishoudenBurgerMutation, AddHuishoudenBurgerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddHuishoudenBurgerMutation, AddHuishoudenBurgerMutationVariables>(AddHuishoudenBurgerDocument, options);
      }
export type AddHuishoudenBurgerMutationHookResult = ReturnType<typeof useAddHuishoudenBurgerMutation>;
export type AddHuishoudenBurgerMutationResult = Apollo.MutationResult<AddHuishoudenBurgerMutation>;
export type AddHuishoudenBurgerMutationOptions = Apollo.BaseMutationOptions<AddHuishoudenBurgerMutation, AddHuishoudenBurgerMutationVariables>;
export const CreateAfdelingDocument = gql`
    mutation createAfdeling($naam: String!, $organisatieId: Int!, $postadressen: [CreatePostadresInput], $rekeningen: [RekeningInput]) {
  createAfdeling(
    input: {naam: $naam, organisatieId: $organisatieId, postadressen: $postadressen, rekeningen: $rekeningen}
  ) {
    ok
    afdeling {
      ...Afdeling
    }
  }
}
    ${AfdelingFragmentDoc}`;
export type CreateAfdelingMutationFn = Apollo.MutationFunction<CreateAfdelingMutation, CreateAfdelingMutationVariables>;

/**
 * __useCreateAfdelingMutation__
 *
 * To run a mutation, you first call `useCreateAfdelingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAfdelingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAfdelingMutation, { data, loading, error }] = useCreateAfdelingMutation({
 *   variables: {
 *      naam: // value for 'naam'
 *      organisatieId: // value for 'organisatieId'
 *      postadressen: // value for 'postadressen'
 *      rekeningen: // value for 'rekeningen'
 *   },
 * });
 */
export function useCreateAfdelingMutation(baseOptions?: Apollo.MutationHookOptions<CreateAfdelingMutation, CreateAfdelingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAfdelingMutation, CreateAfdelingMutationVariables>(CreateAfdelingDocument, options);
      }
export type CreateAfdelingMutationHookResult = ReturnType<typeof useCreateAfdelingMutation>;
export type CreateAfdelingMutationResult = Apollo.MutationResult<CreateAfdelingMutation>;
export type CreateAfdelingMutationOptions = Apollo.BaseMutationOptions<CreateAfdelingMutation, CreateAfdelingMutationVariables>;
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
export const CreateHuishoudenDocument = gql`
    mutation createHuishouden($burgerIds: [Int] = []) {
  createHuishouden(input: {burgerIds: $burgerIds}) {
    ok
    huishouden {
      ...Huishouden
    }
  }
}
    ${HuishoudenFragmentDoc}`;
export type CreateHuishoudenMutationFn = Apollo.MutationFunction<CreateHuishoudenMutation, CreateHuishoudenMutationVariables>;

/**
 * __useCreateHuishoudenMutation__
 *
 * To run a mutation, you first call `useCreateHuishoudenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHuishoudenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHuishoudenMutation, { data, loading, error }] = useCreateHuishoudenMutation({
 *   variables: {
 *      burgerIds: // value for 'burgerIds'
 *   },
 * });
 */
export function useCreateHuishoudenMutation(baseOptions?: Apollo.MutationHookOptions<CreateHuishoudenMutation, CreateHuishoudenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateHuishoudenMutation, CreateHuishoudenMutationVariables>(CreateHuishoudenDocument, options);
      }
export type CreateHuishoudenMutationHookResult = ReturnType<typeof useCreateHuishoudenMutation>;
export type CreateHuishoudenMutationResult = Apollo.MutationResult<CreateHuishoudenMutation>;
export type CreateHuishoudenMutationOptions = Apollo.BaseMutationOptions<CreateHuishoudenMutation, CreateHuishoudenMutationVariables>;
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
    mutation createOrganisatie($kvknummer: String!, $vestigingsnummer: String!, $naam: String) {
  createOrganisatie(
    input: {kvknummer: $kvknummer, vestigingsnummer: $vestigingsnummer, naam: $naam}
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
 *      kvknummer: // value for 'kvknummer'
 *      vestigingsnummer: // value for 'vestigingsnummer'
 *      naam: // value for 'naam'
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
export const CreateAfdelingRekeningDocument = gql`
    mutation createAfdelingRekening($afdelingId: Int!, $rekening: RekeningInput!) {
  createAfdelingRekening(afdelingId: $afdelingId, rekening: $rekening) {
    ok
    rekening {
      ...Rekening
    }
  }
}
    ${RekeningFragmentDoc}`;
export type CreateAfdelingRekeningMutationFn = Apollo.MutationFunction<CreateAfdelingRekeningMutation, CreateAfdelingRekeningMutationVariables>;

/**
 * __useCreateAfdelingRekeningMutation__
 *
 * To run a mutation, you first call `useCreateAfdelingRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAfdelingRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAfdelingRekeningMutation, { data, loading, error }] = useCreateAfdelingRekeningMutation({
 *   variables: {
 *      afdelingId: // value for 'afdelingId'
 *      rekening: // value for 'rekening'
 *   },
 * });
 */
export function useCreateAfdelingRekeningMutation(baseOptions?: Apollo.MutationHookOptions<CreateAfdelingRekeningMutation, CreateAfdelingRekeningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAfdelingRekeningMutation, CreateAfdelingRekeningMutationVariables>(CreateAfdelingRekeningDocument, options);
      }
export type CreateAfdelingRekeningMutationHookResult = ReturnType<typeof useCreateAfdelingRekeningMutation>;
export type CreateAfdelingRekeningMutationResult = Apollo.MutationResult<CreateAfdelingRekeningMutation>;
export type CreateAfdelingRekeningMutationOptions = Apollo.BaseMutationOptions<CreateAfdelingRekeningMutation, CreateAfdelingRekeningMutationVariables>;
export const CreateAfdelingPostadresDocument = gql`
    mutation createAfdelingPostadres($afdelingId: Int!, $huisnummer: String!, $plaatsnaam: String!, $postcode: String!, $straatnaam: String!) {
  createPostadres(
    input: {afdelingId: $afdelingId, huisnummer: $huisnummer, plaatsnaam: $plaatsnaam, postcode: $postcode, straatnaam: $straatnaam}
  ) {
    ok
    postadres {
      id
    }
  }
}
    `;
export type CreateAfdelingPostadresMutationFn = Apollo.MutationFunction<CreateAfdelingPostadresMutation, CreateAfdelingPostadresMutationVariables>;

/**
 * __useCreateAfdelingPostadresMutation__
 *
 * To run a mutation, you first call `useCreateAfdelingPostadresMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAfdelingPostadresMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAfdelingPostadresMutation, { data, loading, error }] = useCreateAfdelingPostadresMutation({
 *   variables: {
 *      afdelingId: // value for 'afdelingId'
 *      huisnummer: // value for 'huisnummer'
 *      plaatsnaam: // value for 'plaatsnaam'
 *      postcode: // value for 'postcode'
 *      straatnaam: // value for 'straatnaam'
 *   },
 * });
 */
export function useCreateAfdelingPostadresMutation(baseOptions?: Apollo.MutationHookOptions<CreateAfdelingPostadresMutation, CreateAfdelingPostadresMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAfdelingPostadresMutation, CreateAfdelingPostadresMutationVariables>(CreateAfdelingPostadresDocument, options);
      }
export type CreateAfdelingPostadresMutationHookResult = ReturnType<typeof useCreateAfdelingPostadresMutation>;
export type CreateAfdelingPostadresMutationResult = Apollo.MutationResult<CreateAfdelingPostadresMutation>;
export type CreateAfdelingPostadresMutationOptions = Apollo.BaseMutationOptions<CreateAfdelingPostadresMutation, CreateAfdelingPostadresMutationVariables>;
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
export type CreateRubriekMutationFn = Apollo.MutationFunction<CreateRubriekMutation, CreateRubriekMutationVariables>;

/**
 * __useCreateRubriekMutation__
 *
 * To run a mutation, you first call `useCreateRubriekMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRubriekMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRubriekMutation, { data, loading, error }] = useCreateRubriekMutation({
 *   variables: {
 *      naam: // value for 'naam'
 *      grootboekrekening: // value for 'grootboekrekening'
 *   },
 * });
 */
export function useCreateRubriekMutation(baseOptions?: Apollo.MutationHookOptions<CreateRubriekMutation, CreateRubriekMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRubriekMutation, CreateRubriekMutationVariables>(CreateRubriekDocument, options);
      }
export type CreateRubriekMutationHookResult = ReturnType<typeof useCreateRubriekMutation>;
export type CreateRubriekMutationResult = Apollo.MutationResult<CreateRubriekMutation>;
export type CreateRubriekMutationOptions = Apollo.BaseMutationOptions<CreateRubriekMutation, CreateRubriekMutationVariables>;
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
export const DeleteAfdelingDocument = gql`
    mutation deleteAfdeling($afdelingId: Int!) {
  deleteAfdeling(id: $afdelingId) {
    ok
  }
}
    `;
export type DeleteAfdelingMutationFn = Apollo.MutationFunction<DeleteAfdelingMutation, DeleteAfdelingMutationVariables>;

/**
 * __useDeleteAfdelingMutation__
 *
 * To run a mutation, you first call `useDeleteAfdelingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAfdelingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAfdelingMutation, { data, loading, error }] = useDeleteAfdelingMutation({
 *   variables: {
 *      afdelingId: // value for 'afdelingId'
 *   },
 * });
 */
export function useDeleteAfdelingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAfdelingMutation, DeleteAfdelingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAfdelingMutation, DeleteAfdelingMutationVariables>(DeleteAfdelingDocument, options);
      }
export type DeleteAfdelingMutationHookResult = ReturnType<typeof useDeleteAfdelingMutation>;
export type DeleteAfdelingMutationResult = Apollo.MutationResult<DeleteAfdelingMutation>;
export type DeleteAfdelingMutationOptions = Apollo.BaseMutationOptions<DeleteAfdelingMutation, DeleteAfdelingMutationVariables>;
export const DeleteAfdelingPostadresDocument = gql`
    mutation deleteAfdelingPostadres($id: String!, $afdelingId: Int!) {
  deletePostadres(id: $id, afdelingId: $afdelingId) {
    ok
  }
}
    `;
export type DeleteAfdelingPostadresMutationFn = Apollo.MutationFunction<DeleteAfdelingPostadresMutation, DeleteAfdelingPostadresMutationVariables>;

/**
 * __useDeleteAfdelingPostadresMutation__
 *
 * To run a mutation, you first call `useDeleteAfdelingPostadresMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAfdelingPostadresMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAfdelingPostadresMutation, { data, loading, error }] = useDeleteAfdelingPostadresMutation({
 *   variables: {
 *      id: // value for 'id'
 *      afdelingId: // value for 'afdelingId'
 *   },
 * });
 */
export function useDeleteAfdelingPostadresMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAfdelingPostadresMutation, DeleteAfdelingPostadresMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAfdelingPostadresMutation, DeleteAfdelingPostadresMutationVariables>(DeleteAfdelingPostadresDocument, options);
      }
export type DeleteAfdelingPostadresMutationHookResult = ReturnType<typeof useDeleteAfdelingPostadresMutation>;
export type DeleteAfdelingPostadresMutationResult = Apollo.MutationResult<DeleteAfdelingPostadresMutation>;
export type DeleteAfdelingPostadresMutationOptions = Apollo.BaseMutationOptions<DeleteAfdelingPostadresMutation, DeleteAfdelingPostadresMutationVariables>;
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
export const DeleteHuishoudenBurgerDocument = gql`
    mutation deleteHuishoudenBurger($huishoudenId: Int!, $burgerIds: [Int]!) {
  deleteHuishoudenBurger(huishoudenId: $huishoudenId, burgerIds: $burgerIds) {
    ok
  }
}
    `;
export type DeleteHuishoudenBurgerMutationFn = Apollo.MutationFunction<DeleteHuishoudenBurgerMutation, DeleteHuishoudenBurgerMutationVariables>;

/**
 * __useDeleteHuishoudenBurgerMutation__
 *
 * To run a mutation, you first call `useDeleteHuishoudenBurgerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteHuishoudenBurgerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteHuishoudenBurgerMutation, { data, loading, error }] = useDeleteHuishoudenBurgerMutation({
 *   variables: {
 *      huishoudenId: // value for 'huishoudenId'
 *      burgerIds: // value for 'burgerIds'
 *   },
 * });
 */
export function useDeleteHuishoudenBurgerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteHuishoudenBurgerMutation, DeleteHuishoudenBurgerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteHuishoudenBurgerMutation, DeleteHuishoudenBurgerMutationVariables>(DeleteHuishoudenBurgerDocument, options);
      }
export type DeleteHuishoudenBurgerMutationHookResult = ReturnType<typeof useDeleteHuishoudenBurgerMutation>;
export type DeleteHuishoudenBurgerMutationResult = Apollo.MutationResult<DeleteHuishoudenBurgerMutation>;
export type DeleteHuishoudenBurgerMutationOptions = Apollo.BaseMutationOptions<DeleteHuishoudenBurgerMutation, DeleteHuishoudenBurgerMutationVariables>;
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
export const DeleteAfdelingRekeningDocument = gql`
    mutation deleteAfdelingRekening($id: Int!, $afdelingId: Int!) {
  deleteAfdelingRekening(afdelingId: $afdelingId, rekeningId: $id) {
    ok
  }
}
    `;
export type DeleteAfdelingRekeningMutationFn = Apollo.MutationFunction<DeleteAfdelingRekeningMutation, DeleteAfdelingRekeningMutationVariables>;

/**
 * __useDeleteAfdelingRekeningMutation__
 *
 * To run a mutation, you first call `useDeleteAfdelingRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAfdelingRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAfdelingRekeningMutation, { data, loading, error }] = useDeleteAfdelingRekeningMutation({
 *   variables: {
 *      id: // value for 'id'
 *      afdelingId: // value for 'afdelingId'
 *   },
 * });
 */
export function useDeleteAfdelingRekeningMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAfdelingRekeningMutation, DeleteAfdelingRekeningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAfdelingRekeningMutation, DeleteAfdelingRekeningMutationVariables>(DeleteAfdelingRekeningDocument, options);
      }
export type DeleteAfdelingRekeningMutationHookResult = ReturnType<typeof useDeleteAfdelingRekeningMutation>;
export type DeleteAfdelingRekeningMutationResult = Apollo.MutationResult<DeleteAfdelingRekeningMutation>;
export type DeleteAfdelingRekeningMutationOptions = Apollo.BaseMutationOptions<DeleteAfdelingRekeningMutation, DeleteAfdelingRekeningMutationVariables>;
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
export const UpdateBurgerDocument = gql`
    mutation updateBurger($id: Int!, $bsn: Int, $voorletters: String, $voornamen: String, $achternaam: String, $geboortedatum: String, $straatnaam: String, $huisnummer: String, $postcode: String, $plaatsnaam: String, $telefoonnummer: String, $email: String) {
  updateBurger(
    id: $id
    bsn: $bsn
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
 *      bsn: // value for 'bsn'
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
    mutation updateOrganisatie($id: Int!, $kvknummer: String, $vestigingsnummer: String, $naam: String) {
  updateOrganisatie(
    id: $id
    kvknummer: $kvknummer
    vestigingsnummer: $vestigingsnummer
    naam: $naam
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
 *      kvknummer: // value for 'kvknummer'
 *      vestigingsnummer: // value for 'vestigingsnummer'
 *      naam: // value for 'naam'
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
export const UpdatePostadresDocument = gql`
    mutation updatePostadres($id: String!, $straatnaam: String, $huisnummer: String, $postcode: String, $plaatsnaam: String) {
  updatePostadres(
    id: $id
    straatnaam: $straatnaam
    huisnummer: $huisnummer
    postcode: $postcode
    plaatsnaam: $plaatsnaam
  ) {
    ok
  }
}
    `;
export type UpdatePostadresMutationFn = Apollo.MutationFunction<UpdatePostadresMutation, UpdatePostadresMutationVariables>;

/**
 * __useUpdatePostadresMutation__
 *
 * To run a mutation, you first call `useUpdatePostadresMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostadresMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostadresMutation, { data, loading, error }] = useUpdatePostadresMutation({
 *   variables: {
 *      id: // value for 'id'
 *      straatnaam: // value for 'straatnaam'
 *      huisnummer: // value for 'huisnummer'
 *      postcode: // value for 'postcode'
 *      plaatsnaam: // value for 'plaatsnaam'
 *   },
 * });
 */
export function useUpdatePostadresMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostadresMutation, UpdatePostadresMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePostadresMutation, UpdatePostadresMutationVariables>(UpdatePostadresDocument, options);
      }
export type UpdatePostadresMutationHookResult = ReturnType<typeof useUpdatePostadresMutation>;
export type UpdatePostadresMutationResult = Apollo.MutationResult<UpdatePostadresMutation>;
export type UpdatePostadresMutationOptions = Apollo.BaseMutationOptions<UpdatePostadresMutation, UpdatePostadresMutationVariables>;
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
export const GetBurgersSearchDocument = gql`
    query getBurgersSearch($search: DynamicType) {
  burgers(search: $search) {
    ...Burger
  }
}
    ${BurgerFragmentDoc}`;

/**
 * __useGetBurgersSearchQuery__
 *
 * To run a query within a React component, call `useGetBurgersSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBurgersSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBurgersSearchQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetBurgersSearchQuery(baseOptions?: Apollo.QueryHookOptions<GetBurgersSearchQuery, GetBurgersSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBurgersSearchQuery, GetBurgersSearchQueryVariables>(GetBurgersSearchDocument, options);
      }
export function useGetBurgersSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBurgersSearchQuery, GetBurgersSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBurgersSearchQuery, GetBurgersSearchQueryVariables>(GetBurgersSearchDocument, options);
        }
export type GetBurgersSearchQueryHookResult = ReturnType<typeof useGetBurgersSearchQuery>;
export type GetBurgersSearchLazyQueryHookResult = ReturnType<typeof useGetBurgersSearchLazyQuery>;
export type GetBurgersSearchQueryResult = Apollo.QueryResult<GetBurgersSearchQuery, GetBurgersSearchQueryVariables>;
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
    ...Export
  }
}
    ${ExportFragmentDoc}`;

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
export const GetHuishoudenDocument = gql`
    query getHuishouden($id: Int!) {
  huishouden(id: $id) {
    ...Huishouden
  }
}
    ${HuishoudenFragmentDoc}`;

/**
 * __useGetHuishoudenQuery__
 *
 * To run a query within a React component, call `useGetHuishoudenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHuishoudenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHuishoudenQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetHuishoudenQuery(baseOptions: Apollo.QueryHookOptions<GetHuishoudenQuery, GetHuishoudenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHuishoudenQuery, GetHuishoudenQueryVariables>(GetHuishoudenDocument, options);
      }
export function useGetHuishoudenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHuishoudenQuery, GetHuishoudenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHuishoudenQuery, GetHuishoudenQueryVariables>(GetHuishoudenDocument, options);
        }
export type GetHuishoudenQueryHookResult = ReturnType<typeof useGetHuishoudenQuery>;
export type GetHuishoudenLazyQueryHookResult = ReturnType<typeof useGetHuishoudenLazyQuery>;
export type GetHuishoudenQueryResult = Apollo.QueryResult<GetHuishoudenQuery, GetHuishoudenQueryVariables>;
export const GetHuishoudensDocument = gql`
    query getHuishoudens {
  huishoudens {
    ...Huishouden
  }
}
    ${HuishoudenFragmentDoc}`;

/**
 * __useGetHuishoudensQuery__
 *
 * To run a query within a React component, call `useGetHuishoudensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHuishoudensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHuishoudensQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetHuishoudensQuery(baseOptions?: Apollo.QueryHookOptions<GetHuishoudensQuery, GetHuishoudensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHuishoudensQuery, GetHuishoudensQueryVariables>(GetHuishoudensDocument, options);
      }
export function useGetHuishoudensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHuishoudensQuery, GetHuishoudensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHuishoudensQuery, GetHuishoudensQueryVariables>(GetHuishoudensDocument, options);
        }
export type GetHuishoudensQueryHookResult = ReturnType<typeof useGetHuishoudensQuery>;
export type GetHuishoudensLazyQueryHookResult = ReturnType<typeof useGetHuishoudensLazyQuery>;
export type GetHuishoudensQueryResult = Apollo.QueryResult<GetHuishoudensQuery, GetHuishoudensQueryVariables>;
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
export const GetRekeningDocument = gql`
    query getRekening($id: Int!) {
  rekening(id: $id) {
    id
    iban
    rekeninghouder
  }
}
    `;

/**
 * __useGetRekeningQuery__
 *
 * To run a query within a React component, call `useGetRekeningQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRekeningQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRekeningQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRekeningQuery(baseOptions: Apollo.QueryHookOptions<GetRekeningQuery, GetRekeningQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRekeningQuery, GetRekeningQueryVariables>(GetRekeningDocument, options);
      }
export function useGetRekeningLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRekeningQuery, GetRekeningQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRekeningQuery, GetRekeningQueryVariables>(GetRekeningDocument, options);
        }
export type GetRekeningQueryHookResult = ReturnType<typeof useGetRekeningQuery>;
export type GetRekeningLazyQueryHookResult = ReturnType<typeof useGetRekeningLazyQuery>;
export type GetRekeningQueryResult = Apollo.QueryResult<GetRekeningQuery, GetRekeningQueryVariables>;
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
 *      filters: // value for 'filters'
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