import { useState } from "react"
export default function Geolocation() {

    const [city, setCity] = useState("")
    const [lat, setLat] = useState()
    const [lon, setLon] = useState()

    var url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
    var token = "f18aa2a24ab6410decc3acf7f974b8eed117d79c";
    var query = { lat: lat, lon: lon };
    
    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify(query)
    }
    
    navigator.geolocation.getCurrentPosition((position) =>{
        setLat(position.coords.latitude)
        setLon(position.coords.longitude)
    })

    fetch(url, options)
    .then(response => response.text())
    .then(result => {setCity(JSON.parse(result).suggestions[0].data.city)})
    .catch(error => setCity("... А где вы?"));
    return (
        <h2>Ваше местоположение: {city}</h2>
    )
}