import React, { useState, useEffect, lazy, Suspense, useRef, useCallback, useMemo } from "react";
import { loadModules } from "esri-loader";
import "../india-map/india-map.component.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData, fetchSchoolStatsData, fetchStudentStatsData, fetchTeachersStatsData, fetchAllStateSchemesData } from "../../../../redux/thunks/dashboardThunk";

import {
  nWiseregionType,
  nWiseregionCode,
  selectedDYear,
  allSWiseregionType,
  allSWiseregionCode,
  specificSWiseregionType,
  nationalWiseName,
  stateWiseName,

} from "../../../../constants/constants";

import {
  fetchDistrictDataByStateCode,
  removeAllDistrict,

} from "../../../../redux/thunks/districtThunk";
import { fetchYearData } from "../../../../redux/thunks/yearThunk";
import { allFilter } from "../../../../redux/slice/schoolFilterSlice";
import { hideShowColumn } from "../../../../redux/slice/dataGridAPISlice";
import { useLocation } from "react-router-dom";
import {
  setUpdateFlag,
  updateMapData,
  updateMapLoaded,
  updateMapSession,
} from "../../../../redux/slice/mapSlice";
import { handleShowDistrict } from "../../../../redux/slice/headerSlice";
import { fetchArchiveServicesSchoolData } from "../../../../redux/thunks/archiveServicesThunk";
import { removeAllBlock } from "../../../../redux/thunks/blockThunk";
window.localStorage.setItem("map_state_name", "All India/National");
window.localStorage.setItem("map_district_name", "District");

