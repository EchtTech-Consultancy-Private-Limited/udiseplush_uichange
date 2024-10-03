import { createSlice } from "@reduxjs/toolkit";

const schoolFilterSlice = createSlice({
  name: 'header/report-3016',
  initialState: {
    yearId: 8,
    regionType: 21,  //21statewise //10 for all india 
    regionCode: 99, // 11statewise //99 for all india
    dType: 10,  //21statewise //10 for all india 
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
    allFilter(state, action) {
      Object.assign(state, action.payload);
    },
 
  },
});

export const { allFilter } = schoolFilterSlice.actions;
export default schoolFilterSlice.reducer;
