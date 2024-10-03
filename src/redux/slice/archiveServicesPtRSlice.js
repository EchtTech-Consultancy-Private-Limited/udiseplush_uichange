import { createSlice } from "@reduxjs/toolkit";
import { fetchArchiveServicesPtR } from "../thunks/archiveServicesThunk";

const archiveServicesSlice = createSlice({
  name: "archiveServicesPtr",
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
      .addCase(fetchArchiveServicesPtR.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArchiveServicesPtR.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchArchiveServicesPtR.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
  },
});

export default archiveServicesSlice.reducer;