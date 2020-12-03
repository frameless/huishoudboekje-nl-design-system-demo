import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /** Decimaal Scalar Description */
  Bedrag: any;
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

/** GraphQL Afspraak model  */
export type Afspraak = {
  __typename?: 'Afspraak';
  id?: Maybe<Scalars['Int']>;
  gebruiker?: Maybe<Gebruiker>;
  beschrijving?: Maybe<Scalars['String']>;
  startDatum?: Maybe<Scalars['Date']>;
  eindDatum?: Maybe<Scalars['Date']>;
  aantalBetalingen?: Maybe<Scalars['Int']>;
  interval?: Maybe<Interval>;
  tegenRekening?: Maybe<Rekening>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  credit?: Maybe<Scalars['Boolean']>;
  kenmerk?: Maybe<Scalars['String']>;
  actief?: Maybe<Scalars['Boolean']>;
  automatischeIncasso?: Maybe<Scalars['Boolean']>;
  organisatie?: Maybe<Organisatie>;
  journaalposten?: Maybe<Array<Maybe<Journaalpost>>>;
  rubriek?: Maybe<Rubriek>;
  overschrijvingen?: Maybe<Array<Maybe<Overschijving>>>;
};


/** GraphQL Afspraak model  */
export type AfspraakOverschrijvingenArgs = {
  startDatum?: Maybe<Scalars['Date']>;
  eindDatum?: Maybe<Scalars['Date']>;
};