const StateMapComponent = lazy(() =>
  import("../state-map/State-map.component")
);
export default function IndiaMapComponent() {
  const bmapRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const [selectedState, setSelectedState] = useState(nationalWiseName);
  const [highlighterMap, setHighlighterMap] = useState(new Map());
  const [selectedStateMapDetails, setSelectedStateMapDetails] = useState([]);
  const headerData = useSelector((state) => state?.header);
  const mapData = useSelector((state) => state?.mapData);
  const schoolFilter = useSelector((state) => state?.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const headerSlice = useSelector((state) => state.header);
  const grossEData = useSelector((state) => state?.mapData?.grossEData)
  const updateFlag = useSelector((state) => state.mapData.updateFlag)
  const handles = sessionStorage.getItem('handle');
  const [handlClickWise, setHandleClickWise] = useState()
  const SchemesData = useSelector((state) => state?.schemesAllState?.data?.data) || {}
  const [abc, setAbc] = useState([]);
  window.localStorage.setItem("state", selectedState);




  useEffect(() => {
    setAbc(SchemesData);
  }, [grossEData])
  useEffect(() => {
    setHandleClickWise(grossEData)
  }, [grossEData])
  useEffect(() => {
    sessionStorage.setItem('handle', '');
  }, [headerSlice])

  useEffect(() => {
    sessionStorage.setItem('handle', '');
    const elements = document.querySelectorAll('.impact-box-content.active');
    elements.forEach(element => {
      element.classList.remove('active');
    });
    const bmapElement = document.getElementById("bmap");
    if (bmapElement && (handles !== "" || handles == null)) {
      bmapElement.innerHTML = "";
    }
    if (bmapElement) {
      initializeMap();
    }
  }, [headerData.headerName, updateFlag]);




  const stateArcUrl =
    "https://mapservice.gov.in/gismapservice/rest/services/BharatMapService/Admin_Boundary_Village/MapServer";
  const stateArcKey =
    "AYoPi0yUpPCJsWAW5QDg0PC4uO_lxb5JGyJajKwyMUBWB-X2MB_XkuK3wFDwHj_xcNuQY5ioZvm51G6MNJiVfg..";

  const handleBack = () => {
    sessionStorage.setItem('handle', '');
    const elements = document.querySelectorAll('.impact-box-content.active');
    elements.forEach(element => {
      element.classList.remove('active');
    });
    window.localStorage.setItem("map_state_name", "All India/National")
    window.localStorage.setItem("map_district_name", "District")
    sessionStorage.clear()
    const modifiedFilterObj = {
      ...structuredClone(schoolFilter),
      categoryCode: 0,
      dashboardRegionCode: "09",
      dashboardRegionType: 10,
      locationCode: 0,
      managementCode: 0,
      regionCode: "11",
      regionType: 21,
      dType: 10,  //21statewise //10 for all india 
      dCode: 99, // 11statewise //99 for all india
      schoolTypeCode: 0,
      yearId: 8
    };
    // dispatch(removeAllDistrict());
    // dispatch(removeAllBlock());
    dispatch(handleShowDistrict(false));
    dispatch(updateMapLoaded(false));
    dispatch(fetchDashboardData(modifiedFilterObj));
    dispatch(fetchSchoolStatsData(modifiedFilterObj));
    dispatch(fetchTeachersStatsData(modifiedFilterObj));
    dispatch(fetchStudentStatsData(modifiedFilterObj));
    const modifiedFilterObjs = {
      regionCode: 99,
      dCode: 99,
      regionType: 21,
      yearId: 8
    };
    dispatch(fetchAllStateSchemesData(modifiedFilterObjs))

  }

  const initializeMap = async (data) => {

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
        PictureMarkerSymbol,
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
          "dojo/domReady!",
        ],
        options
      );

      const emptyBasemap = {
        baseMapLayers: [
          {
            url: "https://webgis1.nic.in/publishing/rest/services/bharatmaps/nuis/MapServer",
            opacity: 0.9,
          },
        ],
        title: "NIC Street",
      };

      const map = new Map("bmap", {
        basemap: emptyBasemap,
        center: [83.0, 24.0],
        zoom: 4,
        logo: false,
        showAttribution: false,
        slider: true,
        smartNavigation: true,

      });

      map?.disableScrollWheel();
      map?.infoWindow?.resize(240, 160);
      const stateQueryTask = new QueryTask(
        stateArcUrl + "/0?Token=" + stateArcKey
      ); // 0->State 1->District

      const stateQuery = new Query();
      stateQuery.returnGeometry = true;
      stateQuery.outFields = ["*"];
      stateQuery.where = "1=1";

      map?.on("load", () => {

        try {

          stateQueryTask
            .execute(stateQuery)
            .then((jsnFset) => {
              let i = 0;
              dispatch(updateMapLoaded(true))
              const handle = sessionStorage.getItem('handle');
              let color = [0, 0, 0];
              let colors = [];
              jsnFset?.features?.forEach((feature, index) => {
                const state_id =
                  feature?.attributes?.stcode11 || feature?.attributes?.STCODE11;
                const state_nm = feature?.attributes?.stname || feature?.attributes?.STNAME;

                const matchingData = data?.find(data => data?.regionName.toLowerCase() === state_nm?.toLowerCase());

                let a = 0;
                let b = 0;

                if (handle === "gross_enrollment_ratio") {
                  a = matchingData?.gerElementary;
                  b = matchingData?.gerSec;
                  if (a >= 0 && a <= 30 && b >= 0 && b <= 30) {
                    color = "#ff4342"; // Red
                  } else if (a > 30 && a <= 70 && b > 30 && b <= 70) {
                    color = [255, 255, 0]; // Yellow
                  } else if (a > 70 && a <= 100 && b > 70 && b <= 100) {
                    color = [0, 255, 0]; // Green
                  }
                  else {
                    color = [255, 255, 255];
                  }
                  colors.push(color)

                } else if (handle === "dropout_rate") {

                  a = matchingData?.dropoutPry;
                  b = matchingData?.dropoutSec;

                  if (a >= 0 && a <= 30 && b >= 0 && b <= 30) {
                    color = [0, 255, 0]; // Green
                  } else if (a > 30 && a <= 70 && b > 30 && b <= 70) {
                    color = "#ffda6e"; // Yellow
                  } else if (a > 70 && a <= 100 && b > 70 && b <= 100) {

                    color = [255, 0, 0]; // Red
                  }
                  else {
                    color = [255, 255, 255];
                  }

                  colors.push(color)

                } else if (handle === "transition_rate") {

                  a = matchingData?.transPryUpr;
                  b = matchingData?.transUprSec;
                  if (a >= 0 && a <= 30 && b >= 0 && b <= 30) {
                    color = [255, 0, 0]; // Red
                  } else if (a > 30 && a <= 70 && b > 30 && b <= 70) {
                    color = [255, 255, 0]; // Yellow
                  } else if (a > 70 && a <= 100 && b > 70 && b <= 100) {
                    // color = "#7ab132"; // Green
                    color = "#ffda6e"
                  }
                  else {
                    color = [255, 255, 255];
                  }
                  colors.push(color)


                } else if (handle === "pupil_teacher_ratio") {
                  a = matchingData?.ptrPry;
                  b = matchingData?.ptrUpr;
                }

                const style = SimpleFillSymbol.STYLE_SOLID;
                const outline = new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([83, 86, 36]),
                  1
                );

                let currentColor = new Color([251, 242, 233, 0.7]);

                if (handle == "" || handle == null) {
                  if (i % 2 !== 0) {
                    currentColor = new Color([170, 183, 155]);
                  }
                  i++;
                }
                else {
                  currentColor = colors[index];
                }

                const sfs = new SimpleFillSymbol(style, outline, currentColor);

                const gmtry = new Polygon(feature.geometry);


                const attr = {
                  step: 1,
                  state_id: state_id,
                  state_nm: state_nm,
                  color_code: color,
                  type: "state-map",
                  abc: matchingData,
                };
                const infoGraphic = new Graphic(gmtry, sfs, attr);

                map?.graphics?.add(infoGraphic);

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
                map?.graphics?.add(labelPointGraphic);
              });
            })
            .catch((err) => {
              console.log(err, "Error creating graphic");
            });


        } catch (error) {
          console.log(error);
        }
      });

      let previousHighlightedState = null;

      map?.on("mouse-move", (event) => {

        const graphic = event?.graphic;
        if (graphic && graphic?.attributes) {
          if (graphic && graphic !== undefined) {
            if (previousHighlightedState) {
              map.graphics.remove(previousHighlightedState);
              previousHighlightedState = null;
            }
            const data_set = graphic?.attributes;
            const event_step = data_set?.step;
            const event_type = data_set?.type;

            if (event_step === 1 && event_type === "state-map") {
              // Remove existing highlightPolyLine

              const state_id = data_set?.state_id;
              const state_nm = data_set?.state_nm;
              const ab = data_set?.gerElementary;
              const matchingData = data?.find(data => data?.regionName?.toLowerCase() === state_nm?.toLowerCase());
              let a = 0;
              let b = 0;
              let c = "";
              let d = "";
              let color = [0, 0, 0];
              const handle = sessionStorage.getItem('handle');
              const indicatorMap = {
                "gross_enrollment_ratio": {
                  c: "Elementary",
                  d: "Secondary"
                },
                "dropout_rate": {
                  c: "Primary",
                  d: "Secondary"
                },
                "transition_rate": {
                  c: "Primary to Upper Primary",
                  d: "Upper Primary to Secondary"
                },
                "pupil_teacher_ratio": {
                  c: "Primary",
                  d: "Upper Primary"
                }
              };

              if (handle in indicatorMap) {
                c = indicatorMap[handle].c;
                d = indicatorMap[handle].d;

                if (handle === "gross_enrollment_ratio") {
                  a = matchingData?.gerElementary;
                  b = matchingData?.gerSec;

                } else if (handle === "dropout_rate") {
                  a = matchingData?.dropoutPry;
                  b = matchingData?.dropoutSec;

                } else if (handle === "transition_rate") {
                  a = matchingData?.transPryUpr;
                  b = matchingData?.transUprSec;


                } else if (handle === "pupil_teacher_ratio") {
                  a = matchingData?.ptrPry;
                  b = matchingData?.ptrUpr;
                }
              }
              const highlightColor = new Color([0, 255, 0]);
              const highlightLine = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                highlightColor,
                1
              );
              const highlightPolyLine = new Graphic(
                event.graphic.geometry,
                highlightLine
              );

              map.graphics.add(highlightPolyLine);
              previousHighlightedState = highlightPolyLine;

              // Set info window content and title
              let infoTemplate = `<table style='font-family: arial, sans-serif; width: 100%;border: 1px solid #e7d8d8'>
              <tr>
                  <th style='width:30%;background-color:#132554;color:white;border: 1px solid white'>State Name</th>
                  <th style='width:30%;background-color:#132554;color:white;border: 1px solid white'>State Id</th>
                  <th style='width:30%;background-color:#132554;color:white;border: 1px solid white'>Country</th>
              </tr>
              <tr>  
                  <td style='width:30%;border: 1px solid #e7d8d8; font-size:09px;color: rgb(9, 87, 231);'>${state_nm}</td>
                  <td style='width:30%;border: 1px solid #e7d8d8; font-size:09px'>${state_id}</td>
                  <td style='width:30%;border: 1px solid #e7d8d8; font-size:09px'>India</td>
              </tr>`;

              if (handle !== "" || handle == null) {
                infoTemplate += `<tr>
                             
                              <th style='width:30%;background-color:#132554;color:white;border: 1px solid white'>${c}</th>
                              <th style='width:30%;background-color:#132554;color:white;border: 1px solid white'>${d}</th>
                          </tr>
                          <tr>  
                            
                              <td style='width:30%;border: 1px solid #e7d8d8; font-size:09px'>${a}%</td>
                              <td style='width:30%;border: 1px solid #e7d8d8; font-size:09px'>${b}%</td>
                          </tr></table>`;
              } else {
                infoTemplate += "</table>";
              }

              map.infoWindow.setContent(infoTemplate);
              map.infoWindow.setTitle(
                `<div style='font-size:15px;font-family:arial, sans-serif;background-color:#3f51b5;color:white'>State :  ${state_nm}</div>`
              );

              // Show info window
              map?.infoWindow.show(
                event?.screenPoint,
                map?.getInfoWindowAnchor(event?.screenPoint)
              );
            } else {
              map?.infoWindow.hide();
              try {
                map?.graphics?.remove(highlighterMap?.get("highlightPolyLine"));
              } catch (err) { }
            }
          } else {

            map.infoWindow.hide();
            try {
              map?.graphics?.remove(highlighterMap?.get("highlightPolyLine"));
            } catch (err) { }
          }
        }
      });
      map?.on("mouse-out", () => {
        map?.infoWindow.hide();
      });
      map?.on("click", async (event) => {
        const graphic = event?.graphic;

        if (graphic && graphic !== undefined && graphic?.attributes) {
          const event_step = graphic.attributes.step;
          const event_type = graphic.attributes.type;

          if (event_step === 1 && event_type === "state-map") {
            const point = new Point(graphic?.geometry?.getCentroid());
            const latitude = point?.getLatitude();
            const longitude = point?.getLongitude();

            const obj = {
              stateId: graphic?.attributes.state_id,
              state_name: graphic?.attributes.state_nm,
              latitude: latitude,
              longitude: longitude,
            };
            dispatch(updateMapData(obj));
            window.localStorage.setItem("map_state_name", obj.state_name);
            sessionStorage.setItem("state-map-details", JSON.stringify(obj));
            dispatch(handleShowDistrict(true));
            setSelectedStateMapDetails(obj);
            dispatch(updateMapSession(obj));

            const state_code = graphic?.attributes.state_id;
            const state_name = graphic?.attributes.state_nm;
            setSelectedState(state_name);
            setSelectedStateMapDetails(state_name);

            if (state_name === nationalWiseName) {
              filterObj.regionType = nWiseregionType;
              filterObj.regionCode = nWiseregionCode;
              filterObj.dashboardRegionType = "n";
              filterObj.dashboardRegionCode = 100;
              filterObj.dType = 10;
              filterObj.dCode = 99;
              dispatch(allFilter(filterObj));
              handleAPICallAccordingToFilter(filterObj)
              const modifiedFilterObjs = {
                regionCode: 99,
                dCode: 99,
                regionType: 21,
                yearId: 8
              };
              dispatch(fetchAllStateSchemesData(modifiedFilterObjs))
              dispatch(hideShowColumn(false));
              dispatch(removeAllDistrict());

            } else if (state_name === stateWiseName) {
              const newDataObject = {
                yearId: filterObj.yearId,
                regionType: 10,
                regionCode: "99",
                dType: 10,
                dCode: 99,
                categoryCode: 0,
                managementCode: 0,
                locationCode: 0,
                schoolTypeCode: 0,
                dashboardRegionType: 10,
                dashboardRegionCode: "09"
              };
              filterObj.regionType = allSWiseregionType;
              filterObj.regionCode = allSWiseregionCode;
              filterObj.dType = allSWiseregionType;
              filterObj.dCode = allSWiseregionCode;
              filterObj.dashboardRegionType = "s";
              filterObj.dashboardRegionCode = state_code;
              dispatch(allFilter(filterObj));
              // handleAPICallAccordingToFilter(filterObj)
              if (location.pathname === "/") {
                handleAPICallAccordingToFilter(newDataObject);
              }
              else {
                handleAPICallAccordingToFilter(filterObj);
              }
              dispatch(hideShowColumn(true));
              dispatch(removeAllDistrict());

            }
            else {
              filterObj.regionType = specificSWiseregionType;
              filterObj.regionCode = state_code;

              filterObj.dType = 11;
              filterObj.dCode = state_code;
              filterObj.dashboardRegionType = "s";
              filterObj.dashboardRegionCode = state_code;
              dispatch(allFilter(filterObj));
              handleAPICallAccordingToFilter(filterObj)
              dispatch(hideShowColumn(false));
              if (location.pathname === "/") {
                dispatch(
                  fetchDistrictDataByStateCode({
                    state_code: state_code,
                    yearId: filterObj.yearId,
                  })
                );
              }

              dispatch(removeAllDistrict());

            }

            // dispatch(updateFilterState(stateDataClone.data));
            window.localStorage.setItem("state", state_name);


          }
        }
      });

    } catch (error) {
      console.error("EsriLoader: ", error);
    }


  };

  const handleAPICallAccordingToFilter = useCallback((obj) => {
    if (location.pathname !== "/") {
      dispatch(fetchArchiveServicesSchoolData(obj));
    } else {
      if (headerSlice.headerName === "Education Dashboard") {
        dispatch(fetchDashboardData(obj));
        dispatch(fetchSchoolStatsData(obj));
        dispatch(fetchTeachersStatsData(obj));
        dispatch(fetchStudentStatsData(obj));
      } else if (headerSlice.headerName === "School Dashboard") {
        dispatch(fetchSchoolStatsData(obj));
      } else if (headerSlice.headerName === "Teacher Dashboard") {
        dispatch(fetchTeachersStatsData(obj));
      } else {
        dispatch(fetchStudentStatsData(obj));
      }
    }
  }, [location.pathname, headerSlice.headerName]);
  useEffect(() => {
    dispatch(fetchAllStateSchemesData(filterObj)).then((res) => {
      initializeMap(res.payload.data);
    })

  }, [headerData.showDistricts]);
  useEffect(() => {

    dispatch(fetchAllStateSchemesData(filterObj)).then((res) => {
      initializeMap(res?.payload?.data);
    })
    dispatch(setUpdateFlag(false))
  }, [grossEData, updateFlag]);

  const memoizedMapComponent = useMemo(() => (
    <>
      {!headerData?.showDistricts && (
        <div className="indian-map " style={{ width: "40vw" }}>
          {handles !== "" && handles !== "dropout_rate" ? (
            <div className="show-color-meaning">

              <div className="show-color-first">
                <div className="circle3"></div>
                <div className="text">High</div>
              </div>
              <div className="show-color-first">
                <div className="circle2"></div>
                <div className="text">Medium</div>
              </div>
              <div className="show-color-first">
                <div className="circle1"></div>
                <div className="text">Low</div>
              </div>
            </div>
          ) : (
            handles !== "" && (
              <div className="show-color-meaning">
                <div className="show-color-first">
                  <div className="circle1"></div>
                  <div className="text">High</div>
                </div>
                <div className="show-color-first">
                  <div className="circle2"></div>
                  <div className="text">Medium</div>
                </div>
                <div className="show-color-first">
                  <div className="circle3"></div>
                  <div className="text">Low</div>
                </div>
              </div>
            )
          )}
          <div
            id="bmap"
            className="esri-map-draw"
            style={{ background: "#768c9200" }}
            ref={bmapRef}
          >
            {!mapData.mapLoaded && (
              <div className="loader-center">
                <div className="spinner-border" role="status">
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {headerData?.showDistricts && (
        <Suspense
          fallback={
            <div>
              {/* Loading....... */}
              <div className="loader-center-map">
              <div className="spinner-border" role="status">
              </div>
            </div>
            </div>
          }
        >
          <StateMapComponent
            stateId={selectedStateMapDetails?.obj?.stateId}
            latitude={selectedStateMapDetails?.obj?.latitude}
            longitude={selectedStateMapDetails?.obj?.longitude}
            mapLoaded={mapData.mapLoaded}
            handleBack={handleBack}
          />
        </Suspense>
      )}
    </>
  ), [headerData.showDistricts, selectedStateMapDetails, mapData.mapLoaded, handleBack]);

  return memoizedMapComponent;

}