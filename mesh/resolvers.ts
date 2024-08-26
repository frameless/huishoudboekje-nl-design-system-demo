import {Resolvers} from './.mesh'

function do_resolve(root, allowedType: string) {
    return root.entityId !== undefined && root.entityType !== undefined && allowedType == root.entityType;
}

function argsFromKeys(keys: string[]) {
    return {
        ids: keys,
        isLogRequest: true
    };
}

const resolvers: Resolvers = {
    Journaalpost: {
        transaction: {
            async resolve(root, _args, context, info) {
                if (root.transactionUuid == undefined) {
                    return undefined
                }
                return context.BankService.Query.GrpcServices_Transaction_GetByIds({
                    root,
                    key: root.transactionUuid,
                    argsFromKeys(keys: string[]) {
                        return {
                            input: {ids: keys}
                        };
                    },
                    valuesFromResults: response => response.data,
                    selectionSet: (set) => {
                        const names = set.selections.map(selection => selection.name.value).join('\n'); //Name is correct here
                        return `
                        {
                            data {
                                ${names}
                            }
                        }
                        `
                    },
                    context,
                    info
                })
            }
        }
    },
    Afspraak: {
        alarm: {
            async resolve(root, _args, context, info) {
                if (root.alarmId == undefined) {
                    return undefined
                }
                return context.AlarmService.Query.GrpcServices_Alarms_GetByIds({
                    root,
                    key: root.alarmId,
                    argsFromKeys(keys: string[]) {
                        return {
                            input: {ids: keys}
                        };
                    },
                    valuesFromResults: response => response.data,
                    selectionSet: (set) => {
                        const names = set.selections.map(selection => selection.name.value).join('\n'); //Name is correct here
                        return `
                        {
                            data {
                                ${names}
                            }
                        }
                        `
                    },
                    context,
                    info
                })
            }
        }
    },
    GrpcServices__Entity: {
        huishouden: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "huishouden")) {
                    return undefined
                }
                // console.log("TESTING")
                // context.headers['log-request'] = "THIS IS A TEST"
                // console.log(context.headers['log-request'])
                // console.log(process.env.HHB_BACKEND_URL)
                return context.Backend.RootQuery.huishoudens({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, burger: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "burger")) {
                    return undefined
                }
                return context.Backend.RootQuery.burgers({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, organisatie: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "organisatie")) {
                    return undefined
                }
                return context.Backend.RootQuery.organisaties({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, afspraak: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "afspraak")) {
                    return undefined
                }
                return context.Backend.RootQuery.afspraken({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, rekening: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "rekening")) {
                    return undefined
                }
                return context.Backend.RootQuery.rekeningen({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, customerStatementMessage: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "customerStatementMessage")) {
                    return undefined
                }
                return context.Backend.RootQuery.customerStatementMessages({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, configuratie: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "configuratie")) {
                    return undefined
                }
                return context.Backend.RootQuery.configuraties({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, rubriek: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "rubriek")) {
                    return undefined
                }
                return context.Backend.RootQuery.rubrieken({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, afdeling: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "afdeling")) {
                    return undefined
                }
                return context.Backend.RootQuery.afdelingen({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, postadres: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "postadres")) {
                    return undefined
                }
                return context.Backend.RootQuery.postadressen({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }, export: {
            async resolve(root, _args, context, info) {
                if (!do_resolve(root, "export")) {
                    return undefined
                }
                return context.Backend.RootQuery.exports({
                    root,
                    argsFromKeys,
                    key: root.entityId,
                    context,
                    info
                })
            }
        }
    }
}

export default resolvers