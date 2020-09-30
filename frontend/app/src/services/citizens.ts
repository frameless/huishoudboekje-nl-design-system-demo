/** Todo: mutation createCitizen() */
import {fakeAsyncCall} from "../utils/things";
import {sampleData} from "../config/sampleData/sampleData";
import {ICitizen} from "../models";

// Todo: make this a GraphQL mutation
export const CreateCitizenMutation = async () => {
	return fakeAsyncCall();
}

// Todo: make this a GraphQL query
export const GetCitizensQuery = async (): Promise<ICitizen[]> => {
	const citizens: ICitizen[] = sampleData.citizens;
	return fakeAsyncCall<ICitizen[]>(citizens, 500);
}

// Todo: make this a GraphQL query
export const GetCitizenByIdQuery = async (props): Promise<ICitizen> => {
	const {id} = props;
	const citizen: ICitizen = sampleData.citizens.find(c => c.id === id);
	return fakeAsyncCall<ICitizen>(citizen, 500);
}