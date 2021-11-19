import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T;
export type InputMaybe<T> = T;
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
  /** Bedrag (bijvoorbeeld: 99.99) n */
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
  /** Accepteert datum, datum en tijd, ints en strings en wordt gebruikt bij ComplexFilterType. */
  DynamicType: any;
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any;
};

/** Mutatie om een zoekterm aan een afspraak toe te voegen. */
export type AddAfspraakZoekterm = {
  afspraak?: Maybe<Afspraak>;
  matchingAfspraken?: Maybe<Array<Maybe<Afspraak>>>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
};

/** Mutatie om een burger aan een huishouden toe te voegen. */
export type AddHuishoudenBurger = {
  burgerIds?: Maybe<Burger>;
  huishouden?: Maybe<Huishouden>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Huishouden>;
};

export type Afdeling = {
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  organisatie?: Maybe<Organisatie>;
  postadressen?: Maybe<Array<Maybe<Postadres>>>;
  rekeningen?: Maybe<Array<Maybe<Rekening>>>;
};

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


export type AfspraakOverschrijvingenArgs = {
  eindDatum?: InputMaybe<Scalars['Date']>;
  startDatum?: InputMaybe<Scalars['Date']>;
};

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
  AND?: InputMaybe<BankTransactionFilter>;
  OR?: InputMaybe<BankTransactionFilter>;
  bedrag?: InputMaybe<ComplexBedragFilterType>;
  id?: InputMaybe<ComplexFilterType>;
  isCredit?: InputMaybe<Scalars['Boolean']>;
  isGeboekt?: InputMaybe<Scalars['Boolean']>;
  statementLine?: InputMaybe<ComplexFilterType>;
  tegenRekening?: InputMaybe<ComplexFilterType>;
  transactieDatum?: InputMaybe<ComplexFilterType>;
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
  byDay?: InputMaybe<Array<InputMaybe<DayOfWeek>>>;
  byMonth?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  byMonthDay?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  endDate?: InputMaybe<Scalars['String']>;
  exceptDates?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  repeatFrequency?: InputMaybe<Scalars['String']>;
  startDate: Scalars['String'];
};

export type Burger = {
  achternaam?: Maybe<Scalars['String']>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  bsn?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  geboortedatum?: Maybe<Scalars['String']>;
  gebruikersactiviteiten?: Maybe<Array<Maybe<GebruikersActiviteit>>>;
  huishouden?: Maybe<Huishouden>;
  huisnummer?: Maybe<Scalars['String']>;
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
  AND?: InputMaybe<BurgerFilter>;
  OR?: InputMaybe<BurgerFilter>;
  achternaam?: InputMaybe<ComplexFilterType>;
  bedrag?: InputMaybe<ComplexBedragFilterType>;
  email?: InputMaybe<ComplexFilterType>;
  geboortedatum?: InputMaybe<ComplexFilterType>;
  huishoudenId?: InputMaybe<ComplexFilterType>;
  huisnummer?: InputMaybe<ComplexFilterType>;
  iban?: InputMaybe<ComplexFilterType>;
  id?: InputMaybe<ComplexFilterType>;
  plaatsnaam?: InputMaybe<ComplexFilterType>;
  postcode?: InputMaybe<ComplexFilterType>;
  rekeninghouder?: InputMaybe<ComplexFilterType>;
  straatnaam?: InputMaybe<ComplexFilterType>;
  tegenRekeningId?: InputMaybe<ComplexFilterType>;
  telefoonnummer?: InputMaybe<ComplexFilterType>;
  voorletters?: InputMaybe<ComplexFilterType>;
  voornamen?: InputMaybe<ComplexFilterType>;
  zoektermen?: InputMaybe<ComplexFilterType>;
};

