import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import * as topojson from "topojson-client";
import "../india-map/india-map.componentN.scss";
import india from "../../../../json-data/india.json";
import { getColor, layersUtils, getCenterOfGeoJson } from "./MapUtilsN";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setstateId, setUpdateFlag, updateMapLoaded } from "../../../../redux/slice/mapSlice";
import { fetchAllStateSchemesData, fetchDashboardData, fetchMaptatsData, fetchMaptatsOtherData, fetchSchoolStatsData, fetchSchoolStatsIntData, fetchStudentStatsData, fetchStudentStatsIntData, fetchTeachersStatsData, fetchTeachersStatsIntData } from "../../../../redux/thunks/dashboardThunk";
import { allSWiseregionCode, allSWiseregionType, district, modifiedFilterObjForReset, modifiedFilterObjResetDashboard, nationalWiseName, nWiseregionCode, nWiseregionType, rangeMapping, specificSWiseregionType, stateWiseName } from "../../../../constants/constants";
import { fetchDistrictDataByStateCode, removeAllDistrict } from "../../../../redux/thunks/districtThunk";
import { removeAllBlock } from "../../../../redux/thunks/blockThunk";
import { handleSchoolFilterStateTest } from "../../../Home/filter/FilterDropdown3016";
import L from 'leaflet';
import { handleShowDistrict } from "../../../../redux/slice/headerSlice";
import { allFilter } from "../../../../redux/slice/schoolFilterSlice3016";
import { fetchArchiveServicesGraphSchoolData, fetchArchiveServicesSchoolData } from "../../../../redux/thunks/archiveServicesThunk";
import { useLocation } from "react-router-dom";
const COUNTRY_VIEW_ID = "india-states";

