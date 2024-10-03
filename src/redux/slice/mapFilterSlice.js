import { createSlice } from "@reduxjs/toolkit";

const mapFilterSlice = createSlice({
  name: 'map',
  initialState: {
    yearId: 8,
    regionType: 21,  //21statewise //10 for all india 
    regionCode: 99, // 11statewise //99 for all india
    dType: 21,  //21statewise //10 for all india 
    dCode: 99, // 11statewise //99 for all india
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    schoolTypeCode:0,
    dashboardRegionType:10, //n 
    dashboardRegionCode:"09", //100
    valueType:1
  },
 
 

  reducers: {
    changeYearFilter(state, action) {
      state.yearId = action.payload;
    },
    changeDistrictFilter(state, action) {
      state.regionCode = action.payload;
    },
    changeStateFilter(state, action) {
      state.regionType = action.payload;
    },
    mapFilter(state, action) {
      Object.assign(state, action.payload);
    }
  },
})

export const { changeYearFilter, changeDistrictFilter, changeStateFilter, mapFilter } = mapFilterSlice.actions
export default mapFilterSlice.reducer