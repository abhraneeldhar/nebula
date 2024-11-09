"use server"
export const fetchWeather= async (lat: number, lon: number)=>{
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            console.log('Failed to fetch weather data');
        }

        // console.log("apikey>>>>>>>>>>>",apiKey)
        const data = await response.json();
        // console.log("data from fetchweather", data)
        return(data)
       
    } catch (error) {
        console.log(error);
    }
}