"use server"
export const fetchWeather= async (lat: number, lon: number)=>{

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_URL+`/api/getWeather?lat=${lat}&lon=${lon}`,{
            method: "GET"
        });

        if (!response.ok) {
            console.log('Failed to fetch weather data');
        }

        const data = await response.json();
        return(data)
       
    } catch (error) {
        console.log(error);
    }
}