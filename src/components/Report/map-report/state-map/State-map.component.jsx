import React, { useState, useEffect } from "react";
import { loadModules } from "esri-loader";
import "../state-map/state-map.component.css";
import { fetchAllStateSchemesData, fetchDashboardData, fetchSchoolStatsData, fetchStudentStatsData, fetchTeachersStatsData } from "../../../../redux/thunks/dashboardThunk";
import {
  allDWiseregionType,
  specificDWiseregionType,
  districtWiseName,
  blockWiseName,
} from "../../../../constants/constants";

import { fetchYearData } from "../../../../redux/thunks/yearThunk";
import { allFilter } from "../../../../redux/slice/schoolFilterSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateMapLoaded, updateMapSession } from "../../../../redux/slice/mapSlice";
import { fetchBlockByDistrictCode, removeAllBlock } from "../../../../redux/thunks/blockThunk";
import { updateFilterDistrict } from "../../../../redux/thunks/districtThunk";
import { useLocation } from "react-router-dom";
import { fetchArchiveServicesSchoolData } from "../../../../redux/thunks/archiveServicesThunk";
window.localStorage.setItem("map_district_name", "District");
const StateMapComponent = ({ handleBack, mapLoaded }) => {
  const dispatch = useDispatch();
  const location = useLocation()
  const schoolFilter = useSelector((state) => state.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const headerSlice = useSelector((state)=>state.header);
  const headerData = useSelector((state) => state.header)
  const mapData = useSelector((state) => state.mapData);
  const districtDataClone = useSelector((state) => state.distrct.dataClone);
  const [highlighterMap, setHighlighterMap] = useState(new Map());
  const [stateIdParams, setStateIdParams] = useState();
  const [centerForState, setCenterForState] = useState([]);
const [selectedDistrictGraphic, setSelectedDistrictGraphic] = useState(null);


  useEffect(() => {
    setStateIdParams(mapData?.stateMapDetails?.stateId);
    setCenterForState([
      mapData?.stateMapDetails?.longitude,
      mapData?.stateMapDetails?.latitude,
      dispatch(updateMapLoaded(true))
    ]);
  }, [mapData]);

  useEffect(() => {
    if (stateIdParams && centerForState.length) {
    //  document.getElementById("bmap").innerHTML = "";
      initializeMap();
    }
  }, [stateIdParams, centerForState,]);
  const getOriginalSymbol = (graphic) => {
    return graphic.symbol.color;
};

  
  const stateArcUrl =
    "https://mapservice.gov.in/gismapservice/rest/services/BharatMapService/Admin_Boundary_Village/MapServer";
  const stateArcKey =
    "AYoPi0yUpPCJsWAW5QDg0PC4uO_lxb5JGyJajKwyMUBWB-X2MB_XkuK3wFDwHj_xcNuQY5ioZvm51G6MNJiVfg..";

  const initializeMap = async () => {
    try {
      const options = { version: "3.45", css: true };
      const [
        Map,
        QueryTask,
        Query,
        SimpleFillSymbol,
        SimpleLineSymbol,
        Polygon,
        Graphic,
        TextSymbol,
        Color,
        Point,
      ] = await loadModules(
        [
          "esri/map",
          "esri/tasks/QueryTask",
          "esri/tasks/query",
          "esri/symbols/SimpleFillSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/geometry/Polygon",
          "esri/graphic",
          "esri/symbols/TextSymbol",
          "esri/Color",
          "esri/geometry/Point",
          "esri/symbols/PictureMarkerSymbol",
        ],
        options
      );

      const EmptyBasemap = {
        baseMapLayers: [
          {
            url: "https://webgis1.nic.in/publishing/rest/services/bharatmaps/nuis/MapServer",
            opacity: 0.9,
          },
        ],
        title: "NIC Street",
      };

      const mapObj = new Map("bmap", {
        basemap: EmptyBasemap,
        center: centerForState,
        zoom: 6,
        logo: false,
        showAttribution: false,
        slider: true,
        smartNavigation: true,
        autoResize: true,
        height: 600,
      });
      mapObj.disableScrollWheel();
      mapObj.infoWindow.resize(240, 160);

      const stateQueryTask = new QueryTask(
        `${stateArcUrl}/1?Token=${stateArcKey}`
      );
      const stateQuery = new Query();
      stateQuery.returnGeometry = true;
      stateQuery.outFields = ["*"];
      stateQuery.where = `stcode11='${stateIdParams}'`;

      mapObj.on("load", () => {
        try {
          stateQueryTask.execute(stateQuery).then((jsnFset) => {
            let i = 0;
            dispatch(updateMapLoaded(true))
            jsnFset.features.forEach((feature) => {
              let state_id = feature.attributes.stcode11;
              let state_nm = feature.attributes.stname;
              let dist_id = feature.attributes.dtcode11;
              let dist_name = feature.attributes.dtname;
              if (`${state_nm}` == "undefined") {
                state_id = feature.attributes.STCODE11;
                state_nm = feature.attributes.STNAME;
                dist_id = feature.attributes.dtcode11;
                dist_name = feature.attributes.dtname;
              }

              const style = SimpleFillSymbol.STYLE_SOLID;
              const outline = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([83, 86, 36]),
                1
              );
              let color = new Color([251, 242, 233, 0.7]);
              if (i % 2 != 0) {
                color = new Color([170, 183, 155]);
              }
              i++;

              const sfs = new SimpleFillSymbol(style, outline, color);
              const gmtry = new Polygon(feature.geometry);

              const attr = {
                step: 1,
                state_id: state_id,
                state_nm: state_nm,
                district_id: dist_id,
                district_name: dist_name,
                color_code: color,
                type: "district-map",
              };

              const infoGraphic = new Graphic(gmtry, sfs, attr);
              mapObj.graphics.add(infoGraphic);

              const textSymbol = new TextSymbol({
                color: "black",
                haloColor: "black",
                haloSize: "1px",
                font: {
                  size: 7,
                  family: "sans-serif",
                  weight: "bolder",
                },
              });

              const labelPointGraphic = new Graphic(gmtry, textSymbol, attr);
              mapObj.graphics.add(labelPointGraphic);
            });

          });

        }
        catch (err) {
          console.log(err);
        }
      });

      mapObj.on("mouse-move", (event) => {
        var graphic = event?.graphic;
        if (graphic && graphic.attributes) {
          if (graphic && graphic != "undefined") {
            var data_set = graphic.attributes;
            var event_step = data_set.step;
            var event_type = data_set.type;

            if (event_step == 1 && event_type == "district-map") {
              //---------------------------------------------
              mapObj.graphics.remove(highlighterMap.get("highlightPolyLine"));
              var highlightColor = new Color([0, 255, 0]);
              var highlightLine = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                highlightColor,
                1
              );
              var highlightPolyLine = new Graphic(
                event.graphic.geometry,
                highlightLine
              );
              mapObj.graphics.add(highlightPolyLine);
              highlighterMap.set("highlightPolyLine", highlightPolyLine);

              //---------------------------------------------

              var state_id = data_set.state_id;
              var event_state_nm = data_set.state_nm;
              var dist_id = data_set.district_id;
              var dist_name = data_set.district_name;
              var infoTemplate = `<table style='font-family: arial, sans-serif; width: 100%;border: 1px solid #e7d8d8'>
            <tr>
              <th style='width:20%;background-color:#132554;color:white;border: 1px solid white'>State Id</th>
              <th style='width:20%;background-color:#132554;color:white;border: 1px solid white'>District Id</th>
                <th style='width:20%;background-color:#132554;color:white;border: 1px solid white'>District Name</th>
                <th style='width:20%;background-color:#132554;color:white;border: 1px solid white'>Country</th>
            </tr>
            <tr>
               <td style='width:20%;border: 1px solid #e7d8d8; font-size:09px'>${state_id}</td>
               <td style='width:20%;border: 1px solid #e7d8d8; font-size:09px'>${dist_id}</td>
               <td style='width:20%;border: 1px solid #e7d8d8; font-size:09px'>${dist_name} </td>
              <td style='width:20%;border: 1px solid #e7d8d8; font-size:09px'>India</td>
            </tr>
            </table>`;

              mapObj.infoWindow.setContent(infoTemplate);
              mapObj.infoWindow.setTitle(
                `<div style='font-size:15px;font-family:arial, sans-serif;background-color:#3f51b5;color:white'>State :  ${event_state_nm}  data</div>`
              );

              mapObj.infoWindow.show(
                event.screenPoint,
                mapObj.getInfoWindowAnchor(event.screenPoint)
              );
            } else {
              mapObj.infoWindow.hide();
              try {
                mapObj.graphics.remove(
                  this.highlighterMap.get("highlightPolyLine")
                );
              } catch (err) { }
            }
          }
        } else {
          mapObj.infoWindow.hide();
          try {
            mapObj.graphics.remove(
              this.highlighterMap.get("highlightPolyLine")
            );
          } catch (err) { }
        }
      });
      
      
    let previousSelectedGraphic = null;
      mapObj.on("click", async (event) => {
        const graphic = event.graphic;
        if (graphic && graphic.attributes) {
          const event_step = graphic.attributes.step;
          const event_type = graphic.attributes.type;
          if (event_step === 1 && event_type === "district-map") {
            if (previousSelectedGraphic && previousSelectedGraphic !== graphic) {
              const originalSymbol = getOriginalSymbol(previousSelectedGraphic);
              if (originalSymbol) {
                  previousSelectedGraphic.setSymbol(originalSymbol);
              }
          }
            const point = new Point(graphic.geometry.getCentroid());
            const latitude = point.getLatitude();
            const longitude = point.getLongitude();

            const state_code = graphic.attributes.state_id;
            const district_name = graphic.attributes.district_name;
            const district_code =graphic.attributes.district_code;

            const obj = {
              stateId: state_code,
              districtId: district_code,
              districtName: district_name,
              latitude: latitude,
              longitude: longitude,
            };

            sessionStorage.setItem("vt-map-details", JSON.stringify(obj));
            window.localStorage.setItem("district", obj.districtName);
            window.localStorage.setItem("map_district_name", obj.districtName);
             dispatch(fetchDashboardData(filterObj));
             setSelectedDistrictGraphic(graphic);
             previousSelectedGraphic = graphic;

             const selectedSymbol = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2),
              new Color([255, 0, 0, 0.7])
          );
          graphic.setSymbol(selectedSymbol);
           
            

        //      if (district_name === districtWiseName) {
      
        //       filterObj.regionType = allDWiseregionType;
        //       filterObj.regionCode = district_code;
        
        //       filterObj.dType = allDWiseregionType;
        //       filterObj.dCode = district_code;
        
        //       dispatch(allFilter(filterObj));
        //       handleAPICallAccordingToFilter(filterObj);
        //       dispatch(removeAllBlock());
        //     } else {
        //       filterObj.regionType = specificDWiseregionType;
        //       filterObj.regionCode = district_code;
        //       filterObj.dType = specificDWiseregionType;
        //       filterObj.dCode = district_code;
        //        filterObj.dashboardRegionCode = district_code;
        //       dispatch(
        //         fetchBlockByDistrictCode({
        //           district_code: district_code,
        //           yearId: filterObj.yearId,
        //         })
        //       );
        //       dispatch(allFilter(filterObj));
             
        // console.log(filterObj, "ssssssssss")
        //       headerData.isViewDataByShow && handleAPICallAccordingToFilter(filterObj);
             
        //       if (!headerData.isViewDataByShow) {
        //         const block_data = district_code + "@" + blockWiseName;
           
        //       }
        
        //     }
        //     dispatch(updateFilterDistrict(districtDataClone.data));
        //     dispatch(removeAllBlock());
           
        //     window.localStorage.setItem("map_district_name", district_name);
        //     window.localStorage.setItem("district", district_name);
          
        
          }
        }
      });
    } catch (error) {
      console.error("EsriLoader: ", error);
    }

    const handleAPICallAccordingToFilter = (objs) => {
      if (location.pathname !== "/") {
        dispatch(fetchArchiveServicesSchoolData(objs));
      } else {
        if(headerSlice.headerName==="Education Dashboard"){
          dispatch(fetchDashboardData(objs));
          dispatch(fetchSchoolStatsData(objs));
          dispatch(fetchTeachersStatsData(objs));
          dispatch(fetchStudentStatsData(objs)); 
        }else if(headerSlice.headerName==="School Dashboard"){
          dispatch(fetchSchoolStatsData(objs));
        }else if(headerSlice.headerName==="Teacher Dashboard"){
          dispatch(fetchTeachersStatsData(objs));
        }else{
          dispatch(fetchStudentStatsData(objs));
        }
      }
    };
  };

  // useEffect(() => {
  //   dispatch(fetchAllStateSchemesData(filterObj)).then((res)=>{
  //     initializeMap(res.payload.data);
  //   })
  // }, [headerData.showDistricts]);

  return (
    <>
      <button type="button" className="btn btn-sm back-btn btn-primary" onClick={handleBack}>Back</button>
      <div className="state-map " style={{ width: "40vw" }}>
        <div
          id="bmap"
          className="esri-map-draw"
          style={{ background: "#768c9200" }}
        >
          {!mapData.mapLoaded && (
            <div className="loader-center">
              <div className="spinner-border" role="status">
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StateMapComponent;