export type BurgersPaged = {
  burgers?: Maybe<Array<Maybe<Burger>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type ComplexBedragFilterType = {
  BETWEEN?: InputMaybe<Array<InputMaybe<Scalars['Bedrag']>>>;
  EQ?: InputMaybe<Scalars['Bedrag']>;
  GT?: InputMaybe<Scalars['Bedrag']>;
  GTE?: InputMaybe<Scalars['Bedrag']>;
  IN?: InputMaybe<Array<InputMaybe<Scalars['Bedrag']>>>;
  LT?: InputMaybe<Scalars['Bedrag']>;
  LTE?: InputMaybe<Scalars['Bedrag']>;
  NEQ?: InputMaybe<Scalars['Bedrag']>;
  NOTIN?: InputMaybe<Array<InputMaybe<Scalars['Bedrag']>>>;
};

export type ComplexFilterType = {
  BETWEEN?: InputMaybe<Array<InputMaybe<Scalars['DynamicType']>>>;
  EQ?: InputMaybe<Scalars['DynamicType']>;
  GT?: InputMaybe<Scalars['DynamicType']>;
  GTE?: InputMaybe<Scalars['DynamicType']>;
  IN?: InputMaybe<Array<InputMaybe<Scalars['DynamicType']>>>;
  LT?: InputMaybe<Scalars['DynamicType']>;
  LTE?: InputMaybe<Scalars['DynamicType']>;
  NEQ?: InputMaybe<Scalars['DynamicType']>;
  NOTIN?: InputMaybe<Array<InputMaybe<Scalars['DynamicType']>>>;
};

export type Configuratie = {
  id?: Maybe<Scalars['String']>;
  waarde?: Maybe<Scalars['String']>;
};

export type ConfiguratieInput = {
  id: Scalars['String'];
  waarde?: InputMaybe<Scalars['String']>;
};

/** Mutatie om een afdeling aan een organisatie toe te voegen. */
export type CreateAfdeling = {
  afdeling?: Maybe<Afdeling>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateAfdelingInput = {
  naam: Scalars['String'];
  organisatieId: Scalars['Int'];
  postadressen?: InputMaybe<Array<InputMaybe<CreatePostadresInput>>>;
  rekeningen?: InputMaybe<Array<InputMaybe<RekeningInput>>>;
};

/** Mutatie om een rekening aan een afdeling toe te voegen. */
export type CreateAfdelingRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
};

export type CreateAfspraak = {
  afspraak?: Maybe<Afspraak>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateAfspraakInput = {
  afdelingId?: InputMaybe<Scalars['Int']>;
  bedrag: Scalars['Bedrag'];
  burgerId: Scalars['Int'];
  credit: Scalars['Boolean'];
  omschrijving: Scalars['String'];
  postadresId?: InputMaybe<Scalars['String']>;
  rubriekId: Scalars['Int'];
  tegenRekeningId: Scalars['Int'];
  validFrom?: InputMaybe<Scalars['String']>;
  validThrough?: InputMaybe<Scalars['String']>;
};

export type CreateBurger = {
  burger?: Maybe<Burger>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateBurgerInput = {
  achternaam?: InputMaybe<Scalars['String']>;
  bsn?: InputMaybe<Scalars['Int']>;
  email?: InputMaybe<Scalars['String']>;
  geboortedatum?: InputMaybe<Scalars['Date']>;
  huishouden?: InputMaybe<HuishoudenInput>;
  huisnummer?: InputMaybe<Scalars['String']>;
  plaatsnaam?: InputMaybe<Scalars['String']>;
  postcode?: InputMaybe<Scalars['String']>;
  rekeningen?: InputMaybe<Array<InputMaybe<RekeningInput>>>;
  straatnaam?: InputMaybe<Scalars['String']>;
  telefoonnummer?: InputMaybe<Scalars['String']>;
  voorletters?: InputMaybe<Scalars['String']>;
  voornamen?: InputMaybe<Scalars['String']>;
};

/** Mutatie om een rekening aan een burger toe te voegen. */
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

/** Mutatie om een betaalinstructie te genereren. */
export type CreateExportOverschrijvingen = {
  export?: Maybe<Export>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateHuishouden = {
  huishouden?: Maybe<Huishouden>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateHuishoudenInput = {
  burgerIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

/** Mutatie om een banktransactie af te letteren op een afspraak. */
export type CreateJournaalpostAfspraak = {
  journaalpost?: Maybe<Journaalpost>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateJournaalpostAfspraakInput = {
  afspraakId: Scalars['Int'];
  isAutomatischGeboekt: Scalars['Boolean'];
  transactionId: Scalars['Int'];
};

/** Mutatie om een banktransactie af te letteren op een grootboekrekening. */
export type CreateJournaalpostGrootboekrekening = {
  journaalpost?: Maybe<Journaalpost>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateJournaalpostGrootboekrekeningInput = {
  grootboekrekeningId: Scalars['String'];
  isAutomatischGeboekt: Scalars['Boolean'];
  transactionId: Scalars['Int'];
};

/** deprecated */
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
  naam?: InputMaybe<Scalars['String']>;
  vestigingsnummer?: InputMaybe<Scalars['String']>;
};

export type CreatePostadres = {
  afdeling?: Maybe<Afdeling>;
  ok?: Maybe<Scalars['Boolean']>;
  postadres?: Maybe<Postadres>;
};

export type CreatePostadresInput = {
  afdelingId?: InputMaybe<Scalars['Int']>;
  huisnummer: Scalars['String'];
  plaatsnaam: Scalars['String'];
  postcode: Scalars['String'];
  straatnaam: Scalars['String'];
};

export type CreateRubriek = {
  ok?: Maybe<Scalars['Boolean']>;
  rubriek?: Maybe<Rubriek>;
};

/** Model van een bankafschrift. */
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

/** Mutatie om een afdeling van een organisatie te verwijderen. */
export type DeleteAfdeling = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afdeling>;
};

/** Mutatie om een rekening van een afdeling te verwijderen. */
export type DeleteAfdelingRekening = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Rekening>;
};

export type DeleteAfspraak = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
};

/** Mutatie om een zoekterm bij een afspraak te verwijderen. */
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

/** Mutatie om een rekening bij een burger te verwijderen. */
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

/** Mutatie om een burger uit een huishouden te verwijderen. */
export type DeleteHuishoudenBurger = {
  burgerIds?: Maybe<Array<Maybe<Burger>>>;
  huishouden?: Maybe<Array<Maybe<Huishouden>>>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Huishouden>;
};

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

/** Model dat een actie van een gebruiker beschrijft. */
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

/** Dit model beschrijft de wijzingen die een gebruiker heeft gedaan. */
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

export type Huishouden = {
  burgers?: Maybe<Array<Maybe<Burger>>>;
  id?: Maybe<Scalars['Int']>;
};

export type HuishoudenInput = {
  id?: InputMaybe<Scalars['Int']>;
};

export type HuishoudensPaged = {
  huishoudens?: Maybe<Array<Maybe<Huishouden>>>;
  pageInfo?: Maybe<PageInfo>;
};

/** Model van een afgeletterde banktransactie. */
export type Journaalpost = {
  afspraak?: Maybe<Afspraak>;
  grootboekrekening?: Maybe<Grootboekrekening>;
  id?: Maybe<Scalars['Int']>;
  isAutomatischGeboekt?: Maybe<Scalars['Boolean']>;
  transaction?: Maybe<BankTransaction>;
};

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

export type Postadres = {
  huisnummer?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
};

export type Rekening = {
  afdelingen?: Maybe<Array<Maybe<Afdeling>>>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  burgers?: Maybe<Array<Maybe<Burger>>>;
  iban?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  rekeninghouder?: Maybe<Scalars['String']>;
};

export type RekeningInput = {
  iban?: InputMaybe<Scalars['String']>;
  rekeninghouder?: InputMaybe<Scalars['String']>;
};

/** The root of all mutations  */
export type RootMutation = {
  /** Mutatie om een zoekterm aan een afspraak toe te voegen. */
  addAfspraakZoekterm?: Maybe<AddAfspraakZoekterm>;
  /** Mutatie om een burger aan een huishouden toe te voegen. */
  addHuishoudenBurger?: Maybe<AddHuishoudenBurger>;
  /** Mutatie om een afdeling aan een organisatie toe te voegen. */
  createAfdeling?: Maybe<CreateAfdeling>;
  /** Mutatie om een rekening aan een afdeling toe te voegen. */
  createAfdelingRekening?: Maybe<CreateAfdelingRekening>;
  createAfspraak?: Maybe<CreateAfspraak>;
  createBurger?: Maybe<CreateBurger>;
  /** Mutatie om een rekening aan een burger toe te voegen. */
  createBurgerRekening?: Maybe<CreateBurgerRekening>;
  createConfiguratie?: Maybe<CreateConfiguratie>;
  createCustomerStatementMessage?: Maybe<CreateCustomerStatementMessage>;
  /** Mutatie om een betaalinstructie te genereren. */
  createExportOverschrijvingen?: Maybe<CreateExportOverschrijvingen>;
  createHuishouden?: Maybe<CreateHuishouden>;
  /** Mutatie om een banktransactie af te letteren op een afspraak. */
  createJournaalpostAfspraak?: Maybe<CreateJournaalpostAfspraak>;
  /** Mutatie om een banktransactie af te letteren op een grootboekrekening. */
  createJournaalpostGrootboekrekening?: Maybe<CreateJournaalpostGrootboekrekening>;
  /** deprecated */
  createJournaalpostPerAfspraak?: Maybe<CreateJournaalpostPerAfspraak>;
  createOrganisatie?: Maybe<CreateOrganisatie>;
  createPostadres?: Maybe<CreatePostadres>;
  createRubriek?: Maybe<CreateRubriek>;
  /** Mutatie om een afdeling van een organisatie te verwijderen. */
  deleteAfdeling?: Maybe<DeleteAfdeling>;
  /** Mutatie om een rekening van een afdeling te verwijderen. */
  deleteAfdelingRekening?: Maybe<DeleteAfdelingRekening>;
  deleteAfspraak?: Maybe<DeleteAfspraak>;
  /** Mutatie om een zoekterm bij een afspraak te verwijderen. */
  deleteAfspraakZoekterm?: Maybe<DeleteAfspraakZoekterm>;
  deleteBurger?: Maybe<DeleteBurger>;
  /** Mutatie om een rekening bij een burger te verwijderen. */
  deleteBurgerRekening?: Maybe<DeleteBurgerRekening>;
  deleteConfiguratie?: Maybe<DeleteConfiguratie>;
  deleteCustomerStatementMessage?: Maybe<DeleteCustomerStatementMessage>;
  deleteHuishouden?: Maybe<DeleteHuishouden>;
  /** Mutatie om een burger uit een huishouden te verwijderen. */
  deleteHuishoudenBurger?: Maybe<DeleteHuishoudenBurger>;
  deleteJournaalpost?: Maybe<DeleteJournaalpost>;
  deleteOrganisatie?: Maybe<DeleteOrganisatie>;
  deletePostadres?: Maybe<DeletePostadres>;
  deleteRubriek?: Maybe<DeleteRubriek>;
  /** Mutatie om niet afgeletterde banktransacties af te letteren. */
  startAutomatischBoeken?: Maybe<StartAutomatischBoeken>;
  updateAfdeling?: Maybe<UpdateAfdeling>;
  updateAfspraak?: Maybe<UpdateAfspraak>;
  /** Mutatie voor het instellen van een nieuwe betaalinstructie voor een afspraak. */
  updateAfspraakBetaalinstructie?: Maybe<UpdateAfspraakBetaalinstructie>;
  updateBurger?: Maybe<UpdateBurger>;
  updateConfiguratie?: Maybe<UpdateConfiguratie>;
  /** deprecated */
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
  burgerIds: Array<InputMaybe<Scalars['Int']>>;
  huishoudenId: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationCreateAfdelingArgs = {
  input?: InputMaybe<CreateAfdelingInput>;
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
  input?: InputMaybe<CreateBurgerInput>;
};


/** The root of all mutations  */
export type RootMutationCreateBurgerRekeningArgs = {
  burgerId: Scalars['Int'];
  rekening: RekeningInput;
};


/** The root of all mutations  */
export type RootMutationCreateConfiguratieArgs = {
  input?: InputMaybe<ConfiguratieInput>;
};


/** The root of all mutations  */
export type RootMutationCreateCustomerStatementMessageArgs = {
  file: Scalars['Upload'];
};


/** The root of all mutations  */
export type RootMutationCreateExportOverschrijvingenArgs = {
  eindDatum?: InputMaybe<Scalars['String']>;
  startDatum?: InputMaybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationCreateHuishoudenArgs = {
  input?: InputMaybe<CreateHuishoudenInput>;
};


/** The root of all mutations  */
export type RootMutationCreateJournaalpostAfspraakArgs = {
  input?: InputMaybe<CreateJournaalpostAfspraakInput>;
};


/** The root of all mutations  */
export type RootMutationCreateJournaalpostGrootboekrekeningArgs = {
  input?: InputMaybe<CreateJournaalpostGrootboekrekeningInput>;
};


/** The root of all mutations  */
export type RootMutationCreateJournaalpostPerAfspraakArgs = {
  input: Array<InputMaybe<CreateJournaalpostAfspraakInput>>;
};


/** The root of all mutations  */
export type RootMutationCreateOrganisatieArgs = {
  input?: InputMaybe<CreateOrganisatieInput>;
};


/** The root of all mutations  */
export type RootMutationCreatePostadresArgs = {
  input?: InputMaybe<CreatePostadresInput>;
};


/** The root of all mutations  */
export type RootMutationCreateRubriekArgs = {
  grootboekrekeningId?: InputMaybe<Scalars['String']>;
  naam?: InputMaybe<Scalars['String']>;
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
  burgerIds: Array<InputMaybe<Scalars['Int']>>;
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
  naam?: InputMaybe<Scalars['String']>;
  organisatieId?: InputMaybe<Scalars['Int']>;
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
  achternaam?: InputMaybe<Scalars['String']>;
  bsn?: InputMaybe<Scalars['Int']>;
  email?: InputMaybe<Scalars['String']>;
  geboortedatum?: InputMaybe<Scalars['String']>;
  huishouden?: InputMaybe<HuishoudenInput>;
  huisnummer?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  plaatsnaam?: InputMaybe<Scalars['String']>;
  postcode?: InputMaybe<Scalars['String']>;
  straatnaam?: InputMaybe<Scalars['String']>;
  telefoonnummer?: InputMaybe<Scalars['String']>;
  voorletters?: InputMaybe<Scalars['String']>;
  voornamen?: InputMaybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationUpdateConfiguratieArgs = {
  input?: InputMaybe<ConfiguratieInput>;
};


/** The root of all mutations  */
export type RootMutationUpdateJournaalpostGrootboekrekeningArgs = {
  input?: InputMaybe<UpdateJournaalpostGrootboekrekeningInput>;
};


/** The root of all mutations  */
export type RootMutationUpdateOrganisatieArgs = {
  id: Scalars['Int'];
  kvknummer?: InputMaybe<Scalars['String']>;
  naam?: InputMaybe<Scalars['String']>;
  vestigingsnummer?: InputMaybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationUpdatePostadresArgs = {
  huisnummer?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  plaatsnaam?: InputMaybe<Scalars['String']>;
  postcode?: InputMaybe<Scalars['String']>;
  straatnaam?: InputMaybe<Scalars['String']>;
};


/** The root of all mutations  */
export type RootMutationUpdateRekeningArgs = {
  id: Scalars['Int'];
  rekening: RekeningInput;
};


/** The root of all mutations  */
export type RootMutationUpdateRubriekArgs = {
  grootboekrekeningId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  naam?: InputMaybe<Scalars['String']>;
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
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryAfspraakArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryAfsprakenArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryBankTransactionArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryBankTransactionsArgs = {
  filters?: InputMaybe<BankTransactionFilter>;
};


/** The root of all queries  */
export type RootQueryBankTransactionsPagedArgs = {
  filters?: InputMaybe<BankTransactionFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  start?: InputMaybe<Scalars['Int']>;
};


/** The root of all queries  */
export type RootQueryBurgerArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryBurgersArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  search?: InputMaybe<Scalars['DynamicType']>;
};


/** The root of all queries  */
export type RootQueryBurgersPagedArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  start?: InputMaybe<Scalars['Int']>;
};


/** The root of all queries  */
export type RootQueryConfiguratieArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQueryConfiguratiesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


/** The root of all queries  */
export type RootQueryCustomerStatementMessageArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryCustomerStatementMessagesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryExportArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryExportsArgs = {
  eindDatum?: InputMaybe<Scalars['Date']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  startDatum?: InputMaybe<Scalars['Date']>;
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitenArgs = {
  afsprakenIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  burgerIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  huishoudenIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryGebruikersactiviteitenPagedArgs = {
  afsprakenIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  burgerIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  huishoudenIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  start?: InputMaybe<Scalars['Int']>;
};


/** The root of all queries  */
export type RootQueryGrootboekrekeningArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQueryGrootboekrekeningenArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


/** The root of all queries  */
export type RootQueryHuishoudenArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryHuishoudensArgs = {
  filters?: InputMaybe<BurgerFilter>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryHuishoudensPagedArgs = {
  filters?: InputMaybe<BurgerFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  start?: InputMaybe<Scalars['Int']>;
};


/** The root of all queries  */
export type RootQueryJournaalpostArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryJournaalpostenArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryOrganisatieArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryOrganisatiesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryPostadresArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQueryPostadressenArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


/** The root of all queries  */
export type RootQueryRekeningArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryRekeningenArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryRubriekArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQueryRubriekenArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Rubriek = {
  grootboekrekening?: Maybe<Grootboekrekening>;
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
};

/** Mutatie om niet afgeletterde banktransacties af te letteren. */
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

/** Mutatie voor het instellen van een nieuwe betaalinstructie voor een afspraak. */
export type UpdateAfspraakBetaalinstructie = {
  afspraak?: Maybe<Afspraak>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Afspraak>;
};

export type UpdateAfspraakInput = {
  afdelingId?: InputMaybe<Scalars['Int']>;
  bedrag?: InputMaybe<Scalars['Bedrag']>;
  burgerId?: InputMaybe<Scalars['Int']>;
  credit?: InputMaybe<Scalars['Boolean']>;
  omschrijving?: InputMaybe<Scalars['String']>;
  postadresId?: InputMaybe<Scalars['String']>;
  rubriekId?: InputMaybe<Scalars['Int']>;
  tegenRekeningId?: InputMaybe<Scalars['Int']>;
  validThrough?: InputMaybe<Scalars['String']>;
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

/** deprecated */
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

export type AfdelingFragment = { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> };

export type AfspraakFragment = { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> };

export type BetaalinstructieFragment = { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string };

export type BurgerFragment = { id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } };

export type CustomerStatementMessageFragment = { id?: number, filename?: string, uploadDate?: any, accountIdentification?: string, closingAvailableFunds?: number, closingBalance?: number, forwardAvailableBalance?: number, openingBalance?: number, relatedReference?: string, sequenceNumber?: string, transactionReferenceNumber?: string };

export type ExportFragment = { id?: number, naam?: string, timestamp?: any, startDatum?: string, eindDatum?: string, sha256?: string, overschrijvingen?: Array<{ id?: number }> };

export type GebruikerFragment = { email?: string };

export type GebruikersactiviteitFragment = { id?: number, timestamp?: any, gebruikerId?: string, action?: string, entities?: Array<{ entityType?: string, entityId?: string, huishouden?: { id?: number, burgers?: Array<{ id?: number, voorletters?: string, voornamen?: string, achternaam?: string }> }, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string }, organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, rekening?: { id?: number, iban?: string, rekeninghouder?: string }, customerStatementMessage?: { id?: number, filename?: string, bankTransactions?: Array<{ id?: number }> }, configuratie?: { id?: string, waarde?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { naam?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, naam?: string } }, postadres?: { id?: string } }>, meta?: { userAgent?: string, ip?: Array<string>, applicationVersion?: string } };

export type GrootboekrekeningFragment = { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } };

export type HuishoudenFragment = { id?: number, burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }> };

export type JournaalpostFragment = { id?: number };

export type OrganisatieFragment = { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> };

export type PostadresFragment = { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string };

export type RekeningFragment = { id?: number, iban?: string, rekeninghouder?: string };

export type RubriekFragment = { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } };

export type BankTransactionFragment = { id?: number, informationToAccountOwner?: string, statementLine?: string, bedrag?: any, isCredit?: boolean, tegenRekeningIban?: string, transactieDatum?: any, tegenRekening?: { iban?: string, rekeninghouder?: string } };

export type AddAfspraakZoektermMutationVariables = Exact<{
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
}>;


export type AddAfspraakZoektermMutation = { addAfspraakZoekterm?: { ok?: boolean, matchingAfspraken?: Array<{ id?: number, zoektermen?: Array<string>, bedrag?: any, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { rekeninghouder?: string, iban?: string } }> } };

export type AddHuishoudenBurgerMutationVariables = Exact<{
  huishoudenId: Scalars['Int'];
  burgerIds: Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>;
}>;


export type AddHuishoudenBurgerMutation = { addHuishoudenBurger?: { ok?: boolean } };

export type CreateAfdelingMutationVariables = Exact<{
  naam: Scalars['String'];
  organisatieId: Scalars['Int'];
  postadressen?: InputMaybe<Array<InputMaybe<CreatePostadresInput>> | InputMaybe<CreatePostadresInput>>;
  rekeningen?: InputMaybe<Array<InputMaybe<RekeningInput>> | InputMaybe<RekeningInput>>;
}>;


export type CreateAfdelingMutation = { createAfdeling?: { ok?: boolean, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> } } };

export type CreateAfspraakMutationVariables = Exact<{
  input: CreateAfspraakInput;
}>;


export type CreateAfspraakMutation = { createAfspraak?: { ok?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } } };

export type CreateBurgerMutationVariables = Exact<{
  input?: InputMaybe<CreateBurgerInput>;
}>;


export type CreateBurgerMutation = { createBurger?: { ok?: boolean, burger?: { id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } } } };

export type CreateBurgerRekeningMutationVariables = Exact<{
  burgerId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateBurgerRekeningMutation = { createBurgerRekening?: { ok?: boolean, rekening?: { id?: number, iban?: string, rekeninghouder?: string } } };

export type CreateConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type CreateConfiguratieMutation = { createConfiguratie?: { ok?: boolean, configuratie?: { id?: string, waarde?: string } } };

export type CreateCustomerStatementMessageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type CreateCustomerStatementMessageMutation = { createCustomerStatementMessage?: { ok?: boolean, customerStatementMessage?: Array<{ id?: number, filename?: string, uploadDate?: any, accountIdentification?: string, closingAvailableFunds?: number, closingBalance?: number, forwardAvailableBalance?: number, openingBalance?: number, relatedReference?: string, sequenceNumber?: string, transactionReferenceNumber?: string }> } };

export type CreateExportOverschrijvingenMutationVariables = Exact<{
  startDatum: Scalars['String'];
  eindDatum: Scalars['String'];
}>;


export type CreateExportOverschrijvingenMutation = { createExportOverschrijvingen?: { ok?: boolean, export?: { id?: number } } };

export type CreateHuishoudenMutationVariables = Exact<{
  burgerIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>>;
}>;


export type CreateHuishoudenMutation = { createHuishouden?: { ok?: boolean, huishouden?: { id?: number, burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }> } } };

export type CreateJournaalpostAfspraakMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  afspraakId: Scalars['Int'];
  isAutomatischGeboekt?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateJournaalpostAfspraakMutation = { createJournaalpostAfspraak?: { ok?: boolean, journaalpost?: { id?: number } } };

export type CreateJournaalpostGrootboekrekeningMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
}>;


export type CreateJournaalpostGrootboekrekeningMutation = { createJournaalpostGrootboekrekening?: { ok?: boolean, journaalpost?: { id?: number } } };

export type CreateOrganisatieMutationVariables = Exact<{
  kvknummer: Scalars['String'];
  vestigingsnummer: Scalars['String'];
  naam?: InputMaybe<Scalars['String']>;
}>;


export type CreateOrganisatieMutation = { createOrganisatie?: { ok?: boolean, organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> } } };

export type CreateAfdelingRekeningMutationVariables = Exact<{
  afdelingId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateAfdelingRekeningMutation = { createAfdelingRekening?: { ok?: boolean, rekening?: { id?: number, iban?: string, rekeninghouder?: string } } };

export type CreateAfdelingPostadresMutationVariables = Exact<{
  afdelingId: Scalars['Int'];
  huisnummer: Scalars['String'];
  plaatsnaam: Scalars['String'];
  postcode: Scalars['String'];
  straatnaam: Scalars['String'];
}>;


export type CreateAfdelingPostadresMutation = { createPostadres?: { ok?: boolean, postadres?: { id?: string } } };

export type CreateRubriekMutationVariables = Exact<{
  naam?: InputMaybe<Scalars['String']>;
  grootboekrekening?: InputMaybe<Scalars['String']>;
}>;


export type CreateRubriekMutation = { createRubriek?: { ok?: boolean, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } } } };

