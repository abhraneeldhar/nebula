export async function GET(request: Request,) {
    const { searchParams } = new URL(request.url);

    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;

    try{

        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=24`)
        const data = await res.json()
        // console.log("data from inside route>>>>>>>>",data)
        return Response.json(data)
    }
    catch(Error){
        console.log(Error)
        return Response.json({Error})
    }
   
  }
