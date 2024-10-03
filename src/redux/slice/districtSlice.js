import { createSlice } from "@reduxjs/toolkit";
import { fetchDistrictDataByStateCode,removeAllDistrict,updateFilterDistrict } from "../thunks/districtThunk";

const distrcitSlice = createSlice({
  name: "district",
  initialState: {
    data:{
      data:[],
    statusCode:0,
    message:"",
    success:false
    },
    dataClone:[],
    isLoading:false,
    isError:false,
    error:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistrictDataByStateCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDistrictDataByStateCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        state.dataClone = action.payload.data===""?[]:action.payload;
      })
      .addCase(fetchDistrictDataByStateCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.data.data = [];
      })

      /*<><><><><><><><><><><><><><><>Make District List Blank<><><><><><><><><><><><><><><><><>*/ 
      .addCase(removeAllDistrict.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.data = [];
        state.dataClone=[]
      })
      .addCase(updateFilterDistrict.fulfilled, (state, action) => {
        state.data.data = action.payload===undefined ? [] : action.payload;
        state.isLoading = false;
      });
  },
});

export default distrcitSlice.reducer;