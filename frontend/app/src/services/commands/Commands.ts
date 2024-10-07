import {Command} from "./AbstractCommand";

export class RefetchSignalCountCommand extends Command<any> {
    execute(variables?: any): void {
        this.RefetchQuery("GetSignalsCount")
    }

}