import { createSlice } from "@reduxjs/toolkit";
import { fetchArchiveServicesPtRYearsManagementWise } from "../thunks/archiveServicesThunk";

const archiveServicesYearSliceManagementWise = createSlice({
  name: "archiveServicesPtrYearsManagementWise",
  initialState: {
    data: [{
         
    }],
    isLoading:true,
    isError:false,
    error:null
  },
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(fetchArchiveServicesPtRYearsManagementWise.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArchiveServicesPtRYearsManagementWise.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;

      })
      .addCase(fetchArchiveServicesPtRYearsManagementWise.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

  },
});

export default archiveServicesYearSliceManagementWise.reducer;