import { createSlice } from "@reduxjs/toolkit";

const schoolFilterSlice = createSlice({
  name: 'header/report2007',
  initialState: {
    yearId: 8,
    regionType: 10,  //21statewise //10 for all india 
    regionCode: 99, // 11statewise //99 for all india
    dType: 10,  //21statewise //10 for all india 
    dCode: 99, // 11statewise //99 for all india
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
    allFilter(state, action) {
      Object.assign(state, action.payload);
    }
  },
})

export const { changeYearFilter, changeDistrictFilter, changeStateFilter, allFilter } = schoolFilterSlice.actions
export default schoolFilterSlice.reducer