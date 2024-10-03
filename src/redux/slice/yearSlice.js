import { createSlice } from "@reduxjs/toolkit";
import { fetchYearData } from "../thunks/yearThunk";

const yearSlice = createSlice({
  name: "year",
  initialState: {
    data: {
      data:[{
        "id": 1,
        "yearDesc": "",
        "yearId": 0
      }],
      statusCode:0,
      message:"",
      success:false,
      selectedYear: "2021-22",
    },

    isLoading:false,
    isError:false
  },
  reducers: {
    setSelectedYear(state, action) {
      state.data.selectedYear = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchYearData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchYearData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchYearData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setSelectedYear } = yearSlice.actions;
export default yearSlice.reducer;