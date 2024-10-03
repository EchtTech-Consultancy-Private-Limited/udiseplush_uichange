import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../services/external-utilityv1';

const fetchBlockByDistrictCode = createAsyncThunk(
  "block/fetchBlockData",
  async ({district_code,yearId}) => {
    const response = await axios.get(`/blocks/${district_code}/${yearId}`);
    return response.data;
  }
);

const removeAllBlock = createAsyncThunk(
  "block/removeAllBlockData",
  async () => {
    return [];
  }
);

const updateFilterBlock = createAsyncThunk(
  "block/searchBlock",
  async (searchBlock) => {
    return searchBlock;
  }
);
export  {fetchBlockByDistrictCode,removeAllBlock,updateFilterBlock};