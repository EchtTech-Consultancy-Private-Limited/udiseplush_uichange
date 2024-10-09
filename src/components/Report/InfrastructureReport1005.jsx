import React, { useEffect, useCallback, useRef } from "react";
import "./infra.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchoolStatsData } from "../../redux/thunks/dashboardThunk";
import { fetchSchoolStatsDataYear } from "../../redux/thunks/dashboardThunk";
import { fetchArchiveServicesSchoolData } from "../../redux/thunks/archiveServicesThunk";
import {
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
  selectedDYear,
  nationalWiseName,
  stateWiseName,
  districtWiseName,
  district,
  blockWiseName,
  block,
  generateTextContent,
} from "../../constants/constants";
import allreportsdata from "../../json-data/allreports.json";
import allReportsHindidata from "../../json-data/allReportsHindi.json";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import groupByKey from "../../utils/groupBy";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { allFilter } from "../../redux/slice/schoolFilterSlice";
import { initialFilterSchoolData } from "../../constants/constants";
import HC_more from "highcharts/highcharts-more";
import FilterDropdown3016 from "../Home/filter/FilterDropdown3016";
import { useLocation, useSearchParams } from "react-router-dom";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
import { categoryMappings as categoryMappingsOriginal } from "../../constants/constants";
import { removeAllDistrict } from "../../redux/thunks/districtThunk";
import { removeAllBlock } from "../../redux/thunks/blockThunk";
import { handleActiveTabs } from "../../redux/slice/headerSlice";
import { useTranslation } from "react-i18next";
import FilterDropdownCommom358 from "../Home/filter/FilterDropdownCommon358";
import { handleMissingData } from "../../utils/handleMissingData";
import satyamevaimg from "../../assets/images/satyameva-jayate-img.png";
import udise from "../../assets/images/udiseplu.jpg";
import useReportOverallLocationSum from "../../CustomHook/useReportOverallLocationSum"


require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/treemap")(Highcharts);
require("highcharts/modules/treegraph")(Highcharts);
HC_more(Highcharts);

