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
  alarm?: Maybe<Alarm>;
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

/** Model om vast te stellen op basis van welke regels een signaal aangemaakt moet worden  */
export type Alarm = {
  afspraak?: Maybe<Afspraak>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  bedragMargin?: Maybe<Scalars['Bedrag']>;
  byDay?: Maybe<Array<Maybe<DayOfWeek>>>;
  byMonth?: Maybe<Array<Maybe<Scalars['Int']>>>;
  byMonthDay?: Maybe<Array<Maybe<Scalars['Int']>>>;
  datumMargin?: Maybe<Scalars['Int']>;
  endDate?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  signaal?: Maybe<Signaal>;
  startDate?: Maybe<Scalars['String']>;
};

export type AlarmTriggerResult = {
  alarm?: Maybe<Alarm>;
  nextAlarm?: Maybe<Alarm>;
  signaal?: Maybe<Signaal>;
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
  geboortedatum?: Maybe<Scalars['Date']>;
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
  alarmId?: InputMaybe<Scalars['String']>;
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

export type CreateAlarm = {
  alarm?: Maybe<Alarm>;
  burgerId?: Maybe<Scalars['String']>;
  ok?: Maybe<Scalars['Boolean']>;
};

export type CreateAlarmInput = {
  afspraakId?: InputMaybe<Scalars['Int']>;
  bedrag?: InputMaybe<Scalars['Bedrag']>;
  bedragMargin?: InputMaybe<Scalars['Bedrag']>;
  byDay?: InputMaybe<Array<InputMaybe<DayOfWeek>>>;
  byMonth?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  byMonthDay?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  datumMargin?: InputMaybe<Scalars['Int']>;
  endDate?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['String']>;
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

export type CreateJournaalpostAfspraak = {
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
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

export type CreateSignaal = {
  ok?: Maybe<Scalars['Boolean']>;
  signaal?: Maybe<Signaal>;
};

export type CreateSignaalInput = {
  actions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alarmId?: InputMaybe<Scalars['String']>;
  banktransactieIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  context?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<Scalars['String']>;
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

/** http://schema.org/DayOfWeek implementation */
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

/** Mutatie om een betaalinstructie bij een afspraak te verwijderen. */
export type DeleteAfspraakBetaalinstructie = {
  afspraak?: Maybe<Afspraak>;
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

export type DeleteAlarm = {
  burgerId?: Maybe<Scalars['String']>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Alarm>;
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

export type DeleteSignaal = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Signaal>;
};

export type EvaluateAlarm = {
  alarmTriggerResult?: Maybe<Array<Maybe<AlarmTriggerResult>>>;
};

export type EvaluateAlarms = {
  alarmTriggerResult?: Maybe<Array<Maybe<AlarmTriggerResult>>>;
};

export type Export = {
  eindDatum?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  overschrijvingen?: Maybe<Array<Maybe<Overschrijving>>>;
  sha256?: Maybe<Scalars['String']>;
  startDatum?: Maybe<Scalars['Date']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  xmldata?: Maybe<Scalars['String']>;
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
  alarm?: Maybe<Alarm>;
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
  signaal?: Maybe<Signaal>;
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
  alarm?: Maybe<Alarm>;
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
  signaal?: Maybe<Signaal>;
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
  datum?: Maybe<Scalars['Date']>;
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
  createAlarm?: Maybe<CreateAlarm>;
  createBurger?: Maybe<CreateBurger>;
  /** Mutatie om een rekening aan een burger toe te voegen. */
  createBurgerRekening?: Maybe<CreateBurgerRekening>;
  createConfiguratie?: Maybe<CreateConfiguratie>;
  createCustomerStatementMessage?: Maybe<CreateCustomerStatementMessage>;
  /** Mutatie om een betaalinstructie te genereren. */
  createExportOverschrijvingen?: Maybe<CreateExportOverschrijvingen>;
  createHuishouden?: Maybe<CreateHuishouden>;
  createJournaalpostAfspraak?: Maybe<CreateJournaalpostAfspraak>;
  /** Mutatie om een banktransactie af te letteren op een grootboekrekening. */
  createJournaalpostGrootboekrekening?: Maybe<CreateJournaalpostGrootboekrekening>;
  createOrganisatie?: Maybe<CreateOrganisatie>;
  createPostadres?: Maybe<CreatePostadres>;
  createRubriek?: Maybe<CreateRubriek>;
  createSignaal?: Maybe<CreateSignaal>;
  /** Mutatie om een afdeling van een organisatie te verwijderen. */
  deleteAfdeling?: Maybe<DeleteAfdeling>;
  /** Mutatie om een rekening van een afdeling te verwijderen. */
  deleteAfdelingRekening?: Maybe<DeleteAfdelingRekening>;
  deleteAfspraak?: Maybe<DeleteAfspraak>;
  /** Mutatie om een betaalinstructie bij een afspraak te verwijderen. */
  deleteAfspraakBetaalinstructie?: Maybe<DeleteAfspraakBetaalinstructie>;
  /** Mutatie om een zoekterm bij een afspraak te verwijderen. */
  deleteAfspraakZoekterm?: Maybe<DeleteAfspraakZoekterm>;
  deleteAlarm?: Maybe<DeleteAlarm>;
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
  deleteSignaal?: Maybe<DeleteSignaal>;
  evaluateAlarm?: Maybe<EvaluateAlarm>;
  evaluateAlarms?: Maybe<EvaluateAlarms>;
  /** Mutatie om niet afgeletterde banktransacties af te letteren. */
  startAutomatischBoeken?: Maybe<StartAutomatischBoeken>;
  updateAfdeling?: Maybe<UpdateAfdeling>;
  updateAfspraak?: Maybe<UpdateAfspraak>;
  /** Mutatie voor het instellen van een nieuwe betaalinstructie voor een afspraak. */
  updateAfspraakBetaalinstructie?: Maybe<UpdateAfspraakBetaalinstructie>;
  updateAlarm?: Maybe<UpdateAlarm>;
  updateBurger?: Maybe<UpdateBurger>;
  updateConfiguratie?: Maybe<UpdateConfiguratie>;
  /** deprecated */
  updateJournaalpostGrootboekrekening?: Maybe<UpdateJournaalpostGrootboekrekening>;
  updateOrganisatie?: Maybe<UpdateOrganisatie>;
  updatePostadres?: Maybe<UpdatePostadres>;
  updateRekening?: Maybe<UpdateRekening>;
  updateRubriek?: Maybe<UpdateRubriek>;
  updateSignaal?: Maybe<UpdateSignaal>;
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
export type RootMutationCreateAlarmArgs = {
  input: CreateAlarmInput;
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
  input: Array<InputMaybe<CreateJournaalpostAfspraakInput>>;
};


/** The root of all mutations  */
export type RootMutationCreateJournaalpostGrootboekrekeningArgs = {
  input?: InputMaybe<CreateJournaalpostGrootboekrekeningInput>;
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
export type RootMutationCreateSignaalArgs = {
  input: CreateSignaalInput;
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
export type RootMutationDeleteAfspraakBetaalinstructieArgs = {
  afspraakId: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationDeleteAfspraakZoektermArgs = {
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
};


/** The root of all mutations  */
export type RootMutationDeleteAlarmArgs = {
  id: Scalars['String'];
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
export type RootMutationDeleteSignaalArgs = {
  id: Scalars['String'];
};


/** The root of all mutations  */
export type RootMutationEvaluateAlarmArgs = {
  id: Scalars['String'];
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
export type RootMutationUpdateAlarmArgs = {
  id: Scalars['String'];
  input: UpdateAlarmInput;
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


/** The root of all mutations  */
export type RootMutationUpdateSignaalArgs = {
  id: Scalars['String'];
  input: UpdateSignaalInput;
};

/** The root of all queries  */
export type RootQuery = {
  afdeling?: Maybe<Afdeling>;
  afdelingen?: Maybe<Array<Maybe<Afdeling>>>;
  afspraak?: Maybe<Afspraak>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  alarm?: Maybe<Alarm>;
  alarmen?: Maybe<Array<Maybe<Alarm>>>;
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
  saldo?: Maybe<Saldo>;
  signaal?: Maybe<Signaal>;
  signalen?: Maybe<Array<Maybe<Signaal>>>;
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
export type RootQueryAlarmArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQueryAlarmenArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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


/** The root of all queries  */
export type RootQuerySaldoArgs = {
  burgerIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQuerySignaalArgs = {
  id: Scalars['String'];
};


/** The root of all queries  */
export type RootQuerySignalenArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Rubriek = {
  grootboekrekening?: Maybe<Grootboekrekening>;
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
};

export type Saldo = {
  bedrag?: Maybe<Scalars['Bedrag']>;
};

export type Signaal = {
  actions?: Maybe<Array<Maybe<Scalars['String']>>>;
  alarm?: Maybe<Alarm>;
  bankTransactions?: Maybe<Array<Maybe<BankTransaction>>>;
  bedragDifference?: Maybe<Scalars['String']>;
  context?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  timeUpdated?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
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
  alarmId?: InputMaybe<Scalars['String']>;
  bedrag?: InputMaybe<Scalars['Bedrag']>;
  burgerId?: InputMaybe<Scalars['Int']>;
  credit?: InputMaybe<Scalars['Boolean']>;
  omschrijving?: InputMaybe<Scalars['String']>;
  postadresId?: InputMaybe<Scalars['String']>;
  rubriekId?: InputMaybe<Scalars['Int']>;
  tegenRekeningId?: InputMaybe<Scalars['Int']>;
  validThrough?: InputMaybe<Scalars['String']>;
};

export type UpdateAlarm = {
  alarm?: Maybe<Alarm>;
  burgerId?: Maybe<Scalars['String']>;
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Alarm>;
};

export type UpdateAlarmInput = {
  afspraakId?: InputMaybe<Scalars['Int']>;
  bedrag?: InputMaybe<Scalars['Bedrag']>;
  bedragMargin?: InputMaybe<Scalars['Bedrag']>;
  byDay?: InputMaybe<Array<InputMaybe<DayOfWeek>>>;
  byMonth?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  byMonthDay?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  datumMargin?: InputMaybe<Scalars['Int']>;
  endDate?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['String']>;
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

export type UpdateSignaal = {
  ok?: Maybe<Scalars['Boolean']>;
  previous?: Maybe<Signaal>;
  signaal?: Maybe<Signaal>;
};

export type UpdateSignaalInput = {
  actions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alarmId?: InputMaybe<Scalars['String']>;
  banktransactieIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  context?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<Scalars['String']>;
};

export type AfdelingFragment = { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> };

export type AfspraakFragment = { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> };

export type AlarmFragment = { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } };

export type BetaalinstructieFragment = { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string };

export type BurgerFragment = { id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: any, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } };

export type CustomerStatementMessageFragment = { id?: number, filename?: string, uploadDate?: any, accountIdentification?: string, closingAvailableFunds?: number, closingBalance?: number, forwardAvailableBalance?: number, openingBalance?: number, relatedReference?: string, sequenceNumber?: string, transactionReferenceNumber?: string };

export type ExportFragment = { id?: number, naam?: string, timestamp?: any, startDatum?: any, eindDatum?: any, sha256?: string, overschrijvingen?: Array<{ id?: number }> };

export type GebruikersactiviteitFragment = { id?: number, timestamp?: any, gebruikerId?: string, action?: string, entities?: Array<{ entityType?: string, entityId?: string, huishouden?: { id?: number, burgers?: Array<{ id?: number, voorletters?: string, voornamen?: string, achternaam?: string }> }, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string }, organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string, bsn?: number, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, rekening?: { id?: number, iban?: string, rekeninghouder?: string }, customerStatementMessage?: { id?: number, filename?: string, bankTransactions?: Array<{ id?: number }> }, configuratie?: { id?: string, waarde?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { naam?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, naam?: string } }, postadres?: { id?: string }, export?: { id?: number, naam?: string } }>, meta?: { userAgent?: string, ip?: Array<string>, applicationVersion?: string } };

export type GrootboekrekeningFragment = { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } };

export type HuishoudenFragment = { id?: number, burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: any, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }> };

export type JournaalpostFragment = { id?: number };

export type OrganisatieFragment = { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> };

export type PostadresFragment = { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string };

export type RekeningFragment = { id?: number, iban?: string, rekeninghouder?: string };

export type RubriekFragment = { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } };

export type SignaalFragment = { id?: string, isActive?: boolean, type?: string, actions?: Array<string>, bedragDifference?: string, timeUpdated?: string, alarm?: { id?: string, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } }, bankTransactions?: Array<{ id?: number, bedrag?: any, isCredit?: boolean }> };

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


export type CreateAfspraakMutation = { createAfspraak?: { ok?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } } };

export type CreateAlarmMutationVariables = Exact<{
  input: CreateAlarmInput;
}>;


export type CreateAlarmMutation = { createAlarm?: { ok?: boolean, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } } } };

export type CreateBurgerMutationVariables = Exact<{
  input?: InputMaybe<CreateBurgerInput>;
}>;


export type CreateBurgerMutation = { createBurger?: { ok?: boolean, burger?: { id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: any, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } } } };

export type CreateBurgerRekeningMutationVariables = Exact<{
  burgerId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateBurgerRekeningMutation = { createBurgerRekening?: { ok?: boolean, rekening?: { id?: number, iban?: string, rekeninghouder?: string } } };

export type CreateConfiguratieMutationVariables = Exact<{
  id: Scalars['String'];
  waarde: Scalars['String'];
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


export type CreateHuishoudenMutation = { createHuishouden?: { ok?: boolean, huishouden?: { id?: number, burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: any, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }> } } };

export type CreateJournaalpostAfspraakMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  afspraakId: Scalars['Int'];
  isAutomatischGeboekt?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateJournaalpostAfspraakMutation = { createJournaalpostAfspraak?: { ok?: boolean, journaalposten?: Array<{ id?: number, afspraak?: { id?: number, alarm?: { id?: string } } }> } };

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

export type DeleteAfspraakBetaalinstructieMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteAfspraakBetaalinstructieMutation = { deleteAfspraakBetaalinstructie?: { ok?: boolean } };

export type DeleteAfspraakZoektermMutationVariables = Exact<{
  afspraakId: Scalars['Int'];
  zoekterm: Scalars['String'];
}>;


export type DeleteAfspraakZoektermMutation = { deleteAfspraakZoekterm?: { ok?: boolean, matchingAfspraken?: Array<{ id?: number, zoektermen?: Array<string>, bedrag?: any, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { rekeninghouder?: string, iban?: string } }> } };

export type DeleteAlarmMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteAlarmMutation = { deleteAlarm?: { ok?: boolean } };

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

export type DeleteRubriekMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteRubriekMutation = { deleteRubriek?: { ok?: boolean } };

export type EndAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  validThrough: Scalars['String'];
}>;


export type EndAfspraakMutation = { updateAfspraak?: { ok?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } } };

export type EvaluateAlarmMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type EvaluateAlarmMutation = { evaluateAlarm?: { alarmTriggerResult?: Array<{ alarm?: { id?: string } }> } };

export type EvaluateAlarmsMutationVariables = Exact<{ [key: string]: never; }>;


export type EvaluateAlarmsMutation = { evaluateAlarms?: { alarmTriggerResult?: Array<{ alarm?: { id?: string } }> } };

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


export type UpdateAfspraakMutation = { updateAfspraak?: { ok?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } } };

export type UpdateAfspraakBetaalinstructieMutationVariables = Exact<{
  id: Scalars['Int'];
  betaalinstructie: BetaalinstructieInput;
}>;


export type UpdateAfspraakBetaalinstructieMutation = { updateAfspraakBetaalinstructie?: { ok?: boolean } };

export type UpdateAlarmMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateAlarmInput;
}>;


export type UpdateAlarmMutation = { updateAlarm?: { ok?: boolean, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } } } };

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


