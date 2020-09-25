/** Todo: mutation createCitizen() */
import {fakeAsyncCall} from "../utils/things";
import {sampleData} from "../config/sampleData/sampleData";
import {ICitizen} from "../models";

export const CreateCitizenMutation = async () => {
	// Todo: make this a GraphQL mutation
	return fakeAsyncCall();
}

export const GetCitizensQuery = async (): Promise<ICitizen[]> => {
	// Todo: make this a GraphQL query
	const citizens: ICitizen[] = sampleData.citizens;
	return fakeAsyncCall<ICitizen[]>(citizens, 500);
}