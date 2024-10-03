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
  initialFilterPtRData,
  selectedDYear2007,
  initialFilterPtRDataStateWise,
  
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
import { allFilter } from "../../../redux/slice/schoolFilter2007Slice";
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
import { useLocation } from "react-router-dom";

import { fetchArchiveServicesPtR } from "../../../redux/thunks/archiveServicesThunk";
import {  fetchAllStateSchemesData } from "../../../redux/thunks/dashboardThunk";
import { handleCurrentIndex, handleRegionName, handleShowDistrict, handleViewDataByShow, handleShowFilter, handleSelectYear } from "../../../redux/slice/headerSlice";
import mapJsonData from "../../../mapData/mapDatalatLong.json";
import {updateMapLoaded } from "../../../redux/slice/mapSlice";
import { setReserveUpdatedFilter } from "../../../redux/slice/headerSlice";

export default function FilterDropdown4000() {
  const dispatch = useDispatch();
  const location = useLocation();

  const stateData = useSelector((state) => state.state);
  const stateDataClone = useSelector((state) => state.state.dataClone);
  const yearData = useSelector((state) => state.year);
  const schoolFilter = useSelector((state) => state.schoolFilterreport);
  const districtData = useSelector((state) => state.distrct);
  const districtDataClone = useSelector((state) => state.distrct.dataClone);
  const blockData = useSelector((state) => state.block);
  const blockDataClone = useSelector((state) => state.block.dataClone);
  const headerData = useSelector((state) => state.header)
  const headerSlice = useSelector((state) => state.header);
  const [isStateSelected, setIsStateSelected] = useState(false);
  const [selectedState, setSelectedState] = useState(nationalWiseName);
  const [selectedStateW, setSelectedStateW] = useState("State Wise");
  const [selectedDistrict, setSelectedDistrict] = useState(district);
  const [selectedDistrictclone, setSelectedDistrictClone] = useState(district);
  // const [selectedYear, setSelectedYear] = useState(selectedDYear2007);
  const [selectedYear, setSelectedYear] = useState(selectedDYear2007);
  // const =useSelector((state)=>state.header.selectYear)
  const [selectedBlock, setSelectedBlock] = useState(block);
  const [selectedBlockClone, setSelectedBlockClone] = useState(block);
  const [isDashbtnDisabled, setIsDashbtnDisabled] = useState(true)
  const [is3016btnDisabled, setIs3016btnDisabled] = useState(true)
  const show = useSelector((state) => state.header.show)
  const distBlockWiseData = useSelector((state) => state.distBlockWise);
  let filterObj = structuredClone(schoolFilter);
  const [updateYearId, setUpdateYearId] = useState(filterObj.yearId)
  const groupKeys = localStorage.getItem("groupKeys")
  const parsedFilterObj = JSON.parse(groupKeys);
  const reserveUpdatedFilter = useSelector(state => state.header.reserveUpdatedFilter);
  const schManagementBroad = parsedFilterObj.schManagementBroad
  const schCategoryBroad = parsedFilterObj.schCategoryBroad
  const schLocationDesc = parsedFilterObj.schLocationDesc
  //window.local=Storage.setItem("state", selectedState);


  useEffect(() => {
    window.localStorage.setItem("state_wise", selectedStateW);
    window.localStorage.setItem("district", selectedDistrict);
    window.localStorage.setItem("block", selectedBlock);
    window.localStorage.setItem("year", selectedYear);
  }, [selectedState, blockData, stateData, districtData,selectedYear])
  const mapStateValue = localStorage.getItem("map_state_name");
  const mapDisValue = window.localStorage.getItem("map_district_name");
  const mapBlockValue = window.localStorage.getItem("block");
  const [jsonstateData, setJsonStateData] = useState([]);
  useEffect(() => {
    filterObj = structuredClone(schoolFilter);
  }, [schoolFilter])
  useEffect(() => {
    setJsonStateData(mapJsonData.stateData);
    const queryString = window.location.href;
    const urlParams = new URLSearchParams(queryString.replace('#/', ""));
    const paramValue = urlParams.get('type');
    if (paramValue === "table") {
      dispatch(handleViewDataByShow(false));
    } 
    else if (paramValue === "graph") {
      dispatch(handleViewDataByShow(false));
    } 
    
    else if (location.pathname === "/") {
      dispatch(handleViewDataByShow(true));
    }
    else if (location.pathname !== "/") {
      dispatch(handleViewDataByShow(false));
    }
    else {
      dispatch(handleViewDataByShow(false));
    }

  }, [mapJsonData.stateData]);
 

  useEffect(() => {
    dispatch(fetchStateData(filterObj.yearId));
    dispatch(fetchYearData());
    const children = document.getElementsByClassName("position-static");
    let filter_drodown = document.getElementsByClassName("filter_drodown")[0];
    if (children.length == 2) {
      filter_drodown?.classList?.add("small-filter-box");
    } else {
      filter_drodown?.classList?.remove("small-filter-box");
    }


    if (location.pathname == "/teacher-reports-2007") {
      dispatch(allFilter(initialFilterPtRData));
    }
    else {
      dispatch(allFilter(initialFilterPtRData));
    }
    const handleEvent = () => {
      // setShow(false);
      dispatch(handleShowFilter(false))
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


  function updateFilterObj(filter, schManagementBroad, schCategoryBroad, schLocationDesc) {
    if (schManagementBroad && !schCategoryBroad) {
      filter.managementCode = 0;
    }

    if (schManagementBroad && schLocationDesc) {
      filter.managementCode = 0;
      filter.locationCode = 0;
    }

    if (schCategoryBroad && schLocationDesc) {
      filter.locationCode = 0;
    }

    if (schCategoryBroad && !schLocationDesc) {
      delete filter.managementCode;
      delete filter.locationCode;
    }
  }
  const handleSchoolFilterYear = (e) => {
    const splittedArr = e.split("@");
    const year = parseInt(splittedArr[0]);
    const year_report = splittedArr[1];
    setSelectedYear(year_report);
    filterObj.yearId = year;
    //dispatch(allFilter(filterObj));
    setUpdateYearId(filterObj?.yearId);

    let reserveUpdatedFilters = {
      ...reserveUpdatedFilter,
      yearId: year,
    };
    dispatch(setReserveUpdatedFilter(reserveUpdatedFilters));
    if (mapStateValue === nationalWiseName || mapStateValue === stateWiseName) {
      updateFilterObj(filterObj, schManagementBroad, schCategoryBroad, schLocationDesc)
      handleAPICallAccordingToFilter(filterObj);
     
    }
    else {
      updateFilterObj(reserveUpdatedFilters, schManagementBroad, schCategoryBroad, schLocationDesc);
      handleAPICallAccordingToFilter(reserveUpdatedFilters);
    }
    //handleAPICallAccordingToFilter(filterObj);
    dispatch(handleSelectYear(year_report))
    // window.localStorage.setItem("year", year_report);
    hideOpendFilterBox();
  };
  const handleSchoolFilterState = (e) => {
    const splittedArr = e.split("@");
    const state_code = splittedArr[0];
    const state_name = splittedArr[1];
    const lat = splittedArr[2];
    const long = splittedArr[3];
    filterObj.yearId = updateYearId

    setIsStateSelected(true);
    setSelectedState(state_name);
    setSelectedStateW(state_name);
    setSelectedDistrict(district);
    setSelectedBlock(block);
    setSelectedBlockClone(block);

    //
    dispatch(updateUdiseDistrictCode(state_code));
    dispatch(handleRegionName("States"));
    //
    /*--------------------Filter by National----------------------*/
    if (state_name === nationalWiseName) {
      sessionStorage.setItem('handle', '');
      filterObj.regionType = nWiseregionType;
      filterObj.regionCode = nWiseregionCode;
      filterObj.dType = 10;
      filterObj.dCode = 99;
      const updatedFilterObj = {
        regionType: nWiseregionType,
        regionCode: nWiseregionCode,
        dashboardRegionType: 10,
        dashboardRegionCode: "09",
        dType: 10,
        dCode: 99,
        ...(schCategoryBroad && { categoryCode: 0 }),
        ...(schManagementBroad && { managementCode: 0 }),
        ...(schLocationDesc && { locationCode: 0 }),
        yearId: 8
      };
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      updateFilterObj(filterObj, schManagementBroad, schCategoryBroad, schLocationDesc);

      dispatch(allFilter(filterObj));
      handleAPICallAccordingToFilter(filterObj);

      const elements = document.querySelectorAll('.impact-box-content.active');
      elements.forEach(element => {
        element.classList.remove('active');
      });

      dispatch(handleShowDistrict(false));
      dispatch(updateMapLoaded(false));
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(district);


    }
    else if (state_name === stateWiseName) {
      const newDataObject = {
        yearId: filterObj.yearId,
        regionType: 10,
        regionCode: "99",
        dType: 10,
        dCode: 99,
        dashboardRegionType: 11,
        dashboardRegionCode: state_code,
      };

      /*--------------------Filter by State Wise----------------------*/

      filterObj.regionType = allSWiseregionType;
      filterObj.regionCode = allSWiseregionCode;

      filterObj.dType = allSWiseregionType;
      filterObj.dCode = allSWiseregionCode;
      const updatedFilterObj = {
        regionType: allSWiseregionType,
        regionCode: allSWiseregionCode,
        dType: allSWiseregionType,
        dCode: allSWiseregionCode,
        dashboardRegionType: 11,
        dashboardRegionCode: state_code,
        ...(schCategoryBroad && { categoryCode: 0 }),
        ...(schManagementBroad && { managementCode: 0 }),
        ...(schLocationDesc && { locationCode: 0 }),
        yearId: 8
      };
        
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      updateFilterObj(filterObj, schManagementBroad, schCategoryBroad, schLocationDesc);

      dispatch(allFilter(filterObj));


      handleAPICallAccordingToFilter(location.pathname === "/" ? newDataObject : filterObj);
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(district);
    } else {

      /*--------------------Filter by Particular State ----------------------*/
      /************ remove selected events *************/
      const elements = document.querySelectorAll('.impact-box-content.active');
      elements.forEach(element => {
        element.classList.remove('active');
      });
      filterObj.regionType = specificSWiseregionType;
      filterObj.regionCode = state_code;

      filterObj.dType = 11;
      filterObj.dCode = state_code;
      const updatedFilterObj = {
        regionType: specificSWiseregionType,
        regionCode: state_code,
        dType: 11,
        dCode: state_code,
        dashboardRegionType: 11,
        dashboardRegionCode: state_code,
        ...(schCategoryBroad && { categoryCode: 0 }),
        ...(schManagementBroad && { managementCode: 0 }),
        ...(schLocationDesc && { locationCode: 0 }),
        yearId: 8
      };


      updateFilterObj(filterObj, schManagementBroad, schCategoryBroad, schLocationDesc);
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      dispatch(allFilter(filterObj));
      if(headerData.activeTab==="graph"){
        headerData.isViewDataByShow && handleAPICallAccordingToFilter(filterObj);
        if (!headerData.isViewDataByShow && location.pathname !== "/") {
          const district_data = state_code + "@" + districtWiseName;
          handleSchoolFilterDistrict(district_data);
        }
      }
      else if(headerData.activeTab==="table"){
        handleAPICallAccordingToFilter(filterObj)
      }
     

      dispatch(
        fetchDistrictDataByStateCode({
          state_code: state_code,
          yearId: filterObj.yearId,
        })
      );
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(state_name);

    }

    dispatch(updateFilterState(stateDataClone.data));
    window.localStorage.setItem("state", state_name);
    window.localStorage.setItem("map_state_name", state_name);
    window.localStorage.setItem("map_district_name", "District");
    dispatch(handleCurrentIndex(0));
    hideOpendFilterBox();
  };


  const handleSchoolFilterDistrict = (e) => {

    const splittedArr = e.split("@");
    const district_code = splittedArr[0];
    const district_name = splittedArr[1];
    filterObj.yearId = updateYearId
    dispatch(handleRegionName("Districts"));
    dispatch(updateUdiseBlockCode(district_code));
    if (district_name === districtWiseName) {

      filterObj.regionType = allDWiseregionType;
      filterObj.regionCode = district_code;

      filterObj.dType = allDWiseregionType;
      filterObj.dCode = district_code;

      const updatedFilterObj = {
        regionType: allDWiseregionType,
        regionCode: district_code,
        dashboardRegionType: 22,
        dashboardRegionCode: "09",
        dType: allDWiseregionType,
        dCode: district_code,
        ...(schCategoryBroad && { categoryCode: 0 }),
        ...(schManagementBroad && { managementCode: 0 }),
        ...(schLocationDesc && { locationCode: 0 }),
        yearId: 8
      };

     
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      updateFilterObj(filterObj, schManagementBroad, schCategoryBroad, schLocationDesc);
      dispatch(allFilter(filterObj));
      handleAPICallAccordingToFilter(filterObj);
      dispatch(removeAllBlock());
      setSelectedBlockClone(block);
    } else {
      filterObj.regionType = specificDWiseregionType;
      filterObj.regionCode = district_code;

      filterObj.dType = specificDWiseregionType;
      filterObj.dCode = district_code;
      const updatedFilterObj = {
        regionType: specificDWiseregionType,
        regionCode: district_code,
        dashboardRegionType: 12,
        dashboardRegionCode: district_code,
        dType: specificDWiseregionType,
        dCode: district_code,
        valueType: location.pathname !== "/" ? 1 : 2,
        ...(schCategoryBroad && { categoryCode: 0 }),
        ...(schManagementBroad && { managementCode: 0 }),
        ...(schLocationDesc && { locationCode: 0 }),
        yearId: 8
      };
      updateFilterObj(filterObj, schManagementBroad, schCategoryBroad, schLocationDesc);
      dispatch(
        fetchBlockByDistrictCode({
          district_code: district_code,
          yearId: filterObj.yearId,
        })
      );
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      dispatch(allFilter(filterObj));
      setSelectedBlockClone(district_name);
if(headerData.activeTab==="graph"){
  headerData.isViewDataByShow && handleAPICallAccordingToFilter(filterObj);
  /*this function will be called when chart tab selected*/
  if (!headerData.isViewDataByShow) {
    const block_data = district_code + "@" + blockWiseName;
    handleSchoolFilterBlock(block_data);
  }
}
else if(headerData.activeTab==="table"){
  handleAPICallAccordingToFilter(filterObj);
}
  

    }
    dispatch(updateFilterDistrict(districtDataClone.data));
    dispatch(removeAllBlock());
    setSelectedDistrict(district_name);
    setSelectedBlock(block);
    window.localStorage.setItem("map_district_name", district_name);
    window.localStorage.setItem("district", district_name);
    dispatch(handleCurrentIndex(0));

    hideOpendFilterBox();
  };

  const handleSchoolFilterBlock = (e) => {
    const splittedArr = e.split("@");
    const block_code = splittedArr[0];
    const block_name = splittedArr[1];
    filterObj.yearId = updateYearId;
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
        ...(schCategoryBroad && { categoryCode: 0 }),
        ...(schManagementBroad && { managementCode: 0 }),
        ...(schLocationDesc && { locationCode: 0 }),
        yearId: 8
      };
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      updateFilterObj(filterObj, schManagementBroad, schCategoryBroad, schLocationDesc);
      dispatch(allFilter(filterObj));
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
        ...(schCategoryBroad && { categoryCode: 0 }),
        ...(schManagementBroad && { managementCode: 0 }),
        ...(schLocationDesc && { locationCode: 0 }),
        yearId: 8
      };
      dispatch(setReserveUpdatedFilter(updatedFilterObj));
      updateFilterObj(filterObj, schManagementBroad, schCategoryBroad, schLocationDesc);
      dispatch(allFilter(filterObj));
      handleAPICallAccordingToFilter(filterObj);
    }
    dispatch(updateFilterBlock(blockDataClone.data));
    setSelectedBlock(block_name);
    window.localStorage.setItem("block", block_name);
    dispatch(handleCurrentIndex(0));

    hideOpendFilterBox();
  };

  /*----------Call API According to Filter-----------*/
  const handleAPICallAccordingToFilter = (obj) => {
    if (location.pathname !== "/") {
      dispatch(fetchArchiveServicesPtR(obj))
    }
   
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
    return extra_col;
  };
  const blockDropdownOptions = () => {
    let extra_col;
    if (blockData.data && blockData.data.data) {
      extra_col = JSON.parse(JSON.stringify(blockData.data.data));
    } else {
      extra_col = [];
    }
    if (selectedBlockClone !== block) {
      extra_col.unshift({
        udiseBlockCode: distBlockWiseData.blockUdiseCode,
        udiseBlockName: "Block Wise",
      });
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

    if (stateData?.data && stateData?.data?.data) {
      extra_col = JSON.parse(JSON.stringify(stateData?.data?.data));

      if (jsonstateData && jsonstateData.length > 0) {
        extra_col?.forEach((state) => {
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

    extra_col.unshift({
      udiseStateCode: nWiseregionType.toString(),
      udiseStateName: nationalWiseName,
    });

    return extra_col;
  };
  const handleResetDash = () => {
    sessionStorage.setItem('handle', '');
    const elements = document.querySelectorAll('.impact-box-content.active');
    elements.forEach(element => {
      element.classList.remove('active');
    });
    // document.getElementById("bmap").innerHTML = "";
    const bmapElement = document.getElementById("bmap");
    if (bmapElement) {
      bmapElement.innerHTML = "";
    }
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
    dispatch(handleSelectYear("2020-21"));
    setSelectedBlock(block);
    setIsStateSelected(false);
    window.localStorage.setItem("map_district_name", "District");
    window.localStorage.setItem("map_state_name", "All India/National");


    const modifiedFilterObj = {
      regionCode: "11",
      regionType: 21,
      dType: 10,  //21statewise //10 for all india 
      dCode: 99, // 11statewise //99 for all india
      yearId: filterObj.yearId,

    };

    // dispatch(fetchDashboardData(modifiedFilterObj));
    handleAPICallAccordingToFilter(modifiedFilterObj);
    if (mapStateValue !== "All India/National") {
      dispatch(updateMapLoaded(false));
      dispatch(handleShowDistrict(false));
    }
    const modifiedFilterObjs = {
      regionCode: 99,
      dCode: 99,
      regionType: 21,
      yearId: 9
    };
    dispatch(fetchAllStateSchemesData(modifiedFilterObjs))

  };

  const handleReset3016 = () => {
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
    setSelectedYear("2021-22")
    window.localStorage.setItem("state_wise", "All India/National");
    window.localStorage.setItem("state", "All India/National");
    window.localStorage.setItem("map_state_name", "All India/National");
    window.localStorage.setItem("map_district_name", "District");
    window.localStorage.setItem("district", "District");
    window.localStorage.setItem("state_wise", "All India/National");
    window.localStorage.setItem("block", "Block");
    dispatch(handleSelectYear("2022-23"));
    setSelectedBlock(block);
    setIsStateSelected(false);

    let modifyobject = {
      regionType: 10,  //21statewise //10 for all india 
      regionCode: 99, // 11statewise //99 for all india
      dType: 10,  //21statewise //10 for all india 
      dCode: 99, // 11statewise //99 for all india
      yearId: filterObj.yearId
    };
    modifyobject.managementCode = schManagementBroad ? 0 : undefined;
    if (schCategoryBroad) {
      modifyobject = {
        ...modifyobject,
      };

      if (schCategoryBroad && schLocationDesc) {
        modifyobject.locationCode = 0;
      }
    }
    if (schManagementBroad) {
      modifyobject = {
        ...modifyobject,

      };
      if (schManagementBroad && schLocationDesc===false) {
        modifyobject.managementCode = 0;
      
      }
      if (schManagementBroad && schLocationDesc) {
        modifyobject.managementCode = 0;
        modifyobject.locationCode = 0;
      }
    }
  
    setUpdateYearId(filterObj?.yearId)
    dispatch(allFilter(modifyobject));
   
    if(headerData.activeTab === "graph" && location.pathname === "/teacher-reports-2007"){
      window.localStorage.setItem("state_wise", "State Wise");
      window.localStorage.setItem("state", "State Wise");
      window.localStorage.setItem("map_state_name", "State Wise");
      handleAPICallAccordingToFilter(initialFilterPtRDataStateWise);
    }
    else if(headerData.activeTab === "table"){
      handleAPICallAccordingToFilter(modifyobject);
    }
    dispatch(handleCurrentIndex(0));
  }

  useEffect(() => {
    setSelectedState(selectedState);
  }, [selectedState]);

  useEffect(() => {


    if(headerSlice.activeTab === "table" && location.pathname === "/teacher-reports-2007"){
      if (mapStateValue === "All India/National" && selectedYear === "2021-22") {
        setIs3016btnDisabled(true);
      } else {
        setIs3016btnDisabled(false);
      }
    }
    if(headerSlice.activeTab === "graph"  && location.pathname === "/teacher-reports-2007" ){
      if (mapStateValue === "State Wise" && selectedYear === "2021-22") {
        setIs3016btnDisabled(true);
      } else {
        setIs3016btnDisabled(false);
      }
    }
  }, [mapStateValue, selectedYear, headerSlice.activeTab, location.pathname]);

  return (
    <>
      <div className="Side_filter" onClick={() => dispatch(handleShowFilter(!show))}>
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
                value={selectedYear}
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
                placeholder={selectedState || "Select a state"}
                value={mapStateValue}
                onChange={handleSchoolFilterState}
                id="school_state"
                name="map_state_name"
                style={{
                  width: "100%",
                }}
                options={stateDropdownOptions().map((item) => ({
                  value:
                    item.udiseStateCode +
                    "@" +
                    item.udiseStateName +
                    "@" +
                    item.longitude +
                    "@" +
                    item.latitude,
                  label: item.udiseStateName,
                }))}
              />
            </div>
            <div className="search-box-div mb-3">
              <span className="select-lable-title">Select District</span>
              <Select
                mode="single"
                showSearch={true}
                placeholder={selectedDistrict || "Select a district"}
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
                disabled={!isStateSelected}/>
            </div>

            {location.pathname !== "/" && <div className="search-box-div">
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
            </div>}
            <div className="text-center mt-2">
              {location.pathname === "/" ? <button className="btn btn-primary btn-reset-filter" disabled={isDashbtnDisabled} onClick={handleResetDash}>Reset</button> : <button className="btn btn-primary btn-reset-filter" disabled={is3016btnDisabled} onClick={handleReset3016}>Reset</button>}
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
