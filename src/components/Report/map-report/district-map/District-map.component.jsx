import React, { useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import "../district-map/district-map.component.css"
function DistrictMapComponent() {
  const [distMapDetails, setDistMapDetails] = useState(JSON.parse(sessionStorage.getItem('vt-map-details') || ''));
  const [stateIdParams, setStateIdParams] = useState();
  const [distIdParams, setDistIdParams] = useState();
  const [centerForState, setCenterForState] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [highlighterMap, setHighlighterMap] = useState(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    setStateIdParams(distMapDetails?.stateId);
    setDistIdParams(distMapDetails?.districtId);
    setCenterForState([distMapDetails?.longitude, distMapDetails?.latitude]);
   
  }, [distMapDetails]);

  useEffect(() => {
    if (stateIdParams && distIdParams &&centerForState.length) {
      initializeMap();
    }
  }, [stateIdParams,distIdParams, centerForState]);

  const initializeMap = async () => {
    try {
      const options = { version: '3.45', css: true };
      const [Map, QueryTask, Query, SimpleFillSymbol, SimpleLineSymbol, Polygon, Graphic, TextSymbol, Color, Point, PictureMarkerSymbol] = await loadModules([
        'esri/map',
        'esri/tasks/QueryTask',
        'esri/tasks/query',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/geometry/Polygon',
        'esri/graphic',
        'esri/symbols/TextSymbol',
        'esri/Color',
        'esri/geometry/Point',
        'esri/symbols/PictureMarkerSymbol',
        'dojo/domReady!'
      ], options);

      const EmptyBasemap = {
        baseMapLayers: [{ url: "https://webgis1.nic.in/publishing/rest/services/bharatmaps/nuis/MapServer", opacity: 0.9 }],
        title: "NIC Street"
      };

      const map = new Map("bmap", {
        basemap: EmptyBasemap,
        center: centerForState,
        zoom: 8,
        logo: false,
        showAttribution: false,
        slider: true,
        smartNavigation: true
      });

      map.disableScrollWheel();
      map.infoWindow.resize(240, 160);

      const stateArcUrl = "https://mapservice.gov.in/gismapservice/rest/services/BharatMapService/Admin_Boundary_Village/MapServer";
      const stateArcKey = "AYoPi0yUpPCJsWAW5QDg0K1addTUhmtdg9EzfsXjyJDwgWGuUlRb0agTOejvK6RP-7KnKiszVZozignazCey6g..";

      const stateQueryTask = new QueryTask(`${stateArcUrl}/2?Token=${stateArcKey}`);
      const stateQuery = new Query();
      stateQuery.returnGeometry = true;
      stateQuery.outFields = ["*"];
      stateQuery.where = `dtcode11 ='${distIdParams}' and stcode11='${stateIdParams}'`;

      map.on("load", () => {
        stateQueryTask.execute(stateQuery).then((jsnFset) => {
          let i = 0;
          setShowMap(true);
          jsnFset.features.forEach((feature) => {
            let state_id = feature.attributes.stcode11;
            let state_nm = feature.attributes.stname;
            let dist_id = feature.attributes.dtcode11;
            let dist_name = feature.attributes.dtname;
            let vt_id = feature.attributes.sdtcode11;
            let vt_name = feature.attributes.sdtname;
            if ('' + state_nm + '' == 'undefined') {
              state_id = feature.attributes.STCODE11;
              state_nm = feature.attributes.STNAME;
              dist_id = feature.attributes.dtcode11;
              dist_name = feature.attributes.dtname;
              vt_id = feature.attributes.sdtcode11;
              vt_name = feature.attributes.sdtname;
            }

            const style = SimpleFillSymbol.STYLE_SOLID;
            const outline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([83, 86, 36]), 1.5);
            let color = new Color([251, 242, 233, 0.7]);
            if (i % 2 == 0) {
              color = new Color([170, 183, 155]);
            }
            i++;

            const sfs = new SimpleFillSymbol(style, outline, color);
            const gmtry = new Polygon(feature.geometry);

            const centroid = gmtry.getCentroid();
            const myPosition = new Point(centroid);
            const url = "https://png.pngtree.com/png-clipart/20201208/original/pngtree-school-building-png-image_5592856.jpg";
            const infoSymbol = new PictureMarkerSymbol(url, 30, 30);
            infoSymbol.setColor(new Color([0, 255, 0]));
            const labelPointGraphic = new Graphic(myPosition, infoSymbol);
            map.graphics.add(labelPointGraphic);

            const attr = {
              step: 1,
              state_id: state_id,
              state_nm: state_nm,
              district_id: dist_id,
              district_name: dist_name,
              color_code: color,
              vt_id: vt_id,
              vt_name: vt_name,
              type: "vt-map"
            };

            const infoGraphic = new Graphic(
              gmtry,
              sfs,
              attr
            );

            map.graphics.add(infoGraphic);

            const textSymbol = new TextSymbol({
              color: "black",
              haloColor: "black",
              haloSize: "1px",
              font: {
                size: 7,
                family: "sans-serif",
                weight: "bolder"
              }
            });

            const labelPointGraphic2 = new Graphic(gmtry, textSymbol, attr); //create label graphic                
            map.graphics.add(labelPointGraphic2);
          });
          setMapLoaded(true);
        });
      });

      map.on("mouse-move", (event) => {
        const graphic = event.graphic;
        if (graphic && graphic.attributes) {
        if (graphic && graphic != 'undefined') {
          const data_set = graphic.attributes;
          const event_step = data_set.step;
          const event_type = data_set.type;
          if (event_step == 1 && (event_type == 'vt-map')) {
            map.graphics.remove(highlighterMap.get("highlightPolyLine"));
            const highlightColor = new Color([0, 255, 0]);
            const highlightLine = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, highlightColor, 1);
            const highlightPolyLine = new Graphic(event.graphic.geometry, highlightLine);
            map.graphics.add(highlightPolyLine);
            highlighterMap.set("highlightPolyLine", highlightPolyLine);
            const state_id = data_set.state_id;
            const dist_id = data_set.district_id;
            const dist_name = data_set.district_name;
            const vt_id = data_set.vt_id;
            var vt_name = data_set.vt_name;

            var infoTemplate = `<table style='font-family: arial, sans-serif; width: 100%;border: 1px solid #e7d8d8'>
            <tr>
              <th style='width:20%;background-color:#132554;color:white;border: 1px solid white'>State Id</th>
              <th style='width:20%;background-color:#132554;color:white;border: 1px solid white'>VT Id</th>
                <th style='width:20%;background-color:#132554;color:white;border: 1px solid white'>Village/Town Name</th>
                <th style='width:20%;background-color:#132554;color:white;border: 1px solid white'>Country</th>
            </tr>
            <tr>
               <td style='width:20%;border: 1px solid #e7d8d8; font-size:09px'>${state_id}</td>
               <td style='width:20%;border: 1px solid #e7d8d8; font-size:09px'>${vt_id}</td>
               <td style='width:20%;border: 1px solid #e7d8d8; font-size:09px'>${vt_name} </td>
              <td style='width:20%;border: 1px solid #e7d8d8; font-size:09px'>India</td>
            </tr>
            </table>`;

            map.infoWindow.setContent(infoTemplate);
            map.infoWindow.setTitle(`<div style='font-size:15px;font-family:arial, sans-serif;background-color:#3f51b5;color:white'>Village/Town :  ${vt_name}  data</div>`);

            map.infoWindow.show(event.screenPoint, map.getInfoWindowAnchor(event.screenPoint));

          } else {
            map.infoWindow.hide();
            try { map.graphics.remove(highlighterMap.get("highlightPolyLine")); } catch (err) { }
          }
        } 
      }else {
          map.infoWindow.hide();
          try { map.graphics.remove(highlighterMap.get("highlightPolyLine")); } catch (err) { }
        }
      });




    } catch (error) {
      console.error("EsriLoader: ", error);
    }
  }








return(
  <div className="dis-map" >
  {!mapLoaded ? (
    <div id="bmap" className="esri-map-draw" style={{ background: "#768c9200", }}>
      
      {/* <div className="loader-center">
        <mat-spinner></mat-spinner>
      </div> */}
    </div>
  ) : (
    <div id="bmap" className="esri-map-draw"></div>
  )}
</div>
)
}
export default DistrictMapComponent