export default function InfrastructureReport1005() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [queryParameters] = useSearchParams();
  const id = queryParameters.get("id");
  const type = queryParameters.get("type");
  const location = useLocation();
  const queryString = window.location.hash.substring(1);
  const urlParams = new URLSearchParams(queryString.split("?")[1]);
  const paramValue = urlParams.get("type");
  const school_data = useSelector((state) => state.school);
  const school_data_valueTypes =
    useSelector((state) => state?.schoolStats) || {};
  const school_data_Years =
    useSelector((state) => state?.schoolStatsYear) || [];
  const school_data_valueType =
    useSelector((state) => state?.schoolStats?.data?.data?.[0]) || {};
  const school_data_Year =
    useSelector((state) => state?.schoolStatsYear?.data?.data) || [];

  const categoryMappings = {};
  for (const [key, value] of Object.entries(categoryMappingsOriginal)) {
    categoryMappings[key] = t(`categories.${key}`);
  }

  const updatedSchoolData = school_data?.data?.data?.map((school) => {
    if (categoryMappings.hasOwnProperty(school.schCategoryDesc)) {
      return {
        ...school,
        schCategoryDesc: categoryMappings[school.schCategoryDesc],
      };
    }
    return school;
  });

  const schoolFilter = useSelector((state) => state.schoolFilter);
  const headerData = useSelector((state) => state.header);
  // const local_state = window.localStorage.getItem("state_wise");
  const [local_state, setLocalStateName] = useState("All India/National");
  const [local_district, setLocalDistrictName] = useState("District");
  const [local_block, setLocalBlockName] = useState("Block");
  const local_year = window.localStorage.getItem("year");
  const stateName = localStorage.getItem("state");
  const filterObj = structuredClone(schoolFilter);
  const [report, setReport] = useState(null);
  const [gridApi, setGridApi] = useState();
  const [arrGroupedData, setArrGroupedData] = useState([]);
  const [activeTab, setActiveTab] = useState(type);
  const [isScrollComplete, setIsScrollComplete] = useState(false);
  dispatch(handleActiveTabs(activeTab));
  const [groupKeys, setGroupKeys] = useState({
    schCategoryBroad: false,
    schCategoryDesc: false,
    schLocationDesc: false,
  });

  useEffect(() => {
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
  }, []);
  useEffect(() => {
    window.localStorage.setItem("map_state_name", "All India/National");
    window.localStorage.setItem("state", "All India/National");
    window.localStorage.setItem("state_wise", "All India/National");
    window.localStorage.setItem("map_district_name", "District");
    window.localStorage.setItem("district", "District");
    window.localStorage.setItem("block", "Block");
  }, []);

  useEffect(() => {
    setLocalStateName(localStorage.getItem("state"));
    setLocalStateName(localStorage.getItem("state_wise"));
    setLocalStateName(localStorage.getItem("map_state_name"));

    setLocalDistrictName(localStorage.getItem("map_district_name"));
    setLocalBlockName(localStorage.getItem("block"));
  }, [filterObj, headerData.activeTab]);

  const [enabledScType, setEnabledSchType] = useState(false);
  const [enabledSchLocation, setEnabledSchLocations] = useState(false);
  const [showTransposed, setShowTransposeds] = useState(false);
  const [gridRefreshKey, setGridRefreshKey] = useState(0);
  const [showTransposedMgts, setShowTransposedMgts] = useState(false);
  const [cat, setCat] = useState("active");
  const [cat_Details, setCatDetail] = useState("");
  const [sch_type, setSchTypes] = useState("");
  const [ur, setUR] = useState("");
  const [cloneUr, setCloneUR] = useState("");
  const [cloneSchtype, setCloneSchTypes] = useState("");
  const [multiCat, setMultiCats] = useState("multibtn");
  const [data, setData] = useState([]);
  const [cloneFilterDatas, setCloneFilterDatas] = useState([]);
  const [customColumnNames, setCustomColumns] = useState("");
  const [customColumnName, setCustomColumn] = useState("");
  const [pinnedBottomRowDataByRows, setPinnedBottomRowDataByRow] = useState([]);

  const totalLabel = t("total");

  const filter_query_by_location =
    (local_state === "All India/National" &&
      groupKeys.schCategoryBroad &&
      groupKeys.schCategoryDesc) ||
    local_state === "State Wise" ||
    local_district === "District Wise" ||
    local_block === "Block Wise";
  const [columns, setColumn] = useState([
    {
      headerName: "Serial Number",
      field: "Serial Number",
      hide: true,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
    },
    {
      headerName: "Location",
      field: "regionName",
      hide: false,
    },
    {
      headerName: t("school_type"),
      field: "schTypeDesc",
      hide: false,
    },
    {
      headerName: "School Category(Broad)",
      field: "schCategoryBroad",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "School Category(Detailed)",
      field: "schCategoryDesc",
      suppressColumnsToolPanel: true,
      hide: true,
    },

    {
      headerName: "Total No. of Schools",
      field: "totSch",
      cellClass: "rightAligned",
    },
  ]);

  // caluculate horizontal total
  const getLastTrueToShowTotal = () => {
    const lastTrueKey = Object.keys(groupKeys).reduce((lastKey, key) => {
      if (groupKeys[key]) {
        return key;
      }
      return lastKey;
    }, null);
    return lastTrueKey;
  };

  // caluculate Vertical  total

  function calculateTotal(fieldName) {
    if (!arrGroupedData) return 0;
    return arrGroupedData.reduce(
      (total, row) => total + parseFloat(row[fieldName] || 0),
      0
    );
  }

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
    if (paramValue === "table") {
      dispatch(allFilter(initialFilterSchoolData));
      dispatch(fetchArchiveServicesSchoolData(initialFilterSchoolData));
    } else if (paramValue === "graph") {
      initialFilterSchoolData.valueType = 2;
      dispatch(allFilter(initialFilterSchoolData));
      dispatch(fetchSchoolStatsData(initialFilterSchoolData));
      initialFilterSchoolData.valueType = 1;
      dispatch(allFilter(initialFilterSchoolData));
      dispatch(fetchSchoolStatsDataYear(initialFilterSchoolData));
    }
  }, [paramValue, i18n.language]);

  useEffect(() => {
    const allFalse = Object.values(groupKeys).every((value) => value === false);
    if (allFalse) {
      schoolLocationRows();
    } else {
      handleCustomKeyInAPIResponse();
      multiGroupingRows();
    }

    gridApi?.columnApi?.api.setColumnVisible("regionName");
  }, [school_data?.data?.data]);
  useEffect(() => {
    const allFalse = Object.values(groupKeys).every((value) => value === false);
    if (allFalse) {
      schoolLocationRows();
    } else {
      multiGroupingRows();
    }
  }, [groupKeys, data]);
  useEffect(() => {
    //  /----------If any of the column is showing by row[disable school type/Urban/Rural]-------------/
    if (showTransposed || showTransposedMgts) {
      setEnabledSchType(true);
      setEnabledSchLocations(true);
      if (ur === "active") {
        setUR("");
        setCloneUR("active");
      }
      if (sch_type === "active") {
        setCloneSchTypes("active");
        setSchTypes("");
      }
    } else {
      if (cloneUr === "active") {
        setUR("active");
        setCloneUR("");
      }
      if (cloneSchtype === "active") {
        setSchTypes("active");
        setCloneSchTypes("");
      }
      setEnabledSchType(false);
      setEnabledSchLocations(false);
    }
    // /-----end here------/
  }, [showTransposed, showTransposedMgts]);
  // useEffect(() => {
  //   multiGroupingRows();
  //   if (showTransposed) {
  //     switchColumnsToRow(false, true);
  //   }
  // }, [data]);
  useEffect(() => {
    if (showTransposed) {
      switchColumnsToRow(false, true);
    }
  }, [cloneFilterDatas, groupKeys, data]);
  useEffect(() => {
    if (showTransposed || showTransposedMgts) {
      const appendedObj = {};
      columns.forEach((item) => {
        if (item.field === customColumnNames) {
          appendedObj[item.field] = "";
        } else if (item.field === customColumnName) {
          appendedObj[item.field] = t("total");
        } else {
          appendedObj[item.field] = calculateTotal(item.field);
        }
      });
      setPinnedBottomRowDataByRow([appendedObj]);
    }
  }, [columns]);
  const [defColumnDefs] = useState({
    flex: 1,
    minWidth: 150,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
    filter: true,
    autoHeaderHeight: true,
  });
  function onColumnVisible(event) {
    const columnId = event?.column?.colId;
    const visible = event.visible;

    if (columnId === "schCategoryBroad") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryBroad: visible,
      }));
      setCat(() => (visible ? "active" : ""));
      setMultiCats("multibtn");
    }
    if (columnId === "schCategoryDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryDesc: visible,
      }));
      setCatDetail(() => (visible ? "active" : ""));
      setMultiCats("multibtn");
    }

    // if (columnId === "schLocationDesc") {
    //   setGroupKeys((prev) => ({
    //     ...prev,
    //     schLocationDesc: visible,
    //   }));
    //   setUR(() => (visible ? "active" : ""));
    // }
  }
  const onGridReady = useCallback((params) => {
    setGridApi(params);
  }, []);
  const handleCustomKeyInAPIResponse = () => {
    const arr = [];
    updatedSchoolData?.forEach((item, idx) => {
      let appendedObj = { ...item };
      /* broad management key added*/
      if (state_gov_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = t("state_government");
      } else if (gov_aided_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = t("govt_aided");
      } else if (pvt_uaided_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = t("privateUnaided");
      } else if (ctrl_gov_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = t("centralGovernment");
      } else if (other_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = t("others");
      }
      /* broad category key added*/
      if (pr_sch_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = t("primary");
      } else if (upr_pr_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = t("upper_primary");
      } else if (hr_sec_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = t("higher_secondary");
      } else if (sec_sch_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = t("secondary");
      } else if (pre_pr_sch_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = t("prePrimary");
      }
      arr.push(appendedObj);
    });
    setData(arr);
  };
  const handleFilter = (value, e) => {
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
          setMultiCats("multibtn");
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

  const handleGroupButtonClicks = (e) => {
    setGridRefreshKey((prevKey) => prevKey + 1);
    handleFilter(e);
    const updatedGroupKeys = { ...groupKeys };

    if (e === "School Category") {
      updatedGroupKeys.schCategoryBroad = true;
      updatedGroupKeys.schCategoryDesc = false;
      setCat("active");
      setCatDetail("");
    } else if (e === "Cats Details") {
      updatedGroupKeys.schCategoryDesc = true;
      updatedGroupKeys.schCategoryBroad = false;
      setCat("");
      setCatDetail("active");
    }
    setGroupKeys(updatedGroupKeys);
    const allFalse = Object.values(updatedGroupKeys).every(
      (value) => value === false
    );
    if (allFalse) {
      schoolLocationRows();
    } else {
      handleCustomKeyInAPIResponse();
      multiGroupingRows();
    }
    if (showTransposed) {
      switchColumnsToRow();
    }
  };

  const schoolLocationRows = () => {
    const primaryKeys = ["regionName"];
    const groupedData = groupByKey(updatedSchoolData, primaryKeys);
    const updatedArrGroupedData = [];
    if (groupedData && typeof groupedData === "object") {
      Object.keys(groupedData)?.forEach((item, idx) => {
        const itemsArray = groupedData[item];
        let totalSchoolsHaveElectricity = 0;
        let totalFunElectricity = 0;
        let totalSchools = 0;

        itemsArray.forEach((dataItem) => {
          totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
          totalSchools += parseInt(dataItem.totSch);
          totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
        });
        const appended = {
          "Serial Number": idx + 1,
          regionName: item,
          totSch: totalSchools,
        };

        updatedArrGroupedData.push(appended);
      });
      setArrGroupedData(updatedArrGroupedData);
      setCloneFilterDatas(updatedArrGroupedData);
    }
    gridApi?.columnApi?.api.setColumnVisible("regionName", true);
    gridApi?.columnApi?.api.setColumnVisible("schCategoryBroad", true);
    gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", true);
  };
  const multiGroupingRows = () => {
    const primaryKeys = Object.keys(groupKeys).filter((key) => groupKeys[key]);
    if (primaryKeys.length > 0) {
      primaryKeys.push("regionName", "schTypeDesc");
      const groupedData = groupByKey(data, primaryKeys);

      const updatedArrGroupedData = [];
      if (groupedData && typeof groupedData === "object") {
        Object.keys(groupedData).forEach((item, idx) => {
          const itemsArray = groupedData[item];
          let totalSchoolsHaveElectricity = 0;
          let totalFunElectricity = 0;
          let totalSchools = 0;
          let regionName = "";
          let schTypeDesc = "";
          itemsArray.forEach((dataItem) => {
            regionName = dataItem.regionName;
            schTypeDesc = dataItem.schTypeDesc;
            totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
            totalSchools += parseInt(dataItem.totSch);
            totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
          });
          const appended = {};
          primaryKeys.forEach((key, index) => {
            appended.regionName = regionName;
            appended.schTypeDesc = schTypeDesc;
            appended[key] = item.split("@")[index];
          });
          appended["Serial Number"] = idx + 1;
          appended.schTypeDesc = schTypeDesc;
          appended.totSchElectricity = totalSchoolsHaveElectricity;
          appended.totSch = totalSchools;
          appended.totSchFuncElectricity = totalFunElectricity;
          updatedArrGroupedData.push(appended);
        });
        setCloneFilterDatas(updatedArrGroupedData);
        setArrGroupedData(updatedArrGroupedData);
      }

      gridApi?.columnApi?.api.setColumnVisible(
        "schCategoryBroad",
        groupKeys.schCategoryBroad
      );
      gridApi?.columnApi?.api.setColumnVisible(
        "schCategoryDesc",
        groupKeys.schCategoryDesc
      );
      gridApi?.columnApi?.api.setColumnVisible(
        "schTypeDesc",
        groupKeys.schTypeDesc
      );
      gridApi?.columnApi?.api.setColumnVisible(
        "schLocationDesc",
        groupKeys.schLocationDesc
      );
      gridApi?.columnApi?.api.setColumnVisible("regionName");
    }
  };

  const countTotalPinnedWithRight = (obj) => {
    let total = 0;
    for (const key in obj) {
      const value = obj[key];
      if (Number.isInteger(value)) {
        total += value;
      }
    }
    return total;
  };

  const switchColumnsToRow = (e, flag = false) => {
    setShowTransposedMgts(false);
    if (flag || !showTransposed) {
      const arr = [];
      const uniqueLocation = new Set();
      const uniqueKeys = new Set();

      let customColumnNames = "";
      let customColumnName = "";

      cloneFilterDatas?.forEach((row) => {
        let location = row.regionName;
        let SchType = row.schTypeDesc || "Boys";
        customColumnNames = "Location";
        customColumnName = t("school_type");
        setCustomColumns(customColumnNames);
        setCustomColumn(customColumnName);

        // Row-wise data for category
        let key;
        if (groupKeys.schCategoryBroad) {
          key = row.schCategoryBroad;
        } else if (groupKeys.schCategoryDesc) {
          key = row.schCategoryDesc;
        }

        uniqueLocation.add(location);
        key = key?.replace(/\./g, "");
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
        }

        const existingDataIndex = arr.findIndex(
          (data) =>
            data[customColumnNames] === location &&
            data[customColumnName] === SchType
        );

        if (existingDataIndex !== -1) {
          arr[existingDataIndex][key] =
            (arr[existingDataIndex][key] || 0) + parseInt(row.totSch, 10);
        } else {
          let newData = {
            [customColumnNames]: location,
            [customColumnName]: SchType,
            Overall: 0,
          };
          newData[key] = parseInt(row.totSch, 10);
          arr.push(newData);
        }
      });

      const columnHeaderss = [
        "Serial Number",
        customColumnNames,
        customColumnName,
        ...Array.from(uniqueKeys),
        "Overall",
      ];

      setColumn(
        columnHeaderss.map((header, idx) => {
          if (idx !== 0) {
            return {
              headerName: header,
              field: header?.replace(/\./g, ""),
              cellClass: idx > 1 ? "rightAligned" : "",
              hide:
                header === "Location" && !filter_query_by_location
                  ? true
                  : false,
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

      const newArr = arr.map((item, idx) => {
        return {
          ...item,
          Overall: countTotalPinnedWithRight(item),
          "Serial Number": idx + 1,
        };
      });

      setArrGroupedData(newArr);
    } else {
      setArrGroupedData(cloneFilterDatas);

      setColumn([
        {
          headerName: "Serial Number",
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
          headerName: "School Type",
          field: "schTypeDesc",
          hide: false,
        },
        {
          headerName: "School Category(Broad)",
          field: "schCategoryBroad",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schCategoryBroad,
        },
        {
          headerName: "School Category(Detailed)",
          field: "schCategoryDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schCategoryDesc,
        },
        {
          headerName: "Total No. of Schools",
          field: "totSch",
          cellClass: "rightAligned",
        },
      ]);
    }

    if (!flag) {
      setShowTransposeds(!showTransposed);
    }
  };

  /*------------Export data to Excel and PDF-------------*/
  const getHeaderToExport = (gridApi) => {
    const columns = gridApi.api.getAllDisplayedColumns();
    const headerCellSerialNumber = {
      text: "Serial Number",
      headerName: "S.NO.",
      bold: true,
      margin: [0, 12, 0, 0],
    };
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
    const date = new Date();
    // const formattedDate = new Intl.DateTimeFormat("en-US", {
    //   year: "numeric",
    //   month: "short",
    //   day: "2-digit",
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

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Example: Draw a rectangle around the whole page
      // doc.setLineWidth(0.02); // Thicker border for the page
      // doc.rect(0.1, 0.1, pageWidth - 0.2, pageHeight - 0.2); // x, y, width, height
    };
    // Function to add footer
    const addFooter = () => {};
    const table = [];
    table.push(headerRow.map((cell) => cell.headerName));
    rows.forEach((row) => {
      table.push(row.map((cell) => cell.text));
    });
    addHeader();
    doc.autoTable({
      head: [table[0]],
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
          columnHeaderText === "Location" ||
          columnHeaderText === "School Type" ||
          columnHeaderText === "regionName"
        ) {
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
      gridApi.api.forEachNode((node, index) => {
        const data = node.data;
        const rowDataWithSerial = { ...data, "Serial Number": index + 1 };
        allData.push(rowDataWithSerial);
      });
      const columnKeys = columnHeaders.map((column) => column.field);
      const columnNames = columnHeaders.map((column) => column.headerName);
      gridApi.api.exportDataAsExcel({
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

  const pinedBottomRowDatas = [
    {
      ...(getLastTrueToShowTotal()
        ? { [getLastTrueToShowTotal()]: "Overall" }
        : { regionName: "Overall" }),
      totSch: calculateTotal("totSch"),
      totSchElectricity: calculateTotal("totSchElectricity"),
      totSchFuncElectricity: calculateTotal("totSchFuncElectricity"),
    },
  ];

  useEffect(() => {
    handleGroupButtonClicks("School Category", null);
  }, []);

  useEffect(() => {
    if (cloneFilterDatas.length > 0) {
      setShowTransposeds((prevShowTransposed) => {
        if (!prevShowTransposed) {
          switchColumnsToRow(true);
        }
        return true;
      });
    }
  }, [cloneFilterDatas]);

  // chart related code

  const years = [
    "2018-2019",
    "2019-2020",
    "2020-2021",
    "2021-2022",
    "2022-2023",
  ];

  const boysData = school_data_Year?.map((item) => parseFloat(item.totSchoolB));
  const girlsData = school_data_Year?.map((item) =>
    parseFloat(item.totSchoolG)
  );
  const coedData = school_data_Year?.map((item) =>
    parseFloat(item.totSchoolCoed)
  );

  const upperPrimData = school_data_Year?.map((item) =>
    parseFloat(item.totSchoolUPry)
  );
  const secondaryData = school_data_Year?.map((item) =>
    parseFloat(item.totSchoolSec)
  );
  const higherSecData = school_data_Year?.map((item) =>
    parseFloat(item.totSchoolHSec)
  );
  const primaryData = school_data_Year?.map((item) =>
    parseFloat(item.totSchoolPry)
  );

  // handle by table and graph data when tab change
  useEffect(() => {
    if (headerData.activeTab === "table") {
      window.localStorage.setItem("state", "All India/National");
      window.localStorage.setItem("map_state_name", "All India/National");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear);
      dispatch(fetchArchiveServicesSchoolData(initialFilterSchoolData));
    }
    if (headerData.activeTab === "graph") {
      window.localStorage.setItem("state", "All India/National");
      window.localStorage.setItem("map_state_name", "All India/National");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear);
      initialFilterSchoolData.valueType = 2;
      dispatch(allFilter(initialFilterSchoolData));
      dispatch(fetchSchoolStatsData(initialFilterSchoolData));
      initialFilterSchoolData.valueType = 1;
      dispatch(allFilter(initialFilterSchoolData));
      dispatch(fetchSchoolStatsDataYear(initialFilterSchoolData));
    }
  }, [headerData.activeTab, i18n.language]);

  const handleScrollComplete = () => {
    setIsScrollComplete(true);
  };
  // Use `arrGroupedData` as the source data and apply the `handleMissingData` function to replace null values with "0".
  // The `handleMissingData` function is used to process data and ensure missing values are replaced,
  // which is then displayed in AG Grid using the processed data.

 
 const result=  useReportOverallLocationSum(arrGroupedData);
  const arrGroupedDataTable = handleMissingData(
    filter_query_by_location ? result : arrGroupedData,
    columns
  );

  return (
    <>
      <ScrollToTopOnMount onScrollComplete={handleScrollComplete} />
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
                          {t("reports_id")} {report.id}
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
                            {t("download_report")}
                          </option>
                          <option value="export_pdf">
                            {t("download_report")}{" "}
                          </option>
                          <option value="export_excel">
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
                          handleGroupButtonClicks("School Category", e)
                        }
                      >
                        {t("school_category_board")}
                      </button>
                      <button
                        type="button"
                        className={`nav-link details-multi dark-active1 ${cat_Details}`}
                        onClick={(e) =>
                          handleGroupButtonClicks("Cats Details", e)
                        }
                      >
                        {t("detailed_view")}
                      </button>

                      {/* <button
                        type="button"
                        className={`nav-link dark-active details-multi`}
                        id="cat_row_column"
                        onClick={(e) => switchColumnsToRow()}

                      >
                        By {showTransposed ? "Column" : "Rows"}
                      </button>   */}
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
                  // onSelect={handleTopFiveTabs}
                  className="nav-absolute"
                  onSelect={(k) => setActiveTab(k)}
                >
                  <Tab eventKey="about" title={t("about")}>
                    <div className="about-card mt-4">
                      <h2 className="heading-sm2 mb-2">{t("about_us")}</h2>
                      <p> {t("about_us_reports.report_1005.para1")} </p>
                      <p> {t("about_us_reports.report_1005.para2")}</p>
                      <p> {t("about_us_reports.report_1005.para3")}</p>
                      <p> {t("about_us_reports.report_1005.para4")}</p>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="table"
                    title={t("table")}
                    className="tabledata-ukkl"
                  >
                    {school_data?.isLoading && <GlobalLoading />}
                    <div
                      className="ag-theme-material ag-theme-custom-height ag-theme-quartz h-300"
                      style={{ height: 450 }}
                    >
                      <AgGridReact
                        key={gridRefreshKey}
                        rowData={arrGroupedDataTable ? arrGroupedDataTable : []}
                        getRowStyle={(params) => {
                          if (params.data.isTotalRow) {
                            return { fontWeight: 'bold' };  // Apply inline bold style for totals row
                          }
                          return {};  // Default style for other rows
                        }}
                        columnDefs={columns}
                        defaultColDef={defColumnDefs}
                        onGridReady={onGridReady}
                        groupDisplayType="custom"
                        groupHideOpenParents={true}
                        onColumnVisible={onColumnVisible}
                        pinnedBottomRowData={
                          showTransposed || showTransposedMgts
                            ? pinnedBottomRowDataByRows
                            : pinedBottomRowDatas
                        }
                      />
                    </div>
                  </Tab>

                  <Tab eventKey="graph" title={t("chart")}>
                    {school_data_valueTypes.isLoading && <GlobalLoading />}
                    {school_data_Years.isLoading && <GlobalLoading />}
                    <div className="card-box-impact tab-for-graph report-1003 mt-4">
                      <div className="row">
                        <div className="col-md-6 col-lg-6">
                          <div className="impact-box-content-education">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("no_of_schools_by_category")} <br />{" "}
                                {t("performance_last_five_years")}
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
                                    text:
                                      t("no_of_schools_by_category") +
                                      t("performance_last_five_years"),
                                    style: {
                                      fontSize: "15px",
                                    },
                                  },

                                  xAxis: {
                                    categories: years,
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

                                  // plotOptions: {
                                  //   line: {
                                  //     dataLabels: {
                                  //       enabled: true,
                                  //     },
                                  //     enableMouseTracking: false,
                                  //   },
                                  // },
                                  tooltip: {
                                    valueSuffix: "",
                                    pointFormatter: function () {
                                      return `<span style="color:${
                                        this.color
                                      }">\u25CF</span> ${
                                        this.series.name
                                      }: <b>${this.y.toLocaleString(
                                        "en-IN"
                                      )}</b><br/>`;
                                    },
                                  },
                                  plotOptions: {
                                    line: {
                                      dataLabels: {
                                        enabled: true,
                                        formatter: function () {
                                          return this.y.toLocaleString("en-IN");
                                        },
                                        style: {
                                          textShadow: false,
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
                                      data: secondaryData,
                                      color: "#F5BF55",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                    {
                                      name: t("upper_primary"),
                                      data: upperPrimData,
                                      color: "#751539",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                    {
                                      name: t("primary"),
                                      data: primaryData,
                                      color: "#BCE263",
                                      marker: {
                                        symbol: "circle",
                                      },
                                    },
                                  ],
                                  exporting: {
                                    filename: t("noOfSchoolsByCategory"),
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
                                {t("numberOfSchoolsByType")} <br />{" "}
                                {t("performance_last_five_years")}
                              </h2>
                            </div>
                            <div className="piechart-box mt-4">
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
                                    categories: years,

                                    // [
                                    //   "2018-2019",
                                    //   "2019-2020",
                                    //   "2020-2021",
                                    //   "2021-2022",
                                    //   "2022-2023"
                                    // ],
                                  },

                                  yAxis: {
                                    allowDecimals: false,
                                    min: 0,
                                    title: {
                                      text: "",
                                    },
                                  },
                                  title: {
                                    text:
                                      t("numberOfSchoolsByType") +
                                      t("performance_last_five_years"),
                                    style: {
                                      fontSize: "15px",
                                    },
                                  },
                                  tooltip: {
                                    headerFormat: "<b>{point.x}</b><br/>",
                                    pointFormat:
                                      "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
                                    pointFormatter: function () {
                                      return `<span style="color:${
                                        this.color
                                      }">\u25CF</span> ${
                                        this.series.name
                                      }: <b>${this.y.toLocaleString(
                                        "en-IN"
                                      )}</b><br/>`;
                                    },
                                  },

                                  plotOptions: {
                                    column: {
                                      stacking: "normal",
                                      minPointLength: 40,
                                      dataLabels: {
                                        enabled: true,
                                        crop: false,
                                        overflow: "none",
                                        rotation: 0,
                                        align: "center",
                                        x: -2,
                                        y: -5,
                                        style: {
                                          // color: 'black',
                                          font: "13px Arial, sans-serif",
                                          fontWeight: "600",
                                          stroke: "transparent",
                                          align: "center",
                                        },
                                        position: "top",
                                        formatter: function () {
                                          // return parseFloat(this.y).toFixed(2);
                                          return this.y.toLocaleString("en-IN");
                                        },
                                      },
                                    },
                                  },
                                  legend: {
                                    // title: {
                                    //   text: "Key",
                                    //   style: {
                                    //     fontSize: "18px",
                                    //   },
                                    // },
                                    layout: "horizontal",
                                    align: "center",
                                    verticalAlign: "bottom",
                                    itemMarginTop: 10,
                                    itemMarginBottom: 10,
                                  },
                                  credits: {
                                    enabled: false,
                                  },
                                  series: [
                                    {
                                      name: t("boys"),
                                      data: boysData,
                                      color: "#F5BF55",
                                      pointWidth: 60,
                                    },
                                    {
                                      name: t("girls"),
                                      data: girlsData,
                                      color: "#BCE263",
                                      pointWidth: 60,
                                    },
                                    {
                                      name: t("co-ed"),
                                      data: coedData,
                                      color: "#E6694A",
                                      pointWidth: 60,
                                    },
                                  ],
                                  exporting: {
                                    filename: t("noOfSchoolsByType"),
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
                          <div className="impact-box-content-education mt-3">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("percentageBySchoolCategory")}
                              </h2>
                            </div>

                            <div className="piechart-box mt-4">
                              <HighchartsReact
                                highcharts={Highcharts}
                                options={{
                                  chart: {
                                    type: "pie",
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
                                  events: {
                                    beforePrint: function () {},
                                    afterPrint: function () {},
                                  },
                                  title: {
                                    text: t("percentageBySchoolCategory"),
                                  },
                                  tooltip: {
                                    valueSuffix: "%",
                                    valueDecimals: 2,
                                  },
                                  credits: {
                                    enabled: false,
                                  },
                                  plotOptions: {
                                    pie: {
                                      size: "100%",
                                      dataLabels: {
                                        enabled: true,
                                        distance: -40,
                                        formatter: function () {
                                          return "<b>" + this.point.y + "%";
                                        },
                                        style: {
                                          fontSize: "16px",
                                          textOutline: "none",
                                          opacity: 0.7,
                                        },
                                      },
                                      center: ["50%", "50%"],
                                      showInLegend: true,
                                    },
                                    series: {
                                      allowPointSelect: true,
                                      cursor: "pointer",
                                      dataLabels: [
                                        {
                                          enabled: true,
                                          distance: 20,
                                        },
                                        {
                                          enabled: false,
                                          distance: -40,
                                          format: "{point.y:.2f}%",
                                          style: {
                                            fontSize: "0.6em",
                                            textOutline: "none",
                                            opacity: 0.7,
                                          },

                                          filter: {
                                            operator: ">",
                                            property: "percentage",
                                            value: 0,
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  legend: {
                                    // title: {
                                    //   text: "Key",
                                    //   style: {
                                    //     fontSize: "18px",
                                    //   },
                                    // },
                                    layout: "horizontal",
                                    align: "center",
                                    verticalAlign: "bottom",
                                    itemMarginTop: 10,
                                    itemMarginBottom: 10,
                                  },
                                  series: [
                                    {
                                      name: t("percentage"),
                                      colorByPoint: true,
                                      data: [
                                        {
                                          name: t("higher_secondary"),
                                          y: parseFloat(
                                            school_data_valueType.totSchoolHSec
                                          ),
                                          color: "#751539",
                                        },
                                        {
                                          name: t("secondary"),
                                          y: parseFloat(
                                            school_data_valueType.totSchoolSec
                                          ),
                                          color: "#E6694A ",
                                        },
                                        {
                                          name: t("upper_primary"),
                                          y: parseFloat(
                                            school_data_valueType.totSchoolUPry
                                          ),
                                          color: "#F5BF55",
                                        },
                                        {
                                          name: t("primary"),
                                          y: parseFloat(
                                            school_data_valueType.totSchoolPry
                                          ),
                                          color: "#BCE263",
                                        },
                                        // {
                                        //     name: 'Pre Primary',
                                        //     y: 7,
                                        //     color: '#57C1BB'
                                        // }
                                      ],
                                    },
                                  ],
                                  exporting: {
                                    filename: t("percentageBySchoolCategory"),
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
                          <div className="impact-box-content-education mt-3">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("percentageOfSchoolsByType")}
                              </h2>
                            </div>

                            <div className="piechart-box mt-4">
                              <HighchartsReact
                                highcharts={Highcharts}
                                options={{
                                  chart: {
                                    type: "pie",
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
                                  events: {
                                    beforePrint: function () {},
                                    afterPrint: function () {},
                                  },
                                  title: {
                                    text: t("percentageOfSchoolsByType"),
                                  },
                                  tooltip: {
                                    valueSuffix: "%",
                                    valueDecimals: 2,
                                  },
                                  credits: {
                                    enabled: false,
                                  },
                                  plotOptions: {
                                    pie: {
                                      size: "100%",
                                      dataLabels: {
                                        enabled: true,
                                        distance: -40,
                                        formatter: function () {
                                          return "<b>" + this.point.y + "%";
                                        },
                                        style: {
                                          fontSize: "16px",
                                          textOutline: "none",
                                          opacity: 0.7,
                                        },
                                      },
                                      center: ["50%", "50%"],
                                      showInLegend: true,
                                    },
                                    series: {
                                      allowPointSelect: true,
                                      cursor: "pointer",
                                      dataLabels: [
                                        {
                                          enabled: true,
                                          distance: 20,
                                        },
                                        {
                                          enabled: false,
                                          distance: -40,
                                          format: "{point.y:.2f}%",
                                          style: {
                                            fontSize: "0.6em",
                                            textOutline: "none",
                                            opacity: 0.7,
                                          },

                                          filter: {
                                            operator: ">",
                                            property: "percentage",
                                            value: 0,
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  legend: {
                                    // title: {
                                    //   text: "Key",
                                    //   style: {
                                    //     fontSize: "18px",
                                    //   },
                                    // },
                                    layout: "horizontal",
                                    align: "center",
                                    verticalAlign: "bottom",
                                    itemMarginTop: 10,
                                    itemMarginBottom: 10,
                                  },
                                  series: [
                                    {
                                      name: t("percentage"),
                                      colorByPoint: true,
                                      data: [
                                        {
                                          name: t("boys"),
                                          y: parseFloat(
                                            school_data_valueType.totSchoolB
                                          ),
                                          color: "#57C1BB",
                                        },
                                        {
                                          name: t("girls"),
                                          y: parseFloat(
                                            school_data_valueType.totSchoolG
                                          ),
                                          color: "#E6694A ",
                                        },
                                        {
                                          name: t("co-ed"),
                                          y: parseFloat(
                                            school_data_valueType.totSchoolCoed
                                          ),
                                          color: "#BCE263",
                                        },
                                      ],
                                    },
                                  ],

                                  exporting: {
                                    filename: t("percentageOfSchoolsByType"),
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
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FilterDropdownCommom358 />
    </>
  );
}
