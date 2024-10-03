import { createSlice } from "@reduxjs/toolkit";
import {fetchBlockByDistrictCode,removeAllBlock,updateFilterBlock} from "../thunks/blockThunk";

const blockSlice = createSlice({
  name: "block",
  initialState: {
    data:{
      data:[]
    },
    dataClone:[],
    isLoading:false,
    isError:false,
    error:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockByDistrictCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlockByDistrictCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        state.dataClone = action.payload.data===""?[]:action.payload;
      })
      .addCase(fetchBlockByDistrictCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.data.data = [];
      })
       /*<><><><><><><><><><><><><><><>Make District List Blank<><><><><><><><><><><><><><><><><>*/ 
       .addCase(removeAllBlock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.data = [];
        state.dataClone = [];
      })
      .addCase(updateFilterBlock.fulfilled, (state, action) => {
        state.data.data = action.payload===undefined ? [] : action.payload;        state.isLoading = false;
      });
  },
});

export default blockSlice.reducer;