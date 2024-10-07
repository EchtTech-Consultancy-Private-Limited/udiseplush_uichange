import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import allReportsHindidata from "../../json-data/allReportsHindi.json";
import allreportsdata from "../../json-data/allreports.json";
import { fetchArchiveServicesPtR } from "../../redux/thunks/archiveServicesThunk";
import { fetchArchiveServicesPtRYears } from "../../redux/thunks/archiveServicesThunk";
import { fetchArchiveServicesPtRYearsManagementWise } from "../../redux/thunks/archiveServicesThunk";
import satyamevaimg from "../../assets/images/satyameva-jayate-img.png";
import udise from "../../assets/images/udiseplu.jpg";

import {
  initialFilterPtRData,
  initialFilterPtRDataStateWise,
  state_gov_mgt_code,
  gov_aided_mgt_code,
  pvt_uaided_mgt_code,
  ctrl_gov_mgt_code,
  other_mgt_code,
  pr_sch_code,
  upr_pr_code,
  hr_sec_code,
  sec_sch_code,
  pre_pr_sch_code,
  location_code_all,
  location_code_rural,
  location_code_urban,
  selectedDYear2007,
  initialFilterPtrDataYearWise,
  nationalWiseName,
  stateWiseName,
  districtWiseName,
  district,
  blockWiseName,
  block,
  generateTextContent,
} from "../../constants/constants";

import { allFilter } from "../../redux/slice/schoolFilterSlice";
import { useDispatch, useSelector } from "react-redux";
import "./infra.css";
import "./report.scss";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_more from "highcharts/highcharts-more";
import { useLocation } from "react-router-dom";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
import { useTranslation } from "react-i18next";
import FilterDropdown2007 from "../Home/filter/FilterDropdown2007";
import { handleMissingData } from "../../utils/handleMissingData";

