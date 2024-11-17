"use server"

export const fetchUserId= async (userEmail:string)=>{

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_URL+`/api/fetchUserId?email=${userEmail}`,{
            method: "GET"
        });

        if (!response.ok) {
            console.log('Failed to fetch  userID');
        }

        const data = await response.json();
        return(data)
       
    } catch (error) {
        console.log(error);
    }
}