export type UpdateBurgerMutation = { updateBurger?: { ok?: boolean, burger?: { id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: any, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } } } };

export type UpdateConfiguratieMutationVariables = Exact<{
  id: Scalars['String'];
  waarde: Scalars['String'];
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

export type UpdateRubriekMutationVariables = Exact<{
  id: Scalars['Int'];
  naam: Scalars['String'];
  grootboekrekeningId: Scalars['String'];
}>;


export type UpdateRubriekMutation = { updateRubriek?: { ok?: boolean } };

export type UpdateSignaalMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateSignaalInput;
}>;


export type UpdateSignaalMutation = { updateSignaal?: { ok?: boolean, signaal?: { id?: string, isActive?: boolean, type?: string, actions?: Array<string>, bedragDifference?: string, timeUpdated?: string, alarm?: { id?: string, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } }, bankTransactions?: Array<{ id?: number, bedrag?: any, isCredit?: boolean }> } } };

export type GetAfdelingQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetAfdelingQuery = { afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> } };

export type GetAfspraakQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetAfspraakQuery = { afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } };

export type GetAfspraakFormDataQueryVariables = Exact<{
  afspraakId: Scalars['Int'];
}>;


export type GetAfspraakFormDataQuery = { afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, rubrieken?: Array<{ id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }>, organisaties?: Array<{ id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }> };

