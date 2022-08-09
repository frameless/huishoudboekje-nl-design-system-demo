import {Alarm} from "@prisma/client";
import prisma from "../../src/client";

const getManyAlarms = async (filters: Record<string, any>): Promise<Alarm[] | unknown> => {
    let filter = Object.keys(filters).reduce((mapping, key) => {
            let value = filters[key]

            if (value instanceof Array) {
                if (value.length > 0) {
                    mapping[key] = {
                        in: value
                    }
                }
            } else {
                mapping[key] = value
            }

            return mapping
        }, {})

    return await prisma.alarm.findMany({
        where: filter
    });
};

export default getManyAlarms;