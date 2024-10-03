import { createAsyncThunk } from "@reduxjs/toolkit";

import axiox from "../../services/utility";

const fetchSchoolCateMgtData = createAsyncThunk(
  "schoolCateMgt/fetchSchoolCategoryManagement",
  async () => {
    const response = await axiox.get(`school-category/get-name-by-code`);
    return response.data;
  }
);

export  {fetchSchoolCateMgtData};