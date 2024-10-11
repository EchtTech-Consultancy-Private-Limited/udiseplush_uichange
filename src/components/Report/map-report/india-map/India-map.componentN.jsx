import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import * as topojson from "topojson-client";
import "../india-map/india-map.componentN.scss";
import india from "../../../../json-data/india.json";
import { getColor, layersUtils, getCenterOfGeoJson } from "./MapUtilsN";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  setstateId,
  setUpdateFlag,
  updateMapLoaded,
} from "../../../../redux/slice/mapSlice";
import {
  fetchAllStateSchemesData,
  fetchDashboardData,
  fetchMaptatsData,
  fetchMaptatsOtherData,
  fetchSchoolStatsData,
  fetchSchoolStatsIntData,
  fetchStudentStatsData,
  fetchStudentStatsIntData,
  fetchTeachersStatsData,
  fetchTeachersStatsIntData,
} from "../../../../redux/thunks/dashboardThunk";
import {
  allSWiseregionCode,
  allSWiseregionType,
  district,
  modifiedFilterObjForReset,
  modifiedFilterObjResetDashboard,
  nationalWiseName,
  nWiseregionCode,
  nWiseregionType,
  rangeMapping,
  specificSWiseregionType,
  stateWiseName,
} from "../../../../constants/constants";
import {
  fetchDistrictDataByStateCode,
  removeAllDistrict,
} from "../../../../redux/thunks/districtThunk";
import { removeAllBlock } from "../../../../redux/thunks/blockThunk";
import L from "leaflet";
import { allFilter } from "../../../../redux/slice/schoolFilterSlice";
import {
  fetchArchiveServicesGraphSchoolData,
  fetchArchiveServicesSchoolData,
} from "../../../../redux/thunks/archiveServicesThunk";
import { useLocation } from "react-router-dom";
import { setMapLoader, setReserveUpdatedFilter } from "../../../../redux/slice/headerSlice";
const COUNTRY_VIEW_ID = "india-states";

