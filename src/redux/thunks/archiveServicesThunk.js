import { createAsyncThunk } from "@reduxjs/toolkit";
import externalAxios  from '../../services/external-utility';

// const fetchArchiveServicesSchoolData = createAsyncThunk(
//   "archive-services/fetchArchiveServicesSchoolData",
//   async ({year_id,region_type,region_code,category_code,management_code,location_code,school_type_code}) => {
//     const response = await externalAxios.post(`${year_id}/${region_type}/${region_code}/${category_code}/${management_code}/${location_code}/${school_type_code}`);
    
//     return response.data;
//   }
// );
const fetchArchiveServicesSchoolData = createAsyncThunk(
  "archive-services/fetchArchiveServicesSchoolData",
  async (filterObj) => {
    const response = await externalAxios.post(`schools-basic-infra/public`,filterObj);
    return response.data;
  }
);
const fetchArchiveServicesGraphSchoolData = createAsyncThunk(
  "archive-services/fetchArchiveServicesGraphSchoolData",
  async (filterObj) => {
    const response = await externalAxios.post(`schools-basic-infra/public`,filterObj);
    return response.data;
  }
);

const fetchArchiveServicesPieGraphSchoolData = createAsyncThunk(
  "archive-services/fetchArchiveServicesPieGraphSchoolData",
  async (filterObj) => {
  
    const response = await externalAxios.post(`schools-basic-infra/public`,filterObj);
    return response.data;
  }
);


const fetchArchiveServicesTeacherDataSocialCatGender=createAsyncThunk(
  "archive-services/fetchArchiveServicesSchoolDataSocialActGender",
  async(filterObj)=>{
    const response=await externalAxios.post(`teachers/public`, filterObj);
    return response.data;
  }
)

const fetchArchiveServicesPtR=createAsyncThunk(
  "archive-services/fetchArchiveServicesTeacherPtr",
  async(filterObj)=>{
    localStorage.setItem("report2007", JSON.stringify(filterObj));
    const response=await externalAxios.post(`ptr/public `, filterObj);
    return response.data;
  }
)


//api to fetch ptr on the basis of years Category wise --->5 year data
const fetchArchiveServicesPtRYears = createAsyncThunk(
  "archive-services/fetchArchiveServicesPtRYears",

  async ({ dType, dCode,valueType,managementCode }) => {
    const response = await externalAxios.post(`ptr/public`,{
      regionType:dType,
      regionCode:dCode,
      valueType :valueType,

    });
    return response.data;
  }
);

//api to fetch ptr on the basis of years Management wise --->5 year data
const fetchArchiveServicesPtRYearsManagementWise = createAsyncThunk(
  "archive-services/fetchArchiveServicesPtRYearsManagementWise",

  async ({ dType, dCode,valueType,managementCode }) => {
    const response = await externalAxios.post(`ptr/public`,{
      regionType:dType,
      regionCode:dCode,
      valueType :valueType,
      managementCode:managementCode

    });
    return response.data;
  }
);



const updateMergeDataToActualData = createAsyncThunk(
  "archive-services/updateMergeDataToActualData",
  async (merged_data) => {
    return merged_data;
  }
);

export  {fetchArchiveServicesSchoolData,updateMergeDataToActualData, fetchArchiveServicesGraphSchoolData,fetchArchiveServicesPieGraphSchoolData,
  fetchArchiveServicesTeacherDataSocialCatGender,fetchArchiveServicesPtR,fetchArchiveServicesPtRYears,fetchArchiveServicesPtRYearsManagementWise};