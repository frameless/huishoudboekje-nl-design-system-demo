export type TransactionSimple = {
    id?: number | undefined;
    informationToAccountOwner?: string | undefined;
    statementLine?: string | undefined;
    bedrag?: any;
    isCredit?: boolean | undefined;
    isGeboekt?: boolean | undefined
    tegenRekeningIban?: string | undefined;
    transactieDatum?: any;
    tegenRekening?: any;
    rubriek?: any
}