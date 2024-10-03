import { createAsyncThunk } from "@reduxjs/toolkit";

import externalUtilityv1 from "../../services/external-utilityv1";

const fetchStateData = createAsyncThunk(
  "state/fetchStateData",
  async (yearId) => {
    
    const response = await externalUtilityv1.get(`states/${yearId}`);
    return response.data;
  }
);

const updateFilterState = createAsyncThunk(
  "state/searchState",
  async (searchState) => {
    return searchState;
  }
);

export  {fetchStateData,updateFilterState};