export type GetAfsprakenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAfsprakenQuery = { afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }> };

export type GetAlarmQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetAlarmQuery = { alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } } };

export type GetAlarmenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAlarmenQuery = { alarmen?: Array<{ id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }> };

export type GetBurgerQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerQuery = { burger?: { id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: any, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } } };

export type GetBurgerAfsprakenQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetBurgerAfsprakenQuery = { burger?: { afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }> } };

export type GetBurgerGebeurtenissenQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetBurgerGebeurtenissenQuery = { gebruikersactiviteitenPaged?: { gebruikersactiviteiten?: Array<{ id?: number, timestamp?: any, gebruikerId?: string, action?: string, entities?: Array<{ entityType?: string, entityId?: string, huishouden?: { id?: number, burgers?: Array<{ id?: number, voorletters?: string, voornamen?: string, achternaam?: string }> }, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string }, organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string, bsn?: number, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, rekening?: { id?: number, iban?: string, rekeninghouder?: string }, customerStatementMessage?: { id?: number, filename?: string, bankTransactions?: Array<{ id?: number }> }, configuratie?: { id?: string, waarde?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { naam?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, naam?: string } }, postadres?: { id?: string }, export?: { id?: number, naam?: string } }>, meta?: { userAgent?: string, ip?: Array<string>, applicationVersion?: string } }>, pageInfo?: { count?: number } } };

export type GetBurgersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBurgersQuery = { burgers?: Array<{ id?: number, voornamen?: string, achternaam?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }> };

export type GetBurgersSearchQueryVariables = Exact<{
  search?: InputMaybe<Scalars['DynamicType']>;
}>;


export type GetBurgersSearchQuery = { burgers?: Array<{ id?: number, voornamen?: string, achternaam?: string }> };

export type GetConfiguratieQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConfiguratieQuery = { configuraties?: Array<{ id?: string, waarde?: string }> };

export type GetCreateAfspraakFormDataQueryVariables = Exact<{
  burgerId: Scalars['Int'];
}>;


