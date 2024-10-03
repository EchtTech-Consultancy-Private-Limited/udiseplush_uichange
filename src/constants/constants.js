export const filterItemsStatePerPage = 10;
export const filterItemsYearPerPage = 4;

export const urls = ['/school-reports', '/school-reports-1005', '/school-reports-1003', '/teacher-reports-2008', '/teacher-reports-2007','/infrastructure-reports3013', '/aspirational-reports-4001', '/aspirational-reports-4002', '/aspirational-reports-4003', '/aspirational-reports-4004'];

// export const nationalWiseName = "All India/National";
export const nationalWiseName = "All India/National";
export const stateWiseName = "State Wise";
export const districtWiseName = "District Wise"
export const blockWiseName = "Block Wise"
export const district = "District";
export const block = "Block"
export const nWiseregionType = 10;
export const nWiseregionCode = "99"
export const selectedDYear = "2021-22"
export const selectedDYear2007 = "2021-22"
export const allSWiseregionType = 21
export const allSWiseregionCode = "11"
export const specificSWiseregionType = 11;
export const allDWiseregionType = 22;
export const specificDWiseregionType = 12;
export const allBWiseregionType = 23;
export const specificBWiseregionType = 13


export const modifiedFilterObjForReset = {
  regionCode: 99,
  regionType: 21,
  dType: 21, //21statewise //10 for all india
  dCode: 99, // 11statewise //99 for all india
  yearId: 8,
  valueType: 2,
};


export const modifiedFilterObjResetDashboard = {
  categoryCode: 0,
  dashboardRegionCode: "09",
  dashboardRegionType: 10,
  locationCode: 0,
  managementCode: 0,
  regionCode: "11",
  regionType: 21,
  dType: 10, //21statewise //10 for all india
  dCode: 99, // 11statewise //99 for all india
  schoolTypeCode: 0,
  yearId: 8,
  valueType: 2,
};


export const initialFilterSchoolData = {
    yearId: 8,
    regionType: 10,  //21statewise //10 for all india 
    regionCode: 99, // 11statewise //99 for all india
    dType: 10,  //21statewise //10 for all india 
    dCode: 99, // 11statewise //99 for all india
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    schoolTypeCode:0,
    dashboardRegionType:10,
    dashboardRegionCode:"09"
  }
  export const initialFilterMapData = {
    yearId: 8,
    regionType: 10,  //21statewise //10 for all india 
    regionCode: 99, // 11statewise //99 for all india
    dType: 21,  //21statewise //10 for all india 
    dCode: 99, // 11statewise //99 for all india
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    schoolTypeCode:0,
    dashboardRegionType:10,
    dashboardRegionCode:"09"
  }
  export const initialFilterPieGraphSchoolData={
    yearId: 8,
    regionType: 10,  //21statewise //10 for all india 
    regionCode: 99, // 11statewise //99 for all india
    dType: 10,  //21statewise //10 for all india 
    dCode: 99, // 11statewise //99 for all india
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    schoolTypeCode:0,
    dashboardRegionType:10,
    dashboardRegionCode:"09"


  }

  export const initialFilterPtRData = {
    yearId: 8,
    regionType: 10,  //21statewise //10 for all india 
    regionCode: 99, // 11statewise //99 for all india
    dType: 10,  //21statewise //10 for all india 
    dCode: 99, // 11statewise //99 for all india
  }

  export const initialFilterPtrDataYearWise = {
    yearId: 8,
    regionType: 10,  //21statewise //10 for all india 
    regionCode: 99, // 11statewise //99 for all india
    dType: 10,  //21statewise //10 for all india 
    dCode: 99, // 11statewise //99 for all india
    categoryCode: 0,
    managementCode: 0,
  
  }


  export const initialFilterPtRDataStateWise = {
    yearId: 8,
    regionType: 21,  //21statewise //10 for all india 
    regionCode: "11", // 11statewise //99 for all india
    dType: 21,  //21statewise //10 for all india 
    dCode: "11", // 11statewise //99 for all india
  }
  export const intialIndiaWiseFilterSchData={
    
      yearId: 8,
      regionType: 10,
      regionCode: "99",
      dType: 10,
      dCode: 99,
      categoryCode: 0,
      managementCode: 0,
      locationCode: 0,
      schoolTypeCode: 0,
      dashboardRegionType: 10,
      dashboardRegionCode: "09",
    
 
  }
  export const intialStateWiseFilterSchData = {
    yearId: 8,
    regionType: 21,
    regionCode: 11,
    dType: 21,
    dCode: 11,
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    schoolTypeCode: 0,
    dashboardRegionType: 11,
    dashboardRegionCode: 21,
    valueType: 1
  }
 export const categoryMappings = {
    "Primary": "Primary (I-V)",
    "Primary with Upper Primary": "Primary with Upper Primary (I-VIII)",
    "Pr. with Up.Pr. Sec. and H.Sec.": "Pr. with Up.Pr. Sec. and H.Sec. (I-XII)",
    "Upper Primary only": "Upper Primary only(VI-VIII)",
    "Secondary Only": "Secondary Only(IX-X)",
    "Upper Pr. and Secondary": "Upper Pr. and Secondary(VI-X)",
    "Secondary with Higher Secondary": "Secondary with Higher Secondary(IX-XII)",
    "Higher Secondary only/Jr. College": "Higher Secondary only/Jr. College(XI-XII)",
    "Up. Pr. Secondary and Higher": "Up. Pr. Secondary and Higher(VI-XII)",
    "Pr. Up Pr. and Secondary Only": "Pr. Up Pr. and Secondary Only(I-X)",
    "Up. Pr. Secondary and Higher Sec":"Up. Pr. Secondary and Higher Sec(VI-XII)"
  };