export type DeleteOrganisatieMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteOrganisatieMutation = { deleteOrganisatie?: { ok?: boolean } };

export type DeleteAfdelingMutationVariables = Exact<{
  afdelingId: Scalars['Int'];
}>;


export type DeleteAfdelingMutation = { deleteAfdeling?: { ok?: boolean } };

export type DeleteAfdelingPostadresMutationVariables = Exact<{
  id: Scalars['String'];
  afdelingId: Scalars['Int'];
}>;


export type DeleteAfdelingPostadresMutation = { deletePostadres?: { ok?: boolean } };

export type DeleteAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteAfspraakMutation = { deleteAfspraak?: { ok?: boolean } };

export type DeleteAfspraakZoektermMutationVariables = Exact<{
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
}>;


export type DeleteAfspraakZoektermMutation = { deleteAfspraakZoekterm?: { ok?: boolean, matchingAfspraken?: Array<{ id?: number, zoektermen?: Array<string>, bedrag?: any, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { rekeninghouder?: string, iban?: string } }> } };

export type DeleteBurgerMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteBurgerMutation = { deleteBurger?: { ok?: boolean } };

export type DeleteBurgerRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  burgerId: Scalars['Int'];
}>;


export type DeleteBurgerRekeningMutation = { deleteBurgerRekening?: { ok?: boolean } };

