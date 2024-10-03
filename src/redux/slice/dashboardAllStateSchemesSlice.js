import { createSlice } from "@reduxjs/toolkit";
import { fetchAllStateSchemesData } from "../thunks/dashboardThunk";

const dashboardAllStateSchemesSlice = createSlice({
    name: 'Schemes Data',
    initialState: {
        data: {
          data:[],
          message:"",
          success:false
        },
        
        isLoading:false,
        isError:false
      },


  reducers: {},
  extraReducers: (builder) => {
    
    builder
      .addCase(fetchAllStateSchemesData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllStateSchemesData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        
      })
      .addCase(fetchAllStateSchemesData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
})

export default dashboardAllStateSchemesSlice.reducer