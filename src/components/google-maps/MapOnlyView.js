
import React, { useState } from 'react'
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import usePlacesAutocomplete, {getGeocode, getLatLng,} from "use-places-autocomplete";
import { Loader } from "@googlemaps/js-api-loader"
//import useOnclickOutside from "react-cool-onclickoutside";

import "./estilos_modal_map.css";

function Map(props) {
    const { empresaMarker} = props;
    const [marker, setMarker] = useState({lat: -23.5325518, lng :-70.399952});
    const [selected, setSelected] = useState(null);

    return (
            <GoogleMap 
                defaultZoom={18} 
                defaultCenter={{lat: empresaMarker.lat, lng : empresaMarker.lng}}
                
                center={{lat: empresaMarker.lat, lng : empresaMarker.lng}} 
            >
                <Marker 
                    position={{lat: empresaMarker.lat, lng : empresaMarker.lng}} 
                    onClick={() => {
                        setSelected(empresaMarker);
                    }}
                />

                {selected ? 
                <InfoWindow 
                    position={{lat: empresaMarker.lat, lng : empresaMarker.lng}}
                    onCloseClick={() => {
                        setSelected(null);
                    }} 
                >
                    <div>
                        <h5>ej: Groot Limitada</h5>
                    </div>
                </InfoWindow> : null}
            </GoogleMap>
    )
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function GMap(props){
    const {empresaMarker} = props;
    return (
        <div style={{width : "90vw" , height : "100vh"}}>
            
            <WrappedMap 
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBqrL85U3SOAdjVV7b3Xhe4xYd6vE4WY3A&libraries=places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                empresaMarker={empresaMarker}
            />
        </div>
    )
}