export type DeleteConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
}>;


export type DeleteConfiguratieMutation = { deleteConfiguratie?: { ok?: boolean } };

export type DeleteCustomerStatementMessageMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCustomerStatementMessageMutation = { deleteCustomerStatementMessage?: { ok?: boolean } };

export type DeleteHuishoudenBurgerMutationVariables = Exact<{
  huishoudenId: Scalars['Int'];
  burgerIds: Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>;
}>;


export type DeleteHuishoudenBurgerMutation = { deleteHuishoudenBurger?: { ok?: boolean } };

export type DeleteJournaalpostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteJournaalpostMutation = { deleteJournaalpost?: { ok?: boolean } };

export type DeleteAfdelingRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  afdelingId: Scalars['Int'];
}>;


export type DeleteAfdelingRekeningMutation = { deleteAfdelingRekening?: { ok?: boolean } };

export type EndAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  validThrough: Scalars['String'];
}>;


export type EndAfspraakMutation = { updateAfspraak?: { ok?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } } };

export type StartAutomatischBoekenMutationVariables = Exact<{ [key: string]: never; }>;


export type StartAutomatischBoekenMutation = { startAutomatischBoeken?: { ok?: boolean, journaalposten?: Array<{ id?: number }> } };

export type UpdateAfdelingMutationVariables = Exact<{
  id: Scalars['Int'];
  naam?: InputMaybe<Scalars['String']>;
  organisatieId?: InputMaybe<Scalars['Int']>;
}>;


