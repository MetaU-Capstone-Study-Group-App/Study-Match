import { useEffect, useState, useRef } from "react";
import { GOOGLE_MAPS_API_KEY } from "../utils/apiConfig";

// Address input on the Sign Up Form using Google Maps API
const AutocompleteAddress = ({addAddressCoordinates}) => {
    const inputRef = useRef();
    const [input, setInput] = useState("");

    const fillInAddress = (autocomplete) => {
        const place = autocomplete.getPlace();
        if (place.formatted_address){
            setInput(place.formatted_address);
        }
        if (place.geometry){
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            addAddressCoordinates(latitude, longitude);
        }
    }

    const autocompleteInput = () => {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: {country: ["us"]},
            types: ["geocode"],
        })
        autocomplete.setFields(["geometry", "formatted_address"]);
        autocomplete.addListener("place_changed", () => fillInAddress(autocomplete));
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.defer = true;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            autocompleteInput();
        }
    }, [])

    return (
        <input 
            type="text"
            ref={inputRef}
            value={input}
            className="signup-inputs"
            onChange={(event) => setInput(event.target.value)}
        />
    )
}

export default AutocompleteAddress;