export default function IndiaMapComponentN() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [geoJsonId, setGeoJsonId] = useState(COUNTRY_VIEW_ID);
  const [mapData, setMapData] = useState({
    dashIntDataMap: null,
    dashData: null,
  });
  const geoJson = useMemo(
    () => topojson.feature(india, india.objects[geoJsonId]),
    [geoJsonId]
  );
  const mapRef = useRef(null);
  const geoJsonRef = useRef(null);
  const handleSchemesEvent = useSelector(
    (state) => state?.mapData?.grossEData,
    shallowEqual
  );
  const schoolFilter = useSelector(
    (state) => state?.schoolFilter,
    shallowEqual
  );
  let filterObj = structuredClone(schoolFilter);
  useEffect(() => {
    localStorage.setItem("selectedYearId", filterObj.yearId);
  }, [filterObj.yearId]);
  const selectedStateCode = useSelector(
    (state) => state.mapData.stateId,
    shallowEqual
  );
  const localStorageStateName = window.localStorage.getItem("map_state_name");
  const mapDisValue = window.localStorage.getItem("map_district_name");
  const [handles, setHandles] = useState(handleSchemesEvent);
  const handlesRef = useRef(handles);
  const dashIntDataMap = useSelector(
    (state) => state?.MapStats?.data?.data,
    shallowEqual
  );
  const dashData = useSelector(
    (state) => state?.MapStatsPercentage?.data?.data,
    shallowEqual
  );
  const dashDataLoading = useSelector(
    (state) => state?.MapStatsPercentage?.data?.status,
    shallowEqual
  );
  const dashIntDataMapLoading = useSelector(
    (state) => state?.MapStats?.data?.status,
    shallowEqual
  );
  const header_name = useSelector((state) => state.header);
  const districtUdice = useSelector(
    (state) => state.distBlockWise.blockUdiseCode
  );
  const headerSlice = useSelector((state) => state.header);
  const selectedYearId = useSelector((state) => state.header.selectYearId, shallowEqual);
  const [selectedEnrollmentType, setSelectedEnrollmentType] =
    useState("elementary");
  const [selectedDropoutType, setSelectedDropoutType] = useState("primary");
  const [selectedTransitionRate, setSelectedTransitionRate] =
    useState("primaryToUpper");
  const [selectedPupilTeacherRatio, setSelectedPupilTeacherRatio] =
    useState("primary");
  const [loading, setLoding] = useState("true");
  //const loading = useSelector((state => state?.header?.mapLoader))
  useEffect(() => {
    setHandles(handleSchemesEvent);
  }, [handleSchemesEvent]);

  useEffect(() => {
    dispatch(setReserveUpdatedFilter(filterObj));
  }, [selectedYearId])

  useEffect(() => {
    handlesRef.current = handles;
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer) =>
        updateFeatureStyleAndTooltip(layer?.feature, layer)
      );
    }
  }, [
    handles,
    mapData,
    selectedEnrollmentType,
    selectedDropoutType,
    selectedTransitionRate,
    selectedPupilTeacherRatio,
  ]);

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

  // const MapUpdater = () => {
  //   const map = useMap();
  //   useEffect(() => {
  //     if (map && geoJsonRef.current) {
  //       map.fitBounds(geoJsonRef.current.getBounds());
  //     }
  //   }, [map, geoJsonId, mapData, handles]);

  //   return null;
  // };

  const MapUpdater = ({ geoJsonRef }) => {
    const map = useMap();

    useEffect(() => {
      if (map && geoJsonRef.current) {
        const overlayElements = document.getElementsByClassName("map");
        const bounds = geoJsonRef.current.getBounds();
        if (geoJsonId === "india-states") {
          const zoomLevel = 4;
          const center = bounds.getCenter();
          map.setView(center, zoomLevel);
          for (let i = 0; i < overlayElements.length; i++) {
            overlayElements[i].style.transform = "";
          }
        } else {
          const isMediumScreen = window.matchMedia(
            "(max-width: 1599px) and (min-width: 1400px)"
          ).matches;
          const isSmallScreen = window.matchMedia(
            "(max-width: 1399px) and (min-width: 1024px)"
          ).matches;
          for (let i = 0; i < overlayElements.length; i++) {
            if (isMediumScreen) {
              if (geoJsonId === "24") {
                overlayElements[i].style.transform = "scale(1.62)";
              } else if (geoJsonId === "18") {
                overlayElements[i].style.transform = "scale(1.55)";
              } else if (geoJsonId === "30") {
                overlayElements[i].style.transform = "scale(1.99)";
              } else if (geoJsonId === "12") {
                overlayElements[i].style.transform = "scale(1.17)";
              } else {
                overlayElements[i].style.transform = "scale(1.40)";
              }
            } else if (isSmallScreen) {
              if (geoJsonId === "24") {
                overlayElements[i].style.transform = "scale(1.45)";
              } else if (geoJsonId === "18") {
                overlayElements[i].style.transform = "scale(1.35)";
              } else if (geoJsonId === "30") {
                overlayElements[i].style.transform = "scale(1.99)";
              } else {
                overlayElements[i].style.transform = "scale(1.25)";
              }
            } else {
              if (geoJsonId === "24") {
                overlayElements[i].style.transform = "scale(1.15)";
              } else if (geoJsonId === "18") {
                overlayElements[i].style.transform = "scale(1.05)";
              } else if (geoJsonId === "30") {
                overlayElements[i].style.transform = "scale(1.7)";
              } else if (geoJsonId === "12") {
                overlayElements[i].style.transform = "scale(1.37)";
              } else if (geoJsonId === "33") {
                overlayElements[i].style.transform = "scale(1.30)";
              } else if (geoJsonId === "19") {
                overlayElements[i].style.transform = "scale(1.10)";
              } else if (geoJsonId === "34") {
                overlayElements[i].style.transform = "scale(1.10)";
              } else if (geoJsonId === "21") {
                overlayElements[i].style.transform = "scale(1.10)";
              } else {
                overlayElements[i].style.transform = "scale(1.50)";
              }
            }
          }
          map.fitBounds(bounds, {
            paddingTopLeft: [20, 50],
            paddingBottomRight: [20, 50],
            // Padding:[200, 200],
            maxZoom: 6.5,
            minZoom: 6,
          });
        }
      }
    }, [map, geoJsonId, geoJsonRef]);

    return null;
  };

  const getColorFromData = useCallback(
    (feature) => {
      const properties = feature?.properties;
      const state_id =
        localStorageStateName === "All India/National"
          ? properties.lgd_state_id
          : null;
      const district_id =
        localStorageStateName !== "All India/National"
          ? properties.udiseDistrictCode
          : null;
      const district_ids = properties.udiseDistrictCode || [];
      const isHighlightedDistrict =
        districtUdice.length >= 4 && district_ids.includes(districtUdice);
      const matchingDatas = state_id
        ? {
          dashIntData: mapData?.dashIntDataMap?.find(
            (item) => item.regionCd === state_id
          ),
          dashData: mapData?.dashData?.find(
            (item) => item.regionCd === state_id
          ),
        }
        : district_id
          ? {
            dashIntData: mapData?.dashIntDataMap?.find(
              (item) => item.regionCd === district_id
            ),
            dashData: mapData?.dashData?.find(
              (item) => item.regionCd === district_id
            ),
          }
          : null;
      const getColor = (a, thresholds, reversed = false) => {
        var normalizedA = a;
        if (reversed) {
          return normalizedA <= thresholds[0]
            ? "#c1d0b5"
            : normalizedA <= thresholds[1]
              ? "#e3d1f8"
              : normalizedA <= thresholds[2]
                ? "#ffeda0"
                : "#fcae91";
        } else {
          return normalizedA <= thresholds[0]
            ? "#fcae91"
            : normalizedA <= thresholds[1]
              ? "#ffeda0"
              : normalizedA <= thresholds[2]
                ? "#e3d1f8"
                : "#c1d0b5";
        }
      };

      var a = 0,
        b = 0;
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
    },
    [
      mapData,
      localStorageStateName,
      handlesRef.current,
      districtUdice,
      selectedEnrollmentType,
      selectedDropoutType,
      selectedTransitionRate,
      selectedPupilTeacherRatio,
    ]
  );

  useEffect(() => {
    setLoding(true);
  }, [schoolFilter,selectedYearId]);

  const updateFeatureStyleAndTooltip = useCallback(
    (feature, layer) => {
      const { color, isHighlightedDistrict } = getColorFromData(feature);
      layer.setStyle({
        color: isHighlightedDistrict ? "#003366" : "#1f2021",
        weight: isHighlightedDistrict ? 7 : 1,
        dashArray: isHighlightedDistrict ? "1, 10" : "1, 0",
        fillOpacity: 1,
        fillColor: color,
      });

      const properties = feature?.properties;
      const state_id =
        localStorageStateName === "All India/National"
          ? properties.lgd_state_id
          : null;
      const district_id =
        localStorageStateName !== "All India/National"
          ? properties.udiseDistrictCode
          : null;
      const matchingDatas = state_id
        ? {
          dashIntData: mapData?.dashIntDataMap?.find(
            (item) => item.regionCd === state_id
          ),
          dashData: mapData?.dashData?.find(
            (item) => item.regionCd === state_id
          ),
        }
        : district_id
          ? {
            dashIntData: mapData?.dashIntDataMap?.find(
              (item) => item.regionCd === district_id
            ),
            dashData: mapData?.dashData?.find(
              (item) => item.regionCd === district_id
            ),
          }
          : null;

      let tooltipContent;
      if (localStorageStateName === "All India/National") {
        // dispatch(setMapLoader(true))
        setLoding(true)
        tooltipContent = `<div class="tooltip-content"><strong>State:</strong> <span class="tooltip-content-text">${properties?.lgd_state_name || "N/A"
          }</span></div>`;
        if (matchingDatas?.dashIntData) {
          //dispatch(setMapLoader(false))
          if (handlesRef.current === "gross_enrollment_ratio") {
            if (selectedEnrollmentType === "elementary") {
              tooltipContent += `<br/><strong>Gross Enrollment Ratio Elementary:</strong> <span class="tooltip-content-text">${matchingDatas?.dashIntData?.gerElementary || "N/A"
                } % </span>`;
            } else if (selectedEnrollmentType === "secondary") {
              tooltipContent += `<br/><strong>Gross Enrollment Ratio  Secondary:</strong> <span class="tooltip-content-text">${matchingDatas?.dashIntData?.gerSec || "N/A"
                } % </span>`;
            }
          }
          if (handlesRef.current === "dropout_rate") {
            if (selectedDropoutType === "primary") {
              tooltipContent += `<br/><strong>Dropout Rate Primary:</strong> <span class="tooltip-content-text" > ${matchingDatas?.dashIntData?.dropoutPry || "N/A"
                } % </span>`;
            } else if (selectedDropoutType === "secondary") {
              tooltipContent += `<br/><strong>Dropout Rate Secondary:</strong> <span class="tooltip-content-text"> ${matchingDatas?.dashIntData?.dropoutSec || "N/A"
                } % </span>`;
            }
          }
          if (handlesRef.current === "transition_rate") {
            if (selectedTransitionRate === "primaryToUpper") {
              tooltipContent += `<br/><strong>Transition Rate Primary to Upper Primary:</strong> <span class="tooltip-content-text">${matchingDatas?.dashIntData?.transPryUPry || "N/A"
                } % </span>`;
            } else if (selectedTransitionRate === "upperToSec") {
              tooltipContent += `<br/><strong>Transition Rate Upper Primary to Secondary:</strong><span class="tooltip-content-text"> ${matchingDatas?.dashIntData?.transUPrySec || "N/A"
                } % </span>`;
            }
          }
          if (handlesRef.current === "pupil_teacher_ratio") {
            if (selectedPupilTeacherRatio === "primary") {
              tooltipContent += `<br/><strong>Pupil Teacher Ratio Primary:</strong> <span class="tooltip-content-text"> ${matchingDatas?.dashIntData?.ptrPry || "N/A"
                }<span/>`;
            } else if (selectedPupilTeacherRatio === "upperPrimary") {
              tooltipContent += `<br/><strong>Pupil Teacher Ratio Upper Primary:</strong> <span class="tooltip-content-text"> ${matchingDatas?.dashIntData?.ptrUPry || "N/A"
                } </span>`;
            }
          }
          if (handlesRef.current === "schools_with_drinking_water") {
            tooltipContent += `<br/><strong>Schools with Drinking Water:</strong> <span class="tooltip-content-text">  ${matchingDatas?.dashData?.schWithDrinkWater || "N/A"
              } % </span>`;
          }
          if (handlesRef.current === "schools_with_electricity_connection") {
            tooltipContent += `<br/><strong> Schools with Electricity Connection:</strong> <span class="tooltip-content-text"> ${matchingDatas?.dashData?.schWithElectricity || "N/A"
              } % </span>`;
          }
          setLoding(false)
        }

      } else {

        tooltipContent = `<div class="tooltip-content"><strong>District:</strong> <span class="tooltip-content-text"> ${properties?.lgd_district_name || "N/A"
          } </span></div>`;
     //   setLoding(false)
        // dispatch(setMapLoader(true))

        if (matchingDatas?.dashIntData) {
          dispatch(setMapLoader(false))
          if (handlesRef.current === "gross_enrollment_ratio") {
            if (selectedEnrollmentType === "elementary") {
              tooltipContent += `<br/><strong>Gross Enrollment Ratio Elementary:</strong> <span class="tooltip-content-text">${matchingDatas?.dashIntData?.gerElementary || "N/A"
                } % </span>`;
            } else if (selectedEnrollmentType === "secondary") {
              tooltipContent += `<br/><strong>Gross Enrollment Ratio  Secondary:</strong> <span class="tooltip-content-text">${matchingDatas?.dashIntData?.gerSec || "N/A"
                } % </span>`;
            }
          }
          if (handlesRef.current === "dropout_rate") {
            if (selectedDropoutType === "primary") {
              tooltipContent += `<br/><strong>Dropout Rate Primary:</strong> <span class="tooltip-content-text">${matchingDatas?.dashIntData?.dropoutPry || "N/A"
                } % </span>`;
            } else if (selectedDropoutType === "secondary") {
              tooltipContent += `<br/><strong>Dropout Rate Secondary:</strong> <span class="tooltip-content-text">${matchingDatas?.dashIntData?.dropoutSec || "N/A"
                } % </span>`;
            }
          }
          if (handlesRef.current === "transition_rate") {
            if (selectedTransitionRate === "primaryToUpper") {
              tooltipContent += `<br/><strong>Transition Rate Primary to Upper Primary:</strong> <span class="tooltip-content-text"> ${matchingDatas?.dashIntData?.transPryUPry || "N/A"
                } % </span>`;
            } else if (selectedTransitionRate === "upperToSec") {
              tooltipContent += `<br/><strong>Transition Rate Upper Primary to Secondary:</strong> <span class="tooltip-content-text"> ${matchingDatas?.dashIntData?.transUPrySec || "N/A"
                } % </span>`;
            }
          }
          if (handlesRef.current === "pupil_teacher_ratio") {
            if (selectedPupilTeacherRatio === "primary") {
              tooltipContent += `<br/><strong>Pupil Teacher Ratio Primary:</strong> <span class="tooltip-content-text"> ${matchingDatas?.dashIntData?.ptrPry || "N/A"
                } </span>`;
            } else if (selectedPupilTeacherRatio === "upperPrimary") {
              tooltipContent += `<br/><strong>Pupil Teacher Ratio Upper Primary:</strong> <span class="tooltip-content-text">${matchingDatas?.dashIntData?.ptrUPry || "N/A"
                }</span>`;
            }
          }
          if (handlesRef.current === "schools_with_drinking_water") {
            tooltipContent += `<br/><strong>Schools with Drinking Water:</strong> <span class="tooltip-content-text">${matchingDatas?.dashData?.schWithDrinkWater || "N/A"
              } % </span>`;
          }
          if (handlesRef.current === "schools_with_electricity_connection") {
            tooltipContent += `<br/><strong> Schools with Electricity Connection:</strong> <span class="tooltip-content-text"> ${matchingDatas?.dashData?.schWithElectricity || "N/A"
              } % </span>`;
          }

        }
        setLoding(false)
      }
 
      layer.bindTooltip(tooltipContent, {
        sticky: false,
        className: "custom-tooltip",
      });

      // if (isHighlightedDistrict) {
      //   const bounds = layer.getBounds();
      //   mapRef.current.fitBounds(bounds, { padding: [20, 20] });
      // }
   
    },
    [
      getColorFromData,
      mapData,
      localStorageStateName,
      handles,
      selectedEnrollmentType,
      selectedDropoutType,
      selectedTransitionRate,
      selectedPupilTeacherRatio,

    ]
  );

  useEffect(() => {
    if(schoolFilter.regionCode.length>=4 || header_name.headerName === "School Dashboard"){
      setLoding(false);
    }
  }, [schoolFilter, header_name.headerName]);
  const geoJSONStyle = useCallback(
    (feature) => {
      const { color, isHighlightedDistrict } = getColorFromData(feature);
      return {
        color: isHighlightedDistrict ? "#003366" : "#1f2021",
        weight: isHighlightedDistrict ? 7 : 1,
        dashArray: isHighlightedDistrict ? "1, 10" : "1, 0",
        fillOpacity: 1,
        fillColor: color,
      };
    },
    [getColorFromData, handles]
  );

  const onEachFeature = useCallback(
    (feature, layer) => {
      if (feature) {
        updateFeatureStyleAndTooltip(feature, layer);
      }
      layer.on({
        mouseover: layersUtils(geoJsonRef.current, mapRef.current)
          .highlightOnClick,
        mouseout: layersUtils(geoJsonRef.current, mapRef.current)
          .resetHighlight,
        click: onDrillDown,
      });

      // layer.bindPopup(feature.properties.lgd_state_name);
    },
    [updateFeatureStyleAndTooltip, mapData, handles]
  );

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
  };
  // };
  const onDrillDown = useCallback(
    (e) => {
      let StateName;
      let featureId;

      const selectYearId = localStorage.getItem("selectedYearId")
      let filterObj = structuredClone(schoolFilter);
      filterObj.yearId = selectYearId;
      if (e) {
        StateName = e?.target?.feature?.properties?.lgd_state_name;
        featureId = e?.target
          ? e?.target?.feature?.properties?.lgd_state_id
          : e;
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
            yearId: selectYearId,
            valueType: 2,
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
            yearId: selectYearId,
          };
          dispatch(fetchAllStateSchemesData(modifiedFilterObjs));
        } else if (StateName === stateWiseName) {
          const newDataObject = {
            yearId: selectYearId,
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
              yearId: selectYearId,
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
    },
    [dispatch, schoolFilter, localStorageStateName, geoJsonId]
  );

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
    const lat =
      flatCoords.reduce((sum, coord) => sum + coord[1], 0) / flatCoords.length;
    const lng =
      flatCoords.reduce((sum, coord) => sum + coord[0], 0) / flatCoords.length;

    if (isNaN(lat) || isNaN(lng)) {
      return [0, 0];
    }

    return [lat, lng];
  };

  return (
    <>
      <div className="mapMainContainer">
        <div className="d-flex justify-content-between align-items-center mt-2">
          {geoJsonId === "india-states" && (
            <div className="buttonWrapper" style={{ visibility: "hidden" }}>
              <button className="backButton ms-2">
                <ArrowBackIcon /> National View
              </button>
            </div>
          )}

          {geoJsonId !== "india-states" && (
            <div className="buttonWrapper">
              <button
                onClick={() => {
                  setGeoJsonId(COUNTRY_VIEW_ID);
                  dispatch(removeAllDistrict());
                  dispatch(removeAllBlock());
                  localStorage.setItem("year", "2021-22");
                  window.localStorage.setItem("map_district_name", "District");
                  window.localStorage.setItem(
                    "map_state_name",
                    "All India/National"
                  );
                  window.localStorage.setItem("state", "All India/National");
                  dispatch(fetchMaptatsData(modifiedFilterObjForReset));
                  dispatch(fetchMaptatsOtherData(modifiedFilterObjForReset));
                  handleAPICallAccordingToFilter(
                    modifiedFilterObjResetDashboard
                  );
                  dispatch(setstateId(null));
                }}
                className="backButton ms-2"
              >
                <ArrowBackIcon /> National View
              </button>
            </div>
          )}
        </div>
        {/* !dashDataLoading && !dashIntDataMapLoading &&  */}
        {loading && (
          <Box className="map-overley">
            <CircularProgress />
          </Box>
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
            <select
              name=""
              id=""
              className="form-control"
              value={selectedTransitionRate}
              onChange={(e) => setSelectedTransitionRate(e.target.value)}
            >
              <option value="primaryToUpper">Primary to upper primary</option>
              <option value="upperToSec">Upper primary to secondary</option>
            </select>
          )}
          {handleSchemesEvent === "pupil_teacher_ratio" && (
            <select
              name=""
              id=""
              className="form-control"
              value={selectedPupilTeacherRatio}
              onChange={(e) => setSelectedPupilTeacherRatio(e.target.value)}
            >
              <option value="primary">Primary</option>
              <option value="upperPrimary">Upper Primary</option>
            </select>
          )}
        </div>

        <MapContainer
          className="map"
          center={mapCenter}
          zoom={5}
          ref={mapRef}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
          attributionControl={false}
        >

          {mapData && (
            <GeoJSON
              className="map-interactive"
              data={geoJson}
              key={geoJsonId}
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
                      html: `<div style="font-size: 7px; color: #000; text-align: center; z-index:1">${feature.properties.lgd_district_name}</div>`,
                      iconSize: [60, 20],
                      iconAnchor: [25, 10],
                    })}
                  />
                );
              }
            }
            return null;
          })} */}

          <MapUpdater
            geoJsonRef={geoJsonRef}
            geoJsonId={geoJsonId}
            center={mapCenter}
          />
        </MapContainer>
      </div>

      <div className="position-relative">
        <div className="d-flex justify-content-center align-items-center ps-2 pr-2">
          {handles !== "" && rangeMapping[handles] ? (
            <div className="show-color-meaning">
              {["dropout_rate", "pupil_teacher_ratio"].includes(handles) ? (
                <>
                  <div className="show-color-first">
                    <div className="circle4"></div>
                    <div className="text">
                      {rangeMapping[handles][3]}
                      {handles !== "pupil_teacher_ratio" && "%"}{" "}
                      {/* High (reversed to Low) */}
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
                      {handles !== "pupil_teacher_ratio" && "%"}{" "}
                      {/* Low (reversed to High) */}
                    </div>
                  </div>
                  <div className="show-color-first">
                    <div className="circle1"></div>
                    <div className="text">
                      {rangeMapping[handles][0]}
                      {handles !== "pupil_teacher_ratio" && "%"}{" "}
                      {/* Very Low */}
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
    </>
  );
}