export type UpdateAfdelingMutation = { updateAfdeling?: { ok?: boolean, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> } } };

export type UpdateAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateAfspraakInput;
}>;


export type UpdateAfspraakMutation = { updateAfspraak?: { ok?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } } };

export type UpdateAfspraakBetaalinstructieMutationVariables = Exact<{
  id: Scalars['Int'];
  betaalinstructie: BetaalinstructieInput;
}>;


export type UpdateAfspraakBetaalinstructieMutation = { updateAfspraakBetaalinstructie?: { ok?: boolean } };

export type UpdateBurgerMutationVariables = Exact<{
  id: Scalars['Int'];
  bsn?: InputMaybe<Scalars['Int']>;
  voorletters?: InputMaybe<Scalars['String']>;
  voornamen?: InputMaybe<Scalars['String']>;
  achternaam?: InputMaybe<Scalars['String']>;
  geboortedatum?: InputMaybe<Scalars['String']>;
  straatnaam?: InputMaybe<Scalars['String']>;
  huisnummer?: InputMaybe<Scalars['String']>;
  postcode?: InputMaybe<Scalars['String']>;
  plaatsnaam?: InputMaybe<Scalars['String']>;
  telefoonnummer?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
}>;


export type UpdateBurgerMutation = { updateBurger?: { ok?: boolean, burger?: { id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } } } };

export type UpdateConfiguratieMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type UpdateConfiguratieMutation = { updateConfiguratie?: { ok?: boolean, configuratie?: { id?: string, waarde?: string } } };

export type UpdateJournaalpostGrootboekrekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
}>;


export type UpdateJournaalpostGrootboekrekeningMutation = { updateJournaalpostGrootboekrekening?: { ok?: boolean } };

export type UpdateOrganisatieMutationVariables = Exact<{
  id: Scalars['Int'];
  kvknummer?: InputMaybe<Scalars['String']>;
  vestigingsnummer?: InputMaybe<Scalars['String']>;
  naam?: InputMaybe<Scalars['String']>;
}>;


export type UpdateOrganisatieMutation = { updateOrganisatie?: { ok?: boolean, organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> } } };

export type UpdatePostadresMutationVariables = Exact<{
  id: Scalars['String'];
  straatnaam?: InputMaybe<Scalars['String']>;
  huisnummer?: InputMaybe<Scalars['String']>;
  postcode?: InputMaybe<Scalars['String']>;
  plaatsnaam?: InputMaybe<Scalars['String']>;
}>;


export type UpdatePostadresMutation = { updatePostadres?: { ok?: boolean } };

export type UpdateRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  iban?: InputMaybe<Scalars['String']>;
  rekeninghouder?: InputMaybe<Scalars['String']>;
}>;


export type UpdateRekeningMutation = { updateRekening?: { ok?: boolean } };

export type GetAfspraakFormDataQueryVariables = Exact<{
  afspraakId: Scalars['Int'];
}>;


export type GetAfspraakFormDataQuery = { afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, rubrieken?: Array<{ id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }>, organisaties?: Array<{ id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }> };

export type GetAfsprakenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAfsprakenQuery = { afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }> };

export type GetBurgerQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerQuery = { burger?: { id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } } };

export type GetSimpleBurgerQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetSimpleBurgerQuery = { burger?: { id?: number, bsn?: number, voorletters?: string, achternaam?: string } };

export type GetBurgerAfsprakenQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerAfsprakenQuery = { burger?: { afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }> } };

export type GetBurgerGebeurtenissenQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetBurgerGebeurtenissenQuery = { gebruikersactiviteitenPaged?: { gebruikersactiviteiten?: Array<{ id?: number, timestamp?: any, gebruikerId?: string, action?: string, entities?: Array<{ entityType?: string, entityId?: string, huishouden?: { id?: number, burgers?: Array<{ id?: number, voorletters?: string, voornamen?: string, achternaam?: string }> }, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string }, organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, rekening?: { id?: number, iban?: string, rekeninghouder?: string }, customerStatementMessage?: { id?: number, filename?: string, bankTransactions?: Array<{ id?: number }> }, configuratie?: { id?: string, waarde?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { naam?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, naam?: string } }, postadres?: { id?: string } }>, meta?: { userAgent?: string, ip?: Array<string>, applicationVersion?: string } }>, pageInfo?: { count?: number } } };

export type GetBurgersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBurgersQuery = { burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }> };

export type GetBurgersSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['DynamicType']>;
}>;


export type GetBurgersSearchQuery = { burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }> };

export type GetConfiguratieQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConfiguratieQuery = { configuraties?: Array<{ id?: string, waarde?: string }> };

export type GetCreateAfspraakFormDataQueryVariables = Exact<{
  burgerId: Scalars['Int'];
}>;


export type GetCreateAfspraakFormDataQuery = { burger?: { rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, rubrieken?: Array<{ id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }>, organisaties?: Array<{ id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }> };

export type GetCsmsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCsmsQuery = { customerStatementMessages?: Array<{ id?: number, filename?: string, uploadDate?: any, accountIdentification?: string, closingAvailableFunds?: number, closingBalance?: number, forwardAvailableBalance?: number, openingBalance?: number, relatedReference?: string, sequenceNumber?: string, transactionReferenceNumber?: string }> };

export type GetExportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExportsQuery = { exports?: Array<{ id?: number, naam?: string, timestamp?: any, startDatum?: string, eindDatum?: string, sha256?: string, overschrijvingen?: Array<{ id?: number }> }> };

export type GetGebeurtenissenQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetGebeurtenissenQuery = { gebruikersactiviteitenPaged?: { gebruikersactiviteiten?: Array<{ id?: number, timestamp?: any, gebruikerId?: string, action?: string, entities?: Array<{ entityType?: string, entityId?: string, huishouden?: { id?: number, burgers?: Array<{ id?: number, voorletters?: string, voornamen?: string, achternaam?: string }> }, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string }, organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, rekening?: { id?: number, iban?: string, rekeninghouder?: string }, customerStatementMessage?: { id?: number, filename?: string, bankTransactions?: Array<{ id?: number }> }, configuratie?: { id?: string, waarde?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { naam?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, naam?: string } }, postadres?: { id?: string } }>, meta?: { userAgent?: string, ip?: Array<string>, applicationVersion?: string } }>, pageInfo?: { count?: number } } };

export type GetGebruikerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGebruikerQuery = { gebruiker?: { email?: string } };

export type GetHuishoudenQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetHuishoudenQuery = { huishouden?: { id?: number, burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }> } };

export type GetHuishoudensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHuishoudensQuery = { huishoudens?: Array<{ id?: number, burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }> }> };

export type GetAfspraakQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetAfspraakQuery = { afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } };

export type GetOrganisatieQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetOrganisatieQuery = { organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> } };

export type GetOrganisatiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganisatiesQuery = { organisaties?: Array<{ id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }> };

export type GetRekeningQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetRekeningQuery = { rekening?: { id?: number, iban?: string, rekeninghouder?: string } };