// managmnet  and category code for reports
  export const state_gov_mgt_code = ["1", "2", "3", "6", "89", "90", "91"];
  export const gov_aided_mgt_code = ["4", "7"];
  export const pvt_uaided_mgt_code = ["5"];
  export const ctrl_gov_mgt_code = ["92", "93", "94", "95", "96", "101"];
  export const other_mgt_code = ["8", "97", "99", "98", "102"];
  export const pr_sch_code = ["1"];
  export const upr_pr_code = ["2", "4"];
  export const hr_sec_code = ["3", "5", "10", "11"];
  export const sec_sch_code = ["6", "7", "8"];
  export const pre_pr_sch_code = ["12"];
  export const location_code_all = ["0"];
  export const location_code_rural = ["1"];
  export const location_code_urban = ["2"];


    export const columnsConfig = [
      {
        headerNameKey: "Serial Number",
        field: "Serial Number",
        hide: true,
        suppressColumnsToolPanel: true,
        suppressFiltersToolPanel: true,
      },
      {
        headerNameKey: "",
        children: [
          {
            headerNameKey: "",
            children: [
              {
                headerNameKey: "Location",
                field: "regionName",
               
              },
              {
                headerNameKey: "School Management(Broad)",
                field: "schManagementBroad",
              },
              {
                headerNameKey: "School Management(Detailed)",
                field: "schManagementDesc",
               
              },
              {
                headerNameKey: "School Category(Broad)",
                field: "schCategoryBroad",
              
              },
              {
                headerNameKey: "School Category(Detailed)",
                field: "schCategoryDesc",
                
              },
              {
                headerNameKey: "Urban/Rural",
                field: "schLocationDesc",
                
              },
            ],
          },
        ],
      },
      {
        headerNameKey: "Social Category",
        children: [
          {
            headerNameKey: "General",
            children: [
              { headerNameKey: "Female", field: "totTchFSocCatCd1", hide: false },
              { headerNameKey: "Male", field: "totTchMSocCatCd1", hide: false },
            ],
          },
          {
            headerNameKey: "OBC",
            children: [
              { headerNameKey: "Female", field: "totTchFSocCatCd4" },
              { headerNameKey: "Male", field: "totTchMSocCatCd4" },
            ],
          },
          {
            headerNameKey: "SC",
            children: [
              { headerNameKey: "Female", field: "totTchFSocCatCd2", hide: false },
              { headerNameKey: "Male", field: "totTchMSocCatCd2", hide: false },
            ],
          },
          {
            headerNameKey: "ST",
            children: [
              { headerNameKey: "Female", field: "totTchFSocCatCd3" },
              { headerNameKey: "Male", field: "totTchMSocCatCd3" },
            ],
          },
          {
            headerNameKey: "",
            hide: false,
            children: [
              {
                headerNameKey: "Overall",
                field: "total",
                valueGetter: (params) => params.data ? params.data.total : null,
                aggFunc: 'sum', 
              },
            ],
          },
        ],
      },
    ];
    //  This is for show Location in pdf file
    
    export const generateTextContent = (stateName, nationalWiseName, stateWiseName, local_district, district, districtWiseName, local_block, block,blockWiseName) => {
      let textContent = "";
      if (stateName === nationalWiseName) {
        textContent = `${nationalWiseName}`;
      } else if (stateName === stateWiseName) {
        textContent = `National(${stateWiseName})`;
      } else if (stateName !== nationalWiseName && stateName !== stateWiseName && local_district === district) {
        textContent = `State-${stateName}`;
      } else if (stateName !== nationalWiseName && stateName !== stateWiseName && local_district !== district && local_district !== districtWiseName && local_block !== blockWiseName && local_block !== block) {
        textContent = `Block -${local_block} (${local_district} (${stateName}))`;
      } else if (stateName !== nationalWiseName && stateName !== stateWiseName && local_district !== districtWiseName && local_district !== district && local_block === blockWiseName) {
        textContent = `${stateName} (${local_district} (${blockWiseName}))`;
      } else if (stateName !== nationalWiseName && stateName !== stateWiseName && local_district !== district && local_district !== districtWiseName) {
        textContent = `District - ${local_district} (${stateName})`;
      } else if (stateName !== nationalWiseName && stateName !== stateWiseName && local_district === districtWiseName) {
        textContent = `${stateName} (${districtWiseName})`;
      }
    
      return textContent;
    };
   export const rangeMapping = {
      gross_enrollment_ratio: ["Below 85", "85-90", "90-95", "95"],
      dropout_rate: ["15+", "11-15", "6-10", "0-5"],
      transition_rate: ["Below 85", "85-90", "90-95", "95"],
      pupil_teacher_ratio: ["40+", "35-40", "31-35", "30 and Below"],
      schools_with_drinking_water: ["Below 85", "85-90", "90-95", "95"],
      schools_with_electricity_connection: ["Below 70", "70-80", "80-90", "90"],
    };