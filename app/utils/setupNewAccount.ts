import { getUserDetails } from "./getUserDetails";

export async function setupNewAccount(userId:string){
    const userDetails= await getUserDetails(userId);
    
}