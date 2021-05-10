
import React, { useState } from 'react'
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import usePlacesAutocomplete, {getGeocode, getLatLng,} from "use-places-autocomplete";
import { Loader } from "@googlemaps/js-api-loader"
//import useOnclickOutside from "react-cool-onclickoutside";

import "./estilos_modal_map.css";

function Map(props) {
    const {markerSearch, setMarkerSearch, setEmpresaMarker, empresaMarker} = props;
    const [marker, setMarker] = useState({lat: -23.5325518, lng :-70.399952});
    const [selected, setSelected] = useState(null);

    return (
            <GoogleMap 
                defaultZoom={18} 
                defaultCenter={{lat: markerSearch.lat, lng : markerSearch.lng}}
                onClick={(event) => {
                    setMarkerSearch({
                        lat: event.latLng.lat(),
                        lng : event.latLng.lng(),
                    });
                    console.log(event);
                }}
                
                center={{lat: markerSearch.lat, lng : markerSearch.lng}} 
            >
                <Marker 
                    position={{lat: markerSearch.lat, lng : markerSearch.lng}} 
                    onClick={() => {
                        setSelected(markerSearch);
                    }}
                    onPositionChanged={() => {
                        console.log("POSITION CHANGED !!");
                        setEmpresaMarker(markerSearch);
                    }}

                />

                {selected ? 
                <InfoWindow 
                    position={{lat: markerSearch.lat, lng : markerSearch.lng}}
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
    const {setEmpresaMarker, empresaMarker , setDireccion} = props;
    const [markerSearch, setMarkerSearch] = useState({lat: -23.5325518, lng :-70.399952});
    return (
        <div style={{width : "90vw" , height : "100vh"}}>
            <div className="Search-wrapper">
                <Search setMarkerSearch={setMarkerSearch} setEmpresaMarker={setEmpresaMarker} setDireccion={setDireccion}/>
            </div>
            
            <WrappedMap 
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBqrL85U3SOAdjVV7b3Xhe4xYd6vE4WY3A&libraries=places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                markerSearch={markerSearch}
                setMarkerSearch={setMarkerSearch}
                empresaMarker={empresaMarker}
            />
        </div>
    )
}

function Search(props){
    const {setMarkerSearch, setEmpresaMarker, setDireccion} = props;
    const {ready, value, suggestions: {status, data}, setValue, clearSuggestions} = usePlacesAutocomplete({
        requestOptions: {
            location: {lat: () =>  -23.5325518, lng :() => -70.399952},
            radius: 200 * 1000,
        }
    });
    
      const handleInput = (e) => {
        // Update the keyword of the input element
        setValue(e.target.value);
        console.log(e.target.value);
      };
    
      const handleSelect = ({ description }) => () => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false);
        console.log(description);
        setDireccion(description);
        clearSuggestions();
    
        // Get latitude and longitude via utility functions
        getGeocode({ address: description })
          .then((results) => getLatLng(results[0]))
          .then(({ lat, lng }) => {
                setEmpresaMarker({ lat, lng });
                setMarkerSearch({ lat, lng });
                console.log("📍 Coordinates: ", { lat, lng });
            })
          .catch((error) => {
            console.log("😱 Error: ", error);
          });
      };

      const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li key={place_id} onClick={handleSelect(suggestion)} className="List-item">
                    <strong className="List-text">{main_text}</strong> <small className="List-text">{secondary_text}</small>
                </li>
            );
        });

    return (
        <div className="Input-wrapper">
            <input
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Escriba una dirección"
                className="Input-search"
            />
            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === "OK" && <ul>{renderSuggestions()}</ul>}
        </div>
    )
}
