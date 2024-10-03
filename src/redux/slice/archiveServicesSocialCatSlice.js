import { createSlice } from "@reduxjs/toolkit";
import {fetchArchiveServicesTeacherDataSocialCatGender  } from "../thunks/archiveServicesThunk";

const archiveServicesSocialCatSlice = createSlice({
  name: "archiveServicesSocialCat",
  initialState: {
    data: [{
            "regionType": "",
            "regionCode": "",
            "yearId": 0,
            "location": "India",
            "rural_urban": "Urban",
            "school_management": "School mgt.",
            "school_type": "School Type.",
           
    }],
    isLoading:true,
    isError:false,
    error:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchiveServicesTeacherDataSocialCatGender.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArchiveServicesTeacherDataSocialCatGender.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchArchiveServicesTeacherDataSocialCatGender.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      
  },
});

export default archiveServicesSocialCatSlice.reducer;