export default function IndiaMapComponentN() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [geoJsonId, setGeoJsonId] = useState(COUNTRY_VIEW_ID);
  const [mapData, setMapData] = useState({ dashIntDataMap: null, dashData: null });
  const [updateGrossEData, setUpdateGrossEData] = useState("Gross Enrollment Ratio")
  const geoJson = useMemo(() => topojson.feature(india, india.objects[geoJsonId]), [geoJsonId]);
  const mapRef = useRef(null);
  const geoJsonRef = useRef(null);
  const handleSchemesEvent = useSelector((state) => state?.mapData?.grossEData, shallowEqual);

  const grossEData = useSelector((state) => state?.mapData?.grossEData)
  const schoolFilter = useSelector((state) => state?.schoolFilter, shallowEqual);
  let filterObj = structuredClone(schoolFilter);
  const selectedStateCode = useSelector((state) => state.mapData.stateId, shallowEqual);
  const selectedStateId = useSelector((state) => state.mapData.stateCodeForMap, shallowEqual);
  const headerData = useSelector((state) => state?.header);
  const localStorageStateName = window.localStorage.getItem("map_state_name");
  const [handles, setHandles] = useState(handleSchemesEvent);
  const handlesRef = useRef(handles);
  const dashIntDataMap = useSelector((state) => state?.MapStats?.data?.data, shallowEqual);
  const dashData = useSelector((state) => state?.MapStatsPercentage?.data?.data, shallowEqual);
  const dashIntDataMapLoading = useSelector((state) => state?.MapStats.isLoading, shallowEqual);
  const districtUdice = useSelector((state) => state.distBlockWise.blockUdiseCode)
  const headerSlice = useSelector((state) => state.header);
  const [selectedEnrollmentType, setSelectedEnrollmentType] = useState("elementary");
  const [selectedDropoutType, setSelectedDropoutType] = useState("primary");
  const [selectedTransitionRate, setSelectedTransitionRate] = useState("primaryToUpper");
  const [selectedPupilTeacherRatio, setSelectedPupilTeacherRatio] = useState("primary");

  useEffect(() => {
    setHandles(handleSchemesEvent);
  }, [handleSchemesEvent]);

  useEffect(() => {
    handlesRef.current = handles;
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer(layer => updateFeatureStyleAndTooltip(layer?.feature, layer));
    }
  }, [handles, mapData, selectedEnrollmentType, selectedDropoutType, selectedTransitionRate, selectedPupilTeacherRatio]);

  // useEffect(() => {
  //   dispatch(fetchMaptatsData(schoolFilter))
  // }, [dispatch, schoolFilter]);


  useEffect(() => {
    if (dashIntDataMap && dashIntDataMap.length > 0) {
      const newMapData = {
        dashIntDataMap: dashIntDataMap,
        dashData: dashData,
      };
      setMapData(newMapData);
      initializeMap(newMapData);
      dispatch(setUpdateFlag(false));
    }
  }, [dashIntDataMap, dashData, dispatch, handles]);

  const mapCenter = useMemo(() => getCenterOfGeoJson(geoJson), [geoJson]);

  useEffect(() => {
    if (selectedStateCode) {
      setGeoJsonId(selectedStateCode);
    }
    if (localStorageStateName === "All India/National") {
      setGeoJsonId(COUNTRY_VIEW_ID);

    }

  }, [selectedStateCode, localStorageStateName, handles]);

  const initializeMap = useCallback((data) => {
    setMapData(data);
  }, []);

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (map && geoJsonRef.current) {
        map.fitBounds(geoJsonRef.current.getBounds());
      }
    }, [map, geoJsonId, mapData, handles]);

    return null;
  };

  const getColorFromData = useCallback((feature) => {
    const properties = feature?.properties;
    const state_id = localStorageStateName === "All India/National" ? properties.lgd_state_id : null;
    const district_id = localStorageStateName !== "All India/National" ? properties.udiseDistrictCode : null;
    const district_ids = properties.udiseDistrictCode || [];
    const isHighlightedDistrict = districtUdice.length >= 4 && district_ids.includes(districtUdice);
    const matchingDatas = state_id
      ? {
        dashIntData: mapData?.dashIntDataMap?.find(item => item.regionCd === state_id),
        dashData: mapData?.dashData?.find(item => item.regionCd === state_id),
      }
      : district_id
        ? {
          dashIntData: mapData?.dashIntDataMap?.find(item => item.regionCd === district_id),
          dashData: mapData?.dashData?.find(item => item.regionCd === district_id),
        }
        : null;
    const getColor = (a, thresholds, reversed = false) => {
      var normalizedA = a;
      if (reversed) {
        return normalizedA <= thresholds[0] ? "#c1d0b5" : 
          normalizedA <= thresholds[1] ? "#e3d1f8" :   
            normalizedA <= thresholds[2] ? "#ffeda0" :   
              "#fcae91";
      } else {
        return normalizedA <= thresholds[0] ? "#fcae91" :  
          normalizedA <= thresholds[1] ? "#ffeda0" :   
            normalizedA <= thresholds[2] ? "#e3d1f8" : 
              "#c1d0b5";
      }
    };

    var a = 0, b = 0;
    let color = "#FFFFFF";
    switch (handlesRef.current) {
      case "gross_enrollment_ratio":
        if (selectedEnrollmentType === "elementary") {
          a = matchingDatas?.dashIntData?.gerElementary ?? a;
        } else if (selectedEnrollmentType === "secondary") {
          a = matchingDatas?.dashIntData?.gerSec ?? a;
        }
        color = getColor(a, [85, 90, 95]);
        break;

      case "dropout_rate":
        if (selectedDropoutType === "primary") {
          a = matchingDatas?.dashIntData?.dropoutPry ?? a;
        } else if (selectedDropoutType === "secondary") {
          a = matchingDatas?.dashIntData?.dropoutSec ?? a;
        }
        color = getColor(a, [5, 10, 15], true);
        break;

      case "transition_rate":
        if (selectedTransitionRate === "primaryToUpper") {
          a = matchingDatas?.dashIntData?.transPryUPry ?? a;
        } else if (selectedTransitionRate === "upperToSec") {
          a = matchingDatas?.dashIntData?.transUPrySec ?? a;
        }
        color = getColor(a, [85, 90, 95]);
        break;

      case "pupil_teacher_ratio":
        if (selectedPupilTeacherRatio === "primary") {
          a = matchingDatas?.dashIntData?.ptrPry ?? a;
        } else if (selectedPupilTeacherRatio === "upperPrimary") {
          a = matchingDatas?.dashIntData?.ptrUPry ?? a;
        }
        color = getColor(a, [30, 35, 40], true);
        break;

      case "schools_with_drinking_water":
        a = matchingDatas?.dashData?.schWithDrinkWater ?? a;
        color = getColor(a, [85, 90, 95]);
        break;

      case "schools_with_electricity_connection":
        a = matchingDatas?.dashData?.schWithElectricity ?? a;
        color = getColor(a, [70, 80, 90]);
        break;

      default:
        break;
    }

    return { color, matchingDatas, isHighlightedDistrict };
  }, [mapData, localStorageStateName, handlesRef.current, districtUdice, selectedEnrollmentType, selectedDropoutType, selectedTransitionRate, selectedPupilTeacherRatio]);

  const updateFeatureStyleAndTooltip = useCallback((feature, layer) => {
    const { color, isHighlightedDistrict } = getColorFromData(feature);
    layer.setStyle({
      color: isHighlightedDistrict ? "#003366" : "#1f2021",
      weight: isHighlightedDistrict ? 7 : 1,
      dashArray: isHighlightedDistrict ? '1, 10' : '1, 0',
      fillOpacity: 1,
      fillColor: color,
    });

    const properties = feature?.properties;
    const state_id = localStorageStateName === "All India/National" ? properties.lgd_state_id : null;
    const district_id = localStorageStateName !== "All India/National" ? properties.udiseDistrictCode : null;
    const matchingDatas = state_id
      ? {
        dashIntData: mapData?.dashIntDataMap?.find(item => item.regionCd === state_id),
        dashData: mapData?.dashData?.find(item => item.regionCd === state_id),
      }
      : district_id
        ? {
          dashIntData: mapData?.dashIntDataMap?.find(item => item.regionCd === district_id),
          dashData: mapData?.dashData?.find(item => item.regionCd === district_id),
        }
        : null;

    let tooltipContent;
    if (localStorageStateName === "All India/National") {
      tooltipContent = `<div><strong>State:</strong> ${properties?.lgd_state_name || 'N/A'}</div>`;
      if (matchingDatas?.dashIntData) {
        if (handlesRef.current === "gross_enrollment_ratio") {
          if (selectedEnrollmentType === "elementary") {
            tooltipContent += `<br/><strong>Gross Enrollment Ratio Elementary:</strong> ${matchingDatas?.dashIntData?.gerElementary || 'N/A'}`;
          } else if (selectedEnrollmentType === "secondary") {
            tooltipContent += `<br/><strong>Gross Enrollment Ratio  Secondary:</strong> ${matchingDatas?.dashIntData?.gerSec || 'N/A'}`;
          }
        }
        if (handlesRef.current === "dropout_rate") {
          if (selectedDropoutType === "primary") {
            tooltipContent += `<br/><strong>Dropout Rate Primary:</strong> ${matchingDatas?.dashIntData?.dropoutPry || 'N/A'}`;
          } else if (selectedDropoutType === "secondary") {
            tooltipContent += `<br/><strong>Dropout Rate Secondary:</strong> ${matchingDatas?.dashIntData?.dropoutSec || 'N/A'}`;
          }
        }
        if (handlesRef.current === "transition_rate") {
          if (selectedTransitionRate === "primaryToUpper") {
            tooltipContent += `<br/><strong>Transition Rate Primary to Upper Primary:</strong> ${matchingDatas?.dashIntData?.transPryUPry || 'N/A'}`;
          } else if (selectedTransitionRate === "upperToSec") {
            tooltipContent += `<br/><strong>Transition Rate Upper Primary to Secondary:</strong> ${matchingDatas?.dashIntData?.transUPrySec || 'N/A'}`;
          }
        }
        if (handlesRef.current === "pupil_teacher_ratio") {
          if (selectedPupilTeacherRatio === "primary") {
            tooltipContent += `<br/><strong>Pupil Teacher Ratio Primary:</strong> ${matchingDatas?.dashIntData?.ptrPry || 'N/A'}`;
          } else if (selectedPupilTeacherRatio === "upperPrimary") {
            tooltipContent += `<br/><strong>Pupil Teacher Ratio Upper Primary:</strong> ${matchingDatas?.dashIntData?.ptrUPry || 'N/A'}`;
          }
        }
        if (handlesRef.current === "schools_with_drinking_water") {
          tooltipContent += `<br/><strong>Schools with Drinking Water:</strong> ${matchingDatas?.dashData?.schWithDrinkWater || 'N/A'} %`
        }
        if (handlesRef.current === "schools_with_electricity_connection") {
          tooltipContent += `<br/><strong> Schools with Electricity Connection:</strong> ${matchingDatas?.dashData?.schWithElectricity || 'N/A'} %`
        }
      }

    } else {
      tooltipContent = `<div><strong>District:</strong> ${properties?.lgd_district_name || 'N/A'}</div>`;
      if (matchingDatas?.dashIntData) {
        if (handlesRef.current === "gross_enrollment_ratio") {
          if (selectedEnrollmentType === "elementary") {
            tooltipContent += `<br/><strong>Gross Enrollment Ratio Elementary:</strong> ${matchingDatas?.dashIntData?.gerElementary || 'N/A'}`;
          } else if (selectedEnrollmentType === "secondary") {
            tooltipContent += `<br/><strong>Gross Enrollment Ratio  Secondary:</strong> ${matchingDatas?.dashIntData?.gerSec || 'N/A'}`;
          }
        }
        if (handlesRef.current === "dropout_rate") {
          if (selectedDropoutType === "primary") {
            tooltipContent += `<br/><strong>Dropout Rate Primary:</strong> ${matchingDatas?.dashIntData?.dropoutPry || 'N/A'}`;
          } else if (selectedDropoutType === "secondary") {
            tooltipContent += `<br/><strong>Dropout Rate Secondary:</strong> ${matchingDatas?.dashIntData?.dropoutSec || 'N/A'}`;
          }
        }
        if (handlesRef.current === "transition_rate") {
          if (selectedTransitionRate === "primaryToUpper") {
            tooltipContent += `<br/><strong>Transition Rate Primary to Upper Primary:</strong> ${matchingDatas?.dashIntData?.transPryUPry || 'N/A'}`;
          } else if (selectedTransitionRate === "upperToSec") {
            tooltipContent += `<br/><strong>Transition Rate Upper Primary to Secondary:</strong> ${matchingDatas?.dashIntData?.transUPrySec || 'N/A'}`;
          }
        }
        if (handlesRef.current === "pupil_teacher_ratio") {
          if (selectedPupilTeacherRatio === "primary") {
            tooltipContent += `<br/><strong>Pupil Teacher Ratio Primary:</strong> ${matchingDatas?.dashIntData?.ptrPry || 'N/A'}`;
          } else if (selectedPupilTeacherRatio === "upperPrimary") {
            tooltipContent += `<br/><strong>Pupil Teacher Ratio Upper Primary:</strong> ${matchingDatas?.dashIntData?.ptrUPry || 'N/A'}`;
          }
        }
        if (handlesRef.current === "schools_with_drinking_water") {
          tooltipContent += `<br/><strong>Schools with Drinking Water:</strong> ${matchingDatas?.dashData?.schWithDrinkWater || 'N/A'} %`
        }
        if (handlesRef.current === "schools_with_electricity_connection") {
          tooltipContent += `<br/><strong> Schools with Electricity Connection:</strong> ${matchingDatas?.dashData?.schWithElectricity || 'N/A'} %`
        }
      }
    }

    layer.bindTooltip(tooltipContent, { sticky: false });


    // if (isHighlightedDistrict) {
    //   const bounds = layer.getBounds();
    //   mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    // }
  }, [getColorFromData, mapData, localStorageStateName, handles, selectedEnrollmentType, selectedDropoutType, selectedTransitionRate, selectedPupilTeacherRatio]);


  const geoJSONStyle = useCallback((feature) => {
    const { color, isHighlightedDistrict } = getColorFromData(feature);
    return {
      color: isHighlightedDistrict ? "#003366" : "#1f2021",
      weight: isHighlightedDistrict ? 7 : 1,
      dashArray: isHighlightedDistrict ? '1, 10' : '1, 0',
      fillOpacity: 1,
      fillColor: color,
    };
  }, [getColorFromData, handles]);

  const onEachFeature = useCallback((feature, layer) => {

    if (feature) {
      updateFeatureStyleAndTooltip(feature, layer);
    }
    layer.on({
      mouseover: layersUtils(geoJsonRef.current, mapRef.current).highlightOnClick,
      mouseout: layersUtils(geoJsonRef.current, mapRef.current).resetHighlight,
      click: onDrillDown
    });

    // layer.bindPopup(feature.properties.lgd_state_name); 

  }, [updateFeatureStyleAndTooltip, mapData, handles]);


  const handleAPICallAccordingToFilter = (obj) => {

    // if (geoJsonId === "india-states") {
    if (headerSlice.headerName === "Education Dashboard") {
      dispatch(fetchDashboardData(obj));
      dispatch(fetchSchoolStatsData(obj));
      dispatch(fetchSchoolStatsIntData(obj));
      dispatch(fetchTeachersStatsData(obj));
      dispatch(fetchTeachersStatsIntData(obj));
      dispatch(fetchStudentStatsData(obj));
      dispatch(fetchStudentStatsIntData(obj));
    } else if (headerSlice.headerName === "School Dashboard") {
      dispatch(fetchSchoolStatsData(obj));
      dispatch(fetchSchoolStatsIntData(obj));
      dispatch(fetchArchiveServicesGraphSchoolData(obj));
    } else if (headerSlice.headerName === "Teacher Dashboard") {
      dispatch(fetchTeachersStatsData(obj));
      dispatch(fetchTeachersStatsIntData(obj));
    } else {
      dispatch(fetchStudentStatsData(obj));
      dispatch(fetchStudentStatsIntData(obj));
    }
  }
  // };
  const onDrillDown = useCallback((e) => {
    let StateName;
    let featureId;
    if (e) {
      StateName = e?.target?.feature?.properties?.lgd_state_name;
      featureId = e?.target ? e?.target?.feature?.properties?.lgd_state_id : e;
    }

    if (localStorageStateName === "All India/National") {
      if (india.objects[featureId]) {
        setGeoJsonId(featureId);
        const modifiedFilterObj = {
          regionCode: featureId,
          regionType: 22,
          dType: 22,
          dCode: featureId,
          dashboardRegionType: 22,
          dashboardRegionCode: featureId,
          yearId: 8,
          valueType: 2
        };
        if (localStorageStateName === "All India/National") {
          dispatch(fetchMaptatsData(modifiedFilterObj));
          dispatch(fetchMaptatsOtherData(modifiedFilterObj));
        }
      }
      if (StateName === nationalWiseName) {
        filterObj.regionType = nWiseregionType;
        filterObj.regionCode = nWiseregionCode;
        filterObj.dashboardRegionType = 21;
        filterObj.dashboardRegionCode = "09";
        filterObj.dType = 21;
        filterObj.dCode = 99;
        filterObj.valueType = 2;

        dispatch(allFilter(filterObj));
        handleAPICallAccordingToFilter(filterObj);
        dispatch(fetchMaptatsData(filterObj));
        filterObj.valueType = 2;
        dispatch(fetchMaptatsOtherData(filterObj));
        dispatch(removeAllDistrict());
        const modifiedFilterObjs = {
          regionCode: 99,
          dCode: 99,
          regionType: 21,
          yearId: 8,
        };
        dispatch(fetchAllStateSchemesData(modifiedFilterObjs));
      } else if (StateName === stateWiseName) {
        const newDataObject = {
          yearId: filterObj.yearId,
          regionType: 21,
          regionCode: "99",
          dType: 21,
          dCode: 99,
          categoryCode: 0,
          managementCode: 0,
          locationCode: 0,
          schoolTypeCode: 0,
          dashboardRegionType: 11,
          dashboardRegionCode: 11,
          valueType: 2,
        };

        /*--------------------Filter by State Wise----------------------*/

        filterObj.regionType = allSWiseregionType;
        filterObj.regionCode = allSWiseregionCode;

        filterObj.dType = allSWiseregionType;
        filterObj.dCode = allSWiseregionCode;

        filterObj.dashboardRegionType = 11;
        filterObj.dashboardRegionCode = featureId;
        filterObj.valueType = 2;

        dispatch(allFilter(filterObj));

        if (location.pathname === "/") {
          handleAPICallAccordingToFilter(newDataObject);
          dispatch(fetchMaptatsData(newDataObject));
          filterObj.valueType = 2;
          dispatch(fetchMaptatsOtherData(newDataObject));

        }

        dispatch(removeAllDistrict());
      } else {
        /*--------------------Filter by Particular State ----------------------*/

        filterObj.regionType = specificSWiseregionType;
        filterObj.regionCode = featureId;

        filterObj.dType = 11;
        filterObj.dCode = featureId;

        filterObj.dashboardRegionType = 11;
        filterObj.dashboardRegionCode = featureId;
        if (location.pathname !== "/") {
          filterObj.valueType = 1;
        } else {
          filterObj.valueType = 2;
        }
        dispatch(allFilter(filterObj));


        dispatch(
          fetchDistrictDataByStateCode({
            state_code: featureId,
            yearId: filterObj.yearId,
          })
        );
        dispatch(removeAllDistrict());
        handleAPICallAccordingToFilter(filterObj);
      }

      window.localStorage.setItem("map_state_name", StateName);

    } else {
      return;
    }
    // window.localStorage.setItem("state", StateName);
  }, [dispatch, schoolFilter, localStorageStateName, geoJsonId]);

  const getCentroid = (feature) => {
    if (!feature.geometry || !feature.geometry.coordinates) {
      return [0, 0];
    }
    const coordinates = feature.geometry.coordinates;

    let flatCoords;
    if (feature.geometry.type === "Polygon") {
      flatCoords = coordinates[0];
    } else if (feature.geometry.type === "MultiPolygon") {
      flatCoords = coordinates[0][0];
    } else {
      return [0, 0];
    }
    const lat = flatCoords.reduce((sum, coord) => sum + coord[1], 0) / flatCoords.length;
    const lng = flatCoords.reduce((sum, coord) => sum + coord[0], 0) / flatCoords.length;

    if (isNaN(lat) || isNaN(lng)) {
      return [0, 0];
    }

    return [lat, lng];
  };





  useEffect(() => {
    if (grossEData === "gross_enrollment_ratio") {
      setUpdateGrossEData("Gross Enrollment Ratio")
    }
    else if (grossEData === "dropout_rate") {
      setUpdateGrossEData("Dropout Rate")
    }
    else if (grossEData === "transition_rate") {
      setUpdateGrossEData("Transition Rate")

    }
    else if (grossEData === "pupil_teacher_ratio") {
      setUpdateGrossEData("Pupil Teacher Ratio")
    }
    else if (grossEData === "schools_with_drinking_water") {
      setUpdateGrossEData("Schools with Drinking Water")
    }
    else if (grossEData === "schools_with_electricity_connection") {
      setUpdateGrossEData("Schools with Electricity Connection")

    }


  }, [grossEData])
  const isReversed = handles === "dropout_rate" || handles === "pupil_teacher_ratio";

  return (
    <>
      <div style={{ width: "100%" }} className="d-flex align-items-center justify-content-between">

        <div className="updated-gross-text ps-2">{updateGrossEData}</div>
        <div>
          {handles !== "" && rangeMapping[handles] ? (
            <div className="show-color-meaning">
              {["dropout_rate", "pupil_teacher_ratio"].includes(handles) ? (
                <>
                  <div className="show-color-first">
                    <div className="circle4"></div>
                    <div className="text">
                      {rangeMapping[handles][3]}
                      {handles !== "pupil_teacher_ratio" && "%"} {/* High (reversed to Low) */}
                    </div>
                  </div>
                  <div className="show-color-first">
                    <div className="circle3"></div>
                    <div className="text">
                      {rangeMapping[handles][2]}
                      {handles !== "pupil_teacher_ratio" && "%"} {/* Medium */}
                    </div>
                  </div>
                  <div className="show-color-first">
                    <div className="circle2"></div>
                    <div className="text">
                      {rangeMapping[handles][1]}
                      {handles !== "pupil_teacher_ratio" && "%"} {/* Low (reversed to High) */}
                    </div>
                  </div>
                  <div className="show-color-first">
                    <div className="circle1"></div>
                    <div className="text">
                      {rangeMapping[handles][0]}
                      {handles !== "pupil_teacher_ratio" && "%"} {/* Very Low */}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="show-color-first">
                    <div className="circle1"></div>
                    <div className="text">
                      {rangeMapping[handles][0]}% {/* Very Low */}
                    </div>
                  </div>
                  <div className="show-color-first">
                    <div className="circle2"></div>
                    <div className="text">
                      {rangeMapping[handles][1]}% {/* Low */}
                    </div>
                  </div>
                  <div className="show-color-first">
                    <div className="circle3"></div>
                    <div className="text">
                      {rangeMapping[handles][2]}% {/* Medium */}
                    </div>
                  </div>
                  <div className="show-color-first">
                    <div className="circle4"></div>
                    <div className="text">
                      {rangeMapping[handles][3]}%+ {/* High */}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}

        </div>
      </div>


      <div className="mapMainContainer">
        <div className="d-flex justify-content-between align-items-center mt-2">
          {geoJsonId === "india-states" && (
            <div className="buttonWrapper" style={{ visibility: "hidden" }}>
              <button
                className="backButton ms-2"
              >
                <ArrowBackIcon /> National View
              </button>
            </div>
          )

          }

          {geoJsonId !== "india-states" && (
            <div className="buttonWrapper">
              <button
                onClick={() => {
                  setGeoJsonId(COUNTRY_VIEW_ID);
                  dispatch(removeAllDistrict());
                  dispatch(removeAllBlock());
                  localStorage.setItem("year", "2021-22")
                  window.localStorage.setItem("map_district_name", "District");
                  window.localStorage.setItem("map_state_name", "All India/National");
                  window.localStorage.setItem("state", "All India/National");
                  dispatch(fetchMaptatsData(modifiedFilterObjForReset));
                  dispatch(fetchMaptatsOtherData(modifiedFilterObjForReset));
                  handleAPICallAccordingToFilter(modifiedFilterObjResetDashboard);
                  dispatch(setstateId(null));
                }}
                className="backButton ms-2"
              >
                <ArrowBackIcon /> National View
              </button>
            </div>
          )}
          <div className="map-dropdown">
            {handleSchemesEvent === "gross_enrollment_ratio" && (
              <select
                value={selectedEnrollmentType}
                onChange={(e) => setSelectedEnrollmentType(e.target.value)}
                className="form-control"
              >
                <option value="elementary">Elementary</option>
                <option value="secondary">Secondary</option>
              </select>
            )}

            {handleSchemesEvent === "dropout_rate" && (
              <select
                value={selectedDropoutType}
                onChange={(e) => setSelectedDropoutType(e.target.value)}
                className="form-control"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            )}

            {handleSchemesEvent === "transition_rate" && (
              <select name="" id="" className="form-control"
                value={selectedTransitionRate}
                onChange={(e) => setSelectedTransitionRate(e.target.value)}
              >
                <option value="primaryToUpper">Primary to upper primary</option>
                <option value="upperToSec">Upper primary to secondary</option>
              </select>
            )}
            {handleSchemesEvent === "pupil_teacher_ratio" && (
              <select name="" id="" className="form-control"
                value={selectedPupilTeacherRatio}
                onChange={(e) => setSelectedPupilTeacherRatio(e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="upperPrimary">Upper Primary</option>
              </select>
            )}
          </div>
        </div>
        {dashIntDataMapLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 90,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: "5px",
              zIndex: 1000,
              height: '75vh',
              width: '100%'
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <MapContainer
          className="map"
          center={mapCenter}
          zoom={11}
          zoomControl={false}
          ref={mapRef}
          attributionControl={false}
          style={{ height: "75vh", width: "100%" }}
        >



          {mapData && (
            <GeoJSON className="map-interactive"
              data={geoJson}
              key={geoJsonId}
              scrollWheelZoom={true}
              style={geoJSONStyle}
              onEachFeature={onEachFeature}
              ref={geoJsonRef}
            />
          )}

          {/* code for show bydefault district name */}
          {/* {mapData && geoJson.features.map((feature, index) => {
            if (feature.properties && feature.properties.lgd_district_name) {
              const [lat, lng] = getCentroid(feature);

              if (geoJsonId !== "india-states") {
                return (
                  <Marker
                    key={index}
                    position={[lat, lng]}
                    icon={L.divIcon({
                      className: 'state-label',
                      html: `<div style="font-size: 8px; color: #000; text-align: center; z-index:1">${feature.properties.lgd_district_name}</div>`,
                      iconSize: [50, 20],
                      iconAnchor: [25, 10],
                    })}
                  />
                );
              }
            }
            return null;
          })} */}

          <MapUpdater />
        </MapContainer>
      </div>
    </>
  );
}
