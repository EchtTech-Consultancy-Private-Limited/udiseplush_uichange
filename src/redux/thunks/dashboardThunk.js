import { createAsyncThunk } from "@reduxjs/toolkit";

import externalUtilityv1 from "../../services/external-utilityv1";

const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",

  async ({yearId, dashboardRegionType, dashboardRegionCode}) => {
    const response = await externalUtilityv1.post(`summarised-stats/public`,{
      yearId:yearId,
      regionType:dashboardRegionType,
      regionCode:dashboardRegionCode
    });
    return response.data;
  }
);

const fetchSchoolStatsData = createAsyncThunk(
  "dashboard/fetchSchoolStatsData",

  async ({yearId, dType, dCode,valueType }) => {
    const response = await externalUtilityv1.post(`schools-summarised-stats/public`,{
      yearId:yearId,
      regionType:dType,
      regionCode:dCode,
      valueType :valueType

    });
    return response.data;
  }
);

const fetchSchoolStatsDataYear = createAsyncThunk(
  "dashboard/fetchSchoolStatsDataYear",

  async ({ dType, dCode,valueType }) => {
    const response = await externalUtilityv1.post(`schools-summarised-stats/public`,{
      regionType:dType,
      regionCode:dCode,
      valueType :valueType

    });
    return response.data;
  }
);


const fetchSchoolStatsIntData = createAsyncThunk(
  "dashboard/fetchSchoolStatsIntData",

  async ({yearId, dType, dCode }) => {
    const response = await externalUtilityv1.post(`schools-summarised-stats/public`,{
      yearId:yearId,
      regionType:dType,
      regionCode:dCode,
      valueType:1
    });
    return response.data;
  }
);
const fetchTeachersStatsData = createAsyncThunk(
  "dashboard/fetchTeachersStatsData",

  async ({yearId, dType, dCode,valueType }) => {
    const response = await externalUtilityv1.post(`teachers-summarised-stats/public`,
    {
      yearId:yearId,
      regionType:dType,
      regionCode:dCode,
      valueType:valueType
    });
    return response.data;
  }
);
const fetchTeachersStatsIntData = createAsyncThunk(
  "dashboard/fetchTeachersStatsIntData",

  async ({yearId, dType, dCode }) => {
    const response = await externalUtilityv1.post(`teachers-summarised-stats/public`,
    {
      yearId:yearId,
      regionType:dType,
      regionCode:dCode,
      valueType:1
    });
    return response.data;
  }
);
const fetchStudentStatsData = createAsyncThunk(
  "dashboard/fetchStudentsStatsData",

  async ({yearId, dType, dCode, valueType }) => {
    const response = await externalUtilityv1.post(`students-summarised-stats/public`,
      {
        yearId:yearId,
        regionType:dType,
        regionCode:dCode,
        valueType :valueType
      }
    );
    return response.data;
  }
);
const fetchStudentStatsIntData = createAsyncThunk(
  "dashboard/fetchStudentStatsIntData",

  async ({yearId, dType, dCode }) => {
    const response = await externalUtilityv1.post(`students-summarised-stats/public`,
      {
        yearId:yearId,
        regionType:dType,
        regionCode:dCode,
        valueType :1
      }
    );
    return response.data;
  }
);

const fetchMaptatsData = createAsyncThunk(
  "dashboard/fetchMaptatsData",

  async ({yearId, dType, dCode, valueType }) => {
    const response = await externalUtilityv1.post(`students-summarised-stats/public`,
      {
        yearId:yearId,
        regionType:dType,
        regionCode:dCode,
        valueType :valueType
      }
    );
    return response.data;
  }
);


const fetchMaptatsOtherData = createAsyncThunk(
  "dashboard/fetchMaptatsOtherData",

  async ({yearId, dType, dCode, valueType }) => {
    const response = await externalUtilityv1.post(`summarised-stats/public`,
      {
        yearId:yearId,
        regionType:dType,
        regionCode:dCode,
        valueType :valueType
      }
    );
    return response.data;
  }
);




const fetchAllStateSchemesData = createAsyncThunk(
  "dashboard/fetchAllStateSchemesData",

  async ({yearId, regionType, dCode}) => {
    const response = await externalUtilityv1.post(`students-summarised-stats/public`,
      {
        yearId:yearId,
        regionType:regionType,
        regionCode:dCode
      }
    );
    return response.data;
  }
);


export  {fetchDashboardData,fetchSchoolStatsData,fetchSchoolStatsDataYear,fetchTeachersStatsData,fetchStudentStatsData,fetchAllStateSchemesData,fetchSchoolStatsIntData,fetchStudentStatsIntData,fetchTeachersStatsIntData,fetchMaptatsData,fetchMaptatsOtherData};