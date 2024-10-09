import React, { useEffect, useState } from "react";
import {
  district,
  block,
  nWiseregionType,
  nWiseregionCode,
  selectedDYear,
  allSWiseregionType,
  allSWiseregionCode,
  specificSWiseregionType,
  allDWiseregionType,
  specificDWiseregionType,
  allBWiseregionType,
  specificBWiseregionType,
  nationalWiseName,
  stateWiseName,
  districtWiseName,
  blockWiseName,
  initialFilterSchoolData,
  initialFilterPtRData,
  intialStateWiseFilterSchData,
  modifiedFilterObjForReset,
  initialFilterMapData,
  modifiedFilterObjResetDashboard,

} from "../../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStateData,
  updateFilterState,
} from "../../../redux/thunks/stateThunk";
import {
  fetchDistrictDataByStateCode,
  removeAllDistrict,
  updateFilterDistrict,
} from "../../../redux/thunks/districtThunk";
import { fetchYearData } from "../../../redux/thunks/yearThunk";
import { allFilter } from "../../../redux/slice/schoolFilterSlice3016";
import { setSelectedStateCode } from "../../../redux/slice/stateSlice";
import {
  updateUdiseBlockCode,
  updateUdiseDistrictCode,
} from "../../../redux/slice/DistBlockWiseSlice";
import {
  fetchBlockByDistrictCode,
  removeAllBlock,
  updateFilterBlock,
} from "../../../redux/thunks/blockThunk";
import { Select } from "antd";
import { useLocation, useParams } from "react-router-dom";

