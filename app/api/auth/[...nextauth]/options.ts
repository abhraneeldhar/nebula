import type { NextAuthOptions } from "next-auth"
// import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
// import CredentialsProvider from "next-auth/providers/credentials"
// import Github from "next-auth/providers/github"
import { mongoClientCS } from "@/app/utils/mongoConnector"
// import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken"
// import { userType } from "@/app/utils/fileFormat"
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { getUserDetails } from "@/app/utils/getUserDetails";
// import { userDetailsType } from "@/app/setupAccount/page"
// import { supabase } from "@/app/utils/supabase/client"
// import { defaultPfpUpdate } from "@/app/utils/defaultPfpUpdate"
// import { setupNewAccount } from "@/app/utils/setupNewAccount"

async function setupNewAccount(userId: string) {
    const userDetails = await getUserDetails(userId);
    if (userDetails.newAccount == false) {
        return (null)
    }
    console.log("userdetails: ",userDetails)

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log("created supabase client")

    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const defaultNotes = db.collection("defaultNotes");
    const notesCollection=db.collection("notes");
    const usersCollection=db.collection("users")
    const defaultNotesArray = await defaultNotes.find({}).toArray();

    // Modify the array here
    const newDefaultNotes = defaultNotesArray.map(note => {
        const { _id, ...rest } = note;
        return {
            ...rest,
            id: uuidv4(),
            owner: userId,
            lastModifiedAt: Date.now()
        };
    });

    console.log("default notes are: ",newDefaultNotes);
    console.log("inserting default notes");
    await notesCollection.insertMany(newDefaultNotes);


    console.log("inserted default notes: ")
    


    const { data: defaultProfilePics, error: e1 } = await supabase
        .storage
        .from('profilePics')
        .list('default')
    if (defaultProfilePics) {
        const newPicName = `profileImage${Date.now()}`
        const randomPfp = defaultProfilePics[Math.floor(Math.random() * defaultProfilePics.length)]

        const { data:copyData, error: e2 } = await supabase
            .storage
            .from('profilePics')
            .copy(`default/${randomPfp.name}`, `${userId}/${newPicName}`)

        console.log(copyData)

        const { data: publicUrl } = supabase
            .storage
            .from('profilePics')
            .getPublicUrl(`${userId}/${newPicName}`)


        console.log("new pic url>>>>> ", publicUrl)

        await usersCollection.updateOne({userId:userId},{$set:{imageUrl:publicUrl.publicUrl}})

    }

    await usersCollection.updateOne({userId:userId},{$set:{newAccount:false}})

}

export const options: NextAuthOptions = {
    // adapter: SupabaseAdapter({
    //     url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    //     secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    // }),
    providers: [
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
            const existingUserCheck = await usersCollection.countDocuments({ email: user.email });
            // console.log("existing check>>>>>>>>>>",existingUserCheck)
            try {
                if (user) {

                    if (existingUserCheck == 0) {
                        console.log("if trigerred\n\n")
                        
                        const newUser = {
                            userId: user.id as string,
                            name: user.name as string,
                            userName: (String(user.name?.replace(/\s/g, '')) + String(uuidv4().slice(0, 5))).toLowerCase() as string,
                            email: user.email as string,
                            bio: "",
                            imageUrl: null,
                            dateOfJoining: Number(new Date),
                            friendList: [],
                            newAccount:true
                        }
                        await usersCollection.insertOne(newUser);
                        console.log("inserted new user")

                        await setupNewAccount(user.id);

                        // return "home";
                        return(true);
                        
                    }
                }


            }
            catch (error) {
                console.log(error)
                // return(true)
            }
            return true;
        },
        // async session({ session, user }) {

        //     const signingSecret = process.env.SUPABASE_JWT_SECRET as string
        //     if (user && session) {
        //         const payload = {
        //             aud: "authenticated",
        //             exp: Math.floor(new Date(session.expires).getTime() / 1000),
        //             sub: user.id as string,
        //             email: user.email as string,
        //             role: "authenticated",
        //         }
        //         session.supabaseAccessToken = jwt.sign(payload, signingSecret)
        //     }


        //     return session
        // },
        async jwt({ token, user }) {
            // Attach user data to the token on initial login
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session) {
                const signingSecret = process.env.SUPABASE_JWT_SECRET as string;
                const payload = {
                    aud: "authenticated",
                    exp: Math.floor(new Date(session.expires).getTime() / 1000),
                    sub: token.id as string,
                    email: token.email as string,
                    role: "authenticated",
                };
                session.supabaseAccessToken = jwt.sign(payload, signingSecret);
            }
            return session;
        },
    },

}
