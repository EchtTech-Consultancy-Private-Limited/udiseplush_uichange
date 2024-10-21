import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios  from '../../services/utility';

import axios from "../../services/utilityNew";

const fetchYearData = createAsyncThunk(
  "year/fetchYearData",
  async () => {
    const response = await axios.get(`v1.1/acad-year-master/public`);
    return response?.data;
  }
);
const removeDateYear = createAsyncThunk(
  "year/removeYear",
  async () => {
    return [];
  }
);
export  {fetchYearData,removeDateYear};