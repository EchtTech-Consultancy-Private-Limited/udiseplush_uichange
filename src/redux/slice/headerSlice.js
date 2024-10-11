import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: 'header',
  initialState: {
    headerName: "Education Dashboard",
    removeBeforeAfterClass: 'main-card-home',
    isViewDataByShow: true,
    regionName: "States",
    showDistricts: false,
    currentIndex: 0,
    show: false,
    activeTab: "table",
    selectYear: "2021-22",
    reserveUpdatedFilter: {},
    arrGroupedGraph3013Data: {
      graphData: [],
      pieGraphData: [],
      pieGraphDatas:[]
    },
 
    selectedField3013graph: {
      field: "totSchLandAvail",
      label: "Land Available"
    },
    pieGraph3013mngSchSelected:"School Management",
    selectYearId:8,
    mapLoader:true

  },
  reducers: {
    handleShowDistrict(state, action) {
      state.showDistricts = action.payload
    },
    updateHeaderName(state, action) {
      state.headerName = action.payload;
    },
    removeBeforeAfterClass(state, action) {
      state.removeBeforeAfterClass = action.payload
    },
    handleViewDataByShow(state, action) {
      state.isViewDataByShow = action.payload
    },
    handleRegionName(state, action) {
      state.regionName = action.payload
    },
    handleCurrentIndex(state, action) {
      state.currentIndex = action.payload
    },
    handleShowFilter(state, action) {
      state.show = action.payload
    },
    handleActiveTabs(state, action) {
      state.activeTab = action.payload
    },
    handleSelectYear(state, action) {
      state.selectYear = action.payload
    },


    setReserveUpdatedFilter(state, action) {
      state.reserveUpdatedFilter = {
        regionType: action.payload.regionType,
        regionCode: action.payload.regionCode,
        dType: action.payload.dType,
        dCode: action.payload.dCode,
        dashboardRegionType: action.payload.dashboardRegionType,
        dashboardRegionCode: action.payload.dashboardRegionCode,
        valueType: action.payload.valueType,
        locationCode: action.payload.locationCode,
        managementCode: action.payload.managementCode,
        categoryCode: action.payload.categoryCode,
        schoolTypeCode: action.payload.schoolTypeCode,
        yearId: action.payload.yearId
      }
    },
    setArrGroupedGraph3013Data(state, action) {
      state.arrGroupedGraph3013Data = {
        graphData: action.payload.graphData || [],
        pieGraphData: action.payload.pieGraphData || [],
        pieGraphDatas:action.payload.pieGraphDatas || []
      };
    },
    
    setpieGraph3013mngSchSelected(state, action) {
      state.pieGraph3013mngSchSelected = action.payload
    },
    setSelectedField3013graph(state, action) {
      state.selectedField3013graph = action.payload
    },
    setSelectYearId(state, action) {
      state.selectYearId = action.payload
    },
    setMapLoader(state, action){
      state.mapLoader = action.payload
    }
  },
})

export const { updateHeaderName, removeBeforeAfterClass, handleViewDataByShow, handleRegionName, handleShowDistrict, handleCurrentIndex, handleDisableBtn, handleShowFilter, handleActiveTabs, handleSelectYear, setReserveUpdatedFilter, setArrGroupedGraph3013Data, setSelectedField3013graph,setpieGraph3013mngSchSelected,setSelectYearId, setMapLoader } = headerSlice.actions
export default headerSlice.reducer