"use server"
export const getUserDetails= async (userId:string)=>{

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_URL+`/api/fetchUserDetails?id=${userId}`,{
            method: "GET"
        });

        if (!response.ok) {
            console.log('Failed to fetch  user details');
        }

        const data = await response.json();
        console.log(data)
        return(data)
       
    } catch (error) {
        console.log(error);
    }
}