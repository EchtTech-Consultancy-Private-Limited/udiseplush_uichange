import { createSlice } from "@reduxjs/toolkit";

const DistBlockWiseSlice = createSlice({
    name: 'dist-block/wise',
    initialState:{
        districtUdiseCode:0,
        blockUdiseCode:0,
        districtUdiceName:"District Wise"
    },
    reducers: {
      updateUdiseDistrictCode(state,action) {
        state.districtUdiseCode=action.payload;
      },
      updateUdiseBlockCode(state,action) {
        state.blockUdiseCode=action.payload;
      },
      updateUdiseDistrictName(state,action) {
        state.districtUdiceName=action.payload;
      }
    },
  })
  
  export const { updateUdiseDistrictCode, updateUdiseBlockCode,updateUdiseDistrictName} = DistBlockWiseSlice.actions
  export default DistBlockWiseSlice.reducer