import {
  fetchArchiveServicesSchoolData,
  fetchArchiveServicesGraphSchoolData,
} from "../../../redux/thunks/archiveServicesThunk";
import {
  fetchDashboardData,
  fetchSchoolStatsData,
  fetchTeachersStatsData,
  fetchStudentStatsData,
  fetchStudentStatsIntData,
  fetchSchoolStatsIntData,
  fetchTeachersStatsIntData,
  fetchAllStateSchemesData,
  fetchSchoolStatsDataYear,
  fetchMaptatsData,
  fetchMaptatsOtherData,
} from "../../../redux/thunks/dashboardThunk";
import {
  handleCurrentIndex,
  handleRegionName,
  handleShowDistrict,
  handleViewDataByShow,
  handleShowFilter,
  setReserveUpdatedFilter,
  setSelectYearId,
} from "../../../redux/slice/headerSlice";
import mapJsonData from "../../../mapData/mapDatalatLong.json";
import {
  setstateId,
  updateMapData,
  updateMapLoaded,
  updateMapSession,
} from "../../../redux/slice/mapSlice";
import { mapFilter } from "../../../redux/slice/mapFilterSlice";
export default function FilterDropdown3016() {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryString = window.location.href;
  const urlParams = new URLSearchParams(queryString.replace("#/", ""));
  const paramValue = urlParams.get("type");
  const stateData = useSelector((state) => state.state);
  const headerSlice = useSelector((state) => state.header);
  const stateDataClone = useSelector((state) => state.state.dataClone);
  const yearData = useSelector((state) => state.year);
  const schoolFilter = useSelector((state) => state.schoolFilter);
  const districtData = useSelector((state) => state.distrct);
  const districtDataClone = useSelector((state) => state.distrct.dataClone);
  const blockData = useSelector((state) => state.block);
  const blockDataClone = useSelector((state) => state.block.dataClone);
  const headerData = useSelector((state) => state.header);
  const [isStateSelected, setIsStateSelected] = useState(false);
  const [selectedState, setSelectedState] = useState(nationalWiseName);
  const [selectedStateW, setSelectedStateW] = useState("State Wise");
  const [selectedDistrict, setSelectedDistrict] = useState(district);
  const [selectedDistrictclone, setSelectedDistrictClone] = useState(district);
  const [selectedYear, setSelectedYear] = useState(selectedDYear);
  const [selectedBlock, setSelectedBlock] = useState(block);
  const [selectedBlockClone, setSelectedBlockClone] = useState(block);
  const [isDashbtnDisabled, setIsDashbtnDisabled] = useState(true);
  const [is3016btnDisabled, setIs3016btnDisabled] = useState(true);
  const show = useSelector((state) => state.header.show);
  const distBlockWiseData = useSelector((state) => state.distBlockWise);
  let filterObj = structuredClone(schoolFilter);
  const reserveUpdatedFilter = useSelector(
    (state) => state.header.reserveUpdatedFilter
  );
  const selectedStateCode = useSelector(
    (state) => state.state.selectedStateCode
  );
  const [updateYearId, setUpdateYearId] = useState(filterObj.yearId);

  //window.localStorage.setItem("state", selectedState);

  useEffect(() => {
    window.localStorage.setItem("state_wise", selectedStateW);
    window.localStorage.setItem("district", selectedDistrict);
    window.localStorage.setItem("block", selectedBlock);
    window.localStorage.setItem("year", selectedYear);
  }, [selectedState, blockData, stateData, districtData, paramValue, yearData]);
  const mapStateValue = localStorage.getItem("map_state_name");
  const mapDisValue = window.localStorage.getItem("map_district_name");
  const mapBlockValue = window.localStorage.getItem("block");
  const mapYearValue = window.localStorage.getItem("year");
  const [jsonstateData, setJsonStateData] = useState([]);
  useEffect(() => {
    filterObj = structuredClone(schoolFilter);
  }, [schoolFilter]);

  useEffect(() => {
    setJsonStateData(mapJsonData.stateData);
    const queryString = window.location.href;
    const urlParams = new URLSearchParams(queryString.replace("#/", ""));
    const paramValue = urlParams.get("type");
    if (paramValue === "table") {
      dispatch(handleViewDataByShow(true));
    } else if (location.pathname === "/") {
      dispatch(handleViewDataByShow(true));
    } else {
      dispatch(handleViewDataByShow(false));
    }
  }, [mapJsonData.stateData]);

  useEffect(() => {
    dispatch(fetchStateData(filterObj.yearId));
    dispatch(fetchYearData());
    const children = document.getElementsByClassName("position-static");
    let filter_drodown = document.getElementsByClassName("filter_drodown")[0];
    if (children.length === 2) {
      filter_drodown?.classList?.add("small-filter-box");
    } else {
      filter_drodown?.classList?.remove("small-filter-box");
    }

    dispatch(allFilter(initialFilterSchoolData));
    dispatch(mapFilter(initialFilterMapData));
    const handleEvent = () => {
      // setShow(false);
      dispatch(handleShowFilter(false));
    };
    const targetElement = window.document.getElementById("content");
    targetElement.removeEventListener("click", handleEvent);
    targetElement.addEventListener("click", function (e) {
      handleEvent();
    });

    return () => {
      targetElement.removeEventListener("click", handleEvent);
    };
  }, []);

  const handleSchoolFilterYear = (e) => {
    const splittedArr = e.split("@");
    const year = parseInt(splittedArr[0]);
    const year_report = splittedArr[1];
    setSelectedYear(year_report);
    dispatch(setSelectYearId(year))
    filterObj.yearId = year;
    setUpdateYearId(filterObj?.yearId);
    if (location.pathname !== "/") {
      filterObj.valueType = 1;
    } else {
      filterObj.valueType = 2;
    }
    const reserveUpdatedFilters = {
      ...reserveUpdatedFilter,
      yearId: year,
      valueType: location.pathname !== "/" ? 1 : 2,
    };
    dispatch(setReserveUpdatedFilter(reserveUpdatedFilters));
    
    // dispatch(allFilter(filterObj));
    if (mapStateValue === nationalWiseName || mapStateValue === stateWiseName) {
 
      handleAPICallAccordingToFilter(filterObj);
      filterObj.regionType=21
      filterObj.dType=21
      filterObj.dashboardRegionType=21
      handleAPICallAccordingToFilterMap(filterObj)
    } else {
      handleAPICallAccordingToFilter(reserveUpdatedFilters);
      reserveUpdatedFilters.regionType=22
      reserveUpdatedFilters.dType=22
      reserveUpdatedFilters.dashboardRegionType=22;
      handleAPICallAccordingToFilterMap(reserveUpdatedFilters)
    }

    window.localStorage.setItem("year", year_report);
    hideOpendFilterBox();
  };

  const handleSchoolFilterState = (e) => {
    const splittedArr = e.split("@");
    const state_code = splittedArr[0];
    const state_name = splittedArr[1];
    const lat = splittedArr[2];
    const long = splittedArr[3];
    filterObj.yearId = updateYearId;
    dispatch(setstateId(state_code))
    setSelectedState(state_name);
    window.localStorage.setItem("map_state_name", state_name);
    dispatch(setSelectedStateCode(state_code));
    dispatch(updateUdiseDistrictCode(state_code));
    dispatch(handleRegionName("States"));

    if (state_name === nationalWiseName) {
      sessionStorage.setItem("handle", "");
      filterObj.regionType = nWiseregionType;
      filterObj.regionCode = nWiseregionCode;
      filterObj.dashboardRegionType = 10;
      filterObj.dashboardRegionCode = "09";
      filterObj.dType = 10;
      filterObj.dCode = 99;
      filterObj.valueType = location.pathname !== "/" ? 1 : 2;
      const updatedFilterObj = {
        regionType: nWiseregionType,
        regionCode: nWiseregionCode,
        dashboardRegionType: 10,
        dashboardRegionCode: "09",
        dType: 10,
        dCode: 99,
        valueType: selectedStateCode.valueType,
        valueType: location.pathname !== "/" ? 1 : 2,
        categoryCode: 0,
        schoolTypeCode: 0,
        locationCode: 0,
        managementCode: 0,
        yearId: 8,
      };

      dispatch(setReserveUpdatedFilter(updatedFilterObj));

      dispatch(allFilter(filterObj));
      dispatch(mapFilter(filterObj));
      handleAPICallAccordingToFilter(filterObj);
      const newDataObject={
        yearId: filterObj.yearId,
        regionType: 21,
        regionCode: "99",
        dType: 21,
        dCode: 99,
        dashboardRegionType: 21,
        dashboardRegionCode: state_code,
        valueType: location.pathname !== "/" ? 1 : 2,
      }
      handleAPICallAccordingToFilterMap(newDataObject)
      const elements = document.querySelectorAll(".impact-box-content.active");
      elements.forEach((element) => {
        element.classList.remove("active");
      });
      const disObj = {
        stateId: state_code,
        state_name: state_name,
        latitude: lat,
        longitude: long,
      };
      sessionStorage.setItem("state-map-details", JSON.stringify(disObj));

      dispatch(updateMapSession(disObj));
      dispatch(handleShowDistrict(false));
      dispatch(updateMapLoaded(false));
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(district);

      dispatch(
        fetchAllStateSchemesData({
          regionCode: 99,
          dCode: 99,
          regionType: 21,
          yearId: 8,
        })
      );

      const modifiedFilterObjs = {
        regionCode: 99,
        dCode: 99,
        regionType: 21,
        yearId: 8,
      };
      dispatch(fetchAllStateSchemesData(modifiedFilterObjs));
    } else if (state_name === stateWiseName) {
      // State-wise filtering
      const newDataObject = {
        yearId: filterObj.yearId,
        regionType: 10,
        regionCode: "99",
        dType: 10,
        dCode: 99,
        dashboardRegionType: 11,
        dashboardRegionCode: state_code,
        valueType: location.pathname !== "/" ? 1 : 2,
      };

      filterObj.regionType = allSWiseregionType;
      filterObj.regionCode = allSWiseregionCode;
      filterObj.dType = allSWiseregionType;
      filterObj.dCode = allSWiseregionCode;
      filterObj.dashboardRegionType = 11;
      filterObj.dashboardRegionCode = state_code;
      filterObj.valueType = location.pathname !== "/" ? 1 : 2;
      const updatedFilterObj = {
        regionType: allSWiseregionType,
        regionCode: allSWiseregionCode,
        dType: allSWiseregionType,
        dCode: allSWiseregionCode,
        dashboardRegionType: 11,
        dashboardRegionCode: state_code,
        valueType: location.pathname !== "/" ? 1 : 2,
        categoryCode: 0,
        schoolTypeCode: 0,
        locationCode: 0,
        managementCode: 0,
        yearId: 8,
      };

      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      dispatch(allFilter(filterObj));
      dispatch(mapFilter(filterObj));
      handleAPICallAccordingToFilter(
        location.pathname === "/" ? newDataObject : filterObj
      );
      handleAPICallAccordingToFilterMap(location.pathname === "/" ? newDataObject : filterObj)
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(district);
    } else {
      // Specific state filtering
      filterObj.regionType = specificSWiseregionType;
      filterObj.regionCode = state_code;
      filterObj.dType = 11;
      filterObj.dCode = state_code;
      filterObj.dashboardRegionType = 11;
      filterObj.dashboardRegionCode = state_code;
      filterObj.valueType = location.pathname !== "/" ? 1 : 2;
      const updatedFilterObj = {
        regionType: specificSWiseregionType,
        regionCode: state_code,
        dType: 11,
        dCode: state_code,
        dashboardRegionType: 11,
        dashboardRegionCode: state_code,
        valueType: location.pathname !== "/" ? 1 : 2,
        categoryCode: 0,
        schoolTypeCode: 0,
        locationCode: 0,
        managementCode: 0,
        yearId: 8,
      };

      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      dispatch(allFilter(filterObj));
      dispatch(mapFilter(filterObj));

      if (headerData.isViewDataByShow) {
        handleAPICallAccordingToFilter(filterObj);
      } else if (!headerData.isViewDataByShow && location.pathname !== "/") {
        const district_data = state_code + "@" + districtWiseName;
        handleSchoolFilterDistrict(district_data);
      }
    
      // if (headerData.isViewDataByShow && location.pathname === "/") {
      //   const district_data = state_code + "@" + districtWiseName;
      //   console.log(district_data, "district_data")
      //   handleSchoolFilterDistrict(district_data);
      // }


      dispatch(
        fetchDistrictDataByStateCode({
          state_code: state_code,
          yearId: filterObj.yearId,
        })
      );
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(state_name);

      const disObj = {
        stateId: state_code,
        state_name: state_name,
        latitude: lat,
        longitude: long,
      };

      sessionStorage.setItem("state-map-details", JSON.stringify(disObj));
      dispatch(updateMapSession(disObj));
      dispatch(handleShowDistrict(true));
    }

    dispatch(updateFilterState(stateDataClone.data));
    window.localStorage.setItem("state", state_name);
    window.localStorage.setItem("map_state_name", state_name);
    window.localStorage.setItem("map_district_name", "District");
   if(location.pathname === "/"){
    filterObj.regionType=22
    filterObj.dType=22
    filterObj.dashboardRegionType=22
   }
     headerData.isViewDataByShow && handleAPICallAccordingToFilterMap(filterObj);
    dispatch(handleCurrentIndex(0));
    hideOpendFilterBox();
  };

  const handleSchoolFilterDistrict = (e) => {
    const splittedArr = e.split("@");
    const district_code = splittedArr[0];
    const district_name = splittedArr[1];
    filterObj.yearId = updateYearId;
    dispatch(handleRegionName("Districts"));
    dispatch(updateUdiseBlockCode(district_code));
    if (district_name === districtWiseName) {
      filterObj.regionType = allDWiseregionType;
      filterObj.regionCode = district_code;
      filterObj.dashboardRegionType = 22;
      filterObj.dashboardRegionCode = "09";
      filterObj.dType = allDWiseregionType;
      filterObj.dCode = district_code;
      if (location.pathname !== "/") {
        filterObj.valueType = 1;
      } else {
        filterObj.valueType = 2;
      }
      const updatedFilterObj = {
        regionType: allDWiseregionType,
        regionCode: district_code,
        dashboardRegionType: 22,
        dashboardRegionCode: "09",
        dType: allDWiseregionType,
        dCode: district_code,
        valueType: location.pathname !== "/" ? 1 : 2,
        categoryCode: 0,
        schoolTypeCode: 0,
        locationCode: 0,
        managementCode: 0,
        yearId: 8,
      };

      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      dispatch(allFilter(filterObj));
      dispatch(mapFilter(filterObj));
      handleAPICallAccordingToFilter(filterObj);
      handleAPICallAccordingToFilterMap(filterObj)

      dispatch(removeAllBlock());
      setSelectedBlockClone(block);
      //  setSelectedBlock(block);
      window.localStorage.setItem("block", "Block");
    } else {
      filterObj.regionType = specificDWiseregionType;
      filterObj.regionCode = district_code;
      filterObj.dashboardRegionType = 12;
      filterObj.dashboardRegionCode = district_code;
      filterObj.dType = specificDWiseregionType;
      filterObj.dCode = district_code;
      if (location.pathname !== "/") {
        filterObj.valueType = 1;
      } else {
        filterObj.valueType = 2;
      }
      const updatedFilterObj = {
        regionType: specificDWiseregionType,
        regionCode: district_code,
        dashboardRegionType: 12,
        dashboardRegionCode: district_code,
        dType: specificDWiseregionType,
        dCode: district_code,
        valueType: location.pathname !== "/" ? 1 : 2,
        categoryCode: 0,
        schoolTypeCode: 0,
        locationCode: 0,
        managementCode: 0,
        yearId: 8,
      };
      // dispatch(
      //   fetchBlockByDistrictCode({
      //     district_code: district_code,
      //     yearId: (mapStateValue === nationalWiseName) ? filterObj.yearId : reserveUpdatedFilter.yearId,
      //   })
      // );
      // filterObj.dashboardRegionCode = district_code;
      dispatch(
        fetchBlockByDistrictCode({
          district_code: district_code,
          yearId: filterObj.yearId,
        })
      );
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      dispatch(allFilter(filterObj));
      dispatch(mapFilter(filterObj));
      setSelectedBlockClone(district_name);
      setSelectedBlock(block);
      headerData.isViewDataByShow && handleAPICallAccordingToFilter(filterObj);
      /*this function will be called when chart tab selected*/
      if (!headerData.isViewDataByShow && location.pathname !== "/") {
        const block_data = district_code + "@" + blockWiseName;
        handleSchoolFilterBlock(block_data);
      }
    }
    dispatch(updateFilterDistrict(districtDataClone.data));
    dispatch(removeAllBlock());
    setSelectedDistrict(district_name);
    setSelectedBlock(block);
    setSelectedBlockClone(block);
    window.localStorage.setItem("map_district_name", district_name);
    window.localStorage.setItem("district", district_name);
    dispatch(handleCurrentIndex(0));
    hideOpendFilterBox();
  };

  const handleSchoolFilterBlock = (e) => {
    const splittedArr = e.split("@");
    const block_code = splittedArr[0];
    const block_name = splittedArr[1];
    filterObj.yearId = updateYearId
    dispatch(handleRegionName("Blocks"));
    if (block_name === blockWiseName) {
      filterObj.regionType = allBWiseregionType;
      filterObj.regionCode = block_code;
      filterObj.dType = allBWiseregionType;
      filterObj.dCode = block_code;
      const updatedFilterObj = {
        regionType: allBWiseregionType,
        regionCode: block_code,
        dType: allBWiseregionType,
        dCode: block_code,
        categoryCode: 0,
        schoolTypeCode: 0,
        locationCode: 0,
        managementCode: 0,
        yearId: 8,
      };
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      dispatch(allFilter(filterObj));
      dispatch(mapFilter(filterObj));
      handleAPICallAccordingToFilter(filterObj);
    } else {
      filterObj.regionType = specificBWiseregionType;
      filterObj.regionCode = block_code;
      filterObj.dType = specificBWiseregionType;
      filterObj.dCode = block_code;
      const updatedFilterObj = {
        regionType: specificBWiseregionType,
        regionCode: block_code,
        dType: specificBWiseregionType,
        dCode: block_code,
        categoryCode: 0,
        schoolTypeCode: 0,
        locationCode: 0,
        managementCode: 0,
        yearId: 8,
      };
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      dispatch(allFilter(filterObj));
      dispatch(mapFilter(filterObj));
      handleAPICallAccordingToFilter(filterObj);
    }
    dispatch(updateFilterBlock(blockDataClone.data));
    setSelectedBlock(block_name);
    setSelectedBlockClone(block);
    window.localStorage.setItem("block", block_name);
    dispatch(handleCurrentIndex(0));

    hideOpendFilterBox();
  };

  /*----------Call API According to Filter-----------*/
  const handleAPICallAccordingToFilter = (obj) => {
    if (location.pathname !== "/") {
      dispatch(fetchArchiveServicesSchoolData(obj));
      // dispatch(fetchArchiveServicesPtR(obj));
      // dispatch(fetchArchiveServicesTeacherDataSocialCatGender(obj));
    } else {
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
  };


  const handleAPICallAccordingToFilterMap = (obj) => {
    // dispatch(mapFilter(obj))
    dispatch(fetchMaptatsData(obj));
    dispatch(fetchMaptatsOtherData(obj));
  };
  /*-------------------end here----------------------*/

  /*------------Dropdown List----------------*/

  const districtDropdownOptions = () => {
    let extra_col;
    if (districtData.data && districtData.data.data) {
      extra_col = JSON.parse(JSON.stringify(districtData?.data?.data));
    } else {
      extra_col = [];
    }
    if (selectedDistrictclone !== district) {
      extra_col.unshift({
        udiseDistrictCode: distBlockWiseData.districtUdiseCode,
        udiseDistrictName: "District Wise",
      });
    }
    if (
      (location.pathname === "/school-reports") &&
      headerData.activeTab === "graph"
    ) {
      if (selectedDistrictclone !== district) {
        extra_col.shift({
          udiseDistrictCode: distBlockWiseData.districtUdiseCode,
          udiseDistrictName: "District Wise",
        });
      }
    }
    if (location.pathname === "/") {
      if (selectedDistrictclone !== district) {
        extra_col.shift({
          udiseDistrictCode: distBlockWiseData.districtUdiseCode,
          udiseDistrictName: "District Wise",
        });
      }
    }
    return extra_col;
  };
  const blockDropdownOptions = () => {

    let extra_col;
    if (blockData.data && blockData.data.data) {
      extra_col = JSON.parse(JSON.stringify(blockData.data.data));
    } else {
      extra_col = [];
    }
    if (selectedBlockClone === block) {
      extra_col.unshift({
        udiseBlockCode: distBlockWiseData.blockUdiseCode,
        udiseBlockName: "Block Wise",
      });
    }
    // hide Block Wise option from filter dropdown
    if (
      (location.pathname === "/school-reports") &&
      headerData.activeTab === "graph"
    ) {
      if (selectedBlockClone === block) {
        extra_col.shift({
          udiseBlockCode: distBlockWiseData.blockUdiseCode,
          udiseBlockName: "Block Wise",
        });
      }
    }
    if (location.pathname === "/") {
      if (selectedBlockClone !== block) {
        extra_col.shift({
          udiseBlockCode: distBlockWiseData.blockUdiseCode,
          udiseBlockName: "Block Wise",
        });
      }
    }
    return extra_col;
  };
  /*-------------End Here----------------*/
  const hideOpendFilterBox = () => {
    const boxes = document.querySelectorAll(".dropdown-menu");
    boxes.forEach((box) => {
      box.classList.remove("show");
    });
  };
  // const [show, setShow] = useState(false);

  const stateDropdownOptions = () => {
    let extra_col = [];

    // Extract states and add latitude/longitude
    if (stateData?.data && stateData?.data?.data) {
      extra_col = JSON.parse(JSON.stringify(stateData?.data?.data));

      if (jsonstateData && jsonstateData.length > 0) {
        extra_col.forEach((state) => {
          const matchedState = jsonstateData.find(
            (data) => data?.udiseStateCode === state?.udiseStateCode
          );
          if (matchedState) {
            state.latitude = matchedState?.latitude;
            state.longitude = matchedState?.longitude;
          }
        });
      }
    }

    extra_col.unshift({
      udiseStateCode: allSWiseregionType.toString(),
      udiseStateName: stateWiseName,
    });

    if (location.pathname === "/") {
      extra_col.shift({
        udiseStateCode: allSWiseregionType.toString(),
        udiseStateName: stateWiseName,
      });
    }
    extra_col.unshift({
      udiseStateCode: nWiseregionType.toString(),
      udiseStateName: nationalWiseName,
    });
    return extra_col;
  };

  const handleResetDash = () => {
    sessionStorage.setItem("handle", "");
    //   const elements = document.querySelectorAll(".impact-box-content.active");
    //   elements.forEach((element) => {
    //     element.classList.remove("active");
    //   });
    //  //  document.getElementById("bmap").innerHTML = "";
    //   const bmapElement = document.getElementById("bmap");
    //   if (bmapElement) {
    //     bmapElement.innerHTML = "";
    //   }
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
    setSelectedYear("2021-22");
    setSelectedBlock(block);
    // setIsStateSelected(false);
    window.localStorage.setItem("map_district_name", "District");
    window.localStorage.setItem("map_state_name", "All India/National");
    handleAPICallAccordingToFilterMap(modifiedFilterObjForReset)
    // dispatch(fetchDashboardData(modifiedFilterObj));
    handleAPICallAccordingToFilter(modifiedFilterObjResetDashboard);
    if (mapStateValue !== "All India/National") {
      dispatch(updateMapLoaded(false));
      dispatch(handleShowDistrict(false));
    }
  };

  const handleReset3016 = () => {
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
    window.localStorage.setItem("state_wise", "All India/National");
    window.localStorage.setItem("state", "All India/National");
    window.localStorage.setItem("map_state_name", "All India/National");
    window.localStorage.setItem("map_district_name", "District");
    window.localStorage.setItem("district", "District");
    window.localStorage.setItem("block", "Block");
    setSelectedYear("2021-22");
    setSelectedBlock(block);
    setIsStateSelected(false);

    dispatch(handleRegionName("States"));
    setUpdateYearId(filterObj?.yearId);
    // dispatch(allFilter(modifyobject));
    if (
      (headerSlice.activeTab === "graph" || paramValue === "graph") &&
      location.pathname === "/school-reports"
    ) {
      window.localStorage.setItem("state_wise", "State Wise");
      window.localStorage.setItem("state", "State Wise");
      window.localStorage.setItem("map_state_name", "State Wise");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      handleAPICallAccordingToFilter(intialStateWiseFilterSchData);
    }
    if (
      (headerSlice.activeTab === "table" || paramValue === "table") &&
      location.pathname === "/school-reports"
    ) {
      const modifyobject = {
        categoryCode: 0,
        locationCode: 0,
        managementCode: 0,
        regionCode: 99,
        regionType: 10,
        dType: 10, //21statewise //10 for all india change 21 to 10
        dCode: 99, // 11statewise //99 for all india change 11 to 99
        schoolTypeCode: 0,
        yearId: filterObj.yearId,
      };
      handleAPICallAccordingToFilter(modifyobject);
    }
    dispatch(handleCurrentIndex(0));
  };

  useEffect(() => {
    setSelectedState(selectedState);
  }, [selectedState]);
  useEffect(() => {
    if (mapStateValue === "All India/National" && selectedYear === "2021-22") {
      setIsDashbtnDisabled(true);
    } else {
      setIsDashbtnDisabled(false);
    }
  }, [mapStateValue, selectedYear]);
  useEffect(() => {
    if (mapStateValue === "All India/National" && selectedYear === "2021-22") {
      setIs3016btnDisabled(true);
    } else {
      setIs3016btnDisabled(false);
    }
    if (
      headerSlice.activeTab === "table" &&
      location.pathname === "/school-reports"
    ) {
      if (
        mapStateValue === "All India/National" &&
        selectedYear === "2021-22"
      ) {
        setIs3016btnDisabled(true);
      } else {
        setIs3016btnDisabled(false);
      }
    }
    if (
      headerSlice.activeTab === "graph" &&
      location.pathname === "/school-reports"
    ) {
      if (mapStateValue === "State Wise" && selectedYear === "2021-22") {
        setIs3016btnDisabled(true);
      } else {
        setIs3016btnDisabled(false);
      }
    }
  }, [mapStateValue, selectedYear, headerSlice.activeTab, location.pathname]);

  return (
    <>
      <div
        className="Side_filter"
        onClick={() => dispatch(handleShowFilter(!show))}
      >
        <div className="open-btn">
          {!show ? (
            <span className="material-icons-round">sort</span>
          ) : (
            <span className="material-icons-round">expand_more</span>
          )}
        </div>
      </div>
      <div
        className={`custmize-filter-column ${show ? "show" : ""}`}
        id="customize_filter"
      >
        <div className="search-f-box">
          <div className="heading-sm main-title d-flex align-items-center">
            <span className="material-icons-round text-blue me-3">sort</span>{" "}
            Apply Filters
          </div>
          <div className="box-cont-cust">
            <div className="search-box-div mb-3">
              <span className="select-lable-title">Select Year</span>
              <Select
                mode="single"
                showSearch={true}
                id="year-id"
                placeholder={selectedYear}
                value={mapYearValue}
                onChange={handleSchoolFilterYear}
                style={{
                  width: "100%",
                }}
                options={yearData?.data?.data.map((item) => ({
                  value: item.yearId + "@" + item.yearDesc,
                  label: item.yearDesc,
                }))}
              />
            </div>
            <div className="search-box-div mb-3">
              <span className="select-lable-title">Select State</span>
              <Select
                mode="single"
                showSearch={true}
                placeholder={selectedState}
                value={mapStateValue}
                onChange={handleSchoolFilterState}
                id="school_state"
                name="map_state_name"
                style={{ width: "100%" }}
                options={stateDropdownOptions().map((item) => ({
                  value: `${item.udiseStateCode}@${item.udiseStateName}@${item.longitude}@${item.latitude}`,
                  label: item.udiseStateName,
                }))}
              />
            </div>

            <div className="search-box-div mb-3">
              <span className="select-lable-title">Select District</span>
              <Select
                mode="single"
                showSearch={true}
                placeholder={selectedDistrict}
                value={mapDisValue}
                onChange={handleSchoolFilterDistrict}
                name="map_district_name"
                style={{
                  width: "100%",
                }}
                options={districtDropdownOptions().map((item) => ({
                  value: item.udiseDistrictCode + "@" + item.udiseDistrictName,
                  label: item.udiseDistrictName,
                }))}
                disabled={!isStateSelected && isDashbtnDisabled}
              />
            </div>

            {location.pathname !== "/" && (
              <div className="search-box-div">
                <span className="select-lable-title">Select Block</span>
                <Select
                  mode="single"
                  showSearch={true}
                  placeholder={selectedBlock}
                  value={mapBlockValue}
                  onChange={handleSchoolFilterBlock}
                  name="block"
                  style={{
                    width: "100%",
                  }}
                  options={blockDropdownOptions().map((item) => ({
                    value: item.udiseBlockCode + "@" + item.udiseBlockName,
                    label: item.udiseBlockName,
                  }))}
                />
              </div>
            )}
            <div className="text-center mt-2">
              {location.pathname === "/" ? (
                <button
                  className="btn btn-primary btn-reset-filter"
                  disabled={isDashbtnDisabled}
                  onClick={handleResetDash}
                >
                  Reset
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-reset-filter"
                  disabled={is3016btnDisabled}
                  onClick={handleReset3016}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
