import L from "leaflet";
import "leaflet/dist/leaflet.css";

export function getColor(d) {
  return d > 25
    ? "#800026"
    : d > 20
    ? "#E31A1C"
    : d > 15
    ? "#FD8D3C"
    : d > 10
    ? "#FEB24C"
    : d > 5
    ? "#FED976"
    : "#FFEDA0";
}

export function getCenterOfGeoJson(geoJson) {
  // Create a leaflet GeoJSON layer from the data
  const geoJsonLayer = L.geoJSON(geoJson);
  
  // Get the bounds of the layer
  const bounds = geoJsonLayer.getBounds();
  
  // Return the center of the bounds
  return bounds.getCenter();
}

export function layersUtils(geoJsonLayer, map) {
  function highlightOnClick(e) {
    var layer = e.target;

    layer.setStyle({
      // weight: 2,
      // color: "#f90303",
      // dashArray: "",
      // fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    // geoJsonLayer.resetStyle(e.target);
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  return { highlightOnClick, resetHighlight, zoomToFeature };
}
