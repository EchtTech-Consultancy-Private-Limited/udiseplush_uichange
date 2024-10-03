import { createSlice } from "@reduxjs/toolkit";
import { fetchArchiveServicesSchoolData,updateMergeDataToActualData } from "../thunks/archiveServicesThunk";

const archiveServicesSlice = createSlice({
  name: "archiveServices",
  initialState: {
    data: [{
            "regionType": "",
            "regionCode": "",
            "yearId": 0,
            "location": "India",
            "rural_urban": "Urban",
            "school_management": "School mgt.",
            "school_type": "School Type.",
            "no_of_headmaster": 0,
            "land_available": 0,
            "totalSchool": 0,
            "schHavingFuncElectricity": 0,
            "schHavingInternet": 0,
            "schHavingLibrary": 0,
            "schHavingPlayground": 0,
            "schHavingRampFacility": 0,
            "schHavingSolarPanel": 0,
            "schHavingNewsPaper": 0,
            "schHavingKitchenGarden": 0,
            "schHavingFurniture": 0,
            "schHavingWaterPurifier": 0,
            "schHavingFuncDrinkingWater": 0,
            "schHavingFuncToilet": 0,
            "schHavingToiletBoys": 0,
            "schHavingFuncToiletBoys": 0,
            "schHavingToiletGirls": 0,
            "schHavingFuncToiletGirls": 0,
            "schHavingFuncUrinalToiletBoys": 0,
            "schHavingFuncUrinalToiletGirls": 0,
            "schHavingRainWaterHarvesting": 0,
            "schHavingWaterTested": 0,
            "schHavingHandwash": 0,
            "schHavingIncinerator": 0,
            "schHavingWashFacility": 0,
            "schHavingHandRails": 0,
            "schHavingMedicalCheckup": 0,
            "schHavingCompleteMedicalCheckup": 0,
            "schHavingAvailableComputer": 0,
            "school_category": "HSS (I-XII)",
    }],
    isLoading:true,
    isError:false,
    error:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchiveServicesSchoolData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArchiveServicesSchoolData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchArchiveServicesSchoolData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(updateMergeDataToActualData.fulfilled, (state, action) => {
        state.data.data = action.payload;
        state.isLoading = false;
      })
  },
});

export default archiveServicesSlice.reducer;