import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import india from "../json-data/india.json"
import * as topojson from 'topojson-client';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [geoData, setGeoData] = useState(null);
  const [districtData, setDistrictData] = useState(null);
  const [isDistrictView, setIsDistrictView] = useState(false);

  useEffect(() => {
    // Fetch India's state GeoJSON data
    fetch(india)
      .then((response) => response.json())
      .then((data) => {
        const geojsonData = topojson.feature(data, data.objects.states);
        setGeoData(geojsonData);
      });
  }, []);

  const onStateClick = (state) => {
    if (state.properties.name === 'Bihar') {
      // Fetch Bihar's district GeoJSON data
      fetch('/bihar-districts.json')
        .then((response) => response.json())
        .then((data) => {
          const geojsonData = topojson.feature(data, data.objects.districts);
          setDistrictData(geojsonData);
          setIsDistrictView(true);
        });
    }
  };

  return (
    <MapContainer center={[22.9734, 78.6569]} zoom={5} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {isDistrictView && districtData ? (
        <GeoJSON data={districtData} />
      ) : (
        geoData && <GeoJSON data={geoData} onEachFeature={(feature, layer) => {
          layer.on({
            click: () => onStateClick(feature),
          });
        }} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