export type GetCreateAfspraakFormDataQuery = { burger?: { rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, rubrieken?: Array<{ id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }>, organisaties?: Array<{ id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }> };

export type GetCsmsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCsmsQuery = { customerStatementMessages?: Array<{ id?: number, filename?: string, uploadDate?: any, accountIdentification?: string, closingAvailableFunds?: number, closingBalance?: number, forwardAvailableBalance?: number, openingBalance?: number, relatedReference?: string, sequenceNumber?: string, transactionReferenceNumber?: string }> };

export type GetExportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExportsQuery = { exports?: Array<{ id?: number, naam?: string, timestamp?: any, startDatum?: any, eindDatum?: any, sha256?: string, overschrijvingen?: Array<{ id?: number }> }> };

export type GetGebeurtenissenQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetGebeurtenissenQuery = { gebruikersactiviteitenPaged?: { gebruikersactiviteiten?: Array<{ id?: number, timestamp?: any, gebruikerId?: string, action?: string, entities?: Array<{ entityType?: string, entityId?: string, huishouden?: { id?: number, burgers?: Array<{ id?: number, voorletters?: string, voornamen?: string, achternaam?: string }> }, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string }, organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, burger?: { id?: number, voorletters?: string, voornamen?: string, achternaam?: string, bsn?: number, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, rekening?: { id?: number, iban?: string, rekeninghouder?: string }, customerStatementMessage?: { id?: number, filename?: string, bankTransactions?: Array<{ id?: number }> }, configuratie?: { id?: string, waarde?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { naam?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, naam?: string } }, postadres?: { id?: string }, export?: { id?: number, naam?: string } }>, meta?: { userAgent?: string, ip?: Array<string>, applicationVersion?: string } }>, pageInfo?: { count?: number } } };

export type GetHuishoudenQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetHuishoudenQuery = { huishouden?: { id?: number, burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: any, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }> } };

export type GetHuishoudensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHuishoudensQuery = { huishoudens?: Array<{ id?: number, burgers?: Array<{ id?: number, voorletters?: string, voornamen?: string, achternaam?: string }> }> };

export type GetOrganisatieQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetOrganisatieQuery = { organisatie?: { id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> } };

export type GetOrganisatiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganisatiesQuery = { organisaties?: Array<{ id?: number, naam?: string, kvknummer?: string, vestigingsnummer?: string, afdelingen?: Array<{ id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }> }> };

export type GetSimpleOrganisatiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSimpleOrganisatiesQuery = { organisaties?: Array<{ id?: number, naam?: string }> };

export type GetRekeningQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetRekeningQuery = { rekening?: { id?: number, iban?: string, rekeninghouder?: string } };

export type GetReportingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReportingDataQuery = { burgers?: Array<{ id?: number, bsn?: number, email?: string, telefoonnummer?: string, voorletters?: string, voornamen?: string, achternaam?: string, geboortedatum?: any, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, huishouden?: { id?: number, burgers?: Array<{ id?: number }> } }>, bankTransactions?: Array<{ id?: number, informationToAccountOwner?: string, statementLine?: string, bedrag?: any, isCredit?: boolean, tegenRekeningIban?: string, transactieDatum?: any, journaalpost?: { id?: number, isAutomatischGeboekt?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, tegenRekening?: { iban?: string, rekeninghouder?: string } }>, rubrieken?: Array<{ id?: number, naam?: string }> };

export type GetRubriekenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRubriekenQuery = { rubrieken?: Array<{ id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }> };

export type GetRubriekenConfiguratieQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRubriekenConfiguratieQuery = { rubrieken?: Array<{ id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, omschrijving?: string } }>, grootboekrekeningen?: Array<{ id: string, naam?: string, omschrijving?: string }> };

export type GetSignalenAndBurgersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSignalenAndBurgersQuery = { signalen?: Array<{ id?: string, isActive?: boolean, type?: string, actions?: Array<string>, bedragDifference?: string, timeUpdated?: string, alarm?: { id?: string, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } }, bankTransactions?: Array<{ id?: number, bedrag?: any, isCredit?: boolean }> }>, burgers?: Array<{ id?: number, voorletters?: string, voornamen?: string, achternaam?: string }> };

export type GetSignalenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSignalenQuery = { signalen?: Array<{ id?: string, isActive?: boolean, type?: string, actions?: Array<string>, bedragDifference?: string, timeUpdated?: string, alarm?: { id?: string, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> } }, bankTransactions?: Array<{ id?: number, bedrag?: any, isCredit?: boolean }> }> };

export type GetSimpleBurgersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSimpleBurgersQuery = { burgers?: Array<{ id?: number, bsn?: number, voorletters?: string, achternaam?: string }> };

export type GetTransactieQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetTransactieQuery = { bankTransaction?: { id?: number, informationToAccountOwner?: string, statementLine?: string, bedrag?: any, isCredit?: boolean, tegenRekeningIban?: string, transactieDatum?: any, journaalpost?: { id?: number, isAutomatischGeboekt?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, suggesties?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, tegenRekening?: { iban?: string, rekeninghouder?: string } } };

export type GetTransactionItemFormDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTransactionItemFormDataQuery = { rubrieken?: Array<{ id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }>, afspraken?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }> };

export type GetTransactiesQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  filters?: InputMaybe<BankTransactionFilter>;
}>;


