import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import { mongoClientCS } from "@/app/utils/mongoConnector"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken"
import { userType } from "@/app/utils/fileFormat"
import { v4 as uuidv4 } from "uuid";


export const options: NextAuthOptions = {
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL as string,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    }),
    providers: [
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID as string,
        //     clientSecret: process.env.GITHUB_SECRET as string
        // }),
        // CredentialsProvider({
        //     name: "Credentails",
        //     credentials:{
        //         username:{
        //             label:"Username: ",
        //             type: "text",
        //             placeholder: "Your username...",
        //         },
        //         password: {
        //             label: "Password: ",
        //             type: "password"
        //         }
        //     },
        //     async authorize(credentials){
        //         const user={id:"42", name:"Abhraneel", password:"nextauth"}
        //         if(credentials?.username == user.name && credentials?.password==user.password){
        //             return user
        //         }
        //         else{
        //             return null
        //         }
        //     }
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {

        async signIn({ user }) {
            await mongoClientCS.connect();
            const db = mongoClientCS.db("notesApp");
            const usersCollection = db.collection("users");
            const existingUserCheck = await usersCollection.findOne({ email: user.email });

            try {
                if (user) {

                    if (!existingUserCheck) {
                        const newUser: userType = {
                            userId: user.id as string,
                            name: user.name as string,
                            userName: String(user.name?.replace(/\s/g,''))+String(uuidv4().slice(0, 5)) as string,
                            email: user.email as string,
                            imageUrl: user.image as string,
                            dateOfJoining: Number(new Date)
                        }
                        await usersCollection.insertOne(newUser);
                        console.log("inserted new user")
                        return "/setupAccount";
                    }
                }
            }
            catch (error) {
                console.log(error)
            }
            // return "/allnotes";
            return true;
        },
        async session({ session, user }) {
            const signingSecret = process.env.SUPABASE_JWT_SECRET as string

            if (signingSecret && user && session) {
                const payload = {
                    aud: "authenticated",
                    exp: Math.floor(new Date(session.expires).getTime() / 1000),
                    sub: user.id,
                    email: user.email,
                    role: "authenticated",
                }
                session.supabaseAccessToken = jwt.sign(payload, signingSecret)
            }
            return session
        },
    },

}
