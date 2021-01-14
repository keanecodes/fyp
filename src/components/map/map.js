import React, { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
// eslint-disable-next-line
import singmap from "data/MP14_PLNG_AREA_WEB_PL.geojson"
import { 
  settings, 
  // eslint-disable-next-line
  fetchData, 
  // eslint-disable-next-line
  loadInitialPolygon, 
  enableMapHover, 
  // eslint-disable-next-line
  enableMapClick,
  enable3d 
} from "./mapHelpers";
import { renderDeckglLayers } from "./deckgl";

export default function Map() {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  const [map, setMap] = useState(null);
  // const [mapDat, setMapDat] = useState(singmap)
  const mapContainer = useRef(null);
  

  useEffect(() => {
    // fetchData(singmap).then(data => {
    //   setMapDat(data)
    // });

    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        ...settings
      });
  
      map.on("load", () => {        
        // loadInitialPolygon(map, mapDat);
          
        enableMapHover(map, new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        }));

        // enableMapClick(map);
        enable3d(map);

        renderDeckglLayers(map);
        
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);
  // }, [map, mapDat]);

  return <div id="map" ref={el => (mapContainer.current = el)}/>;
};