export type AfspraakInput = {
  gebruikerId?: Maybe<Scalars['Int']>;
  beschrijving?: Maybe<Scalars['String']>;
  startDatum?: Maybe<Scalars['String']>;
  eindDatum?: Maybe<Scalars['String']>;
  aantalBetalingen?: Maybe<Scalars['Int']>;
  interval?: Maybe<IntervalInput>;
  tegenRekeningId?: Maybe<Scalars['Int']>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  credit?: Maybe<Scalars['Boolean']>;
  kenmerk?: Maybe<Scalars['String']>;
  actief?: Maybe<Scalars['Boolean']>;
  organisatieId?: Maybe<Scalars['Int']>;
  rubriekId?: Maybe<Scalars['Int']>;
  automatischeIncasso?: Maybe<Scalars['Boolean']>;
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
  journaalpost?: Maybe<Journaalpost>;
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

export type CreateConfiguratie = {
  __typename?: 'CreateConfiguratie';
  ok?: Maybe<Scalars['Boolean']>;
  configuratie?: Maybe<Configuratie>;
};

export type CreateCustomerStatementMessage = {
  __typename?: 'CreateCustomerStatementMessage';
  ok?: Maybe<Scalars['Boolean']>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
};

export type CreateGebruiker = {
  __typename?: 'CreateGebruiker';
  ok?: Maybe<Scalars['Boolean']>;
  gebruiker?: Maybe<Gebruiker>;
};

export type CreateGebruikerInput = {
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

export type CreateGebruikerRekening = {
  __typename?: 'CreateGebruikerRekening';
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
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



export type DeleteAfspraak = {
  __typename?: 'DeleteAfspraak';
  ok?: Maybe<Scalars['Boolean']>;
};

export type DeleteConfiguratie = {
  __typename?: 'DeleteConfiguratie';
  ok?: Maybe<Scalars['Boolean']>;
};

export type DeleteCustomerStatementMessage = {
  __typename?: 'DeleteCustomerStatementMessage';
  ok?: Maybe<Scalars['Boolean']>;
};

export type DeleteGebruiker = {
  __typename?: 'DeleteGebruiker';
  ok?: Maybe<Scalars['Boolean']>;
};

export type DeleteGebruikerRekening = {
  __typename?: 'DeleteGebruikerRekening';
  ok?: Maybe<Scalars['Boolean']>;
};

/** Delete journaalpost by id  */
export type DeleteJournaalpost = {
  __typename?: 'DeleteJournaalpost';
  ok?: Maybe<Scalars['Boolean']>;
};

export type DeleteOrganisatie = {
  __typename?: 'DeleteOrganisatie';
  ok?: Maybe<Scalars['Boolean']>;
};

export type DeleteOrganisatieRekening = {
  __typename?: 'DeleteOrganisatieRekening';
  ok?: Maybe<Scalars['Boolean']>;
};

export type DeleteRubriek = {
  __typename?: 'DeleteRubriek';
  ok?: Maybe<Scalars['Boolean']>;
};

/** GraphQL Export model  */
export type Export = {
  __typename?: 'Export';
  id?: Maybe<Scalars['Int']>;
};

/** GraphQL Gebruiker model  */
export type Gebruiker = {
  __typename?: 'Gebruiker';
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
};

/** Grootboekrekening model  */
export type Grootboekrekening = {
  __typename?: 'Grootboekrekening';
  id: Scalars['String'];
  naam?: Maybe<Scalars['String']>;
  referentie?: Maybe<Scalars['String']>;
  omschrijving?: Maybe<Scalars['String']>;
  debet?: Maybe<Scalars['Boolean']>;
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

export type IntervalInput = {
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

export type Overschijving = {
  __typename?: 'Overschijving';
  id?: Maybe<Scalars['Int']>;
  afspraak?: Maybe<Afspraak>;
  export?: Maybe<Export>;
  datum?: Maybe<Scalars['Date']>;
  bedrag?: Maybe<Scalars['Bedrag']>;
  bankTransaction?: Maybe<BankTransaction>;
  status?: Maybe<OverschijvingStatus>;
};

export enum OverschijvingStatus {
  Gereed = 'GEREED',
  InBehandeling = 'IN_BEHANDELING',
  Verwachting = 'VERWACHTING'
}

/** GraphQL Rekening model */
export type Rekening = {
  __typename?: 'Rekening';
  id?: Maybe<Scalars['Int']>;
  iban?: Maybe<Scalars['String']>;
  rekeninghouder?: Maybe<Scalars['String']>;
  gebruikers?: Maybe<Array<Maybe<Gebruiker>>>;
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
  createGebruiker?: Maybe<CreateGebruiker>;
  deleteGebruiker?: Maybe<DeleteGebruiker>;
  updateGebruiker?: Maybe<UpdateGebruiker>;
  createAfspraak?: Maybe<CreateAfspraak>;
  updateAfspraak?: Maybe<UpdateAfspraak>;
  deleteAfspraak?: Maybe<DeleteAfspraak>;
  createOrganisatie?: Maybe<CreateOrganisatie>;
  updateOrganisatie?: Maybe<UpdateOrganisatie>;
  deleteOrganisatie?: Maybe<DeleteOrganisatie>;
  createGebruikerRekening?: Maybe<CreateGebruikerRekening>;
  deleteGebruikerRekening?: Maybe<DeleteGebruikerRekening>;
  createOrganisatieRekening?: Maybe<CreateOrganisatieRekening>;
  deleteOrganisatieRekening?: Maybe<DeleteOrganisatieRekening>;
  updateRekening?: Maybe<UpdateRekening>;
  deleteCustomerStatementMessage?: Maybe<DeleteCustomerStatementMessage>;
  createCustomerStatementMessage?: Maybe<CreateCustomerStatementMessage>;
  /** Create a Journaalpost with an Afspraak */
  createJournaalpostAfspraak?: Maybe<CreateJournaalpostAfspraak>;
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
};


/** The root of all mutations  */
export type RootMutationCreateGebruikerArgs = {
  input?: Maybe<CreateGebruikerInput>;
};


/** The root of all mutations  */
export type RootMutationDeleteGebruikerArgs = {
  id: Scalars['Int'];
};


/** The root of all mutations  */
export type RootMutationUpdateGebruikerArgs = {
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
  input: AfspraakInput;
};


/** The root of all mutations  */
export type RootMutationUpdateAfspraakArgs = {
  id: Scalars['Int'];
  input: AfspraakInput;
};


/** The root of all mutations  */
export type RootMutationDeleteAfspraakArgs = {
  id: Scalars['Int'];
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
export type RootMutationCreateGebruikerRekeningArgs = {
  gebruikerId: Scalars['Int'];
  rekening: RekeningInput;
};


/** The root of all mutations  */
export type RootMutationDeleteGebruikerRekeningArgs = {
  gebruikerId: Scalars['Int'];
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

/** The root of all queries  */
export type RootQuery = {
  __typename?: 'RootQuery';
  afspraak?: Maybe<Afspraak>;
  afspraken?: Maybe<Array<Maybe<Afspraak>>>;
  bankTransaction?: Maybe<BankTransaction>;
  bankTransactions?: Maybe<Array<Maybe<BankTransaction>>>;
  customerStatementMessage?: Maybe<CustomerStatementMessage>;
  customerStatementMessages?: Maybe<Array<Maybe<CustomerStatementMessage>>>;
  gebruiker?: Maybe<Gebruiker>;
  gebruikers?: Maybe<Array<Maybe<Gebruiker>>>;
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
export type RootQueryCustomerStatementMessageArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryCustomerStatementMessagesArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** The root of all queries  */
export type RootQueryGebruikerArgs = {
  id: Scalars['Int'];
};


/** The root of all queries  */
export type RootQueryGebruikersArgs = {
  ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
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

/** GraphQL Rubriek model */
export type Rubriek = {
  __typename?: 'Rubriek';
  id?: Maybe<Scalars['Int']>;
  naam?: Maybe<Scalars['String']>;
  grootboekrekening?: Maybe<Grootboekrekening>;
};

export type UpdateAfspraak = {
  __typename?: 'UpdateAfspraak';
  ok?: Maybe<Scalars['Boolean']>;
  afspraak?: Maybe<Afspraak>;
};

export type UpdateConfiguratie = {
  __typename?: 'UpdateConfiguratie';
  ok?: Maybe<Scalars['Boolean']>;
  configuratie?: Maybe<Configuratie>;
};

export type UpdateGebruiker = {
  __typename?: 'UpdateGebruiker';
  ok?: Maybe<Scalars['Boolean']>;
  gebruiker?: Maybe<Gebruiker>;
};

/** Update a Journaalpost with a Grootboekrekening */
export type UpdateJournaalpostGrootboekrekening = {
  __typename?: 'UpdateJournaalpostGrootboekrekening';
  ok?: Maybe<Scalars['Boolean']>;
  journaalpost?: Maybe<Journaalpost>;
};

export type UpdateJournaalpostGrootboekrekeningInput = {
  id: Scalars['Int'];
  grootboekrekeningId: Scalars['String'];
};

export type UpdateOrganisatie = {
  __typename?: 'UpdateOrganisatie';
  ok?: Maybe<Scalars['Boolean']>;
  organisatie?: Maybe<Organisatie>;
};

export type UpdateRekening = {
  __typename?: 'UpdateRekening';
  ok?: Maybe<Scalars['Boolean']>;
  rekening?: Maybe<Rekening>;
};

export type UpdateRubriek = {
  __typename?: 'UpdateRubriek';
  ok?: Maybe<Scalars['Boolean']>;
  rubriek?: Maybe<Rubriek>;
};


export type RekeningFragment = (
  { __typename?: 'Rekening' }
  & Pick<Rekening, 'id' | 'iban' | 'rekeninghouder'>
);

export type GrootboekrekeningFragment = (
  { __typename?: 'Grootboekrekening' }
  & Pick<Grootboekrekening, 'id' | 'naam' | 'omschrijving' | 'referentie'>
);

export type RubriekFragment = (
  { __typename?: 'Rubriek' }
  & Pick<Rubriek, 'id' | 'naam'>
  & { grootboekrekening?: Maybe<(
    { __typename?: 'Grootboekrekening' }
    & GrootboekrekeningFragment
  )> }
);

export type AfspraakFragment = (
  { __typename?: 'Afspraak' }
  & Pick<Afspraak, 'id' | 'beschrijving' | 'startDatum' | 'eindDatum' | 'aantalBetalingen' | 'bedrag' | 'credit' | 'kenmerk' | 'actief'>
  & { interval?: Maybe<(
    { __typename?: 'Interval' }
    & Pick<Interval, 'dagen' | 'weken' | 'maanden' | 'jaren'>
  )>, gebruiker?: Maybe<(
    { __typename?: 'Gebruiker' }
    & Pick<Gebruiker, 'id' | 'voorletters' | 'achternaam'>
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
  )>, rubriek?: Maybe<(
    { __typename?: 'Rubriek' }
    & RubriekFragment
  )> }
);

export type GebruikerFragment = (
  { __typename?: 'Gebruiker' }
  & Pick<Gebruiker, 'id' | 'email' | 'telefoonnummer' | 'voorletters' | 'voornamen' | 'achternaam' | 'geboortedatum' | 'straatnaam' | 'huisnummer' | 'postcode' | 'plaatsnaam'>
  & { rekeningen?: Maybe<Array<Maybe<(
    { __typename?: 'Rekening' }
    & RekeningFragment
  )>>>, afspraken?: Maybe<Array<Maybe<(
    { __typename?: 'Afspraak' }
    & AfspraakFragment
  )>>> }
);

export type KvkFragment = (
  { __typename?: 'Organisatie' }
  & { kvkDetails?: Maybe<(
    { __typename?: 'OrganisatieKvK' }
    & Pick<OrganisatieKvK, 'huisnummer' | 'naam' | 'nummer' | 'plaatsnaam' | 'postcode' | 'straatnaam'>
  )> }
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

export type BankTransactionFragment = (
  { __typename?: 'BankTransaction' }
  & Pick<BankTransaction, 'id' | 'informationToAccountOwner' | 'statementLine' | 'bedrag' | 'isCredit' | 'tegenRekeningIban' | 'transactieDatum'>
  & { tegenRekening?: Maybe<(
    { __typename?: 'Rekening' }
    & Pick<Rekening, 'iban' | 'rekeninghouder'>
  )> }
);

export type CustomerStatementMessageFragment = (
  { __typename?: 'CustomerStatementMessage' }
  & Pick<CustomerStatementMessage, 'accountIdentification' | 'closingAvailableFunds' | 'closingBalance' | 'forwardAvailableBalance' | 'id' | 'openingBalance' | 'relatedReference' | 'sequenceNumber' | 'transactionReferenceNumber' | 'uploadDate'>
  & { bankTransactions?: Maybe<Array<Maybe<(
    { __typename?: 'BankTransaction' }
    & BankTransactionFragment
  )>>> }
);

export type JournaalpostFragment = (
  { __typename?: 'Journaalpost' }
  & Pick<Journaalpost, 'id'>
);

export type CreateGebruikerMutationVariables = Exact<{
  input?: Maybe<CreateGebruikerInput>;
}>;


export type CreateGebruikerMutation = (
  { __typename?: 'RootMutation' }
  & { createGebruiker?: Maybe<(
    { __typename?: 'CreateGebruiker' }
    & Pick<CreateGebruiker, 'ok'>
    & { gebruiker?: Maybe<(
      { __typename?: 'Gebruiker' }
      & GebruikerFragment
    )> }
  )> }
);

export type UpdateGebruikerMutationVariables = Exact<{
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


export type UpdateGebruikerMutation = (
  { __typename?: 'RootMutation' }
  & { updateGebruiker?: Maybe<(
    { __typename?: 'UpdateGebruiker' }
    & Pick<UpdateGebruiker, 'ok'>
    & { gebruiker?: Maybe<(
      { __typename?: 'Gebruiker' }
      & GebruikerFragment
    )> }
  )> }
);

export type DeleteGebruikerMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteGebruikerMutation = (
  { __typename?: 'RootMutation' }
  & { deleteGebruiker?: Maybe<(
    { __typename?: 'DeleteGebruiker' }
    & Pick<DeleteGebruiker, 'ok'>
  )> }
);

export type CreateOrganizationMutationVariables = Exact<{
  huisnummer?: Maybe<Scalars['String']>;
  kvkNummer: Scalars['String'];
  naam?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  weergaveNaam: Scalars['String'];
}>;


export type CreateOrganizationMutation = (
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

export type UpdateOrganizationMutationVariables = Exact<{
  id: Scalars['Int'];
  huisnummer?: Maybe<Scalars['String']>;
  kvkNummer?: Maybe<Scalars['String']>;
  naam?: Maybe<Scalars['String']>;
  plaatsnaam?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  straatnaam?: Maybe<Scalars['String']>;
  weergaveNaam?: Maybe<Scalars['String']>;
}>;


export type UpdateOrganizationMutation = (
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

export type DeleteOrganizationMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteOrganizationMutation = (
  { __typename?: 'RootMutation' }
  & { deleteOrganisatie?: Maybe<(
    { __typename?: 'DeleteOrganisatie' }
    & Pick<DeleteOrganisatie, 'ok'>
  )> }
);

export type CreateAfspraakMutationVariables = Exact<{
  input: AfspraakInput;
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

export type UpdateAfspraakMutationVariables = Exact<{
  id: Scalars['Int'];
  input: AfspraakInput;
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

export type CreateGebruikerRekeningMutationVariables = Exact<{
  gebruikerId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateGebruikerRekeningMutation = (
  { __typename?: 'RootMutation' }
  & { createGebruikerRekening?: Maybe<(
    { __typename?: 'CreateGebruikerRekening' }
    & Pick<CreateGebruikerRekening, 'ok'>
    & { rekening?: Maybe<(
      { __typename?: 'Rekening' }
      & RekeningFragment
    )> }
  )> }
);

export type DeleteGebruikerRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  gebruikerId: Scalars['Int'];
}>;


export type DeleteGebruikerRekeningMutation = (
  { __typename?: 'RootMutation' }
  & { deleteGebruikerRekening?: Maybe<(
    { __typename?: 'DeleteGebruikerRekening' }
    & Pick<DeleteGebruikerRekening, 'ok'>
  )> }
);

export type CreateOrganizationRekeningMutationVariables = Exact<{
  orgId: Scalars['Int'];
  rekening: RekeningInput;
}>;


export type CreateOrganizationRekeningMutation = (
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

export type DeleteOrganizationRekeningMutationVariables = Exact<{
  id: Scalars['Int'];
  orgId: Scalars['Int'];
}>;


export type DeleteOrganizationRekeningMutation = (
  { __typename?: 'RootMutation' }
  & { deleteOrganisatieRekening?: Maybe<(
    { __typename?: 'DeleteOrganisatieRekening' }
    & Pick<DeleteOrganisatieRekening, 'ok'>
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

export type GetAllGebruikersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllGebruikersQuery = (
  { __typename?: 'RootQuery' }
  & { gebruikers?: Maybe<Array<Maybe<(
    { __typename?: 'Gebruiker' }
    & GebruikerFragment
  )>>> }
);

export type GetOneGebruikerQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetOneGebruikerQuery = (
  { __typename?: 'RootQuery' }
  & { gebruiker?: Maybe<(
    { __typename?: 'Gebruiker' }
    & GebruikerFragment
  )> }
);

export type GetOneGebruikerAfsprakenQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetOneGebruikerAfsprakenQuery = (
  { __typename?: 'RootQuery' }
  & { gebruiker?: Maybe<(
    { __typename?: 'Gebruiker' }
    & { afspraken?: Maybe<Array<Maybe<(
      { __typename?: 'Afspraak' }
      & { gebruiker?: Maybe<(
        { __typename?: 'Gebruiker' }
        & Pick<Gebruiker, 'id'>
      )> }
      & AfspraakFragment
    )>>> }
  )> }
);

export type GetAllOrganisatiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOrganisatiesQuery = (
  { __typename?: 'RootQuery' }
  & { organisaties?: Maybe<Array<Maybe<(
    { __typename?: 'Organisatie' }
    & Pick<Organisatie, 'id'>
    & OrganisatieFragment
  )>>> }
);

export type GetOneOrganisatieQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetOneOrganisatieQuery = (
  { __typename?: 'RootQuery' }
  & { organisatie?: Maybe<(
    { __typename?: 'Organisatie' }
    & OrganisatieFragment
  )> }
);

export type GetAllAfsprakenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAfsprakenQuery = (
  { __typename?: 'RootQuery' }
  & { afspraken?: Maybe<Array<Maybe<(
    { __typename?: 'Afspraak' }
    & AfspraakFragment
  )>>> }
);

export type GetOneAfspraakQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetOneAfspraakQuery = (
  { __typename?: 'RootQuery' }
  & { afspraak?: Maybe<(
    { __typename?: 'Afspraak' }
    & AfspraakFragment
  )> }
);

export type GetAllCsmsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCsmsQuery = (
  { __typename?: 'RootQuery' }
  & { customerStatementMessages?: Maybe<Array<Maybe<(
    { __typename?: 'CustomerStatementMessage' }
    & CustomerStatementMessageFragment
  )>>> }
);

export type GetAllTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTransactionsQuery = (
  { __typename?: 'RootQuery' }
  & { bankTransactions?: Maybe<Array<Maybe<(
    { __typename?: 'BankTransaction' }
    & { journaalpost?: Maybe<(
      { __typename?: 'Journaalpost' }
      & Pick<Journaalpost, 'id'>
      & { afspraak?: Maybe<(
        { __typename?: 'Afspraak' }
        & Pick<Afspraak, 'id'>
      )>, grootboekrekening?: Maybe<(
        { __typename?: 'Grootboekrekening' }
        & GrootboekrekeningFragment
      )> }
    )> }
    & BankTransactionFragment
  )>>> }
);

export type GetAllRubriekenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRubriekenQuery = (
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
  omschrijving
  referentie
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
  beschrijving
  startDatum
  eindDatum
  aantalBetalingen
  interval {
    dagen
    weken
    maanden
    jaren
  }
  gebruiker {
    id
    voorletters
    achternaam
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
  }
  bedrag
  credit
  kenmerk
  actief
  rubriek {
    ...Rubriek
  }
}
    ${RekeningFragmentDoc}
${RubriekFragmentDoc}`;
export const GebruikerFragmentDoc = gql`
    fragment Gebruiker on Gebruiker {
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
export const CustomerStatementMessageFragmentDoc = gql`
    fragment CustomerStatementMessage on CustomerStatementMessage {
  accountIdentification
  bankTransactions {
    ...BankTransaction
  }
  closingAvailableFunds
  closingBalance
  forwardAvailableBalance
  id
  openingBalance
  relatedReference
  sequenceNumber
  transactionReferenceNumber
  uploadDate
}
    ${BankTransactionFragmentDoc}`;
export const JournaalpostFragmentDoc = gql`
    fragment Journaalpost on Journaalpost {
  id
}
    `;
export const CreateGebruikerDocument = gql`
    mutation createGebruiker($input: CreateGebruikerInput) {
  createGebruiker(input: $input) {
    ok
    gebruiker {
      ...Gebruiker
    }
  }
}
    ${GebruikerFragmentDoc}`;
export type CreateGebruikerMutationFn = Apollo.MutationFunction<CreateGebruikerMutation, CreateGebruikerMutationVariables>;

/**
 * __useCreateGebruikerMutation__
 *
 * To run a mutation, you first call `useCreateGebruikerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGebruikerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGebruikerMutation, { data, loading, error }] = useCreateGebruikerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGebruikerMutation(baseOptions?: Apollo.MutationHookOptions<CreateGebruikerMutation, CreateGebruikerMutationVariables>) {
        return Apollo.useMutation<CreateGebruikerMutation, CreateGebruikerMutationVariables>(CreateGebruikerDocument, baseOptions);
      }
export type CreateGebruikerMutationHookResult = ReturnType<typeof useCreateGebruikerMutation>;
export type CreateGebruikerMutationResult = Apollo.MutationResult<CreateGebruikerMutation>;
export type CreateGebruikerMutationOptions = Apollo.BaseMutationOptions<CreateGebruikerMutation, CreateGebruikerMutationVariables>;
export const UpdateGebruikerDocument = gql`
    mutation updateGebruiker($id: Int!, $voorletters: String, $voornamen: String, $achternaam: String, $geboortedatum: String, $straatnaam: String, $huisnummer: String, $postcode: String, $plaatsnaam: String, $telefoonnummer: String, $email: String) {
  updateGebruiker(id: $id, voorletters: $voorletters, voornamen: $voornamen, achternaam: $achternaam, geboortedatum: $geboortedatum, straatnaam: $straatnaam, huisnummer: $huisnummer, postcode: $postcode, plaatsnaam: $plaatsnaam, telefoonnummer: $telefoonnummer, email: $email) {
    ok
    gebruiker {
      ...Gebruiker
    }
  }
}
    ${GebruikerFragmentDoc}`;
export type UpdateGebruikerMutationFn = Apollo.MutationFunction<UpdateGebruikerMutation, UpdateGebruikerMutationVariables>;

/**
 * __useUpdateGebruikerMutation__
 *
 * To run a mutation, you first call `useUpdateGebruikerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGebruikerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGebruikerMutation, { data, loading, error }] = useUpdateGebruikerMutation({
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
export function useUpdateGebruikerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGebruikerMutation, UpdateGebruikerMutationVariables>) {
        return Apollo.useMutation<UpdateGebruikerMutation, UpdateGebruikerMutationVariables>(UpdateGebruikerDocument, baseOptions);
      }
export type UpdateGebruikerMutationHookResult = ReturnType<typeof useUpdateGebruikerMutation>;
export type UpdateGebruikerMutationResult = Apollo.MutationResult<UpdateGebruikerMutation>;
export type UpdateGebruikerMutationOptions = Apollo.BaseMutationOptions<UpdateGebruikerMutation, UpdateGebruikerMutationVariables>;
export const DeleteGebruikerDocument = gql`
    mutation deleteGebruiker($id: Int!) {
  deleteGebruiker(id: $id) {
    ok
  }
}
    `;
export type DeleteGebruikerMutationFn = Apollo.MutationFunction<DeleteGebruikerMutation, DeleteGebruikerMutationVariables>;

/**
 * __useDeleteGebruikerMutation__
 *
 * To run a mutation, you first call `useDeleteGebruikerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGebruikerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGebruikerMutation, { data, loading, error }] = useDeleteGebruikerMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGebruikerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGebruikerMutation, DeleteGebruikerMutationVariables>) {
        return Apollo.useMutation<DeleteGebruikerMutation, DeleteGebruikerMutationVariables>(DeleteGebruikerDocument, baseOptions);
      }
export type DeleteGebruikerMutationHookResult = ReturnType<typeof useDeleteGebruikerMutation>;
export type DeleteGebruikerMutationResult = Apollo.MutationResult<DeleteGebruikerMutation>;
export type DeleteGebruikerMutationOptions = Apollo.BaseMutationOptions<DeleteGebruikerMutation, DeleteGebruikerMutationVariables>;
export const CreateOrganizationDocument = gql`
    mutation createOrganization($huisnummer: String, $kvkNummer: String!, $naam: String, $plaatsnaam: String, $postcode: String, $straatnaam: String, $weergaveNaam: String!) {
  createOrganisatie(input: {huisnummer: $huisnummer, kvkNummer: $kvkNummer, naam: $naam, plaatsnaam: $plaatsnaam, postcode: $postcode, straatnaam: $straatnaam, weergaveNaam: $weergaveNaam}) {
    ok
    organisatie {
      ...Organisatie
    }
  }
}
    ${OrganisatieFragmentDoc}`;
export type CreateOrganizationMutationFn = Apollo.MutationFunction<CreateOrganizationMutation, CreateOrganizationMutationVariables>;

/**
 * __useCreateOrganizationMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationMutation, { data, loading, error }] = useCreateOrganizationMutation({
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
export function useCreateOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>) {
        return Apollo.useMutation<CreateOrganizationMutation, CreateOrganizationMutationVariables>(CreateOrganizationDocument, baseOptions);
      }
export type CreateOrganizationMutationHookResult = ReturnType<typeof useCreateOrganizationMutation>;
export type CreateOrganizationMutationResult = Apollo.MutationResult<CreateOrganizationMutation>;
export type CreateOrganizationMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export const UpdateOrganizationDocument = gql`
    mutation updateOrganization($id: Int!, $huisnummer: String, $kvkNummer: String, $naam: String, $plaatsnaam: String, $postcode: String, $straatnaam: String, $weergaveNaam: String) {
  updateOrganisatie(id: $id, huisnummer: $huisnummer, kvkNummer: $kvkNummer, naam: $naam, plaatsnaam: $plaatsnaam, postcode: $postcode, straatnaam: $straatnaam, weergaveNaam: $weergaveNaam) {
    ok
    organisatie {
      ...Organisatie
    }
  }
}
    ${OrganisatieFragmentDoc}`;
export type UpdateOrganizationMutationFn = Apollo.MutationFunction<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;

/**
 * __useUpdateOrganizationMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationMutation, { data, loading, error }] = useUpdateOrganizationMutation({
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
export function useUpdateOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>) {
        return Apollo.useMutation<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>(UpdateOrganizationDocument, baseOptions);
      }
export type UpdateOrganizationMutationHookResult = ReturnType<typeof useUpdateOrganizationMutation>;
export type UpdateOrganizationMutationResult = Apollo.MutationResult<UpdateOrganizationMutation>;
export type UpdateOrganizationMutationOptions = Apollo.BaseMutationOptions<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;
export const DeleteOrganizationDocument = gql`
    mutation deleteOrganization($id: Int!) {
  deleteOrganisatie(id: $id) {
    ok
  }
}
    `;
export type DeleteOrganizationMutationFn = Apollo.MutationFunction<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;

/**
 * __useDeleteOrganizationMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationMutation, { data, loading, error }] = useDeleteOrganizationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>) {
        return Apollo.useMutation<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>(DeleteOrganizationDocument, baseOptions);
      }
export type DeleteOrganizationMutationHookResult = ReturnType<typeof useDeleteOrganizationMutation>;
export type DeleteOrganizationMutationResult = Apollo.MutationResult<DeleteOrganizationMutation>;
export type DeleteOrganizationMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationMutation, DeleteOrganizationMutationVariables>;
export const CreateAfspraakDocument = gql`
    mutation createAfspraak($input: AfspraakInput!) {
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
        return Apollo.useMutation<CreateAfspraakMutation, CreateAfspraakMutationVariables>(CreateAfspraakDocument, baseOptions);
      }
export type CreateAfspraakMutationHookResult = ReturnType<typeof useCreateAfspraakMutation>;
export type CreateAfspraakMutationResult = Apollo.MutationResult<CreateAfspraakMutation>;
export type CreateAfspraakMutationOptions = Apollo.BaseMutationOptions<CreateAfspraakMutation, CreateAfspraakMutationVariables>;
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
        return Apollo.useMutation<DeleteAfspraakMutation, DeleteAfspraakMutationVariables>(DeleteAfspraakDocument, baseOptions);
      }
export type DeleteAfspraakMutationHookResult = ReturnType<typeof useDeleteAfspraakMutation>;
export type DeleteAfspraakMutationResult = Apollo.MutationResult<DeleteAfspraakMutation>;
export type DeleteAfspraakMutationOptions = Apollo.BaseMutationOptions<DeleteAfspraakMutation, DeleteAfspraakMutationVariables>;
export const UpdateAfspraakDocument = gql`
    mutation updateAfspraak($id: Int!, $input: AfspraakInput!) {
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
        return Apollo.useMutation<UpdateAfspraakMutation, UpdateAfspraakMutationVariables>(UpdateAfspraakDocument, baseOptions);
      }
export type UpdateAfspraakMutationHookResult = ReturnType<typeof useUpdateAfspraakMutation>;
export type UpdateAfspraakMutationResult = Apollo.MutationResult<UpdateAfspraakMutation>;
export type UpdateAfspraakMutationOptions = Apollo.BaseMutationOptions<UpdateAfspraakMutation, UpdateAfspraakMutationVariables>;
export const CreateGebruikerRekeningDocument = gql`
    mutation createGebruikerRekening($gebruikerId: Int!, $rekening: RekeningInput!) {
  createGebruikerRekening(gebruikerId: $gebruikerId, rekening: $rekening) {
    ok
    rekening {
      ...Rekening
    }
  }
}
    ${RekeningFragmentDoc}`;
export type CreateGebruikerRekeningMutationFn = Apollo.MutationFunction<CreateGebruikerRekeningMutation, CreateGebruikerRekeningMutationVariables>;

/**
 * __useCreateGebruikerRekeningMutation__
 *
 * To run a mutation, you first call `useCreateGebruikerRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGebruikerRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGebruikerRekeningMutation, { data, loading, error }] = useCreateGebruikerRekeningMutation({
 *   variables: {
 *      gebruikerId: // value for 'gebruikerId'
 *      rekening: // value for 'rekening'
 *   },
 * });
 */
export function useCreateGebruikerRekeningMutation(baseOptions?: Apollo.MutationHookOptions<CreateGebruikerRekeningMutation, CreateGebruikerRekeningMutationVariables>) {
        return Apollo.useMutation<CreateGebruikerRekeningMutation, CreateGebruikerRekeningMutationVariables>(CreateGebruikerRekeningDocument, baseOptions);
      }
export type CreateGebruikerRekeningMutationHookResult = ReturnType<typeof useCreateGebruikerRekeningMutation>;
export type CreateGebruikerRekeningMutationResult = Apollo.MutationResult<CreateGebruikerRekeningMutation>;
export type CreateGebruikerRekeningMutationOptions = Apollo.BaseMutationOptions<CreateGebruikerRekeningMutation, CreateGebruikerRekeningMutationVariables>;
export const DeleteGebruikerRekeningDocument = gql`
    mutation deleteGebruikerRekening($id: Int!, $gebruikerId: Int!) {
  deleteGebruikerRekening(id: $id, gebruikerId: $gebruikerId) {
    ok
  }
}
    `;
export type DeleteGebruikerRekeningMutationFn = Apollo.MutationFunction<DeleteGebruikerRekeningMutation, DeleteGebruikerRekeningMutationVariables>;

/**
 * __useDeleteGebruikerRekeningMutation__
 *
 * To run a mutation, you first call `useDeleteGebruikerRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGebruikerRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGebruikerRekeningMutation, { data, loading, error }] = useDeleteGebruikerRekeningMutation({
 *   variables: {
 *      id: // value for 'id'
 *      gebruikerId: // value for 'gebruikerId'
 *   },
 * });
 */
export function useDeleteGebruikerRekeningMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGebruikerRekeningMutation, DeleteGebruikerRekeningMutationVariables>) {
        return Apollo.useMutation<DeleteGebruikerRekeningMutation, DeleteGebruikerRekeningMutationVariables>(DeleteGebruikerRekeningDocument, baseOptions);
      }
export type DeleteGebruikerRekeningMutationHookResult = ReturnType<typeof useDeleteGebruikerRekeningMutation>;
export type DeleteGebruikerRekeningMutationResult = Apollo.MutationResult<DeleteGebruikerRekeningMutation>;
export type DeleteGebruikerRekeningMutationOptions = Apollo.BaseMutationOptions<DeleteGebruikerRekeningMutation, DeleteGebruikerRekeningMutationVariables>;
export const CreateOrganizationRekeningDocument = gql`
    mutation createOrganizationRekening($orgId: Int!, $rekening: RekeningInput!) {
  createOrganisatieRekening(organisatieId: $orgId, rekening: $rekening) {
    ok
    rekening {
      ...Rekening
    }
  }
}
    ${RekeningFragmentDoc}`;
export type CreateOrganizationRekeningMutationFn = Apollo.MutationFunction<CreateOrganizationRekeningMutation, CreateOrganizationRekeningMutationVariables>;

/**
 * __useCreateOrganizationRekeningMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationRekeningMutation, { data, loading, error }] = useCreateOrganizationRekeningMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      rekening: // value for 'rekening'
 *   },
 * });
 */
export function useCreateOrganizationRekeningMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationRekeningMutation, CreateOrganizationRekeningMutationVariables>) {
        return Apollo.useMutation<CreateOrganizationRekeningMutation, CreateOrganizationRekeningMutationVariables>(CreateOrganizationRekeningDocument, baseOptions);
      }
export type CreateOrganizationRekeningMutationHookResult = ReturnType<typeof useCreateOrganizationRekeningMutation>;
export type CreateOrganizationRekeningMutationResult = Apollo.MutationResult<CreateOrganizationRekeningMutation>;
export type CreateOrganizationRekeningMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationRekeningMutation, CreateOrganizationRekeningMutationVariables>;
export const DeleteOrganizationRekeningDocument = gql`
    mutation deleteOrganizationRekening($id: Int!, $orgId: Int!) {
  deleteOrganisatieRekening(organisatieId: $orgId, rekeningId: $id) {
    ok
  }
}
    `;
export type DeleteOrganizationRekeningMutationFn = Apollo.MutationFunction<DeleteOrganizationRekeningMutation, DeleteOrganizationRekeningMutationVariables>;

/**
 * __useDeleteOrganizationRekeningMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationRekeningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationRekeningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationRekeningMutation, { data, loading, error }] = useDeleteOrganizationRekeningMutation({
 *   variables: {
 *      id: // value for 'id'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useDeleteOrganizationRekeningMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrganizationRekeningMutation, DeleteOrganizationRekeningMutationVariables>) {
        return Apollo.useMutation<DeleteOrganizationRekeningMutation, DeleteOrganizationRekeningMutationVariables>(DeleteOrganizationRekeningDocument, baseOptions);
      }
export type DeleteOrganizationRekeningMutationHookResult = ReturnType<typeof useDeleteOrganizationRekeningMutation>;
export type DeleteOrganizationRekeningMutationResult = Apollo.MutationResult<DeleteOrganizationRekeningMutation>;
export type DeleteOrganizationRekeningMutationOptions = Apollo.BaseMutationOptions<DeleteOrganizationRekeningMutation, DeleteOrganizationRekeningMutationVariables>;
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
        return Apollo.useMutation<CreateCustomerStatementMessageMutation, CreateCustomerStatementMessageMutationVariables>(CreateCustomerStatementMessageDocument, baseOptions);
      }
export type CreateCustomerStatementMessageMutationHookResult = ReturnType<typeof useCreateCustomerStatementMessageMutation>;
export type CreateCustomerStatementMessageMutationResult = Apollo.MutationResult<CreateCustomerStatementMessageMutation>;
export type CreateCustomerStatementMessageMutationOptions = Apollo.BaseMutationOptions<CreateCustomerStatementMessageMutation, CreateCustomerStatementMessageMutationVariables>;
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
        return Apollo.useMutation<DeleteCustomerStatementMessageMutation, DeleteCustomerStatementMessageMutationVariables>(DeleteCustomerStatementMessageDocument, baseOptions);
      }
export type DeleteCustomerStatementMessageMutationHookResult = ReturnType<typeof useDeleteCustomerStatementMessageMutation>;
export type DeleteCustomerStatementMessageMutationResult = Apollo.MutationResult<DeleteCustomerStatementMessageMutation>;
export type DeleteCustomerStatementMessageMutationOptions = Apollo.BaseMutationOptions<DeleteCustomerStatementMessageMutation, DeleteCustomerStatementMessageMutationVariables>;
export const CreateJournaalpostGrootboekrekeningDocument = gql`
    mutation createJournaalpostGrootboekrekening($transactionId: Int!, $grootboekrekeningId: String!) {
  createJournaalpostGrootboekrekening(input: {transactionId: $transactionId, grootboekrekeningId: $grootboekrekeningId}) {
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
        return Apollo.useMutation<CreateJournaalpostGrootboekrekeningMutation, CreateJournaalpostGrootboekrekeningMutationVariables>(CreateJournaalpostGrootboekrekeningDocument, baseOptions);
      }
export type CreateJournaalpostGrootboekrekeningMutationHookResult = ReturnType<typeof useCreateJournaalpostGrootboekrekeningMutation>;
export type CreateJournaalpostGrootboekrekeningMutationResult = Apollo.MutationResult<CreateJournaalpostGrootboekrekeningMutation>;
export type CreateJournaalpostGrootboekrekeningMutationOptions = Apollo.BaseMutationOptions<CreateJournaalpostGrootboekrekeningMutation, CreateJournaalpostGrootboekrekeningMutationVariables>;
export const UpdateJournaalpostGrootboekrekeningDocument = gql`
    mutation updateJournaalpostGrootboekrekening($id: Int!, $grootboekrekeningId: String!) {
  updateJournaalpostGrootboekrekening(input: {id: $id, grootboekrekeningId: $grootboekrekeningId}) {
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
        return Apollo.useMutation<UpdateJournaalpostGrootboekrekeningMutation, UpdateJournaalpostGrootboekrekeningMutationVariables>(UpdateJournaalpostGrootboekrekeningDocument, baseOptions);
      }
export type UpdateJournaalpostGrootboekrekeningMutationHookResult = ReturnType<typeof useUpdateJournaalpostGrootboekrekeningMutation>;
export type UpdateJournaalpostGrootboekrekeningMutationResult = Apollo.MutationResult<UpdateJournaalpostGrootboekrekeningMutation>;
export type UpdateJournaalpostGrootboekrekeningMutationOptions = Apollo.BaseMutationOptions<UpdateJournaalpostGrootboekrekeningMutation, UpdateJournaalpostGrootboekrekeningMutationVariables>;
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
        return Apollo.useMutation<DeleteJournaalpostMutation, DeleteJournaalpostMutationVariables>(DeleteJournaalpostDocument, baseOptions);
      }
export type DeleteJournaalpostMutationHookResult = ReturnType<typeof useDeleteJournaalpostMutation>;
export type DeleteJournaalpostMutationResult = Apollo.MutationResult<DeleteJournaalpostMutation>;
export type DeleteJournaalpostMutationOptions = Apollo.BaseMutationOptions<DeleteJournaalpostMutation, DeleteJournaalpostMutationVariables>;
export const GetAllGebruikersDocument = gql`
    query getAllGebruikers {
  gebruikers {
    ...Gebruiker
  }
}
    ${GebruikerFragmentDoc}`;

/**
 * __useGetAllGebruikersQuery__
 *
 * To run a query within a React component, call `useGetAllGebruikersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGebruikersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGebruikersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllGebruikersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllGebruikersQuery, GetAllGebruikersQueryVariables>) {
        return Apollo.useQuery<GetAllGebruikersQuery, GetAllGebruikersQueryVariables>(GetAllGebruikersDocument, baseOptions);
      }
export function useGetAllGebruikersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGebruikersQuery, GetAllGebruikersQueryVariables>) {
          return Apollo.useLazyQuery<GetAllGebruikersQuery, GetAllGebruikersQueryVariables>(GetAllGebruikersDocument, baseOptions);
        }
export type GetAllGebruikersQueryHookResult = ReturnType<typeof useGetAllGebruikersQuery>;
export type GetAllGebruikersLazyQueryHookResult = ReturnType<typeof useGetAllGebruikersLazyQuery>;
export type GetAllGebruikersQueryResult = Apollo.QueryResult<GetAllGebruikersQuery, GetAllGebruikersQueryVariables>;
export const GetOneGebruikerDocument = gql`
    query getOneGebruiker($id: Int!) {
  gebruiker(id: $id) {
    ...Gebruiker
  }
}
    ${GebruikerFragmentDoc}`;

/**
 * __useGetOneGebruikerQuery__
 *
 * To run a query within a React component, call `useGetOneGebruikerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOneGebruikerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOneGebruikerQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOneGebruikerQuery(baseOptions: Apollo.QueryHookOptions<GetOneGebruikerQuery, GetOneGebruikerQueryVariables>) {
        return Apollo.useQuery<GetOneGebruikerQuery, GetOneGebruikerQueryVariables>(GetOneGebruikerDocument, baseOptions);
      }
export function useGetOneGebruikerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOneGebruikerQuery, GetOneGebruikerQueryVariables>) {
          return Apollo.useLazyQuery<GetOneGebruikerQuery, GetOneGebruikerQueryVariables>(GetOneGebruikerDocument, baseOptions);
        }
export type GetOneGebruikerQueryHookResult = ReturnType<typeof useGetOneGebruikerQuery>;
export type GetOneGebruikerLazyQueryHookResult = ReturnType<typeof useGetOneGebruikerLazyQuery>;
export type GetOneGebruikerQueryResult = Apollo.QueryResult<GetOneGebruikerQuery, GetOneGebruikerQueryVariables>;
export const GetOneGebruikerAfsprakenDocument = gql`
    query getOneGebruikerAfspraken($id: Int!) {
  gebruiker(id: $id) {
    afspraken {
      ...Afspraak
      gebruiker {
        id
      }
    }
  }
}
    ${AfspraakFragmentDoc}`;

/**
 * __useGetOneGebruikerAfsprakenQuery__
 *
 * To run a query within a React component, call `useGetOneGebruikerAfsprakenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOneGebruikerAfsprakenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOneGebruikerAfsprakenQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOneGebruikerAfsprakenQuery(baseOptions: Apollo.QueryHookOptions<GetOneGebruikerAfsprakenQuery, GetOneGebruikerAfsprakenQueryVariables>) {
        return Apollo.useQuery<GetOneGebruikerAfsprakenQuery, GetOneGebruikerAfsprakenQueryVariables>(GetOneGebruikerAfsprakenDocument, baseOptions);
      }
export function useGetOneGebruikerAfsprakenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOneGebruikerAfsprakenQuery, GetOneGebruikerAfsprakenQueryVariables>) {
          return Apollo.useLazyQuery<GetOneGebruikerAfsprakenQuery, GetOneGebruikerAfsprakenQueryVariables>(GetOneGebruikerAfsprakenDocument, baseOptions);
        }
export type GetOneGebruikerAfsprakenQueryHookResult = ReturnType<typeof useGetOneGebruikerAfsprakenQuery>;
export type GetOneGebruikerAfsprakenLazyQueryHookResult = ReturnType<typeof useGetOneGebruikerAfsprakenLazyQuery>;
export type GetOneGebruikerAfsprakenQueryResult = Apollo.QueryResult<GetOneGebruikerAfsprakenQuery, GetOneGebruikerAfsprakenQueryVariables>;
export const GetAllOrganisatiesDocument = gql`
    query getAllOrganisaties {
  organisaties {
    id
    ...Organisatie
  }
}
    ${OrganisatieFragmentDoc}`;

/**
 * __useGetAllOrganisatiesQuery__
 *
 * To run a query within a React component, call `useGetAllOrganisatiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllOrganisatiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllOrganisatiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllOrganisatiesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllOrganisatiesQuery, GetAllOrganisatiesQueryVariables>) {
        return Apollo.useQuery<GetAllOrganisatiesQuery, GetAllOrganisatiesQueryVariables>(GetAllOrganisatiesDocument, baseOptions);
      }
export function useGetAllOrganisatiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllOrganisatiesQuery, GetAllOrganisatiesQueryVariables>) {
          return Apollo.useLazyQuery<GetAllOrganisatiesQuery, GetAllOrganisatiesQueryVariables>(GetAllOrganisatiesDocument, baseOptions);
        }
export type GetAllOrganisatiesQueryHookResult = ReturnType<typeof useGetAllOrganisatiesQuery>;
export type GetAllOrganisatiesLazyQueryHookResult = ReturnType<typeof useGetAllOrganisatiesLazyQuery>;
export type GetAllOrganisatiesQueryResult = Apollo.QueryResult<GetAllOrganisatiesQuery, GetAllOrganisatiesQueryVariables>;
export const GetOneOrganisatieDocument = gql`
    query getOneOrganisatie($id: Int!) {
  organisatie(id: $id) {
    ...Organisatie
  }
}
    ${OrganisatieFragmentDoc}`;

/**
 * __useGetOneOrganisatieQuery__
 *
 * To run a query within a React component, call `useGetOneOrganisatieQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOneOrganisatieQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOneOrganisatieQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOneOrganisatieQuery(baseOptions: Apollo.QueryHookOptions<GetOneOrganisatieQuery, GetOneOrganisatieQueryVariables>) {
        return Apollo.useQuery<GetOneOrganisatieQuery, GetOneOrganisatieQueryVariables>(GetOneOrganisatieDocument, baseOptions);
      }
export function useGetOneOrganisatieLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOneOrganisatieQuery, GetOneOrganisatieQueryVariables>) {
          return Apollo.useLazyQuery<GetOneOrganisatieQuery, GetOneOrganisatieQueryVariables>(GetOneOrganisatieDocument, baseOptions);
        }
export type GetOneOrganisatieQueryHookResult = ReturnType<typeof useGetOneOrganisatieQuery>;
export type GetOneOrganisatieLazyQueryHookResult = ReturnType<typeof useGetOneOrganisatieLazyQuery>;
export type GetOneOrganisatieQueryResult = Apollo.QueryResult<GetOneOrganisatieQuery, GetOneOrganisatieQueryVariables>;
export const GetAllAfsprakenDocument = gql`
    query getAllAfspraken {
  afspraken {
    ...Afspraak
  }
}
    ${AfspraakFragmentDoc}`;

/**
 * __useGetAllAfsprakenQuery__
 *
 * To run a query within a React component, call `useGetAllAfsprakenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllAfsprakenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllAfsprakenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllAfsprakenQuery(baseOptions?: Apollo.QueryHookOptions<GetAllAfsprakenQuery, GetAllAfsprakenQueryVariables>) {
        return Apollo.useQuery<GetAllAfsprakenQuery, GetAllAfsprakenQueryVariables>(GetAllAfsprakenDocument, baseOptions);
      }
export function useGetAllAfsprakenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllAfsprakenQuery, GetAllAfsprakenQueryVariables>) {
          return Apollo.useLazyQuery<GetAllAfsprakenQuery, GetAllAfsprakenQueryVariables>(GetAllAfsprakenDocument, baseOptions);
        }
export type GetAllAfsprakenQueryHookResult = ReturnType<typeof useGetAllAfsprakenQuery>;
export type GetAllAfsprakenLazyQueryHookResult = ReturnType<typeof useGetAllAfsprakenLazyQuery>;
export type GetAllAfsprakenQueryResult = Apollo.QueryResult<GetAllAfsprakenQuery, GetAllAfsprakenQueryVariables>;
export const GetOneAfspraakDocument = gql`
    query getOneAfspraak($id: Int!) {
  afspraak(id: $id) {
    ...Afspraak
  }
}
    ${AfspraakFragmentDoc}`;

/**
 * __useGetOneAfspraakQuery__
 *
 * To run a query within a React component, call `useGetOneAfspraakQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOneAfspraakQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOneAfspraakQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOneAfspraakQuery(baseOptions: Apollo.QueryHookOptions<GetOneAfspraakQuery, GetOneAfspraakQueryVariables>) {
        return Apollo.useQuery<GetOneAfspraakQuery, GetOneAfspraakQueryVariables>(GetOneAfspraakDocument, baseOptions);
      }
export function useGetOneAfspraakLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOneAfspraakQuery, GetOneAfspraakQueryVariables>) {
          return Apollo.useLazyQuery<GetOneAfspraakQuery, GetOneAfspraakQueryVariables>(GetOneAfspraakDocument, baseOptions);
        }
export type GetOneAfspraakQueryHookResult = ReturnType<typeof useGetOneAfspraakQuery>;
export type GetOneAfspraakLazyQueryHookResult = ReturnType<typeof useGetOneAfspraakLazyQuery>;
export type GetOneAfspraakQueryResult = Apollo.QueryResult<GetOneAfspraakQuery, GetOneAfspraakQueryVariables>;
export const GetAllCsmsDocument = gql`
    query getAllCsms {
  customerStatementMessages {
    ...CustomerStatementMessage
  }
}
    ${CustomerStatementMessageFragmentDoc}`;

/**
 * __useGetAllCsmsQuery__
 *
 * To run a query within a React component, call `useGetAllCsmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCsmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCsmsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCsmsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCsmsQuery, GetAllCsmsQueryVariables>) {
        return Apollo.useQuery<GetAllCsmsQuery, GetAllCsmsQueryVariables>(GetAllCsmsDocument, baseOptions);
      }
export function useGetAllCsmsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCsmsQuery, GetAllCsmsQueryVariables>) {
          return Apollo.useLazyQuery<GetAllCsmsQuery, GetAllCsmsQueryVariables>(GetAllCsmsDocument, baseOptions);
        }
export type GetAllCsmsQueryHookResult = ReturnType<typeof useGetAllCsmsQuery>;
export type GetAllCsmsLazyQueryHookResult = ReturnType<typeof useGetAllCsmsLazyQuery>;
export type GetAllCsmsQueryResult = Apollo.QueryResult<GetAllCsmsQuery, GetAllCsmsQueryVariables>;
export const GetAllTransactionsDocument = gql`
    query getAllTransactions {
  bankTransactions {
    ...BankTransaction
    journaalpost {
      id
      afspraak {
        id
      }
      grootboekrekening {
        ...Grootboekrekening
      }
    }
  }
}
    ${BankTransactionFragmentDoc}
${GrootboekrekeningFragmentDoc}`;

/**
 * __useGetAllTransactionsQuery__
 *
 * To run a query within a React component, call `useGetAllTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTransactionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTransactionsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTransactionsQuery, GetAllTransactionsQueryVariables>) {
        return Apollo.useQuery<GetAllTransactionsQuery, GetAllTransactionsQueryVariables>(GetAllTransactionsDocument, baseOptions);
      }
export function useGetAllTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTransactionsQuery, GetAllTransactionsQueryVariables>) {
          return Apollo.useLazyQuery<GetAllTransactionsQuery, GetAllTransactionsQueryVariables>(GetAllTransactionsDocument, baseOptions);
        }
export type GetAllTransactionsQueryHookResult = ReturnType<typeof useGetAllTransactionsQuery>;
export type GetAllTransactionsLazyQueryHookResult = ReturnType<typeof useGetAllTransactionsLazyQuery>;
export type GetAllTransactionsQueryResult = Apollo.QueryResult<GetAllTransactionsQuery, GetAllTransactionsQueryVariables>;
export const GetAllRubriekenDocument = gql`
    query getAllRubrieken {
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
 * __useGetAllRubriekenQuery__
 *
 * To run a query within a React component, call `useGetAllRubriekenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllRubriekenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllRubriekenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllRubriekenQuery(baseOptions?: Apollo.QueryHookOptions<GetAllRubriekenQuery, GetAllRubriekenQueryVariables>) {
        return Apollo.useQuery<GetAllRubriekenQuery, GetAllRubriekenQueryVariables>(GetAllRubriekenDocument, baseOptions);
      }
export function useGetAllRubriekenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRubriekenQuery, GetAllRubriekenQueryVariables>) {
          return Apollo.useLazyQuery<GetAllRubriekenQuery, GetAllRubriekenQueryVariables>(GetAllRubriekenDocument, baseOptions);
        }
export type GetAllRubriekenQueryHookResult = ReturnType<typeof useGetAllRubriekenQuery>;
export type GetAllRubriekenLazyQueryHookResult = ReturnType<typeof useGetAllRubriekenLazyQuery>;
export type GetAllRubriekenQueryResult = Apollo.QueryResult<GetAllRubriekenQuery, GetAllRubriekenQueryVariables>;