import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import { mongoClientCS } from "@/app/utils/mongoConnector"
import { userType } from "@/app/utils/fileFormat"
import { v4 as uuidv4 } from "uuid";
export const options: NextAuthOptions={
    providers:[
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        CredentialsProvider({
            name: "Credentails",
            credentials:{
                username:{
                    label:"Username: ",
                    type: "text",
                    placeholder: "Your username...",
                },
                password: {
                    label: "Password: ",
                    type: "password"
                }
            },
            async authorize(credentials){
                const user={id:"42", name:"Abhraneel", password:"nextauth"}
                if(credentials?.username == user.name && credentials?.password==user.password){
                    return user
                }
                else{
                    return null
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        })
    ],
    session: {
        strategy: "jwt",
      },
    callbacks:{
        
        async signIn({user}){
            await mongoClientCS.connect();
            const db=mongoClientCS.db("notesApp");
            const usersCollection=db.collection("users");
            const existingUserCheck= await usersCollection.findOne({email: user.email});
            
            try{

                if(!existingUserCheck){
                    const newUser: userType={
                        userId: uuidv4(),
                        name: user.name as string,
                        email: user.email as string,
                        imageUrl: user.image as string,
                        dateOfJoining: Number(new Date)
                    }
                    await usersCollection.insertOne(newUser);
                    console.log("inserted new user")
                }
            }
            catch (error){
                console.log(error)
            }
            return "/allnotes";
        },
    },
    
    
}