import {
  handleActiveTabs,
  handleCurrentIndex,
} from "../../redux/slice/headerSlice";
import { removeAllDistrict } from "../../redux/thunks/districtThunk";
import { removeAllBlock } from "../../redux/thunks/blockThunk";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/treemap")(Highcharts);
require("highcharts/modules/treegraph")(Highcharts);
HC_more(Highcharts);
export default function TeacherReport2007() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryString = window.location.href;
  const urlParams = new URLSearchParams(queryString.replace("#/", ""));
  const paramValue = urlParams.get("type");
  const schData = useSelector((state) => state?.pupilteacherratio);
  const school_data = useSelector(
    (state) => state?.pupilteacherratio?.data?.data
  );
  const school_data_Years = useSelector(
    (state) => state?.pupilteacherratioyear?.data?.data
  );
  const school_data_Years_management = useSelector(
    (state) => state?.pupilteacherratioyearmanagement?.data?.data
  );
  const [local_state, setLocalStateName] = useState("All India/National");
  const [local_district, setLocalDistrictName] = useState("District");
  const [local_block, setLocalBlockName] = useState("Block");
  const schoolFilter = useSelector((state) => state.schoolFilter2007Slice);
  const filterObj = structuredClone(schoolFilter);
  const headerSliceData = useSelector((state) => state.header.activeTab);
  const local_year = localStorage.getItem("year");

  const stateName = useMemo(() => localStorage.getItem("state"), []);
  const [processedData, setProcessedData] = useState([]);
  const [groupKeys, setGroupKeys] = useState({
    schManagementBroad: false,
    schCategoryBroad: true,
    schLocationDesc: false,
  });

  useEffect(() => {
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
  }, []);
  useEffect(() => {
    if (headerSliceData === "table") {
      window.localStorage.setItem("state_wise", "All India/National");
      window.localStorage.setItem("state", "All India/National");
      window.localStorage.setItem("map_state_name", "All India/National");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
    } else if (headerSliceData === "graph") {
      window.localStorage.setItem("state_wise", "State Wise");
      window.localStorage.setItem("state", "State Wise");
      window.localStorage.setItem("map_state_name", "State Wise");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
    }
  }, [headerSliceData]);

  useEffect(() => {
    setLocalStateName(localStorage.getItem("state"));
    setLocalStateName(localStorage.getItem("map_state_name"));
    setLocalDistrictName(localStorage.getItem("map_district_name"));
    setLocalBlockName(localStorage.getItem("block"));
  }, [filterObj, headerSliceData]);
  localStorage.setItem("groupKeys", JSON.stringify(groupKeys));
  const [chartHeight, setChartHeight] = useState(450);
  const [mgt, setMgt] = useState("");
  const [mgt_Details, setMgtDetail] = useState("");
  const [cat, setCat] = useState("active");
  const [cat_Details, setCatDetail] = useState("");
  const [ur, setUR] = useState("");
  const [multiMgt, setMultiMgts] = useState("");
  const [multiCat, setMultiCats] = useState("multibtn");
  const [showTransposed, setShowTransposeds] = useState(false);
  const [customColumnNames, setCustomColumns] = useState("");
  const [cloneFilterDatas, setCloneFilterDatas] = useState([]);
  const [topFiveData, setTopFiveData] = useState([]);
  const [stateWiseData, setStateWiseData] = useState([]);
  const [queryParameters] = useSearchParams();
  const id = queryParameters.get("id");
  const type = queryParameters.get("type");
  const [intialTeacherData, setIntialTeacherData] = useState(school_data);
  const [pinnedBottomRowDataByRows, setPinnedBottomRowDataByRow] = useState([]);
  const [pupilTeacherRatioBy, setPupilTeacherRatioBy] =
    useState("School Management");
  const gridApiRef = useRef(null);
  useEffect(() => {
    setIntialTeacherData(school_data);
  }, [school_data]);

  // Taking the both reports data condition wise for language change
  useEffect(() => {
    const reportsData =
      i18n.language === "hi" ? allReportsHindidata : allreportsdata;

    for (const category in reportsData) {
      const foundReport = reportsData[category].find(
        (report) => report.id === parseInt(id)
      );
      if (foundReport) {
        setReport(foundReport);
        break;
      }
    }
  }, [id, i18n.language]);

  useEffect(() => {
    dispatch(allFilter(initialFilterPtRData));
    dispatch(fetchArchiveServicesPtR(initialFilterPtRData));
    dispatch(
      fetchArchiveServicesPtRYearsManagementWise(initialFilterPtrDataYearWise)
    );
  }, []);
  const storedFilterObj = localStorage.getItem("report2007");
  const parsedFilterObj = JSON.parse(storedFilterObj);
  const regionCode = parsedFilterObj?.regionCode;
  const regionType = parsedFilterObj?.regionType;
  const dType = parsedFilterObj?.dType;
  const dCode = parsedFilterObj?.dCode;
  const yearId = parsedFilterObj?.yearId;
  const [report, setReport] = useState(null);
  const [gridApi, setGridApi] = useState();
  const [currentDataTreeLength, setCurrentDataTreeLength] = useState(36);
  const [arrGroupedData, setArrGroupedData] = useState([]);
  const [arrGroupedGraphData, setArrGroupedGraphData] = useState([]);
  const [arrGroupedGraphWithTotalKey, setArrGroupedGraphWithTotalKey] =
    useState([]);
  const [gridRefreshKey, setGridRefreshKey] = useState(0);

  const [activeTab, setActiveTab] = useState(type);
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [pinnedData, SetPinnedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const filter_query_by_location =
    // local_state === "All India/National" ||
    local_state === "State Wise" ||
    local_district === "District Wise" ||
    local_block === "Block Wise";

  const [columns, setColumn] = useState([
    {
      headerName: "S.NO.",
      field: "S.NO.",
      hide: true,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
    },
    {
      headerName: "Location",
      field: "regionName",
      hide: !filter_query_by_location,
    },

    {
      headerName: "School Management(Broad)",
      field: "schManagementBroad",
      suppressColumnsToolPanel: true,
      hide: true,
    },

    {
      headerName: "Pre-Primary",
      field: "ptrPrePry",
      hide: false,
    },
    {
      headerName: "Primary",
      field: "ptrPry",
      hide: false,
    },
    {
      headerName: "Upper Primary",
      field: "ptrUPry",
      hide: false,
    },
    {
      headerName: "Secondary",
      field: "ptrSec",
      hide: false,
    },
    {
      headerName: "Higher Secondary",
      field: "ptrHSec",
      hide: false,
    },
    // {
    //   headerName: "Overall",
    //   field: "ptrTotal",
    //   hide: false,
    // },
  ]);
  const [defColumnDefs] = useState({
    flex: 1,
    minWidth: 150,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
    filter: true,
    autoHeaderHeight: true,
  });
  const arrGroupedDataTable = useMemo(() => {
    return handleMissingData(arrGroupedData, columns);
  }, [arrGroupedData]);

  // useEffect(() => {
  //   if (local_state === "All India/National") {
  //     SetPinnedData(arrGroupedDataTable);
  //   }
  // }, [arrGroupedDataTable, local_state]);

  function onColumnVisible(event) {
    const columnId = event?.column?.colId;
    const visible = event.visible;
    if (columnId === "schManagementBroad") {
      setGroupKeys((prev) => ({
        ...prev,
        schManagementBroad: visible,
      }));
      setMgt(() => (visible ? "active" : ""));
    }

    if (columnId === "schCategoryBroad") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryBroad: visible,
      }));
      setCat(() => (visible ? "active" : ""));
    }

    if (columnId === "schLocationDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schLocationDesc: visible,
      }));
      setUR(() => (visible ? "active" : ""));
    }
  }
  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    setColumnVisibility(groupKeys);
    setGridApi(params);
  };

  const setColumnVisibility = (keys) => {
    if (gridApiRef.current) {
      const gridApi = gridApiRef.current;
      Object.keys(keys).forEach((key) => {
        gridApi?.columnApi?.setColumnVisible(key, keys[key]);
      });
    }
  };
  const handleCustomKeyInAPIResponse = () => {
    const arr = [];
    if (school_data) {
      school_data?.forEach((item, idx) => {
        let appendedObj = { ...item };
        /* broad management key added*/
        if (state_gov_mgt_code.includes(item.managementCode)) {
          appendedObj.schManagementBroad = "State Government";
        } else if (gov_aided_mgt_code.includes(item.managementCode)) {
          appendedObj.schManagementBroad = "Govt. Aided";
        } else if (pvt_uaided_mgt_code.includes(item.managementCode)) {
          appendedObj.schManagementBroad = "Private Unaided";
        } else if (ctrl_gov_mgt_code.includes(item.managementCode)) {
          appendedObj.schManagementBroad = "Central Government";
        } else if (other_mgt_code.includes(item.managementCode)) {
          appendedObj.schManagementBroad = "Others";
        }
        /* broad category key added*/
        if (pr_sch_code.includes(item.schCategoryCode)) {
          appendedObj.schCategoryBroad = "Primary (PRY)";
        } else if (upr_pr_code.includes(item.schCategoryCode)) {
          appendedObj.schCategoryBroad = "Upper Primary (UPR)";
        } else if (hr_sec_code.includes(item.schCategoryCode)) {
          appendedObj.schCategoryBroad = "Higher Secondary (HSEC)";
        } else if (sec_sch_code.includes(item.schCategoryCode)) {
          appendedObj.schCategoryBroad = "Secondary (SEC)";
        } else if (pre_pr_sch_code.includes(item.schCategoryCode)) {
          appendedObj.schCategoryBroad = "Pre-Primary (PRY)";
        }

        if (location_code_all.includes(item.locationCode)) {
          appendedObj.schLocationDesc = "All";
        } else if (location_code_urban.includes(item.locationCode)) {
          appendedObj.schLocationDesc = "Urban";
        } else if (location_code_rural.includes(item.locationCode)) {
          appendedObj.schLocationDesc = "Rural";
        }
        arr?.push(appendedObj);
      });

      setData(arr);
    } else return "Data not found";
  };

  const handleCustomKeyInAPIResponseForGraph = () => {
    if (
      !school_data_Years_management ||
      !Array.isArray(school_data_Years_management)
    ) {
      console.error("Data is not available or not an array");
      return;
    }

    const arr = [];

    school_data_Years_management?.forEach((item) => {
      let appendedObj = { ...item };

      if (state_gov_mgt_code.includes(item.managementCode)) {
        appendedObj.schManagementBroad = "State Government";
      } else if (gov_aided_mgt_code.includes(item.managementCode)) {
        appendedObj.schManagementBroad = "Govt. Aided";
      } else if (pvt_uaided_mgt_code.includes(item.managementCode)) {
        appendedObj.schManagementBroad = "Private Unaided";
      } else if (ctrl_gov_mgt_code.includes(item.managementCode)) {
        appendedObj.schManagementBroad = "Central Government";
      } else if (other_mgt_code.includes(item.managementCode)) {
        appendedObj.schManagementBroad = "Others";
      }

      arr.push(appendedObj);
    });

    setGraphData(arr);
  };

  // Example of using the function after data fetching
  useEffect(() => {
    if (
      school_data_Years_management &&
      school_data_Years_management?.length > 0
    ) {
      handleCustomKeyInAPIResponseForGraph();
    }
  }, [school_data_Years_management]);
  useEffect(() => {
    if (graphData && graphData.length > 0) {
      const processed = processData(graphData);
      setProcessedData(processed);
    }
  }, [graphData]);

  const yearIdToYearRange = {
    7: "2020-21",
    8: "2021-22",
    9: "2022-23",
  };
  const processData = (graphData) => {
    const groupedData = {};

    graphData.forEach((item) => {
      const { yearId, schManagementBroad, ptrTotal } = item;
      const yearRange = yearIdToYearRange[yearId];
      if (!groupedData[yearId]) {
        groupedData[yearId] = {
          yearRange,
          stateGovernment: 0,
          govtAided: 0,
          privateUnaided: 0,
          centralGovernment: 0,
          others: 0,
        };
      }

      switch (schManagementBroad) {
        case "State Government":
          groupedData[yearId].stateGovernment += parseFloat(ptrTotal) || 0;
          break;
        case "Govt. Aided":
          groupedData[yearId].govtAided += parseFloat(ptrTotal) || 0;
          break;
        case "Private Unaided":
          groupedData[yearId].privateUnaided += parseFloat(ptrTotal) || 0;
          break;
        case "Central Government":
          groupedData[yearId].centralGovernment += parseFloat(ptrTotal) || 0;
          break;
        default:
          groupedData[yearId].others += parseFloat(ptrTotal) || 0;
          break;
      }
    });

    return Object.values(groupedData).map((item) => ({
      yearRange: item.yearRange,
      stateGovernment: item.stateGovernment.toFixed(2),
      govtAided: item.govtAided.toFixed(2),
      privateUnaided: item.privateUnaided.toFixed(2),
      centralGovernment: item.centralGovernment.toFixed(2),
      others: item.others.toFixed(2),
    }));
  };

  const stateGovernmentValues = processedData.map((item) =>
    parseFloat(item.stateGovernment)
  );
  const govtAidedValues = processedData.map((item) =>
    parseFloat(item.govtAided)
  );
  const privateUnaidedValues = processedData.map((item) =>
    parseFloat(item.privateUnaided)
  );
  const categoriesYear = processedData.map((item) => item.yearRange);

  const handleFilter = (e, value) => {
    if (value === "School Management" || value === "Mgts Details") {
      if (value === "School Management") {
        if (mgt === "active") {
          setMgt("");
        } else {
          setMgt("active");
        }
      } else {
        setMgt("");
      }
      if (value === "Mgts Details") {
        if (mgt_Details === "active") {
          setMgtDetail("");
        } else {
          setMgtDetail("active");
        }
      } else {
        setMgtDetail("");
      }
      // /hide and show multi button class for details view/
      if (value === "School Management") {
        if (mgt === "active") {
          setMultiMgts("");
        } else {
          setMultiMgts("multibtn");
        }
      }
      if (value === "Mgts Details") {
        if (mgt_Details === "active") {
          setMultiMgts("");
        } else {
          setMultiMgts("multibtn");
        }
      }
      //  /end here/
    }
    if (value === "School Category" || value === "Cats Details") {
      if (value === "School Category") {
        if (cat === "active") {
          setCat("");
        } else {
          setCat("active");
        }
      } else {
        setCat("");
      }
      if (value === "Cats Details") {
        if (cat_Details === "active") {
          setCatDetail("");
        } else {
          setCatDetail("active");
        }
      } else {
        setCatDetail("");
      }
      if (value === "School Category") {
        if (cat === "active") {
          setMultiCats("");
        } else {
          setMultiCats("multibtn");
        }
      }
      if (value === "Cats Details") {
        if (cat_Details === "active") {
          setMultiCats("");
        } else {
          setMultiCats("multibtn");
        }
      }
    }
  };

  useEffect(() => {
    handleCustomKeyInAPIResponse();
  }, [intialTeacherData]);

  const generateKey = (item, filters) => {
    const {
      regionName,
      schManagementBroad,
      ptrPrePry,
      ptrPry,
      ptrUPry,
      ptrSec,
      ptrHSec,
      ptrTotal,
      schLocationDesc,
    } = item;
    let keyParts = [regionName];

    if (filters.schManagementBroad) keyParts.push(schManagementBroad);
    keyParts.push(ptrPrePry);
    keyParts.push(ptrPry);
    keyParts.push(ptrUPry);
    keyParts.push(ptrSec);
    keyParts.push(ptrHSec);
    keyParts.push(ptrTotal);
    if (filters.schLocationDesc) keyParts.push(schLocationDesc);

    return keyParts.join("-");
  };

  const groupData = (data, filters) => {
    const groupedData = {};

    data.forEach((item) => {
      const key = generateKey(item, filters);
      groupedData[key] = groupedData[key] || {
        ...item,
        ptrTotal: 0,
      };

      groupedData[key].ptrTotal += parseFloat(item.ptrTotal) || 0;
    });

    return Object.values(groupedData).map((item) => ({
      ...item,
      ptrTotal: item.ptrTotal.toFixed(2),
    }));
  };
  const createChildrenColumns = (urbanField, ruralField) => {
    return [
      { headerName: "Urban", field: urbanField, hide: false },
      { headerName: "Rural", field: ruralField, hide: false },
    ];
  };

  const updateColumnHelper = (
    headerName,
    baseField,
    urbanField,
    ruralField
  ) => {
    return {
      headerName,
      hide: false,
      children: groupKeys.schLocationDesc
        ? undefined
        : createChildrenColumns(urbanField, ruralField),
      ...(groupKeys.schLocationDesc ? { field: baseField } : {}),
    };
  };

  const updateColumns = () => {
    setColumn((prevColumns) => {
      return prevColumns.map((col) => {
        switch (col.headerName) {
          case "Pre-Primary":
            return updateColumnHelper(
              "Pre-Primary",
              "ptrPrePry",
              "ptrPrePryUrban",
              "ptrPrePryRural"
            );
          case "Primary":
            return updateColumnHelper(
              "Primary",
              "ptrPry",
              "ptrPryUrban",
              "ptrPryRural"
            );
          case "Upper Primary":
            return updateColumnHelper(
              "Upper Primary",
              "ptrUPry",
              "ptrUPryUrban",
              "ptrUPryRural"
            );
          case "Secondary":
            return updateColumnHelper(
              "Secondary",
              "ptrSec",
              "ptrSecUrban",
              "ptrSecRural"
            );
          case "Higher Secondary":
            return updateColumnHelper(
              "Higher Secondary",
              "ptrHSec",
              "ptrHSecUrban",
              "ptrHSecRural"
            );
          default:
            return col;
        }
      });
    });
  };
  var initialFilter = {
    yearId: yearId,
    regionType: regionType,
    regionCode: regionCode,
    dType: dType,
    dCode: dCode,
  };
  const handleButtonClick = useCallback(
    (type, detailType, e) => {
      handleFilterClick(type, detailType);

      if (type === "School Management" && detailType === "broad") {
        initialFilter.managementCode = 0;
        dispatch(fetchArchiveServicesPtR(initialFilter));
        setMgt("active");
        setMgtDetail("");
        setCatDetail("");
        setCat("");
        setUR("");
        setGroupKeys((prevKeys) => ({
          ...prevKeys,
          schManagementBroad: true,
          schCategoryBroad: false,
          schLocationDesc: false,
        }));
      } else if (type === "School Category" && detailType === "broad") {
        initialFilter.categoryCode = 0;
        dispatch(fetchArchiveServicesPtR(initialFilter));
        setCat("active");
        setCatDetail("");
        setMgtDetail("");
        setMgt("");
        setUR("");
        setGroupKeys((prevKeys) => ({
          ...prevKeys,
          schManagementBroad: false,
          schCategoryBroad: true,
          schLocationDesc: false,
        }));

        const updatedColumns = [
          { headerName: "Location", field: "regionName", hide: false },
          { headerName: "Pre-Primary", field: "ptrPrePry", hide: false },
          { headerName: "Primary", field: "ptrPry", hide: false },
          { headerName: "Upper Primary", field: "ptrUPry", hide: false },
          { headerName: "Secondary", field: "ptrSec", hide: false },
          { headerName: "Higher Secondary", field: "ptrHSec", hide: false },
          // {
          //   headerName: "Overall",
          //   field: "ptrHSec",
          //   hide: false,
          // },
        ];

        setColumn(updatedColumns);
      } else if (type === "Urban/Rural" && detailType === "broad") {
        const currentLocationDesc = !groupKeys.schLocationDesc;
        setUR(currentLocationDesc ? "active" : "");
        setGroupKeys((prevKeys) => ({
          ...prevKeys,
          schLocationDesc: currentLocationDesc,
        }));
        updateColumns();

        if (currentLocationDesc) {
          initialFilter.locationCode = 0;
          if (groupKeys.schManagementBroad) {
            initialFilter.managementCode = 0;
          }
        } else {
          if (groupKeys.schManagementBroad) {
            initialFilter.managementCode = 0;
          }
        }

        dispatch(fetchArchiveServicesPtR(initialFilter));
      }

      handleFilter(type, e);
    },
    [yearId, regionType, regionCode, dType, dCode, dispatch, groupKeys]
  );

  const handleButtonClickGraph = (type, detailType, e) => {
    handleFilterClick(type, detailType);

    let initialFilter = {
      yearId: yearId,
      regionType: regionType,
      regionCode: regionCode,
      dType: dType,
      dCode: dCode,
    };

    if (type === "School Management" && detailType === "broad") {
      initialFilter.managementCode = 0;
      dispatch(fetchArchiveServicesPtR(initialFilter));
      setMgt("active");
      setMgtDetail("");
      setCatDetail("");
      setCat("");
      setUR("");
      setGroupKeys((prevKeys) => ({
        ...prevKeys,
        schManagementBroad: true,
        schCategoryBroad: false,
        schLocationDesc: false,
      }));
    } else if (type === "School Category" && detailType === "broad") {
      initialFilter.categoryCode = 0;
      dispatch(fetchArchiveServicesPtR(initialFilter));
      setCat("active");
      setCatDetail("");
      setMgtDetail("");
      setMgt("");
      setUR("");
      setGroupKeys((prevKeys) => ({
        ...prevKeys,
        schManagementBroad: false,
        schCategoryBroad: true,
        schLocationDesc: false,
      }));

      const updatedColumns = [
        { headerName: "Location", field: "regionName", hide: false },
        { headerName: "Pre-Primary", field: "ptrPrePry", hide: false },
        { headerName: "Primary", field: "ptrPry", hide: false },
        { headerName: "Upper Primary", field: "ptrUPry", hide: false },
        { headerName: "Secondary", field: "ptrSec", hide: false },
        { headerName: "Higher Secondary", field: "ptrHSec", hide: false },
        // {
        //   headerName: "Overall",
        //   field: "ptrHSec",
        //   hide: false,
        // },
      ];

      setColumn(updatedColumns);
    } else if (type === "Urban/Rural" && detailType === "broad") {
      const currentLocationDesc = !groupKeys.schLocationDesc;
      setUR(currentLocationDesc ? "active" : "");
      setGroupKeys((prevKeys) => ({
        ...prevKeys,
        schLocationDesc: currentLocationDesc,
      }));
      updateColumns();

      if (currentLocationDesc) {
        initialFilter.locationCode = 0;
        if (groupKeys.schManagementBroad) {
          initialFilter.managementCode = 0;
        }
      } else {
        if (groupKeys.schManagementBroad) {
          initialFilter.managementCode = 0;
        }
      }

      dispatch(fetchArchiveServicesPtR(initialFilter));
    }

    handleFilter(type, e);
  };
  useEffect(() => {
    setIsLoading(true);
    const mergedData = data?.reduce((acc, curr) => {
      const existingKey = acc.find(
        (item) => item.regionName === curr.regionName
      );

      if (existingKey) {
        existingKey.ptrPrePry = curr.ptrPrePry;
        existingKey.ptrPry = curr.ptrPry;
        existingKey.ptrUPry = curr.ptrUPry;
        existingKey.ptrSec = curr.ptrSec;
        existingKey.ptrHSec = curr.ptrHSec;
        existingKey.ptrTotal = curr.ptrTotal;
        if (curr.locationCode === "1") {
          // Rural
          existingKey.ptrPrePryRural = curr.ptrPrePry;
          existingKey.ptrPryRural = curr.ptrPry;
          existingKey.ptrUPryRural = curr.ptrUPry;
          existingKey.ptrSecRural = curr.ptrSec;
          existingKey.ptrHSecRural = curr.ptrHSec;
          existingKey.ptrTotal = curr.ptrTotal;
        } else if (curr.locationCode === "2") {
          // Urban
          existingKey.ptrPrePryUrban = curr.ptrPrePry;
          existingKey.ptrPryUrban = curr.ptrPry;
          existingKey.ptrUPryUrban = curr.ptrUPry;
          existingKey.ptrSecUrban = curr.ptrSec;
          existingKey.ptrHSecUrban = curr.ptrHSec;
          existingKey.ptrTotal = curr.ptrTotal;
        }
      } else {
        const newItem = {
          regionName: curr.regionName,
          ptrPrePry: curr.ptrPrePry,
          ptrPry: curr.ptrPry,
          ptrUPry: curr.ptrUPry,
          ptrSec: curr.ptrSec,
          ptrHSec: curr.ptrHSec,
          ptrTotal: curr.ptrTotal,
          ptrPrePryRural: curr.locationCode === "1" ? curr.ptrPrePry : "0.00",
          ptrPryRural: curr.locationCode === "1" ? curr.ptrPry : "0.00",
          ptrUPryRural: curr.locationCode === "1" ? curr.ptrUPry : "0.00",
          ptrSecRural: curr.locationCode === "1" ? curr.ptrSec : "0.00",
          ptrHSecRural: curr.locationCode === "1" ? curr.ptrHSec : "0.00",
          ptrPrePryUrban: curr.locationCode === "2" ? curr.ptrPrePry : "0.00",
          ptrPryUrban: curr.locationCode === "2" ? curr.ptrPry : "0.00",
          ptrUPryUrban: curr.locationCode === "2" ? curr.ptrUPry : "0.00",
          ptrSecUrban: curr.locationCode === "2" ? curr.ptrSec : "0.00",
          ptrHSecUrban: curr.locationCode === "2" ? curr.ptrHSec : "0.00",
        };
        acc.push(newItem);
      }
      setIsLoading(false);
      return acc;
    }, []);

    const mergedDatasMgt = data?.reduce((acc, curr) => {
      const standardizedKey = curr.schManagementBroad
        ?.replace(/\./g, "")
        ?.replace(/\s/g, "");

      const existingKeyIndex = acc.findIndex(
        (item) => item.regionName === curr.regionName && item[standardizedKey]
      );

      if (existingKeyIndex !== -1) {
        acc[existingKeyIndex][standardizedKey] = (
          parseFloat(acc[existingKeyIndex][standardizedKey] || 0) +
          parseFloat(curr.ptrTotal)
        ).toFixed(2);
      } else {
        const newItem = {
          regionName: curr.regionName,

          schManagementBroad: curr.schManagementBroad,
          [standardizedKey]: parseFloat(curr.ptrTotal).toFixed(2),
        };
        acc.push(newItem);
      }

      return acc;
    }, []);

    const mergedDataMgtLocation = data?.reduce((acc, curr) => {
      const existingKey = acc.find(
        (item) =>
          item.regionName === curr.regionName &&
          item.schManagementBroad === curr.schManagementBroad
      );

      if (existingKey) {
        if (curr.locationCode === "1") {
          // Rural
          existingKey.ptrTotalRural = (
            parseFloat(existingKey.ptrTotalRural) + parseFloat(curr.ptrTotal)
          ).toFixed(2);
        } else if (curr.locationCode === "2") {
          // Urban
          existingKey.ptrTotalUrban = (
            parseFloat(existingKey.ptrTotalUrban) + parseFloat(curr.ptrTotal)
          ).toFixed(2);
        }
      } else {
        const newItem = {
          regionName: curr.regionName,
          schManagementBroad: curr.schManagementBroad,
          ptrTotalRural: curr.locationCode === "1" ? curr.ptrTotal : "0.00",
          ptrTotalUrban: curr.locationCode === "2" ? curr.ptrTotal : "0.00",
        };
        acc.push(newItem);
      }

      return acc;
    }, []);

    const grouped1 = groupData(mergedData, groupKeys);
    const grouped2 = groupData(mergedDatasMgt, groupKeys);
    const grouped3 = groupData(mergedDataMgtLocation, groupKeys);
    setArrGroupedGraphData(grouped1);
    setArrGroupedData(grouped1);
    setCloneFilterDatas(grouped1);
    setColumnVisibility(grouped1);
    if (groupKeys.schManagementBroad && groupKeys.schLocationDesc === false) {
      setArrGroupedGraphData(grouped2);
      setArrGroupedData(grouped2);
      setCloneFilterDatas(grouped2);
      setColumnVisibility(grouped2);
    }
    if (groupKeys.schManagementBroad && groupKeys.schLocationDesc) {
      setArrGroupedGraphData(grouped3);
      setArrGroupedData(grouped3);
      setCloneFilterDatas(grouped3);
      setColumnVisibility(grouped3);
    }
  }, [groupKeys, data]);

  const countTotalPinnedWithRight = (obj) => {
    let total = 0;
    for (const key in obj) {
      if (!key.includes("Total")) {
        const value = obj[key];
        if (Number.isInteger(value)) {
          total += value;
        }
      }
    }
    return total;
  };

  const handleFilterClick = useCallback((type, detailType) => {
    setGroupKeys((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (type === "School Management") {
        newFilters.schManagementBroad =
          detailType === "broad"
            ? !prevFilters.schManagementBroad
            : prevFilters.schManagementBroad;
        newFilters.schCategoryBroad = false;
        newFilters.schLocationDesc = false;
      } else if (type === "School Category") {
        newFilters.schCategoryBroad =
          detailType === "broad"
            ? !prevFilters.schCategoryBroad
            : prevFilters.schCategoryBroad;
        newFilters.schManagementBroad = false;
        newFilters.schLocationDesc = false;
      } else if (type === "Urban/Rural") {
        newFilters.schLocationDesc = !prevFilters.schLocationDesc;
      }
      return newFilters;
    });
  }, []);

  const switchColumnsToRow = (e, flag = false) => {
    setShowTransposeds(false);
    if (flag || !showTransposed) {
      let arr = [];
      const uniqueKeys = new Set();
      let customColumnName = "";
      if (groupKeys.schManagementBroad && groupKeys.schLocationDesc === false) {
        cloneFilterDatas?.forEach((row) => {
          let location = row.regionName;
          let schManagementBroad = row.ptrTotal;
          // Central Government
          // Add keys to the uniqueKeys set if they are not null
          if (row.StateGovernment !== undefined)
            uniqueKeys.add("StateGovernment");
          if (row.GovtAided !== undefined) uniqueKeys.add("GovtAided");
          if (row.PrivateUnaided !== undefined)
            uniqueKeys.add("PrivateUnaided");
          if (row.CentralGovernment !== undefined)
            uniqueKeys.add("CentralGovernment");
          const existingDataIndex = arr.findIndex(
            (data) =>
              data["Location"] === location &&
              data["School Management(Broad)"] === schManagementBroad
          );

          if (existingDataIndex !== -1) {
            if (row.StateGovernment !== undefined) {
              arr[existingDataIndex]["StateGovernment"] =
                (arr[existingDataIndex]["StateGovernment"] || 0) +
                parseFloat(row.StateGovernment);
            }
            if (row.GovtAided !== undefined) {
              arr[existingDataIndex]["GovtAided"] =
                (arr[existingDataIndex]["GovtAided"] || 0) +
                parseFloat(row.GovtAided);
            }
            if (row.PrivateUnaided !== undefined) {
              arr[existingDataIndex]["PrivateUnaided"] =
                (arr[existingDataIndex]["PrivateUnaided"] || 0) +
                parseFloat(row.PrivateUnaided);
            }
            if (row.CentralGovernment !== undefined) {
              arr[existingDataIndex]["CentralGovernment"] =
                (arr[existingDataIndex]["CentralGovernment"] || 0) +
                parseFloat(row.CentralGovernment);
            }
          } else {
            let newData = {
              Location: location,
              "School Management(Broad)": schManagementBroad,
            };
            if (row.StateGovernment !== undefined)
              newData["StateGovernment"] = row.StateGovernment;
            if (row.GovtAided !== undefined)
              newData["GovtAided"] = row.GovtAided;
            if (row.PrivateUnaided !== undefined)
              newData["PrivateUnaided"] = row.PrivateUnaided;
            if (row.CentralGovernment !== undefined)
              newData["CentralGovernment"] = row.CentralGovernment;

            arr.push(newData);
          }
        });
      } else if (groupKeys.schManagementBroad && groupKeys.schLocationDesc) {
        cloneFilterDatas.forEach((row) => {
          const {
            regionName: location,
            schManagementBroad,
            ptrTotalRural,
            ptrTotalUrban,
          } = row;
          let existingData = arr.find((data) => data["Location"] === location);
          if (!existingData) {
            existingData = { Location: location };
            arr.push(existingData);
          }
          if (schManagementBroad === "State Government") {
            if (ptrTotalRural !== undefined)
              existingData["StateptrTotalRural"] = parseFloat(ptrTotalRural);
            if (ptrTotalUrban !== undefined)
              existingData["StateptrTotalUrban"] = parseFloat(ptrTotalUrban);
          } else if (schManagementBroad === "Govt. Aided") {
            if (ptrTotalRural !== undefined)
              existingData["GovtptrTotalRural"] = parseFloat(ptrTotalRural);
            if (ptrTotalUrban !== undefined)
              existingData["GovtptrTotalUrban"] = parseFloat(ptrTotalUrban);
          } else if (schManagementBroad === "Private Unaided") {
            if (ptrTotalRural !== undefined)
              existingData["PrivateptrTotalRural"] = parseFloat(ptrTotalRural);
            if (ptrTotalUrban !== undefined)
              existingData["PrivateptrTotalUrban"] = parseFloat(ptrTotalUrban);
          }
        });
      }

      const columnHeaders = [
        "S.NO.",
        ...(!filter_query_by_location ? [] : ["Location"]),
        "School Management(Broad)",
        ...Array.from(uniqueKeys),
        // "Total"
      ];

      if (groupKeys.schManagementBroad && groupKeys.schLocationDesc === false) {
        setColumn(
          columnHeaders.map((header, idx) => {
            if (idx !== 0) {
              return {
                headerName: header.replace(/([A-Z])/g, " $1").trim(),
                field: header,
                cellClass: idx > 1 ? "rightAligned" : "",
                hide: header === "School Management(Broad)",
              };
            } else {
              return {
                hide: true,
                headerName: header,
                field: header?.replace(/\./g, ""),
              };
            }
          })
        );
      } else if (groupKeys.schManagementBroad && groupKeys.schLocationDesc) {
        setColumn((prevColumns) => {
          const locationExists = prevColumns.some(
            (col) => col.headerName === "Location"
          );
          const updatedColumns = !locationExists
            ? [
                ...prevColumns,
                {
                  headerName: "Location",
                  field: "Location",
                  hide: !filter_query_by_location,
                },
              ]
            : prevColumns;

          return updatedColumns.map((col) => {
            const managementCategories = {
              "State Government": {
                ruralField: "StateptrTotalRural",
                urbanField: "StateptrTotalUrban",
              },
              "Govt Aided": {
                ruralField: "GovtptrTotalRural",
                urbanField: "GovtptrTotalUrban",
              },
              "Private Unaided": {
                ruralField: "PrivateptrTotalRural",
                urbanField: "PrivateptrTotalUrban",
              },
              "Central Government": {
                ruralField: "CentralptrTotalRural",
                urbanField: "CentralptrTotalUrban",
              },
              Others: {
                ruralField: "OthersptrTotalRural",
                urbanField: "OthersptrTotalUrban",
              },
            };

            if (managementCategories[col.headerName]) {
              return {
                ...col,
                hide: false,
                children: [
                  {
                    headerName: "Urban",
                    field: managementCategories[col.headerName].urbanField,
                    hide: false,
                  },
                  {
                    headerName: "Rural",
                    field: managementCategories[col.headerName].ruralField,
                    hide: false,
                  },
                ],
              };
            } else {
              return col;
            }
          });
        });
      }
      const newArr = arr.map((item, idx) => ({
        ...item,
        // Overall: countTotalPinnedWithRight(item),
        "Serial Number": idx + 1,
      }));

      setArrGroupedData(newArr);
      setArrGroupedGraphData(newArr);
    } else {
      setArrGroupedData(cloneFilterDatas);
      setArrGroupedGraphData(cloneFilterDatas);
      setColumn([
        {
          headerName: "S.NO.",
          field: "Serial Number",
          hide: true,
          suppressColumnsToolPanel: true,
          suppressFiltersToolPanel: true,
        },
        {
          headerName: "Location",
          field: "regionName",
          hide: !filter_query_by_location,
        },
        {
          headerName: "School Management(Broad)",
          field: "ptrTotal",
          suppressColumnsToolPanel: true,
          hide: false,
        },
      ]);
    }
  };

  useEffect(() => {
    if (!showTransposed) {
      const appendedObj = {};
      const removefirstTwoColumns = columns.slice(2);
      removefirstTwoColumns.forEach((item) => {
        if (item.field === customColumnNames) {
          appendedObj[item.field] = "Total";
        } else if (item.field === customColumnNames) {
          appendedObj[item.field] = "";
        } else {
          appendedObj[item.field] = calculateTotal(item.field);
        }
      });
      setPinnedBottomRowDataByRow([appendedObj]);
    }
  }, [columns]);
  const getLastTrueToShowTotal = () => {
    const lastTrueKey = Object.keys(groupKeys)?.reduce((lastKey, key) => {
      if (groupKeys[key]) {
        return key;
      }
      return lastKey;
    }, null);
    return lastTrueKey;
  };

  function calculateTotal(fieldName) {
    if (!arrGroupedData) return 0;
    return arrGroupedData.reduce(
      (total, row) => total + parseFloat(row[fieldName] || 0),
      0
    );
  }

  // const pinedBottomRowDatas = [
  //   {
  //     ...(getLastTrueToShowTotal()
  //       ? { [getLastTrueToShowTotal()]: "Total" }
  //       : { regionName: "Total" }),
  //     totSch: calculateTotal("totSch"),
  //   },
  // ];

  // Function to filter keys with decimal values
  const getDecimalValues = (data) => {
    return data.map((item) => {
      return Object.entries(item).reduce((acc, [key, value]) => {
        if (!isNaN(value) && value !== null && value.toString().includes(".")) {
          acc[key] = value;
        }
        return acc;
      }, {});
    });
  };

  const pinedBottomRowDatas = getDecimalValues(pinnedData).map(
    (filteredItem) => ({
      ...(getLastTrueToShowTotal()
        ? { [getLastTrueToShowTotal()]: "Total" }
        : { regionName: "Total" }),
      totSch: calculateTotal("totSch"),
      ...filteredItem,
    })
  );

  /*------------Export data to Excel and PDF-------------*/
  const getHeaderToExport = (gridApi) => {
    const columns = gridApi.api.getAllDisplayedColumns();
    const headerCellSerialNumber = {
      text: "Serial Number",
      headerName: "S.NO.",
      bold: true,
      margin: [0, 12, 0, 0],
    };
    // const headerCellLocation = {
    //   text: stateName,
    //   headerName: "Location",
    //   bold: true,
    //   margin: [0, 12, 0, 0],
    // };
    const headerRow = columns.map((column) => {
      const { field, headerName } = column.getColDef();
      const sort = column.getSort();
      const headerNameUppercase = field[0].toUpperCase() + field.slice(1);
      const headerCell = {
        text: headerNameUppercase + (sort ? ` (${sort})` : ""),
        headerName: headerName,
        bold: true,
        margin: [0, 12, 0, 0],
      };
      return headerCell;
    });
    headerRow.unshift(headerCellSerialNumber);
    // if (stateName !== "State Wise") {
    //   headerRow.push(headerCellLocation);
    // }
    return headerRow;
  };
  const getRowsToExport = (gridApi) => {
    const columns = gridApi.api.getAllDisplayedColumns();
    const getCellToExport = (column, node) => ({
      text: gridApi.api.getValue(column, node) ?? "",
    });
    const rowsToExport = [];
    gridApi.api.forEachNodeAfterFilterAndSort((node) => {
      const rowToExport = [];
      rowToExport.push({ text: rowsToExport.length + 1 });
      columns.forEach((column) => {
        rowToExport.push(getCellToExport(column, node));
      });
      rowsToExport.push(rowToExport);
    });
    return rowsToExport;
  };
  const getDocument = (gridApi) => {
    const headerRow = getHeaderToExport(gridApi);
    const rows = getRowsToExport(gridApi);
    const pinnedBottomRowData =
      (local_state !== "All India/National" && local_state === "State Wise") ||
      local_district === "District Wise" ||
      local_block === "Block Wise"
        ? pinedBottomRowDatas
        : [];
    const pinnedBottomRow = pinnedBottomRowData;
    const date = new Date();
    // const formattedDate = new Intl.DateTimeFormat("en-US", {
    //   weekday: "long",     // Full day name (e.g., Friday)
    //   year: "numeric",
    //   day: "2-digit",

    //   month: "short",
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: true,
    // }).format(date);

    const formattedDate = `${date.toLocaleDateString("en-GB", {
      weekday: "long", // Full day name (e.g., Friday)
    })}, ${date.toLocaleDateString("en-GB", {
      day: "2-digit", // Day of the month (e.g., 13)
      month: "long", // Full month name (e.g., September)
      year: "numeric", // Full year (e.g., 2024)
    })}, ${date.toLocaleTimeString("en-US", {
      hour: "2-digit", // Hour (e.g., 10)
      minute: "2-digit", // Minutes (e.g., 25)
      hour12: true, // 12-hour format with AM/PM
    })}`;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [12, 20],
    });
    // Function to add header
    const addHeader = () => {
      doc.setFontSize(22);
      doc.setTextColor("black");
      doc.setFont("Helvetica", "bold");
      // doc.text("UDISE+", 0.6, 1);

      // Add the header text
      doc.text(
        "Unified District Information System for Education",
        doc.internal.pageSize.width / 2,
        0.7,
        {
          fontStyle: "bold",

          color: "black",
          align: "center",
        }
      );
      doc.setFont("Helvetica", "normal");

      doc.setFontSize(18);

      doc.text(
        "Department of School Education & Literacy, Ministry of Education, Government of India",
        doc.internal.pageSize.width / 2,
        1.1,
        {
          // fontStyle: '',
          color: "black",
          align: "center",
        }
      );

      doc.setFont("Helvetica", "bold");

      doc.setTextColor("black");
      doc.setFontSize(20);

      doc.text(`${report.report_name}`, doc.internal.pageSize.width / 2, 1.5, {
        fontSize: 12,
        fontStyle: "bold",

        color: "black",
        align: "center",
      });

      doc.setFont("Helvetica", "bold");

      doc.setTextColor("black");
      doc.setFontSize(20);

      // doc.text(`${stateName}`, doc.internal.pageSize.width / 2, 1.7, {
      //   fontSize: 12,
      //   color: "black",
      //   align: "center",
      // });

      doc.setFont("bold");

      doc.setTextColor("black");
      doc.setFontSize(20);

      doc.text(
        `Academic Year : ${local_year}`,
        doc.internal.pageSize.width / 2,
        1.9,
        {
          fontSize: 12,
          color: "black",
          align: "center",
        }
      );

      const textContent = generateTextContent(
        stateName,
        nationalWiseName,
        stateWiseName,
        local_district,
        district,
        districtWiseName,
        local_block,
        block,
        blockWiseName
      );

      if (textContent) {
        doc.text(textContent, doc.internal.pageSize.width / 2, 2.3, {
          fontSize: 12,
          color: "black",
          align: "center",
        });
      }

      // Set the margin for the image from the left
      const leftMargin = 0.1; // Margin from the left (in inches)
      const topLeftX = leftMargin; // X position from the left including margin
      const topLeftY = 0; // Y position from the top (in inches)
      const imgWidth = 2; // Image width (in inches)
      const imgHeight = 2; // Image height (in inches)

      doc.setFontSize(20);
      doc.setTextColor("blue");

      // Add the satyameva image with the specified left margin
      doc.addImage(
        satyamevaimg,
        "PNG",
        topLeftX,
        topLeftY,
        imgWidth,
        imgHeight
      );

      doc.setTextColor("blue");
      doc.setFont("bold");

      // Get page dimensions
      const pageWidthE = doc.internal.pageSize.getWidth();
      const pageHeightE = doc.internal.pageSize.getHeight();

      const imgWidthE = 2.8; // Image width (in inches)
      const imgHeightE = 1.4; // Image height (in inches)
      const marginRight = 0.7; // Right margin (in inches)

      // Calculate x position for top-right corner
      const topRightX = pageWidthE - imgWidthE - marginRight;
      const topRightY = 0.3; // Y position from the top (in inches)

      // Add the education image at the top-right corner
      doc.addImage(
        udise,
        "JPG",
        topRightX, // X position for top-right
        topRightY, // Y position for top-right
        imgWidthE,
        imgHeightE
      );
    };
    // Function to add footer
    const addFooter = () => {};
    const secondRow = [{ content: "", colSpan: 1 }];
    columns?.children?.forEach((category) => {
      secondRow.push({
        content: category.headerName,
        colSpan: category.children.length,
        styles: { halign: "center" },
      });
    });
    const table = [];
    table.push(headerRow.map((cell) => cell.headerName));
    rows.forEach((row) => {
      table.push(row.map((cell) => cell.text));
    });
    if (pinnedBottomRow && pinnedBottomRow.length > 0) {
      pinnedBottomRow.forEach((row) => {
        const totalRow = headerRow.map((header) => {
          let field = header.text;
          if (
            row.hasOwnProperty(field.charAt(0).toLowerCase() + field.slice(1))
          ) {
            field = field.charAt(0).toLowerCase() + field.slice(1);
          } else if (
            row.hasOwnProperty(field.charAt(0).toUpperCase() + field.slice(1))
          ) {
            field = field.charAt(0).toUpperCase() + field.slice(1);
          }
          return row[field] !== undefined ? row[field].toString() : "";
        });

        table.push(totalRow);
      });
    }
    addHeader();

    const headers = [];

    if (groupKeys.schCategoryBroad && groupKeys.schLocationDesc === true) {
      headers.push([
        {
          content: "",
          colSpan:
            local_state === "State Wise" ||
            local_district === "District Wise" ||
            local_block === "Block Wise"
              ? 2
              : 1,
          styles: { halign: "center" },
        },
        { content: "Pre-Primary", colSpan: 2, styles: { halign: "center" } },
        { content: "Primary", colSpan: 2, styles: { halign: "center" } },
        { content: "Upper Primary", colSpan: 2, styles: { halign: "center" } },
        { content: "Secondary", colSpan: 2, styles: { halign: "center" } },
        {
          content: "Higher Secondary",
          colSpan: 2,
          styles: { halign: "center" },
        },
        // { content: '', colSpan: 1, styles: { halign: 'center' } },
      ]);
    }
    if (
      groupKeys.schManagementBroad === true &&
      groupKeys.schLocationDesc === true
    ) {
      headers.push([
        {
          content: "",
          colSpan:
            local_state === "State Wise" ||
            local_district === "District Wise" ||
            local_block === "Block Wise"
              ? 2
              : 1,
          styles: { halign: "center" },
        },
        {
          content: "State Government",
          colSpan: 2,
          styles: { halign: "center" },
        },
        { content: "Govt Aided", colSpan: 2, styles: { halign: "center" } },
        {
          content: "Private Unaided",
          colSpan: 2,
          styles: { halign: "center" },
        },
      ]);
    }
    const thirdRow = [{ content: "", styles: { halign: "center" } }];

    table[0].forEach((header) => {
      thirdRow.push({ content: header, styles: { halign: "center" } });
    });

    thirdRow.shift({ content: "", colSpan: 1 });

    headers.push(thirdRow);
    doc.autoTable({
      head: groupKeys.schLocationDesc === false ? [table[0]] : headers,
      //  head: [table[0]],
      body: table.slice(1),
      theme: "grid",
      startY: 2.7,
      styles: {
        cellPadding: 0.15, // Adjust cell padding if needed
        lineColor: [0, 0, 0], // Set border color (black in this case)
        lineWidth: 0.001, // Set border width
        fillColor: [255, 255, 255], // Default background color (white)
        textColor: [0, 0, 0],
      },
      headStyles: {
        fontSize: 14, // Set the font size for the header row
        fontStyle: "bold", // Make the header text bold (optional)
        textColor: [0, 0, 0],
        cellPadding: 0.2, // Set text color for the header row
      },

      didParseCell: function (data) {
        const headerRow = getHeaderToExport(gridApi); // Get the header row

        // Get the header text for this column
        const columnHeaderText = headerRow[data.column.index]?.text;
        // Check if the current column header is "Serial Number"
        if (columnHeaderText === "Serial Number") {
          data.cell.styles.halign = "center"; // Center-align the content for "Serial Number"
        } else if (
          columnHeaderText === "RegionName" ||
          columnHeaderText === "Location"
        ) {
          data.cell.styles.halign = "left"; // Center-align the content for "Serial Number"
        } else if (columnHeaderText === "Location") {
          data.cell.styles.halign = "left"; // Center-align the content for "Serial Number"
        } else {
          data.cell.styles.halign = "right";
        }
      },

      afterPageContent: addFooter,
    });

    const totalPages = doc.internal.getNumberOfPages();
    doc.page = 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor("black");
      doc.text(
        `Page ${i} of ${totalPages}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 0.2,
        { align: "center", color: "black" }
      );

      doc.text(
        `Report generated on : ${formattedDate}`,
        doc.internal.pageSize.width - 1,
        doc.internal.pageSize.height - 0.2,
        { fontSize: 12, align: "right", color: "black" }
      );
    }

    for (let i = 0; i < totalPages; i++) {
      doc.setPage(i + 1);
      doc.autoTable({
        startY: 3.5,
      });
    }
    return doc;
  };
  const exportToPDF = () => {
    const doc = getDocument(gridApi);
    doc.save(`${report.report_name}.pdf`);
  };
  const exportToExcel = () => {
    if (gridApi) {
      const allData = [];
      const visibleColumns = gridApi.api.getAllDisplayedColumns();
      const columnHeaders = visibleColumns.map((column) => ({
        headerName: column.getColDef().headerName,
        field: column.getColDef().field,
      }));
      columnHeaders.unshift({
        headerName: "S.NO.",
        field: "Serial Number",
      });
      gridApi?.api?.forEachNode((node, index) => {
        const data = node.data;
        const rowDataWithSerial = { ...data, "Serial Number": index + 1 };
        allData.push(rowDataWithSerial);
      });
      const columnKeys = columnHeaders.map((column) => column.field);
      const columnNames = columnHeaders.map((column) => column.headerName);
      gridApi?.api?.exportDataAsExcel({
        processCellCallback: (params) => {
          return params.value;
        },
        rowData: allData,
        fileName: report.report_name,
        sheetName: "Udise+",
        columnKeys: columnKeys,
        columnNames: columnNames,
      });
    }
  };
  const handleExportData = (e) => {
    const { value } = e.target;
    if (value === "export_pdf") {
      exportToPDF();
    }
    if (value === "export_excel") {
      exportToExcel();
    }
    document.getElementById("export_data").selectedIndex = 0;
  };

  useEffect(() => {
    if (groupKeys.schManagementBroad)
      if (cloneFilterDatas.length > 0) {
        setShowTransposeds((prevShowTransposed) => {
          if (!prevShowTransposed) {
            switchColumnsToRow(true);
          }
          return true;
        });
      }
  }, [cloneFilterDatas, location.pathname]);

  useEffect(() => {
    setColumn((prevColumns) =>
      prevColumns.map((column) => {
        if (column.field === "regionName") {
          return {
            ...column,
            hide: !filter_query_by_location,
          };
        }
        return column;
      })
    );
  }, [filter_query_by_location, groupKeys]);
  //handle tabs table chart about
  dispatch(handleActiveTabs(activeTab));

  // enable disable State District and Block tab
  const storedStateWise = useMemo(
    () => localStorage.getItem("map_state_name"),
    []
  );
  const storedDistrictWise = useMemo(
    () => localStorage.getItem("map_district_name"),
    []
  );

  const [isStateTabEnabled, setIsStateTabEnabled] = useState(true);
  const [isDistrictTabEnabled, setIsDistrictTabEnabled] = useState(false);
  const [isBlockTabEnabled, setIsBlockTabEnabled] = useState(false);

  useEffect(() => {
    if (["State Wise", "All India/National"].includes(storedStateWise)) {
      setIsStateTabEnabled(true);
      setIsDistrictTabEnabled(false);
      setIsBlockTabEnabled(false);
    } else if (["District"].includes(storedDistrictWise)) {
      setIsStateTabEnabled(false);
      setIsDistrictTabEnabled(true);
      setIsBlockTabEnabled(false);
    } else {
      setIsStateTabEnabled(false);
      setIsDistrictTabEnabled(false);
      setIsBlockTabEnabled(true);
    }
  }, [schoolFilter]);
  // ..........................Graph code......................................

  useEffect(() => {
    if (headerSliceData === "table") {
      window.localStorage.setItem("state", "All India/National");
      window.localStorage.setItem("map_state_name", "All India/National");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear2007);
      dispatch(fetchArchiveServicesPtR(initialFilterPtRData));
    }
    if (headerSliceData === "graph") {
      window.localStorage.setItem("state", "State Wise");
      window.localStorage.setItem("map_state_name", "State Wise");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear2007);
      setGroupKeys((prevKeys) => ({
        ...prevKeys,
        schManagementBroad: false,
        schCategoryBroad: true,
        schLocationDesc: false,
      }));
      handleButtonClickGraph("School Category", "broad");
      dispatch(fetchArchiveServicesPtR(initialFilterPtRDataStateWise));
      dispatch(fetchArchiveServicesPtRYears(initialFilterPtRData));
      dispatch(
        fetchArchiveServicesPtRYearsManagementWise(initialFilterPtrDataYearWise)
      );
    }
  }, [headerSliceData, dispatch]);
  useEffect(() => {
    if (headerSliceData === "graph" && Array?.isArray(school_data)) {
      setStateWiseData(school_data);
    }
  }, [headerSliceData, school_data]);

  useEffect(() => {
    if (headerSliceData === "graph" && stateWiseData.length > 0) {
      const sortedTopFiveStates = [...stateWiseData]
        .sort((a, b) => parseFloat(a.ptrTotal) - parseFloat(b.ptrTotal))
        .slice(0, 5);
      setTopFiveData(sortedTopFiveStates);
    } else if (headerSliceData !== "graph") {
      setTopFiveData([]);
    }
  }, [headerSliceData, stateWiseData]);

  const categories = topFiveData.map((data) => data.regionName);
  const availableData = topFiveData.map((data) => parseFloat(data.ptrTotal));
  const notAvailableData = topFiveData.map(
    (data) => 100 - parseFloat(data.ptrTotal)
  );

  /*<><><><><><><><><><>-------Tree Graph--------<><><><><><><><><><><><>*/

  const [limit] = useState(5);
  const currentIndex = useSelector((state) => state.header.currentIndex);

  function getColorCode(percentage) {
    const colorRanges = [
      { min: 18, color: "#BCE263" },
      { min: 7, max: 12.99, color: "#F5BF55" },
      { min: 0, max: 3.99, color: "#E6694A" },
    ];
    for (let range of colorRanges) {
      if (
        percentage >= range.min &&
        (range.max === undefined || percentage <= range.max)
      ) {
        return range.color;
      }
    }
    return "#E6694A";
  }

  const handlePupilTeacherRatioByTabChange = (e) => {
    setPupilTeacherRatioBy(e);
    if (e === "School Management") {
      handleButtonClickGraph("School Management", "broad", e);
    } else {
      handleButtonClickGraph("School Category", "broad", e);
    }
  };

  let count = 1;
  arrGroupedGraphData.sort((a, b) => {
    return b.ptrTotal - a.ptrTotal;
  });

  const limitedData = arrGroupedGraphData.slice(
    currentIndex,
    currentIndex + limit
  );
  // Pupil Teacher Ratio Overview  By School Category

  const formattedData = limitedData?.map((item, key) => {
    let regionName = {
      id: item.regionName,

      parent: "INDIA",
      name: `${item.regionName} ${item.ptrTotal || 0}`,
      value: item.ptrTotal,
      color: getColorCode(item.ptrTotal),
    };
    let ptrHSec = {
      id: ++count,
      parent: item.regionName,
      name: `Higher Secondary ${item.ptrHSec || 0}`,
      value: item.ptrHSec,
      color: getColorCode(item.ptrHSec),
    };
    let ptrPrePry = {
      id: ++count,
      parent: item.regionName,
      name: `Pre-Primary ${item.ptrPrePry || 0}`,
      value: item.ptrPrePry,
      color: getColorCode(item.ptrPrePry),
    };

    let ptrPry = {
      id: ++count,
      parent: item.regionName,

      name: `Primary ${item.ptrPry || 0}`,
      value: item.ptrPry,
      color: getColorCode(item.ptrPry),
    };
    let ptrSec = {
      id: ++count,
      parent: item.regionName,
      name: `Secondary ${item.ptrSec || 0}`,
      value: item.ptrSec,
      color: getColorCode(item.ptrSec),
    };
    let ptrUPry = {
      id: ++count,
      parent: item.regionName,
      name: `Upper Primary ${item.ptrUPry || 0}`,
      value: item.ptrUPry,
      color: getColorCode(item.ptrUPry),
    };
    return [regionName, ptrHSec, ptrPrePry, ptrPry, ptrSec, ptrUPry];
  });

  useEffect(() => {
    const updatedData = arrGroupedGraphData.map((entry) => {
      const stateGovernment = parseFloat(entry.StateGovernment);
      const govtAided = parseFloat(entry.GovtAided);
      const privateUnaided = parseFloat(entry.PrivateUnaided);

      const total =
        (isNaN(stateGovernment) ? 0 : stateGovernment) +
        (isNaN(govtAided) ? 0 : govtAided) +
        (isNaN(privateUnaided) ? 0 : privateUnaided);

      return {
        ...entry,
        Total: total.toFixed(2),
      };
    });

    setArrGroupedGraphWithTotalKey(updatedData);
  }, [pupilTeacherRatioBy, arrGroupedGraphData]);

  arrGroupedGraphWithTotalKey.sort((a, b) => {
    return b.Total - a.Total;
  });

  const limitedData1 = arrGroupedGraphWithTotalKey.slice(
    currentIndex,
    currentIndex + limit
  );

  // Pupil Teacher Ratio Overview  By School Management

  const formattedData1 = limitedData1?.map((item) => {
    let Location = {
      ...item,
      id: item?.Location,
      parent: "INDIA",
      name: `${item.Location} ${item.Total || 0}`,

      color: getColorCode(item.Total),
    };
    let GovtAided = {
      id: ++count,
      parent: item?.Location,
      name: `Govt Aided ${item?.GovtAided || 0}`,
      color: getColorCode(item.GovtAided),
    };
    let PrivateUnaided = {
      id: ++count,
      parent: item?.Location,
      name: ` Private Unaided ${item?.PrivateUnaided || 0}`,
      value: item?.PrivateUnaided,
      color: getColorCode(item.PrivateUnaided),
    };

    let StateGovernment = {
      // ...item,
      id: ++count,
      parent: item?.Location,
      name: ` State Government ${item?.StateGovernment || 0}`,
      value: item?.StateGovernment,
      color: getColorCode(item.StateGovernment),
    };

    return [Location, GovtAided, PrivateUnaided, StateGovernment];
  });

  const FinalData = formattedData.flat();
  const FinalData1 = formattedData1.flat();

  FinalData.unshift({
    id: "INDIA",
    parent: "",
    name: "INDIA",
    color: "#EBEBEB",
  });
  FinalData1.unshift({
    id: "INDIA",
    parent: "",
    name: "INDIA",
    color: "#EBEBEB",
  });

  const handleNext = () => {
    if (currentDataTreeLength >= limit && currentIndex < 38 - limit) {
      dispatch(handleCurrentIndex(currentIndex + limit));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      dispatch(handleCurrentIndex(currentIndex - limit));
    }
  };
  const countAllChildNodes = (node) => {
    let counts = 0;
    const countChildren = (n) => {
      if (n?.children) {
        counts += n.children.length;
        n.children.forEach(countChildren);
      }
    };
    countChildren(node);
    return counts;
  };

  const handleNodeClick = (e) => {
    const node = e.point;
    const childNodesCount = countAllChildNodes(node);
    const pixelValue = 40;
    let newHeight = chartHeight;

    if (node.collapsed) {
      newHeight += childNodesCount * pixelValue;
    } else {
      newHeight -= childNodesCount * pixelValue;
    }
    setChartHeight(newHeight);
  };

  const higherSecData = school_data_Years?.map((item) =>
    parseFloat(item.ptrHSec)
  );

  const secData = school_data_Years?.map((item) => parseFloat(item.ptrSec));

  const uprPriData = school_data_Years?.map((item) => parseFloat(item.ptrUPry));

  const priData = school_data_Years?.map((item) => parseFloat(item.ptrPry));

  const prePriData = school_data_Years?.map((item) =>
    parseFloat(item.ptrPrePry)
  );
  // Use `arrGroupedData` as the source data and apply the `handleMissingData` function to replace null values with "0".
  // The `handleMissingData` function is used to process data and ensure missing values are replaced,
  // which is then displayed in AG Grid using the processed data.

  const pinnedBottomRowData =
    (local_state !== "All India/National" && local_state === "State Wise") ||
    local_district === "District Wise" ||
    local_block === "Block Wise"
      ? pinedBottomRowDatas
      : [];
  return (
    <>
      {schData.isLoading && <GlobalLoading />}
      <section className="infrastructure-main-card p-0" id="content">
        <div className="bg-grey2 pb-0 pt-0 header-bar tab-for-graph">
          <div className="blue-strip">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-10 col-lg-10">
                  <div className="common-content text-start map-heading-map">
                    {report && (
                      <div className="common-content text-start map-heading-map d-flex align-items-center">
                        <span className="me-3">
                          {t("reports_id")}
                          {report.id}
                        </span>
                        <h2 className="heading-sm1 mb-0 mt-0">
                          {report.report_name}
                        </h2>
                      </div>
                    )}
                  </div>
                </div>
                {activeTab !== "about" && activeTab !== "graph" && (
                  <div className="col-md-2 col-lg-2">
                    <div className="select-infra button-group-filter">
                      <div className="indicator-select">
                        <select
                          id="export_data"
                          className="form-select bg-grey2"
                          onChange={handleExportData}
                          defaultValue={""}
                        >
                          <option className="option-hide">
                            {" "}
                            {t("download_report")}
                          </option>
                          <option value="export_pdf">
                            {t("download_as_pdf")}{" "}
                          </option>
                          <option value="export_excel">
                            {" "}
                            {t("download_as_excel")}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container pb-4">
            <div className="row">
              {activeTab !== "about" && activeTab !== "graph" && (
                <div className="col-md-12 col-lg-12 d-flex align-items-center">
                  <div className="tab-text-infra me-4">{t("view_data_by")}</div>
                  <ul className="nav nav-tabs mul-tab-main">
                    <li className={`nav-item ${multiCat}`}>
                      <button
                        type="button"
                        className={`nav-link dark-active1 ${cat}`}
                        onClick={(e) =>
                          handleButtonClick("School Category", "broad", e)
                        }
                      >
                        {t("school_category_board")}
                      </button>
                    </li>
                    <li className={`nav-item ${multiMgt}`}>
                      <button
                        type="button"
                        className={`nav-link dark-active ${mgt}`}
                        onClick={(e) =>
                          handleButtonClick("School Management", "broad", e)
                        }
                      >
                        {t("school_management_board")}
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${ur}`}
                        onClick={(e) =>
                          handleButtonClick("Urban/Rural", "broad", e)
                        }
                      >
                        {t("urban_rural")}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-grey ptb-30">
          <div className="container tab-for-graph">
            <div className="row align-items-center report-inner-tab">
              <div className="col-md-12 col-lg-12 table-text-i table-brud-card">
                {activeTab !== "about" && (
                  <h4 className="brudcrumb_heading">
                    {t("showing_result_for")}
                    <span>&nbsp;{local_state}</span>
                    <span className="material-icons-round">chevron_right</span>
                    {local_district !== "District" && (
                      <>
                        <span>{local_district}</span>
                        <span className="material-icons-round">
                          chevron_right
                        </span>
                      </>
                    )}
                    {local_block !== "Block" && (
                      <>
                        <span>{local_block}</span>
                        <span className="material-icons-round">
                          chevron_right
                        </span>
                      </>
                    )}

                    <span>{local_year}</span>
                  </h4>
                )}
                <Tabs
                  defaultActiveKey={type}
                  id="uncontrolled-tab-example"
                  className="nav-absolute"
                  onSelect={(k) => setActiveTab(k)}
                >
                  <Tab eventKey="about" title={t("about")}>
                    <div className="about-card mt-4">
                      <h2 className="heading-sm2 mb-2">{t("about_us")}</h2>
                      <p> {t("about_us_reports.report_2007.para1")}</p>
                      <p> {t("about_us_reports.report_2007.para2")}</p>
                      <p> {t("about_us_reports.report_2007.para3")}</p>
                      <p> {t("about_us_reports.report_2007.para4")}</p>
                    </div>
                  </Tab>

                  <Tab eventKey="table" title={t("table")}>
                    <div className="multi-header-table">
                      <div
                        className="multi-header-table ag-theme-material ag-theme-custom-height ag-theme-quartz h-300"
                        style={{ height: 450 }}
                      >
                        <AgGridReact
                          key={gridRefreshKey}
                          rowData={
                            arrGroupedDataTable ? arrGroupedDataTable : []
                          }
                          columnDefs={columns}
                          defaultColDef={defColumnDefs}
                          onColumnVisible={onColumnVisible}
                          onGridReady={onGridReady}
                          groupDisplayType="custom"
                          groupHideOpenParents={true}
                          loadingOverlayComponentFramework={GlobalLoading}
                          suppressServerSideFullWidthLoadingRow={true}
                          // pinnedBottomRowData={pinnedBottomRowData}
                          enableRangeSelection={true}
                        >
                          {isLoading && <GlobalLoading />}
                        </AgGridReact>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="graph" title={t("chart")}>
                    <div className="card-box-impact tab-for-graph report-1003 mt-4">
                      <div className="row">
                        <div className="col-md-6 col-lg-6">
                          <div className="impact-box-content-education">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("ptr_last_five_years")}
                              </h2>
                            </div>
                            <div className="piechart-box mt-4">
                              <HighchartsReact
                                highcharts={Highcharts}
                                options={{
                                  chart: {
                                    type: "line",
                                    marginTop: 50,
                                    events: {
                                      beforePrint: function () {
                                        this.exportSVGElements[0].box.hide();
                                        this.exportSVGElements[1].hide();
                                      },
                                      afterPrint: function () {
                                        this.exportSVGElements[0].box.show();
                                        this.exportSVGElements[1].show();
                                      },
                                    },
                                  },
                                  title: {
                                    text: t("ptr_last_five_years"),
                                  },

                                  xAxis: {
                                    categories: categoriesYear,
                                    gridLineWidth: 0, // Remove horizontal grid lines
                                    lineWidth: 0,
                                  },
                                  yAxis: {
                                    title: {
                                      text: "",
                                    },

                                    gridLineWidth: 0, // Remove horizontal grid lines
                                    lineWidth: 0,
                                  },

                                  plotOptions: {
                                    line: {
                                      dataLabels: {
                                        enabled: true,
                                        formatter: function () {
                                          return this.y.toLocaleString("en-IN");
                                        },
                                      },
                                    },
                                    series: {
                                      label: {
                                        connectorAllowed: false,
                                      },
                                      // pointStart: 2010,
                                    },
                                  },
                                  legend: {
                                    layout: "horizontal",
                                    align: "center",
                                    verticalAlign: "bottom",
                                    itemMarginTop: 10,
                                    itemMarginBottom: 10,

                                    symbolHeight: 12,
                                    symbolWidth: 8,
                                    symbolRadius: 10,
                                    squareSymbol: false,

                                    enabled: true,
                                  },
                                  credits: {
                                    enabled: false,
                                  },

                                  series: [
                                    {
                                      name: t("state_government"),
                                      data: stateGovernmentValues,
                                      color: "#E6694A",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                    {
                                      name: t("govt_aided"),
                                      data: govtAidedValues,
                                      color: "#F5BF55",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                    {
                                      name: t("privateUnaided"),
                                      data: privateUnaidedValues,
                                      color: "#751539",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                  ],
                                  exporting: {
                                    filename: t("ptr_last_five_years"),
                                    csv: {
                                      columnHeaderFormatter: function (item) {
                                        if (
                                          !item ||
                                          item instanceof Highcharts.Axis
                                        ) {
                                          return t("category");
                                        }
                                        return item.name;
                                      },
                                    },
                                  },
                                }}
                                // allowChartUpdate={true}
                                immutable={true}
                              />
                            </div>
                          </div>
                        </div>

                        {/* second value type  chart */}

                        <div className="col-md-6 col-lg-6">
                          <div className="impact-box-content-education">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("ptr_last_five_years_school_category")}
                              </h2>
                            </div>
                            <div className="piechart-box mt-4">
                              <HighchartsReact
                                highcharts={Highcharts}
                                options={{
                                  chart: {
                                    type: "line",
                                    marginTop: 50,
                                    events: {
                                      beforePrint: function () {
                                        this.exportSVGElements[0].box.hide();
                                        this.exportSVGElements[1].hide();
                                      },
                                      afterPrint: function () {
                                        this.exportSVGElements[0].box.show();
                                        this.exportSVGElements[1].show();
                                      },
                                    },
                                  },
                                  title: {
                                    text: t(
                                      "ptr_last_five_years_school_category"
                                    ),
                                  },

                                  xAxis: {
                                    categories: categoriesYear,
                                    gridLineWidth: 0, // Remove horizontal grid lines
                                    lineWidth: 0,
                                  },
                                  yAxis: {
                                    title: {
                                      text: "",
                                    },

                                    gridLineWidth: 0, // Remove horizontal grid lines
                                    lineWidth: 0,
                                  },
                                  plotOptions: {
                                    line: {
                                      dataLabels: {
                                        enabled: true,
                                        formatter: function () {
                                          return this.y.toLocaleString("en-IN");
                                        },
                                      },
                                    },
                                    series: {
                                      label: {
                                        connectorAllowed: false,
                                      },
                                      // pointStart: 2010,
                                    },
                                  },
                                  legend: {
                                    layout: "horizontal",
                                    align: "center",
                                    verticalAlign: "bottom",
                                    itemMarginTop: 10,
                                    itemMarginBottom: 10,

                                    symbolHeight: 12,
                                    symbolWidth: 8,
                                    symbolRadius: 10,
                                    squareSymbol: false,
                                    enabled: true,
                                  },
                                  credits: {
                                    enabled: false,
                                  },

                                  series: [
                                    {
                                      name: t("higher_secondary"),
                                      data: higherSecData,
                                      color: "#E6694A",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                    {
                                      name: t("secondary"),
                                      data: secData,
                                      color: "#F5BF55",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                    {
                                      name: t("primary"),
                                      data: priData,
                                      color: "#751539",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                    {
                                      name: t("upper_primary"),
                                      data: uprPriData,
                                      color: "#BCE263",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                  ],
                                  exporting: {
                                    filename: t(
                                      "ptr_last_five_years_school_category"
                                    ),
                                    csv: {
                                      columnHeaderFormatter: function (item) {
                                        if (
                                          !item ||
                                          item instanceof Highcharts.Axis
                                        ) {
                                          return t("category");
                                        }
                                        return item.name;
                                      },
                                    },
                                  },
                                }}
                                // allowChartUpdate={true}
                                immutable={true}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 col-lg-6">
                          <div className="impact-box-content-education tab-sdb-blue">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("top_performing_states_ptr")}
                              </h2>
                            </div>
                            <div className="piechart-box mt-3 tab-content-reduce">
                              <Tabs
                                defaultActiveKey="State"
                                id="uncontrolled-tab-example"
                                className="mt-0"
                              >
                                <Tab
                                  eventKey="State"
                                  title={t("state")}
                                  disabled={!isStateTabEnabled}
                                >
                                  <div className="piechart-box row mt-0">
                                    <div className="col-md-12">
                                      <HighchartsReact
                                        highcharts={Highcharts}
                                        options={{
                                          chart: {
                                            type: "column",
                                            marginTop: 50,
                                            events: {
                                              beforePrint: function () {
                                                this.exportSVGElements[0].box.hide();
                                                this.exportSVGElements[1].hide();
                                              },
                                              afterPrint: function () {
                                                this.exportSVGElements[0].box.show();
                                                this.exportSVGElements[1].show();
                                              },
                                            },
                                          },

                                          xAxis: {
                                            categories: categories,
                                          },

                                          yAxis: {
                                            allowDecimals: false,
                                            min: 0,
                                            title: {
                                              text: "",
                                            },
                                          },
                                          title: {
                                            text: t(
                                              "top_performing_states_ptr"
                                            ),
                                          },
                                          tooltip: {
                                            headerFormat:
                                              "<b>{point.x}</b><br/>",
                                            valueSuffix: " ",
                                            pointFormat:
                                              "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
                                          },

                                          plotOptions: {
                                            column: {
                                              stacking: "normal",
                                              dataLabels: {
                                                enabled: true,
                                                crop: false,
                                                overflow: "none",
                                                rotation: 0,
                                                align: "center",
                                                x: -2,
                                                y: -5,
                                                style: {
                                                  font: "13px Arial, sans-serif",
                                                  fontWeight: "600",
                                                  stroke: "transparent",
                                                  align: "center",
                                                },
                                                position: "top",
                                                formatter: function () {
                                                  return parseFloat(
                                                    this.y
                                                  ).toFixed(2);
                                                },
                                              },
                                            },
                                          },
                                          legend: {
                                            layout: "horizontal",
                                            align: "center",
                                            verticalAlign: "bottom",
                                            itemMarginTop: 10,
                                            itemMarginBottom: 10,
                                            enabled: false,
                                          },
                                          credits: {
                                            enabled: false,
                                          },
                                          series: [
                                            // {
                                            //   name: "Not Available",
                                            //   data: notAvailableData,
                                            //   color: "#E6694A",
                                            // },
                                            {
                                              name: t("available"),
                                              data: availableData,
                                              color: "#BCE263",
                                              maxPointWidth: 50,
                                            },
                                          ],
                                          exporting: {
                                            filename: t(
                                              "top_performing_states_ptr"
                                            ),
                                            csv: {
                                              columnHeaderFormatter: function (
                                                item
                                              ) {
                                                if (
                                                  !item ||
                                                  item instanceof
                                                    Highcharts.Axis
                                                ) {
                                                  return t("category");
                                                }
                                                return item.name;
                                              },
                                            },
                                          },
                                        }}
                                        // allowChartUpdate={true}
                                        immutable={true}
                                      />
                                    </div>
                                  </div>
                                </Tab>
                                <Tab
                                  eventKey="District"
                                  title={t("district")}
                                  disabled={!isDistrictTabEnabled}
                                >
                                  <div className="piechart-box row mt-4">
                                    <div className="col-md-12">
                                      <HighchartsReact
                                        highcharts={Highcharts}
                                        options={{
                                          chart: {
                                            type: "column",
                                            marginTop: 50,
                                            events: {
                                              beforePrint: function () {
                                                this.exportSVGElements[0].box.hide();
                                                this.exportSVGElements[1].hide();
                                              },
                                              afterPrint: function () {
                                                this.exportSVGElements[0].box.show();
                                                this.exportSVGElements[1].show();
                                              },
                                            },
                                          },

                                          yAxis: {
                                            allowDecimals: false,
                                            min: 0,
                                            title: {
                                              text: "",
                                            },
                                          },
                                          title: {
                                            text: t(
                                              "top_performing_states_ptr"
                                            ),
                                          },
                                          tooltip: {
                                            headerFormat:
                                              "<b>{point.x}</b><br/>",
                                            valueSuffix: "%",
                                            pointFormat:
                                              "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
                                          },

                                          plotOptions: {
                                            column: {
                                              stacking: "normal",
                                              dataLabels: {
                                                enabled: true,
                                                crop: false,
                                                overflow: "none",
                                                rotation: 0,
                                                align: "center",
                                                x: -2,
                                                y: -5,
                                                style: {
                                                  font: "13px Arial, sans-serif",
                                                  fontWeight: "600",
                                                  stroke: "transparent",
                                                  align: "center",
                                                },
                                                position: "top",
                                                formatter: function () {
                                                  return (
                                                    parseFloat(this.y).toFixed(
                                                      2
                                                    ) + "%"
                                                  );
                                                },
                                              },
                                            },
                                          },
                                          legend: {
                                            layout: "horizontal",
                                            align: "center",
                                            verticalAlign: "bottom",
                                            itemMarginTop: 10,
                                            itemMarginBottom: 10,
                                            enabled: false,
                                          },
                                          credits: {
                                            enabled: false,
                                          },
                                          series: [
                                            {
                                              name: "Not Available",
                                              data: [4, 9, 2, 15, 3],
                                              color: "#E6694A",
                                            },
                                            {
                                              name: t("available"),
                                              data: [96, 91, 98, 85, 97],
                                              color: "#BCE263",
                                            },
                                          ],
                                          exporting: {
                                            filename: t(
                                              "top_performing_states_ptr"
                                            ),
                                            csv: {
                                              columnHeaderFormatter: function (
                                                item
                                              ) {
                                                if (
                                                  !item ||
                                                  item instanceof
                                                    Highcharts.Axis
                                                ) {
                                                  return t("category");
                                                }
                                                return item.name;
                                              },
                                            },
                                          },
                                        }}
                                        // allowChartUpdate={true}
                                        immutable={true}
                                      />
                                    </div>
                                  </div>
                                </Tab>
                                <Tab
                                  eventKey="Block"
                                  title={t("block")}
                                  disabled={!isBlockTabEnabled}
                                >
                                  <div className="piechart-box row mt-4">
                                    <div className="col-md-12">
                                      <HighchartsReact
                                        highcharts={Highcharts}
                                        options={{
                                          chart: {
                                            type: "column",
                                            marginTop: 50,
                                            events: {
                                              beforePrint: function () {
                                                this.exportSVGElements[0].box.hide();
                                                this.exportSVGElements[1].hide();
                                              },
                                              afterPrint: function () {
                                                this.exportSVGElements[0].box.show();
                                                this.exportSVGElements[1].show();
                                              },
                                            },
                                          },

                                          yAxis: {
                                            allowDecimals: false,
                                            min: 0,
                                            title: {
                                              text: "",
                                            },
                                          },
                                          title: {
                                            text: t(
                                              "top_performing_states_ptr"
                                            ),
                                          },
                                          tooltip: {
                                            headerFormat:
                                              "<b>{point.x}</b><br/>",
                                            valueSuffix: "%",
                                            pointFormat:
                                              "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
                                          },

                                          plotOptions: {
                                            column: {
                                              stacking: "normal",
                                              dataLabels: {
                                                enabled: true,
                                                crop: false,
                                                overflow: "none",
                                                rotation: 0,
                                                align: "center",
                                                x: -2,
                                                y: -5,
                                                style: {
                                                  font: "13px Arial, sans-serif",
                                                  fontWeight: "600",
                                                  stroke: "transparent",
                                                  align: "center",
                                                },
                                                position: "top",
                                                formatter: function () {
                                                  return (
                                                    parseFloat(this.y).toFixed(
                                                      2
                                                    ) + "%"
                                                  );
                                                },
                                              },
                                            },
                                          },
                                          legend: {
                                            layout: "horizontal",
                                            align: "center",
                                            verticalAlign: "bottom",
                                            itemMarginTop: 10,
                                            itemMarginBottom: 10,
                                            enabled: false,
                                          },
                                          credits: {
                                            enabled: false,
                                          },
                                          series: [
                                            {
                                              name: "Not Available",
                                              data: [4, 9, 2, 15, 3],
                                              color: "#E6694A",
                                            },
                                            {
                                              name: t("available"),
                                              data: [96, 91, 98, 85, 97],
                                              color: "#BCE263",
                                            },
                                          ],
                                          exporting: {
                                            filename: t(
                                              "top_performing_states_ptr"
                                            ),
                                            csv: {
                                              columnHeaderFormatter: function (
                                                item
                                              ) {
                                                if (
                                                  !item ||
                                                  item instanceof
                                                    Highcharts.Axis
                                                ) {
                                                  return t("category");
                                                }
                                                return item.name;
                                              },
                                            },
                                          },
                                        }}
                                        // allowChartUpdate={true}
                                        immutable={true}
                                      />
                                    </div>
                                  </div>
                                </Tab>
                              </Tabs>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12 col-lg-12">
                          <div className="impact-box-content-education tab-content-reduce">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("pupil_teacher_ratio_overview")}
                              </h2>
                            </div>
                            <Tabs
                              defaultActiveKey="School Category"
                              id="uncontrolled-tab-connection-by"
                              onSelect={handlePupilTeacherRatioByTabChange}
                            >
                              <Tab
                                eventKey="School Category"
                                title={t("school_category")}
                              >
                                <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-12">
                                    <div
                                      className={`scroll-btn-graph ${
                                        currentIndex === 0 ? "disabled" : ""
                                      }`}
                                      onClick={handlePrevious}
                                    >
                                      <span className="material-icons-round">
                                        expand_less
                                      </span>
                                    </div>
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      options={{
                                        title: {
                                          text: t(
                                            "pupil_teacher_ratio_overview"
                                          ),
                                        },
                                        credits: {
                                          enabled: false,
                                        },
                                        chart: {
                                          height: 650,
                                          marginTop: 50,
                                          events: {
                                            beforePrint: function () {
                                              this.exportSVGElements[0].box.hide();
                                              this.exportSVGElements[1].hide();
                                            },
                                            afterPrint: function () {
                                              this.exportSVGElements[0].box.show();
                                              this.exportSVGElements[1].show();
                                            },
                                          },
                                        },
                                        navigation: {
                                          buttonOptions: {
                                            align: "right",
                                            verticalAlign: "top",
                                            y: -10,
                                          },
                                        },

                                        series: [
                                          {
                                            reversed: true,
                                            type: "treegraph",
                                            data: FinalData,
                                            tooltip: {
                                              pointFormat: "{point.name}",
                                            },
                                            marker: {
                                              symbol: "rect",
                                              width: "25%",
                                              height: "25",
                                            },
                                            borderRadius: 10,
                                            dataLabels: {
                                              allowOverlap: false, // Prevent overlapping labels
                                              pointFormat: "{point.name}",
                                              style: {
                                                whiteSpace: "nowrap",
                                              },
                                            },
                                            levels: [
                                              {
                                                level: 1,
                                                levelIsConstant: false,
                                              },
                                              {
                                                level: 2,
                                                colorByPoint: false,
                                                collapsed: true,
                                              },
                                              {
                                                level: 3,
                                                collapsed: true,
                                                layoutAlgorithm: "stripes", // Better algorithm to manage space
                                              },
                                              {
                                                level: 4,
                                                collapsed: true,
                                                colorVariation: {
                                                  key: "brightness",
                                                  to: 0.5,
                                                },
                                              },
                                            ],
                                            events: {
                                              // Add event handler for node click
                                              click: handleNodeClick,
                                            },
                                          },
                                        ],
                                        exporting: {
                                          filename: t(
                                            "pupil_teacher_ratio_overview"
                                          ),
                                          csv: {
                                            columnHeaderFormatter: function (
                                              item
                                            ) {
                                              if (
                                                !item ||
                                                item instanceof Highcharts.Axis
                                              ) {
                                                return t("category");
                                              }
                                              return item.name;
                                            },
                                          },
                                          buttons: {
                                            contextButton: {
                                              menuItems: [
                                                "printChart",
                                                "separator",
                                                "downloadPNG",
                                                "downloadJPEG",
                                                "downloadPDF",
                                                "downloadSVG",
                                                "downloadCSV",
                                                "downloadXLS",
                                              ],
                                            },
                                          },
                                        },
                                        yAxis: {
                                          reversed: true,
                                        },
                                      }}
                                      // allowChartUpdate={true}
                                      immutable={true}
                                    />
                                    <div
                                      className={`scroll-btn-graph ${
                                        currentIndex >= 38 - limit
                                          ? "disabled"
                                          : ""
                                      }`}
                                      onClick={handleNext}
                                    >
                                      <span className="material-icons-round">
                                        expand_more
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Tab>
                              <Tab
                                eventKey="School Management"
                                title={t("school_management")}
                              >
                                <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-12">
                                    <div
                                      className={`scroll-btn-graph ${
                                        currentIndex === 0 ? "disabled" : ""
                                      }`}
                                      onClick={handlePrevious}
                                    >
                                      <span className="material-icons-round">
                                        expand_less
                                      </span>
                                    </div>
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      options={{
                                        title: {
                                          text: t(
                                            "pupil_teacher_ratio_overview"
                                          ),
                                        },
                                        credits: {
                                          enabled: false,
                                        },
                                        chart: {
                                          height: 500,
                                          marginTop: 50,
                                        },
                                        navigation: {
                                          buttonOptions: {
                                            align: "right",
                                            verticalAlign: "top",
                                            y: -10,
                                          },
                                        },

                                        series: [
                                          {
                                            reversed: true,
                                            type: "treegraph",
                                            data: FinalData1,
                                            tooltip: {
                                              pointFormat: "{point.name}",
                                            },
                                            marker: {
                                              symbol: "rect",
                                              width: "25%",
                                              height: "25",
                                            },
                                            borderRadius: 10,
                                            dataLabels: {
                                              pointFormat: "{point.name}",
                                              style: {
                                                whiteSpace: "nowrap",
                                              },
                                            },
                                            levels: [
                                              {
                                                level: 1,
                                                levelIsConstant: false,
                                              },
                                              {
                                                level: 2,
                                                colorByPoint: false,
                                                collapsed: true,
                                              },
                                              {
                                                level: 3,
                                                collapsed: true,
                                                colorVariation: {
                                                  key: "brightness",
                                                  to: -0.5,
                                                },
                                              },
                                              {
                                                level: 4,
                                                collapsed: true,
                                                colorVariation: {
                                                  key: "brightness",
                                                  to: 0.5,
                                                },
                                              },
                                            ],
                                            events: {
                                              // Add event handler for node click
                                              click: handleNodeClick,
                                            },
                                          },
                                        ],
                                        exporting: {
                                          filename: t(
                                            "pupil_teacher_ratio_overview"
                                          ),
                                          csv: {
                                            columnHeaderFormatter: function (
                                              item
                                            ) {
                                              if (
                                                !item ||
                                                item instanceof Highcharts.Axis
                                              ) {
                                                return t("category");
                                              }
                                              return item.name;
                                            },
                                          },
                                          buttons: {
                                            contextButton: {
                                              menuItems: [
                                                "viewFullscreen",
                                                "printChart",
                                                "separator",
                                                "downloadPNG",
                                                "downloadJPEG",
                                                "downloadPDF",
                                                "downloadSVG",
                                                "downloadCSV",
                                                "downloadXLS",
                                              ],
                                            },
                                          },
                                        },
                                        yAxis: {
                                          reversed: true,
                                        },
                                      }}
                                      // allowChartUpdate={true}
                                      immutable={true}
                                    />
                                    <div
                                      className={`scroll-btn-graph ${
                                        currentIndex >= 38 - limit
                                          ? "disabled"
                                          : ""
                                      }`}
                                      onClick={handleNext}
                                    >
                                      <span className="material-icons-round">
                                        expand_more
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Tab>
                            </Tabs>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FilterDropdown2007 />
    </>
  );
}
