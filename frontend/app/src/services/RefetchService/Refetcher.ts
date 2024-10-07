import {Command} from "../commands/AbstractCommand"
import {RefetchSignalCountCommand} from "../commands/Commands"

export class Refetcher {
    private commands: {[key: string]: Command<any>} = {}

    constructor() {
        this.commands["signalcount"] = new RefetchSignalCountCommand()
    }


    public Refetch(key: string, variables?: any) {
        const command = this.commands[key]

        if (command) {
            return command.execute(variables)
        }
    }
}