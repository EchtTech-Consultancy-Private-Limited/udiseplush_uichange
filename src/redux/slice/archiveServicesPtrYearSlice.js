import { createSlice } from "@reduxjs/toolkit";
import { fetchArchiveServicesPtRYears } from "../thunks/archiveServicesThunk";

const archiveServicesYearSlice = createSlice({
  name: "archiveServicesPtrYears",
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
      .addCase(fetchArchiveServicesPtRYears.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArchiveServicesPtRYears.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;

      })
      .addCase(fetchArchiveServicesPtRYears.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

  },
});

export default archiveServicesYearSlice.reducer;