export type GetTransactiesQuery = { bankTransactionsPaged?: { banktransactions?: Array<{ id?: number, informationToAccountOwner?: string, statementLine?: string, bedrag?: any, isCredit?: boolean, tegenRekeningIban?: string, transactieDatum?: any, journaalpost?: { id?: number, isAutomatischGeboekt?: boolean, afspraak?: { id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, suggesties?: Array<{ id?: number, omschrijving?: string, bedrag?: any, credit?: boolean, zoektermen?: Array<string>, validFrom?: any, validThrough?: any, betaalinstructie?: { byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, exceptDates?: Array<string>, repeatFrequency?: string, startDate?: string, endDate?: string }, burger?: { id?: number, bsn?: number, voornamen?: string, voorletters?: string, achternaam?: string, plaatsnaam?: string, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, alarm?: { id?: string, isActive?: boolean, bedrag?: any, bedragMargin?: any, startDate?: string, endDate?: string, datumMargin?: number, byDay?: Array<DayOfWeek>, byMonth?: Array<number>, byMonthDay?: Array<number>, afspraak?: { id?: number }, signaal?: { id?: string } }, afdeling?: { id?: number, naam?: string, organisatie?: { id?: number, kvknummer?: string, vestigingsnummer?: string, naam?: string }, postadressen?: Array<{ id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }>, rekeningen?: Array<{ id?: number, iban?: string, rekeninghouder?: string }> }, postadres?: { id?: string, straatnaam?: string, huisnummer?: string, postcode?: string, plaatsnaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string }, rubriek?: { id?: number, naam?: string, grootboekrekening?: { id: string, naam?: string, credit?: boolean, omschrijving?: string, referentie?: string, rubriek?: { id?: number, naam?: string } } }, matchingAfspraken?: Array<{ id?: number, credit?: boolean, zoektermen?: Array<string>, bedrag?: any, omschrijving?: string, burger?: { voorletters?: string, voornamen?: string, achternaam?: string }, tegenRekening?: { id?: number, iban?: string, rekeninghouder?: string } }> }>, tegenRekening?: { iban?: string, rekeninghouder?: string } }>, pageInfo?: { count?: number, limit?: number, start?: number } } };

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
export const AlarmFragmentDoc = gql`
    fragment Alarm on Alarm {
  id
  isActive
  bedrag
  bedragMargin
  startDate
  endDate
  datumMargin
  byDay
  byMonth
  byMonthDay
  afspraak {
    id
  }
  signaal {
    id
  }
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
    bsn
    voornamen
    voorletters
    achternaam
    plaatsnaam
    rekeningen {
      ...Rekening
    }
  }
  alarm {
    ...Alarm
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
${AlarmFragmentDoc}
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
      burger {
        id
        voorletters
        voornamen
        achternaam
      }
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
    export {
      id
      naam
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
export const SignaalFragmentDoc = gql`
    fragment Signaal on Signaal {
  id
  isActive
  type
  actions
  bedragDifference
  timeUpdated
  alarm {
    id
    afspraak {
      ...Afspraak
    }
  }
  bankTransactions {
    id
    bedrag
    isCredit
  }
}
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
export const CreateAlarmDocument = gql`
    mutation createAlarm($input: CreateAlarmInput!) {
  createAlarm(input: $input) {
    ok
    alarm {
      ...Alarm
    }
  }
}
    ${AlarmFragmentDoc}`;
export type CreateAlarmMutationFn = Apollo.MutationFunction<CreateAlarmMutation, CreateAlarmMutationVariables>;

/**
 * __useCreateAlarmMutation__
 *
 * To run a mutation, you first call `useCreateAlarmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAlarmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAlarmMutation, { data, loading, error }] = useCreateAlarmMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAlarmMutation(baseOptions?: Apollo.MutationHookOptions<CreateAlarmMutation, CreateAlarmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAlarmMutation, CreateAlarmMutationVariables>(CreateAlarmDocument, options);
      }
export type CreateAlarmMutationHookResult = ReturnType<typeof useCreateAlarmMutation>;
export type CreateAlarmMutationResult = Apollo.MutationResult<CreateAlarmMutation>;
export type CreateAlarmMutationOptions = Apollo.BaseMutationOptions<CreateAlarmMutation, CreateAlarmMutationVariables>;
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
    mutation createConfiguratie($id: String!, $waarde: String!) {
  createConfiguratie(input: {id: $id, waarde: $waarde}) {
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
 *      id: // value for 'id'
 *      waarde: // value for 'waarde'
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
    input: [{transactionId: $transactionId, afspraakId: $afspraakId, isAutomatischGeboekt: $isAutomatischGeboekt}]
  ) {
    ok
    journaalposten {
      id
      afspraak {
        id
        alarm {
          id
        }
      }
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
export const DeleteAfspraakBetaalinstructieDocument = gql`
    mutation deleteAfspraakBetaalinstructie($id: Int!) {
  deleteAfspraakBetaalinstructie(afspraakId: $id) {
    ok
  }
}
    `;
export type DeleteAfspraakBetaalinstructieMutationFn = Apollo.MutationFunction<DeleteAfspraakBetaalinstructieMutation, DeleteAfspraakBetaalinstructieMutationVariables>;

/**
 * __useDeleteAfspraakBetaalinstructieMutation__
 *
 * To run a mutation, you first call `useDeleteAfspraakBetaalinstructieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAfspraakBetaalinstructieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAfspraakBetaalinstructieMutation, { data, loading, error }] = useDeleteAfspraakBetaalinstructieMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAfspraakBetaalinstructieMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAfspraakBetaalinstructieMutation, DeleteAfspraakBetaalinstructieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAfspraakBetaalinstructieMutation, DeleteAfspraakBetaalinstructieMutationVariables>(DeleteAfspraakBetaalinstructieDocument, options);
      }
export type DeleteAfspraakBetaalinstructieMutationHookResult = ReturnType<typeof useDeleteAfspraakBetaalinstructieMutation>;
export type DeleteAfspraakBetaalinstructieMutationResult = Apollo.MutationResult<DeleteAfspraakBetaalinstructieMutation>;
export type DeleteAfspraakBetaalinstructieMutationOptions = Apollo.BaseMutationOptions<DeleteAfspraakBetaalinstructieMutation, DeleteAfspraakBetaalinstructieMutationVariables>;
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
export const DeleteAlarmDocument = gql`
    mutation deleteAlarm($id: String!) {
  deleteAlarm(id: $id) {
    ok
  }
}
    `;
export type DeleteAlarmMutationFn = Apollo.MutationFunction<DeleteAlarmMutation, DeleteAlarmMutationVariables>;

/**
 * __useDeleteAlarmMutation__
 *
 * To run a mutation, you first call `useDeleteAlarmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAlarmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAlarmMutation, { data, loading, error }] = useDeleteAlarmMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAlarmMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAlarmMutation, DeleteAlarmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAlarmMutation, DeleteAlarmMutationVariables>(DeleteAlarmDocument, options);
      }
export type DeleteAlarmMutationHookResult = ReturnType<typeof useDeleteAlarmMutation>;
export type DeleteAlarmMutationResult = Apollo.MutationResult<DeleteAlarmMutation>;
export type DeleteAlarmMutationOptions = Apollo.BaseMutationOptions<DeleteAlarmMutation, DeleteAlarmMutationVariables>;
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
export const DeleteRubriekDocument = gql`
    mutation deleteRubriek($id: Int!) {
  deleteRubriek(id: $id) {
    ok
  }
}
    `;
export type DeleteRubriekMutationFn = Apollo.MutationFunction<DeleteRubriekMutation, DeleteRubriekMutationVariables>;

/**
 * __useDeleteRubriekMutation__
 *
 * To run a mutation, you first call `useDeleteRubriekMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRubriekMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRubriekMutation, { data, loading, error }] = useDeleteRubriekMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRubriekMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRubriekMutation, DeleteRubriekMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRubriekMutation, DeleteRubriekMutationVariables>(DeleteRubriekDocument, options);
      }
export type DeleteRubriekMutationHookResult = ReturnType<typeof useDeleteRubriekMutation>;
export type DeleteRubriekMutationResult = Apollo.MutationResult<DeleteRubriekMutation>;
export type DeleteRubriekMutationOptions = Apollo.BaseMutationOptions<DeleteRubriekMutation, DeleteRubriekMutationVariables>;
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
export const EvaluateAlarmDocument = gql`
    mutation evaluateAlarm($id: String!) {
  evaluateAlarm(id: $id) {
    alarmTriggerResult {
      alarm {
        id
      }
    }
  }
}
    `;
export type EvaluateAlarmMutationFn = Apollo.MutationFunction<EvaluateAlarmMutation, EvaluateAlarmMutationVariables>;

/**
 * __useEvaluateAlarmMutation__
 *
 * To run a mutation, you first call `useEvaluateAlarmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEvaluateAlarmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [evaluateAlarmMutation, { data, loading, error }] = useEvaluateAlarmMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEvaluateAlarmMutation(baseOptions?: Apollo.MutationHookOptions<EvaluateAlarmMutation, EvaluateAlarmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EvaluateAlarmMutation, EvaluateAlarmMutationVariables>(EvaluateAlarmDocument, options);
      }
export type EvaluateAlarmMutationHookResult = ReturnType<typeof useEvaluateAlarmMutation>;
export type EvaluateAlarmMutationResult = Apollo.MutationResult<EvaluateAlarmMutation>;
export type EvaluateAlarmMutationOptions = Apollo.BaseMutationOptions<EvaluateAlarmMutation, EvaluateAlarmMutationVariables>;
export const EvaluateAlarmsDocument = gql`
    mutation evaluateAlarms {
  evaluateAlarms {
    alarmTriggerResult {
      alarm {
        id
      }
    }
  }
}
    `;
export type EvaluateAlarmsMutationFn = Apollo.MutationFunction<EvaluateAlarmsMutation, EvaluateAlarmsMutationVariables>;

/**
 * __useEvaluateAlarmsMutation__
 *
 * To run a mutation, you first call `useEvaluateAlarmsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEvaluateAlarmsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [evaluateAlarmsMutation, { data, loading, error }] = useEvaluateAlarmsMutation({
 *   variables: {
 *   },
 * });
 */
export function useEvaluateAlarmsMutation(baseOptions?: Apollo.MutationHookOptions<EvaluateAlarmsMutation, EvaluateAlarmsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EvaluateAlarmsMutation, EvaluateAlarmsMutationVariables>(EvaluateAlarmsDocument, options);
      }
export type EvaluateAlarmsMutationHookResult = ReturnType<typeof useEvaluateAlarmsMutation>;
export type EvaluateAlarmsMutationResult = Apollo.MutationResult<EvaluateAlarmsMutation>;
export type EvaluateAlarmsMutationOptions = Apollo.BaseMutationOptions<EvaluateAlarmsMutation, EvaluateAlarmsMutationVariables>;
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
export type UpdateAfdelingMutationFn = Apollo.MutationFunction<UpdateAfdelingMutation, UpdateAfdelingMutationVariables>;

/**
 * __useUpdateAfdelingMutation__
 *
 * To run a mutation, you first call `useUpdateAfdelingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAfdelingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAfdelingMutation, { data, loading, error }] = useUpdateAfdelingMutation({
 *   variables: {
 *      id: // value for 'id'
 *      naam: // value for 'naam'
 *      organisatieId: // value for 'organisatieId'
 *   },
 * });
 */
export function useUpdateAfdelingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAfdelingMutation, UpdateAfdelingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAfdelingMutation, UpdateAfdelingMutationVariables>(UpdateAfdelingDocument, options);
      }
export type UpdateAfdelingMutationHookResult = ReturnType<typeof useUpdateAfdelingMutation>;
export type UpdateAfdelingMutationResult = Apollo.MutationResult<UpdateAfdelingMutation>;
export type UpdateAfdelingMutationOptions = Apollo.BaseMutationOptions<UpdateAfdelingMutation, UpdateAfdelingMutationVariables>;
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
export const UpdateAlarmDocument = gql`
    mutation updateAlarm($id: String!, $input: UpdateAlarmInput!) {
  updateAlarm(id: $id, input: $input) {
    ok
    alarm {
      ...Alarm
    }
  }
}
    ${AlarmFragmentDoc}`;
export type UpdateAlarmMutationFn = Apollo.MutationFunction<UpdateAlarmMutation, UpdateAlarmMutationVariables>;

/**
 * __useUpdateAlarmMutation__
 *
 * To run a mutation, you first call `useUpdateAlarmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAlarmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAlarmMutation, { data, loading, error }] = useUpdateAlarmMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAlarmMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAlarmMutation, UpdateAlarmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAlarmMutation, UpdateAlarmMutationVariables>(UpdateAlarmDocument, options);
      }
export type UpdateAlarmMutationHookResult = ReturnType<typeof useUpdateAlarmMutation>;
export type UpdateAlarmMutationResult = Apollo.MutationResult<UpdateAlarmMutation>;
export type UpdateAlarmMutationOptions = Apollo.BaseMutationOptions<UpdateAlarmMutation, UpdateAlarmMutationVariables>;
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
    mutation updateConfiguratie($id: String!, $waarde: String!) {
  updateConfiguratie(input: {id: $id, waarde: $waarde}) {
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
 *      id: // value for 'id'
 *      waarde: // value for 'waarde'
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
export const UpdateRubriekDocument = gql`
    mutation updateRubriek($id: Int!, $naam: String!, $grootboekrekeningId: String!) {
  updateRubriek(id: $id, naam: $naam, grootboekrekeningId: $grootboekrekeningId) {
    ok
  }
}
    `;
export type UpdateRubriekMutationFn = Apollo.MutationFunction<UpdateRubriekMutation, UpdateRubriekMutationVariables>;

/**
 * __useUpdateRubriekMutation__
 *
 * To run a mutation, you first call `useUpdateRubriekMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRubriekMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRubriekMutation, { data, loading, error }] = useUpdateRubriekMutation({
 *   variables: {
 *      id: // value for 'id'
 *      naam: // value for 'naam'
 *      grootboekrekeningId: // value for 'grootboekrekeningId'
 *   },
 * });
 */
export function useUpdateRubriekMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRubriekMutation, UpdateRubriekMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRubriekMutation, UpdateRubriekMutationVariables>(UpdateRubriekDocument, options);
      }
export type UpdateRubriekMutationHookResult = ReturnType<typeof useUpdateRubriekMutation>;
export type UpdateRubriekMutationResult = Apollo.MutationResult<UpdateRubriekMutation>;
export type UpdateRubriekMutationOptions = Apollo.BaseMutationOptions<UpdateRubriekMutation, UpdateRubriekMutationVariables>;
export const UpdateSignaalDocument = gql`
    mutation updateSignaal($id: String!, $input: UpdateSignaalInput!) {
  updateSignaal(id: $id, input: $input) {
    ok
    signaal {
      ...Signaal
    }
  }
}
    ${SignaalFragmentDoc}`;
export type UpdateSignaalMutationFn = Apollo.MutationFunction<UpdateSignaalMutation, UpdateSignaalMutationVariables>;

/**
 * __useUpdateSignaalMutation__
 *
 * To run a mutation, you first call `useUpdateSignaalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSignaalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSignaalMutation, { data, loading, error }] = useUpdateSignaalMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSignaalMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSignaalMutation, UpdateSignaalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSignaalMutation, UpdateSignaalMutationVariables>(UpdateSignaalDocument, options);
      }
export type UpdateSignaalMutationHookResult = ReturnType<typeof useUpdateSignaalMutation>;
export type UpdateSignaalMutationResult = Apollo.MutationResult<UpdateSignaalMutation>;
export type UpdateSignaalMutationOptions = Apollo.BaseMutationOptions<UpdateSignaalMutation, UpdateSignaalMutationVariables>;
export const GetAfdelingDocument = gql`
    query getAfdeling($id: Int!) {
  afdeling(id: $id) {
    ...Afdeling
  }
}
    ${AfdelingFragmentDoc}`;

/**
 * __useGetAfdelingQuery__
 *
 * To run a query within a React component, call `useGetAfdelingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAfdelingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAfdelingQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAfdelingQuery(baseOptions: Apollo.QueryHookOptions<GetAfdelingQuery, GetAfdelingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAfdelingQuery, GetAfdelingQueryVariables>(GetAfdelingDocument, options);
      }
export function useGetAfdelingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAfdelingQuery, GetAfdelingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAfdelingQuery, GetAfdelingQueryVariables>(GetAfdelingDocument, options);
        }
export type GetAfdelingQueryHookResult = ReturnType<typeof useGetAfdelingQuery>;
export type GetAfdelingLazyQueryHookResult = ReturnType<typeof useGetAfdelingLazyQuery>;
export type GetAfdelingQueryResult = Apollo.QueryResult<GetAfdelingQuery, GetAfdelingQueryVariables>;
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
export const GetAlarmDocument = gql`
    query getAlarm($id: String!) {
  alarm(id: $id) {
    ...Alarm
  }
}
    ${AlarmFragmentDoc}`;

/**
 * __useGetAlarmQuery__
 *
 * To run a query within a React component, call `useGetAlarmQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAlarmQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAlarmQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAlarmQuery(baseOptions: Apollo.QueryHookOptions<GetAlarmQuery, GetAlarmQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAlarmQuery, GetAlarmQueryVariables>(GetAlarmDocument, options);
      }
export function useGetAlarmLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAlarmQuery, GetAlarmQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAlarmQuery, GetAlarmQueryVariables>(GetAlarmDocument, options);
        }
export type GetAlarmQueryHookResult = ReturnType<typeof useGetAlarmQuery>;
export type GetAlarmLazyQueryHookResult = ReturnType<typeof useGetAlarmLazyQuery>;
export type GetAlarmQueryResult = Apollo.QueryResult<GetAlarmQuery, GetAlarmQueryVariables>;
export const GetAlarmenDocument = gql`
    query getAlarmen {
  alarmen {
    ...Alarm
  }
}
    ${AlarmFragmentDoc}`;

/**
 * __useGetAlarmenQuery__
 *
 * To run a query within a React component, call `useGetAlarmenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAlarmenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAlarmenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAlarmenQuery(baseOptions?: Apollo.QueryHookOptions<GetAlarmenQuery, GetAlarmenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAlarmenQuery, GetAlarmenQueryVariables>(GetAlarmenDocument, options);
      }
export function useGetAlarmenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAlarmenQuery, GetAlarmenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAlarmenQuery, GetAlarmenQueryVariables>(GetAlarmenDocument, options);
        }
export type GetAlarmenQueryHookResult = ReturnType<typeof useGetAlarmenQuery>;
export type GetAlarmenLazyQueryHookResult = ReturnType<typeof useGetAlarmenLazyQuery>;
export type GetAlarmenQueryResult = Apollo.QueryResult<GetAlarmenQuery, GetAlarmenQueryVariables>;
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
    id
    voornamen
    achternaam
    straatnaam
    huisnummer
    postcode
    plaatsnaam
  }
}
    `;

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
    id
    voornamen
    achternaam
  }
}
    `;

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
    id
    burgers {
      id
      voorletters
      voornamen
      achternaam
    }
  }
}
    `;

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
export const GetSimpleOrganisatiesDocument = gql`
    query getSimpleOrganisaties {
  organisaties {
    id
    naam
  }
}
    `;

/**
 * __useGetSimpleOrganisatiesQuery__
 *
 * To run a query within a React component, call `useGetSimpleOrganisatiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSimpleOrganisatiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSimpleOrganisatiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSimpleOrganisatiesQuery(baseOptions?: Apollo.QueryHookOptions<GetSimpleOrganisatiesQuery, GetSimpleOrganisatiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSimpleOrganisatiesQuery, GetSimpleOrganisatiesQueryVariables>(GetSimpleOrganisatiesDocument, options);
      }
export function useGetSimpleOrganisatiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSimpleOrganisatiesQuery, GetSimpleOrganisatiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSimpleOrganisatiesQuery, GetSimpleOrganisatiesQueryVariables>(GetSimpleOrganisatiesDocument, options);
        }
export type GetSimpleOrganisatiesQueryHookResult = ReturnType<typeof useGetSimpleOrganisatiesQuery>;
export type GetSimpleOrganisatiesLazyQueryHookResult = ReturnType<typeof useGetSimpleOrganisatiesLazyQuery>;
export type GetSimpleOrganisatiesQueryResult = Apollo.QueryResult<GetSimpleOrganisatiesQuery, GetSimpleOrganisatiesQueryVariables>;
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
export const GetRubriekenConfiguratieDocument = gql`
    query getRubriekenConfiguratie {
  rubrieken {
    id
    naam
    grootboekrekening {
      id
      naam
      omschrijving
    }
  }
  grootboekrekeningen {
    id
    naam
    omschrijving
  }
}
    `;

/**
 * __useGetRubriekenConfiguratieQuery__
 *
 * To run a query within a React component, call `useGetRubriekenConfiguratieQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRubriekenConfiguratieQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRubriekenConfiguratieQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRubriekenConfiguratieQuery(baseOptions?: Apollo.QueryHookOptions<GetRubriekenConfiguratieQuery, GetRubriekenConfiguratieQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRubriekenConfiguratieQuery, GetRubriekenConfiguratieQueryVariables>(GetRubriekenConfiguratieDocument, options);
      }
export function useGetRubriekenConfiguratieLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubriekenConfiguratieQuery, GetRubriekenConfiguratieQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRubriekenConfiguratieQuery, GetRubriekenConfiguratieQueryVariables>(GetRubriekenConfiguratieDocument, options);
        }
export type GetRubriekenConfiguratieQueryHookResult = ReturnType<typeof useGetRubriekenConfiguratieQuery>;
export type GetRubriekenConfiguratieLazyQueryHookResult = ReturnType<typeof useGetRubriekenConfiguratieLazyQuery>;
export type GetRubriekenConfiguratieQueryResult = Apollo.QueryResult<GetRubriekenConfiguratieQuery, GetRubriekenConfiguratieQueryVariables>;
export const GetSignalenAndBurgersDocument = gql`
    query getSignalenAndBurgers {
  signalen {
    id
    ...Signaal
  }
  burgers {
    id
    voorletters
    voornamen
    achternaam
  }
}
    ${SignaalFragmentDoc}`;

/**
 * __useGetSignalenAndBurgersQuery__
 *
 * To run a query within a React component, call `useGetSignalenAndBurgersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSignalenAndBurgersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSignalenAndBurgersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSignalenAndBurgersQuery(baseOptions?: Apollo.QueryHookOptions<GetSignalenAndBurgersQuery, GetSignalenAndBurgersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSignalenAndBurgersQuery, GetSignalenAndBurgersQueryVariables>(GetSignalenAndBurgersDocument, options);
      }
export function useGetSignalenAndBurgersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSignalenAndBurgersQuery, GetSignalenAndBurgersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSignalenAndBurgersQuery, GetSignalenAndBurgersQueryVariables>(GetSignalenAndBurgersDocument, options);
        }
export type GetSignalenAndBurgersQueryHookResult = ReturnType<typeof useGetSignalenAndBurgersQuery>;
export type GetSignalenAndBurgersLazyQueryHookResult = ReturnType<typeof useGetSignalenAndBurgersLazyQuery>;
export type GetSignalenAndBurgersQueryResult = Apollo.QueryResult<GetSignalenAndBurgersQuery, GetSignalenAndBurgersQueryVariables>;
export const GetSignalenDocument = gql`
    query getSignalen {
  signalen {
    id
    ...Signaal
  }
}
    ${SignaalFragmentDoc}`;

/**
 * __useGetSignalenQuery__
 *
 * To run a query within a React component, call `useGetSignalenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSignalenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSignalenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSignalenQuery(baseOptions?: Apollo.QueryHookOptions<GetSignalenQuery, GetSignalenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSignalenQuery, GetSignalenQueryVariables>(GetSignalenDocument, options);
      }
export function useGetSignalenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSignalenQuery, GetSignalenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSignalenQuery, GetSignalenQueryVariables>(GetSignalenDocument, options);
        }
export type GetSignalenQueryHookResult = ReturnType<typeof useGetSignalenQuery>;
export type GetSignalenLazyQueryHookResult = ReturnType<typeof useGetSignalenLazyQuery>;
export type GetSignalenQueryResult = Apollo.QueryResult<GetSignalenQuery, GetSignalenQueryVariables>;
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

/**
 * __useGetSimpleBurgersQuery__
 *
 * To run a query within a React component, call `useGetSimpleBurgersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSimpleBurgersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSimpleBurgersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSimpleBurgersQuery(baseOptions?: Apollo.QueryHookOptions<GetSimpleBurgersQuery, GetSimpleBurgersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSimpleBurgersQuery, GetSimpleBurgersQueryVariables>(GetSimpleBurgersDocument, options);
      }
export function useGetSimpleBurgersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSimpleBurgersQuery, GetSimpleBurgersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSimpleBurgersQuery, GetSimpleBurgersQueryVariables>(GetSimpleBurgersDocument, options);
        }
export type GetSimpleBurgersQueryHookResult = ReturnType<typeof useGetSimpleBurgersQuery>;
export type GetSimpleBurgersLazyQueryHookResult = ReturnType<typeof useGetSimpleBurgersLazyQuery>;
export type GetSimpleBurgersQueryResult = Apollo.QueryResult<GetSimpleBurgersQuery, GetSimpleBurgersQueryVariables>;
export const GetTransactieDocument = gql`
    query getTransactie($id: Int!) {
  bankTransaction(id: $id) {
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
}
    ${BankTransactionFragmentDoc}
${AfspraakFragmentDoc}
${GrootboekrekeningFragmentDoc}`;

/**
 * __useGetTransactieQuery__
 *
 * To run a query within a React component, call `useGetTransactieQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactieQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactieQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTransactieQuery(baseOptions: Apollo.QueryHookOptions<GetTransactieQuery, GetTransactieQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactieQuery, GetTransactieQueryVariables>(GetTransactieDocument, options);
      }
export function useGetTransactieLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactieQuery, GetTransactieQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactieQuery, GetTransactieQueryVariables>(GetTransactieDocument, options);
        }
export type GetTransactieQueryHookResult = ReturnType<typeof useGetTransactieQuery>;
export type GetTransactieLazyQueryHookResult = ReturnType<typeof useGetTransactieLazyQuery>;
export type GetTransactieQueryResult = Apollo.QueryResult<GetTransactieQuery, GetTransactieQueryVariables>;
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