export type GetReportingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReportingDataQuery = { burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }>, bankTransactions?: Array<{ id?: number, informationToAccountOwner?: string, statementLine?: string, bedrag?: any, isCredit?: boolean, tegenRekeningIban?: string, transactieDatum?: any, journaalpost?: { id?: number, isAutomatischGeboekt?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, tegenRekening?: { iban?: string, rekeninghouder?: string } }>, rubrieken?: Array<{ id?: number, naam?: string }> };

export type GetRubriekenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRubriekenQuery = { rubrieken?: Array<{ id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }> };

export type GetSimpleBurgersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSimpleBurgersQuery = { burgers?: Array<{ id?: number, bsn?: number, voorletters?: string, achternaam?: string }> };

export type GetTransactionItemFormDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTransactionItemFormDataQuery = { rubrieken?: Array<{ id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }> };

export type GetTransactiesQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  filters?: InputMaybe<BankTransactionFilter>;
}>;


export type GetTransactiesQuery = { bankTransactionsPaged?: { banktransactions?: Array<{ id?: number, informationToAccountOwner?: string, statementLine?: string, bedrag?: any, isCredit?: boolean, tegenRekeningIban?: string, transactieDatum?: any, journaalpost?: { id?: number, isAutomatischGeboekt?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, suggesties?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, tegenRekening?: { iban?: string, rekeninghouder?: string } }>, pageInfo?: { count?: number, limit?: number, start?: number } } };

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
  postadres {
    ...Postadres
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
${PostadresFragmentDoc}
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
    afdeling {
      id
      naam
      organisatie {
        id
        naam
      }
    }
    postadres {
      id
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
export const AddHuishoudenBurgerDocument = gql`
    mutation addHuishoudenBurger($huishoudenId: Int!, $burgerIds: [Int]!) {
  addHuishoudenBurger(huishoudenId: $huishoudenId, burgerIds: $burgerIds) {
    ok
  }
}
    `;
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
export const DeleteAfdelingDocument = gql`
    mutation deleteAfdeling($afdelingId: Int!) {
  deleteAfdeling(id: $afdelingId) {
    ok
  }
}
    `;
export const DeleteAfdelingPostadresDocument = gql`
    mutation deleteAfdelingPostadres($id: String!, $afdelingId: Int!) {
  deletePostadres(id: $id, afdelingId: $afdelingId) {
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
export const DeleteHuishoudenBurgerDocument = gql`
    mutation deleteHuishoudenBurger($huishoudenId: Int!, $burgerIds: [Int]!) {
  deleteHuishoudenBurger(huishoudenId: $huishoudenId, burgerIds: $burgerIds) {
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
export const DeleteAfdelingRekeningDocument = gql`
    mutation deleteAfdelingRekening($id: Int!, $afdelingId: Int!) {
  deleteAfdelingRekening(afdelingId: $afdelingId, rekeningId: $id) {
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
export const UpdateAfdelingDocument = gql`
    mutation updateAfdeling($id: Int!, $naam: String, $organisatieId: Int) {
  updateAfdeling(id: $id, naam: $naam, organisatieId: $organisatieId) {
    ok
    afdeling {
      ...Afdeling
    }
  }
}
    ${AfdelingFragmentDoc}`;
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
export const GetBurgerDocument = gql`
    query getBurger($id: Int!) {
  burger(id: $id) {
    ...Burger
  }
}
    ${BurgerFragmentDoc}`;
export const GetSimpleBurgerDocument = gql`
    query getSimpleBurger($id: Int!) {
  burger(id: $id) {
    id
    bsn
    voorletters
    achternaam
  }
}
    `;
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
export const GetBurgersDocument = gql`
    query getBurgers {
  burgers {
    ...Burger
  }
}
    ${BurgerFragmentDoc}`;
export const GetBurgersSearchDocument = gql`
    query getBurgersSearch($search: DynamicType) {
  burgers(search: $search) {
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
export const GetHuishoudenDocument = gql`
    query getHuishouden($id: Int!) {
  huishouden(id: $id) {
    ...Huishouden
  }
}
    ${HuishoudenFragmentDoc}`;
export const GetHuishoudensDocument = gql`
    query getHuishoudens {
  huishoudens {
    ...Huishouden
  }
}
    ${HuishoudenFragmentDoc}`;
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
export const GetRekeningDocument = gql`
    query getRekening($id: Int!) {
  rekening(id: $id) {
    id
    iban
    rekeninghouder
  }
}
    `;
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
export const GetSimpleBurgersDocument = gql`
    query getSimpleBurgers {
  burgers {
    id
    bsn
    voorletters
    achternaam
  }
}
    `;
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
    addHuishoudenBurger(variables: AddHuishoudenBurgerMutationVariables, options?: C): Promise<AddHuishoudenBurgerMutation> {
      return requester<AddHuishoudenBurgerMutation, AddHuishoudenBurgerMutationVariables>(AddHuishoudenBurgerDocument, variables, options);
    },
    createAfdeling(variables: CreateAfdelingMutationVariables, options?: C): Promise<CreateAfdelingMutation> {
      return requester<CreateAfdelingMutation, CreateAfdelingMutationVariables>(CreateAfdelingDocument, variables, options);
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
    createHuishouden(variables?: CreateHuishoudenMutationVariables, options?: C): Promise<CreateHuishoudenMutation> {
      return requester<CreateHuishoudenMutation, CreateHuishoudenMutationVariables>(CreateHuishoudenDocument, variables, options);
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
    createAfdelingRekening(variables: CreateAfdelingRekeningMutationVariables, options?: C): Promise<CreateAfdelingRekeningMutation> {
      return requester<CreateAfdelingRekeningMutation, CreateAfdelingRekeningMutationVariables>(CreateAfdelingRekeningDocument, variables, options);
    },
    createAfdelingPostadres(variables: CreateAfdelingPostadresMutationVariables, options?: C): Promise<CreateAfdelingPostadresMutation> {
      return requester<CreateAfdelingPostadresMutation, CreateAfdelingPostadresMutationVariables>(CreateAfdelingPostadresDocument, variables, options);
    },
    createRubriek(variables?: CreateRubriekMutationVariables, options?: C): Promise<CreateRubriekMutation> {
      return requester<CreateRubriekMutation, CreateRubriekMutationVariables>(CreateRubriekDocument, variables, options);
    },
    deleteOrganisatie(variables: DeleteOrganisatieMutationVariables, options?: C): Promise<DeleteOrganisatieMutation> {
      return requester<DeleteOrganisatieMutation, DeleteOrganisatieMutationVariables>(DeleteOrganisatieDocument, variables, options);
    },
    deleteAfdeling(variables: DeleteAfdelingMutationVariables, options?: C): Promise<DeleteAfdelingMutation> {
      return requester<DeleteAfdelingMutation, DeleteAfdelingMutationVariables>(DeleteAfdelingDocument, variables, options);
    },
    deleteAfdelingPostadres(variables: DeleteAfdelingPostadresMutationVariables, options?: C): Promise<DeleteAfdelingPostadresMutation> {
      return requester<DeleteAfdelingPostadresMutation, DeleteAfdelingPostadresMutationVariables>(DeleteAfdelingPostadresDocument, variables, options);
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
    deleteHuishoudenBurger(variables: DeleteHuishoudenBurgerMutationVariables, options?: C): Promise<DeleteHuishoudenBurgerMutation> {
      return requester<DeleteHuishoudenBurgerMutation, DeleteHuishoudenBurgerMutationVariables>(DeleteHuishoudenBurgerDocument, variables, options);
    },
    deleteJournaalpost(variables: DeleteJournaalpostMutationVariables, options?: C): Promise<DeleteJournaalpostMutation> {
      return requester<DeleteJournaalpostMutation, DeleteJournaalpostMutationVariables>(DeleteJournaalpostDocument, variables, options);
    },
    deleteAfdelingRekening(variables: DeleteAfdelingRekeningMutationVariables, options?: C): Promise<DeleteAfdelingRekeningMutation> {
      return requester<DeleteAfdelingRekeningMutation, DeleteAfdelingRekeningMutationVariables>(DeleteAfdelingRekeningDocument, variables, options);
    },
    endAfspraak(variables: EndAfspraakMutationVariables, options?: C): Promise<EndAfspraakMutation> {
      return requester<EndAfspraakMutation, EndAfspraakMutationVariables>(EndAfspraakDocument, variables, options);
    },
    startAutomatischBoeken(variables?: StartAutomatischBoekenMutationVariables, options?: C): Promise<StartAutomatischBoekenMutation> {
      return requester<StartAutomatischBoekenMutation, StartAutomatischBoekenMutationVariables>(StartAutomatischBoekenDocument, variables, options);
    },
    updateAfdeling(variables: UpdateAfdelingMutationVariables, options?: C): Promise<UpdateAfdelingMutation> {
      return requester<UpdateAfdelingMutation, UpdateAfdelingMutationVariables>(UpdateAfdelingDocument, variables, options);
    },
    updateAfspraak(variables: UpdateAfspraakMutationVariables, options?: C): Promise<UpdateAfspraakMutation> {
      return requester<UpdateAfspraakMutation, UpdateAfspraakMutationVariables>(UpdateAfspraakDocument, variables, options);
    },
    updateAfspraakBetaalinstructie(variables: UpdateAfspraakBetaalinstructieMutationVariables, options?: C): Promise<UpdateAfspraakBetaalinstructieMutation> {
      return requester<UpdateAfspraakBetaalinstructieMutation, UpdateAfspraakBetaalinstructieMutationVariables>(UpdateAfspraakBetaalinstructieDocument, variables, options);
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
    updatePostadres(variables: UpdatePostadresMutationVariables, options?: C): Promise<UpdatePostadresMutation> {
      return requester<UpdatePostadresMutation, UpdatePostadresMutationVariables>(UpdatePostadresDocument, variables, options);
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
    getBurger(variables: GetBurgerQueryVariables, options?: C): Promise<GetBurgerQuery> {
      return requester<GetBurgerQuery, GetBurgerQueryVariables>(GetBurgerDocument, variables, options);
    },
    getSimpleBurger(variables: GetSimpleBurgerQueryVariables, options?: C): Promise<GetSimpleBurgerQuery> {
      return requester<GetSimpleBurgerQuery, GetSimpleBurgerQueryVariables>(GetSimpleBurgerDocument, variables, options);
    },
    getBurgerAfspraken(variables: GetBurgerAfsprakenQueryVariables, options?: C): Promise<GetBurgerAfsprakenQuery> {
      return requester<GetBurgerAfsprakenQuery, GetBurgerAfsprakenQueryVariables>(GetBurgerAfsprakenDocument, variables, options);
    },
    GetBurgerGebeurtenissen(variables: GetBurgerGebeurtenissenQueryVariables, options?: C): Promise<GetBurgerGebeurtenissenQuery> {
      return requester<GetBurgerGebeurtenissenQuery, GetBurgerGebeurtenissenQueryVariables>(GetBurgerGebeurtenissenDocument, variables, options);
    },
    getBurgers(variables?: GetBurgersQueryVariables, options?: C): Promise<GetBurgersQuery> {
      return requester<GetBurgersQuery, GetBurgersQueryVariables>(GetBurgersDocument, variables, options);
    },
    getBurgersSearch(variables?: GetBurgersSearchQueryVariables, options?: C): Promise<GetBurgersSearchQuery> {
      return requester<GetBurgersSearchQuery, GetBurgersSearchQueryVariables>(GetBurgersSearchDocument, variables, options);
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
    getHuishouden(variables: GetHuishoudenQueryVariables, options?: C): Promise<GetHuishoudenQuery> {
      return requester<GetHuishoudenQuery, GetHuishoudenQueryVariables>(GetHuishoudenDocument, variables, options);
    },
    getHuishoudens(variables?: GetHuishoudensQueryVariables, options?: C): Promise<GetHuishoudensQuery> {
      return requester<GetHuishoudensQuery, GetHuishoudensQueryVariables>(GetHuishoudensDocument, variables, options);
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
    getRekening(variables: GetRekeningQueryVariables, options?: C): Promise<GetRekeningQuery> {
      return requester<GetRekeningQuery, GetRekeningQueryVariables>(GetRekeningDocument, variables, options);
    },
    getReportingData(variables?: GetReportingDataQueryVariables, options?: C): Promise<GetReportingDataQuery> {
      return requester<GetReportingDataQuery, GetReportingDataQueryVariables>(GetReportingDataDocument, variables, options);
    },
    getRubrieken(variables?: GetRubriekenQueryVariables, options?: C): Promise<GetRubriekenQuery> {
      return requester<GetRubriekenQuery, GetRubriekenQueryVariables>(GetRubriekenDocument, variables, options);
    },
    getSimpleBurgers(variables?: GetSimpleBurgersQueryVariables, options?: C): Promise<GetSimpleBurgersQuery> {
      return requester<GetSimpleBurgersQuery, GetSimpleBurgersQueryVariables>(GetSimpleBurgersDocument, variables, options);
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