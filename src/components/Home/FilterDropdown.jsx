import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
} from "mdb-react-ui-kit";
import { district,block,nWiseregionType,nWiseregionCode,selectedDYear,allSWiseregionType,allSWiseregionCode,specificSWiseregionType,allDWiseregionType,specificDWiseregionType,allBWiseregionType,specificBWiseregionType,nationalWiseName, stateWiseName,districtWiseName,blockWiseName } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchStateData, updateFilterState } from "../../redux/thunks/stateThunk";
import { fetchDistrictDataByStateCode, removeAllDistrict, updateFilterDistrict } from "../../redux/thunks/districtThunk";
import { fetchYearData } from "../../redux/thunks/yearThunk";
import {
  allFilter,
} from "../../redux/slice/schoolFilterSlice";

import { hideShowColumn } from "../../redux/slice/dataGridAPISlice";
import { updateUdiseBlockCode,updateUdiseDistrictCode } from "../../redux/slice/DistBlockWiseSlice";
import {
  filterItemsStatePerPage,
  filterItemsYearPerPage,
} from "../../constants/constants";
import { fetchBlockByDistrictCode, removeAllBlock, updateFilterBlock } from "../../redux/thunks/blockThunk";
import { useLocation } from "react-router-dom";


export default function FilterDropdown() {
  const [itemsPerPage] = useState(filterItemsStatePerPage);
  const [yearItemsPerPage] = useState(filterItemsYearPerPage);
  const dispatch = useDispatch();
  const location = useLocation();
  const stateData = useSelector((state) => state.state);
  const stateDataClone = useSelector((state) => state.state.dataClone);
  const yearData = useSelector((state) => state.year);
  const schoolFilter = useSelector((state) => state.schoolFilter);
  const districtData = useSelector((state) => state.distrct);
  const districtDataClone = useSelector((state) => state.distrct.dataClone);
  const blockData = useSelector((state) => state.block);
  const blockDataClone = useSelector((state) => state.block.dataClone);
  const [selectedState, setSelectedState] = useState(nationalWiseName);
  const [selectedStateW, setSelectedStateW] = useState("State Wise");
  const [selectedDistrict, setSelectedDistrict] = useState(district);
  const [selectedDistrictclone, setSelectedDistrictClone] = useState(district);
  const [selectedYear, setSelectedYear] = useState(selectedDYear);
  const [selectedBlock, setSelectedBlock] = useState(block);
  const [selectedBlockClone, setSelectedBlockClone] = useState(block);
  const distBlockWiseData = useSelector((state)=>state.distBlockWise)
  const filterObj = structuredClone(schoolFilter);
  const stateSearch = stateDataClone;
  const districtSearch = districtDataClone;
  const blockSearch = blockDataClone;

  window.localStorage.setItem("state", selectedState);
 // window.localStorage.setItem("state_wise", selectedStateW);
  window.localStorage.setItem("district", selectedDistrict);
  window.localStorage.setItem("block", selectedBlock);
  window.localStorage.setItem("year", selectedYear);

  useEffect(() => {
    dispatch(fetchStateData(filterObj.yearId));
    dispatch(fetchYearData());
    const children = document.getElementsByClassName("position-static");
    let filter_drodown = document.getElementsByClassName('filter_drodown')[0];
    if (children.length == 2) {
      filter_drodown?.classList?.add('small-filter-box');
    } else {
      filter_drodown?.classList?.remove('small-filter-box');
    }
  }, []);

  const handleSchoolFilterYear = (year, year_report) => {
    setSelectedYear(year_report);
    filterObj.yearId = year;
    dispatch(allFilter(filterObj));
    window.localStorage.setItem("year", year_report);
    hideOpendFilterBox();
  };
  const handleSchoolFilterState = (state_code, state_name) => {
    setSelectedState(state_name);
    setSelectedStateW(state_name);
    setSelectedDistrict(district);
    
    setSelectedBlock(block);
    
    setSelectedBlockClone(block);

    //
    dispatch(updateUdiseDistrictCode(state_code));
  //

    if (state_name === nationalWiseName) {

      filterObj.regionType = nWiseregionType;
      filterObj.regionCode = nWiseregionCode;
      filterObj.dashboardRegionType = 10;
      filterObj.dashboardRegionCode = "09";
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(false));
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(district);
    } else if (state_name === stateWiseName) {

      // filterObj.regionType = "sw";
      filterObj.regionType = allSWiseregionType;
      filterObj.regionCode = allSWiseregionCode;
      filterObj.dashboardRegionType = "s";
      filterObj.dashboardRegionCode = state_code;

      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(true));
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(district);
    } else {
      filterObj.regionType = specificSWiseregionType;
      filterObj.regionCode = state_code;

    
        filterObj.dashboardRegionType = "s";
        filterObj.dashboardRegionCode = state_code;
        dispatch(allFilter(filterObj));
    
    
      dispatch(hideShowColumn(false));
      if(location.pathname!=="/"){
      dispatch(fetchDistrictDataByStateCode({ state_code: state_code, yearId: filterObj.yearId }));
      }
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(state_name);
    }


     dispatch(updateFilterState(stateDataClone.data));
    window.localStorage.setItem("state", state_name);
    hideOpendFilterBox();
  };

  
  const handleSchoolFilterDistrict = (district_name, district_code) => {

    dispatch(updateUdiseBlockCode(district_code));
    if (district_name === districtWiseName) {
      filterObj.regionType = allDWiseregionType;
      filterObj.regionCode = district_code;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(true));
      dispatch(removeAllBlock());
      setSelectedBlockClone(block);
    } else {
      filterObj.regionType = specificDWiseregionType;
      filterObj.regionCode = district_code;
      dispatch(
        fetchBlockByDistrictCode({
          district_code: district_code,
          yearId: filterObj.yearId,
        })
      );
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(false));
      setSelectedBlockClone(district_name);
    }
    dispatch(updateFilterDistrict(districtDataClone.data));
    dispatch(removeAllBlock());
    setSelectedDistrict(district_name);
    setSelectedBlock(block);
    window.localStorage.setItem("district", district_name);
    hideOpendFilterBox();
  };

  
  const handleSchoolFilterBlock = (block_code, block_name) => {
    if (block_name === blockWiseName) {
      filterObj.regionType = allBWiseregionType;
      filterObj.regionCode = block_code;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(true));
    } else {
      filterObj.regionType = specificBWiseregionType;
      filterObj.regionCode = block_code;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(false));
    }
    dispatch(updateFilterBlock(blockDataClone.data));
    setSelectedBlock(block_name);
    window.localStorage.setItem("block", block_name);
    hideOpendFilterBox();
  };

  const renderStateListGroup = () => {
    const groups = [];
    //let extra_col = JSON.parse(JSON.stringify(stateData.data.data));
    let extra_col;

    if (stateData.data && stateData.data.data) {
      extra_col = JSON.parse(JSON.stringify(stateData.data.data));
    } else {

      extra_col = [];
    }

    if (location.pathname !== "/") {
      // extra_col.unshift({ udiseStateCode: "sw", udiseStateName: "State Wise" });
      extra_col.unshift({ udiseStateCode: allSWiseregionType, udiseStateName: stateWiseName });
    }
      extra_col.unshift({
        udiseStateCode: nWiseregionType,
        udiseStateName: nationalWiseName,
      });
   

    for (let i = 0; i < extra_col.length; i += itemsPerPage) {
      const groupItems = [];
      for (let j = i; j < i + itemsPerPage && j < extra_col.length; j++) {
        groupItems.push(
          <MDBListGroupItem
            key={j}
            onClick={() =>
              handleSchoolFilterState(
                extra_col[j].udiseStateCode,
                extra_col[j].udiseStateName
              )
            }
          >
            {extra_col[j].udiseStateName}
          </MDBListGroupItem>
        );
      }
      groups.push(
        <MDBCol key={i} md="6" lg="4" className="mb-3 mb-lg-0">
          <MDBListGroup>{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return groups;
  };

  
  const renderDistrictListGroup = () => {
    const groups = [];

    //let extra_col = JSON.parse(JSON.stringify(districtData?.data?.data));
    let extra_col;

    if (districtData.data && districtData.data.data) {
      extra_col = JSON.parse(JSON.stringify(districtData?.data?.data));
    } else {

      extra_col = [];
    }
    if (location.pathname !== "/" && selectedDistrictclone !== district) {
      extra_col.unshift({
        udiseDistrictCode: distBlockWiseData.districtUdiseCode,
        udiseDistrictName: "District Wise",
      });
    }
    for (let i = 0; i < extra_col.length; i += itemsPerPage) {
      const groupItems = [];
      for (let j = i; j < i + itemsPerPage && j < extra_col.length; j++) {
        groupItems.push(
          <MDBListGroupItem
            key={j}
            onClick={() =>
              handleSchoolFilterDistrict(
                extra_col[j].udiseDistrictName,
                extra_col[j].udiseDistrictCode
              )
            }
          >
            {extra_col[j].udiseDistrictName}
          </MDBListGroupItem>
        );
      }
      groups.push(
        <MDBCol key={i} md="6" lg="4" className="mb-3 mb-lg-0">
          <MDBListGroup>{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return groups;
  };

  const renderBlockListGroup = () => {
    const groups = [];
    // let extra_col;
    // if (blockData?.data?.data.length > 0) {
    //   extra_col = JSON.parse(JSON.stringify(blockData?.data?.data));
    // } else {
    //   extra_col = [];
    // }
    let extra_col;

    if (blockData.data && blockData.data.data) {
      extra_col = JSON.parse(JSON.stringify(blockData.data.data));
    } else {

      extra_col = [];
    }
    if (location.pathname !== "/" && selectedBlockClone !== block) {
      extra_col.unshift({
        udiseBlockCode: distBlockWiseData.blockUdiseCode,
        udiseBlockName: "Block Wise",
      });
    }

    for (let i = 0; i < extra_col?.length; i += itemsPerPage) {
      const groupItems = [];
      for (let j = i; j < i + itemsPerPage && j < extra_col?.length; j++) {
        groupItems.push(
          <MDBListGroupItem
            key={j}
            onClick={() =>
              handleSchoolFilterBlock(
                extra_col[j].udiseBlockCode,
                extra_col[j].udiseBlockName
              )
            }
          >
            {extra_col[j].udiseBlockName}
          </MDBListGroupItem>
        );
      }
      groups.push(
        <MDBCol key={i} md="6" lg="4" className="mb-3 mb-lg-0">
          <MDBListGroup>{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return groups;
  };
  const renderYearListGroup = () => {
    const yearGroups = [];
    for (let i = 0; i < yearData.data.data.length; i += yearItemsPerPage) {
      const groupItems = [];
      for (
        let j = i;
        j < i + yearItemsPerPage && j < yearData.data.data.length;
        j++
      ) {
        
        groupItems.push(
          <MDBListGroupItem
            key={j}
            onClick={() =>
              handleSchoolFilterYear(
                yearData.data.data[j].yearId,
                yearData.data.data[j].yearDesc
              )
            }
          >
            {yearData.data.data[j].yearDesc}
          </MDBListGroupItem>
        );
      }
      yearGroups.push(
        <MDBCol key={i} md="6" lg="4" className="mb-3 mb-lg-0">
          <MDBListGroup>{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return yearGroups;
  };
  const hideOpendFilterBox = () => {
    const boxes = document.querySelectorAll(".dropdown-menu");
    boxes.forEach((box) => {
      box.classList.remove("show");
    });
  }

  const handleSearch = (e) => {
    if (e.target.name === "state_search") {
      
      const searchStateResult = stateSearch.data.filter((item) => item.udiseStateName.toLowerCase().indexOf(e.target.value) > -1);
      dispatch(updateFilterState(searchStateResult));
    }
    if (e.target.name === "district_search") {
      const searchDistrictResult = districtSearch.data.filter((item) => item.udiseDistrictName.toLowerCase().indexOf(e.target.value) > -1);
      dispatch(updateFilterDistrict(searchDistrictResult));
    }
    if (e.target.name === "block_search") {
      const searchBlockResult = blockSearch.data.filter((item) => item.udiseBlockName.toLowerCase().indexOf(e.target.value) > -1);
      dispatch(updateFilterBlock(searchBlockResult));
    }
  }

  const handleStateDistBlockSearchState = (e) => {
    if (e === "state_search_update_state") {
      dispatch(updateFilterState(stateDataClone.data));
    } else if (e === "district_search_update_state") {
      dispatch(updateFilterDistrict(districtDataClone.data));
    } else {
      dispatch(updateFilterBlock(blockDataClone.data));
    }
  }

  return (
    <>
      <div className={`filter_drodown `}>
        <div className="filter-content">
          <h6 className="mb-0">Apply Filters</h6>
          <div className="select-box from-control">
            <MDBNavbar expand="lg" light>
              <MDBContainer fluid className="p-0">
                <MDBNavbarNav className='me-auto ps-lg-0 smallfilter'>


                <MDBNavbarItem className="position-static">
                    <MDBDropdown>
                      <MDBDropdownToggle tag="a" className="nav-link">
                        <div className="menu-sub-heading">Select Year</div>
                        {selectedYear}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu
                        className="mt-0 w-100 justify-content-center"
                        style={{
                          borderTopLeftRadius: "0",
                          borderTopRightRadius: "0",
                        }}
                      >
                        <MDBContainer className="droplist">
                          <MDBRow className="my-1">
                            {<>{renderYearListGroup()}</>}
                          </MDBRow>
                        </MDBContainer>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarItem>


                  <MDBNavbarItem className='position-static' onClick={() => handleStateDistBlockSearchState("state_search_update_state")}>
                    <MDBDropdown>
                      <MDBDropdownToggle tag="a" className="nav-link">
                        <div className="menu-sub-heading">Select State</div>
                        {selectedState}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu
                        className="mt-0 w-100 justify-content-center"
                        style={{
                          borderTopLeftRadius: "0",
                          borderTopRightRadius: "0",
                        }}
                      >
                        <MDBContainer className="droplist">
                          <MDBRow className="my-0">
                            <li className="list-group-item mb-3">
                              <div className="search-barfilter mx-2">
                                <input type="search" placeholder="Search here..." className="form-control" id="state_search" name="state_search" onChange={handleSearch} />
                              </div>
                            </li>
                            {<>{renderStateListGroup()}</>}
                          </MDBRow>
                        </MDBContainer>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarItem>

                  {/* District List */}
                  {location.pathname !== "/" && (
                    <MDBNavbarItem className="position-static" onClick={() => handleStateDistBlockSearchState("district_search_update_state")}>
                      <MDBDropdown className="disabled">
                        <MDBDropdownToggle tag="a" className="nav-link">
                          <div className="menu-sub-heading">
                            Select District
                          </div>
                          {selectedDistrict}
                        </MDBDropdownToggle>
                        <MDBDropdownMenu
                          className="mt-0 w-100 justify-content-center"
                          style={{
                            borderTopLeftRadius: "0",
                            borderTopRightRadius: "0",
                          }}
                        >
                          <MDBContainer className="droplist">
                            <MDBRow className="my-1">
                              <li className="list-group-item mb-3">
                                <div className="search-barfilter mx-2">
                                  <input type="search" placeholder="Search here..." className="form-control" id="district_search" name="district_search" onChange={handleSearch} />
                                </div>
                              </li>
                              {<>{renderDistrictListGroup()}</>}
                            </MDBRow>
                          </MDBContainer>
                        </MDBDropdownMenu>
                      </MDBDropdown>
                    </MDBNavbarItem>
                  )}

                  {/* Block List */}
                  {location.pathname !== "/" && (
                    <MDBNavbarItem className="position-static" onClick={() => handleStateDistBlockSearchState("block_search_update_state")}>
                      <MDBDropdown className="disabled">
                        <MDBDropdownToggle tag="a" className="nav-link">
                          <div className="menu-sub-heading">Select Block</div>
                          {selectedBlock}
                        </MDBDropdownToggle>
                        <MDBDropdownMenu
                          className="mt-0 w-100 justify-content-center"
                          style={{
                            borderTopLeftRadius: "0",
                            borderTopRightRadius: "0",
                          }}
                        >
                          <MDBContainer className="droplist">
                            <MDBRow className="my-1">
                              <li className="list-group-item mb-3">
                                <div className="search-barfilter mx-2">
                                  <input type="search" placeholder="Search here..." className="form-control" id="block_search" name="block_search" onChange={handleSearch} />
                                </div>
                              </li>
                              {<>{renderBlockListGroup()}</>}
                            </MDBRow>
                          </MDBContainer>
                        </MDBDropdownMenu>
                      </MDBDropdown>
                    </MDBNavbarItem>
                  )}

                 
                </MDBNavbarNav>
              </MDBContainer>
            </MDBNavbar>
          </div>
        </div>
      </div>
    </>
  );
}
