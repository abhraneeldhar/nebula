// import { getSession } from "next-auth/react"
"use client"
import { useSession } from "next-auth/react";

export default function AuthTesting() {
  const { data: session } = useSession();

  
  return (<>
    {session && session.user &&

      <div>
        <h1>Welcome, {session.user.name}!</h1>
        <p>Your email: {session.user.email}</p>
        
      </div>
    }
  </>
  );
}