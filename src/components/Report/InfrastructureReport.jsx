import React, { useEffect, useCallback, useId } from "react";
import "./infra.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchiveServicesSchoolData } from "../../redux/thunks/archiveServicesThunk";
import allReportsHindidata from "../../json-data/allReportsHindi.json";
import allreportsdata from "../../json-data/allreports.json";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import groupByKey from "../../utils/groupBy";
import Infraicon from "../../assets/images/infra-power.svg";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { allFilter } from "../../redux/slice/schoolFilterSlice";
import {
  block,
  blockWiseName,
  district,
  districtWiseName,
  generateTextContent,
  initialFilterSchoolData,
  intialStateWiseFilterSchData,
  nationalWiseName,
  selectedDYear,
  stateWiseName,
} from "../../constants/constants";
import initialTreeData from "./initialTreeData.json";
import HC_more from "highcharts/highcharts-more";
import { categoryMappings } from "../../constants/constants";
import {
  handleActiveTabs,
  handleCurrentIndex,
  handleViewDataByShow,
} from "../../redux/slice/headerSlice";
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
} from "../../constants/constants";
import { useTranslation } from "react-i18next";
import { removeAllDistrict } from "../../redux/thunks/districtThunk";
import { removeAllBlock } from "../../redux/thunks/blockThunk";
import { useLocation } from "react-router-dom";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";

import { handleMissingData } from "../../utils/handleMissingData";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";

import satyamevaimg from "../../assets/images/satyameva-jayate-img.png";
import udise from "../../assets/images/udiseplu.jpg";

import useReportOverallRegionSum from "../../CustomHook/useReportOverallRegionSum";

require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/treemap")(Highcharts);
require("highcharts/modules/treegraph")(Highcharts);
HC_more(Highcharts);
export default function Infrastructure({ id, type }) {
  const location = useLocation();
  const queryString = window.location.href;
  const urlParams = new URLSearchParams(queryString.replace("#/", ""));
  const paramValue = urlParams.get("type");
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const school_data = useSelector((state) => state.school);
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
  const distBlockWiseData = useSelector((state) => state.distBlockWise);
  const headerData = useSelector((state) => state.header);
  // const local_state = window.localStorage.getItem("state_wise");
  const [local_state, setLocalStateName] = useState("State Wise");
  const [local_district, setLocalDistrictName] = useState("District");
  const [local_block, setLocalBlockName] = useState("Block");
  const [isScrollComplete, setIsScrollComplete] = useState(false);
  const [local_year, setLocalYear] = useState("year");
  // const local_year = window.localStorage.getItem("year");
  const stateName = localStorage.getItem("state");
  const filterObj = structuredClone(schoolFilter);
  const [report, setReport] = useState(null);
  const [gridApi, setGridApi] = useState();
  const [currentDataTreeLength, setCurrentDataTreeLength] = useState(0);
  const [arrGroupedData, setArrGroupedData] = useState([]);
  const [groupKeys, setGroupKeys] = useState({
    schManagementDesc: false,
    schManagementBroad: false,
    schCategoryDesc: false,
    schCategoryBroad: false,
    schTypeDesc: false,
    schLocationDesc: false,
  });

  useEffect(() => {
    if (headerData.activeTab === "table") {
      window.localStorage.setItem("state_wise", "All India/National");
      window.localStorage.setItem("state", "All India/National");
      window.localStorage.setItem("map_state_name", "All India/National");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear);
    } else if (headerData.activeTab === "graph") {
      window.localStorage.setItem("state_wise", "State Wise");
      window.localStorage.setItem("state", "State Wise");
      window.localStorage.setItem("map_state_name", "State Wise");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear);
    }
  }, [headerData.activeTab]);
  useEffect(() => {
    setLocalStateName(localStorage.getItem("state_wise"));
    setLocalStateName(localStorage.getItem("state"));
    setLocalStateName(localStorage.getItem("map_state_name"));
    setLocalDistrictName(localStorage.getItem("map_district_name"));
    setLocalBlockName(localStorage.getItem("block"));
    setLocalYear(localStorage.getItem("year"));
  }, [filterObj, headerData.activeTab]);
  useEffect(() => {
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
  }, [location.pathname, headerData.activeTab]);
  const [chartHeight, setChartHeight] = useState(400);
  const [enabledScType, setEnabledSchType] = useState(false);
  const [enabledSchLocation, setEnabledSchLocation] = useState(false);
  const [showTransposed, setShowTransposed] = useState(false);
  const [showTransposedMgt, setShowTransposedMgt] = useState(false);
  const [mgt, setMgt] = useState("");
  const [mgt_Details, setMgtDetails] = useState("");
  const [cat, setCat] = useState("");
  const [cat_Details, setCatDetails] = useState("");
  const [sch_type, setSchType] = useState("");
  const [ur, setUR] = useState("");
  const [cloneUr, setCloneUR] = useState("");
  const [cloneSchtype, setCloneSchType] = useState("");
  const [multiMgt, setMultiMgt] = useState("");
  const [multiCat, setMultiCat] = useState("");
  const [data, setData] = useState([]);
  const [cloneFilterData, setCloneFilterData] = useState([]);
  const [customColumnName, setCustomColumn] = useState("");
  const [pinnedBottomRowDataByRows, setPinnedBottomRowDataByRows] = useState(
    []
  );
  const [topFiveData, setTopFiveData] = useState([]);
  const [performanceByData, setPerformanceByData] = useState([]);
  const [electricityConnectionByData, setElectricityConnectionByData] =
    useState([]);
  const [performanceBy, setPerformanceBy] = useState("School Management");
  const [connectionBy, setConnectionBy] = useState("School Management");
  const [activeTab, setActiveTab] = useState(type);
  const [updatedTreeData, setUpdatedTreeData] = useState([]);

  (function (H) {
    H.seriesTypes.pie.prototype.animate = function (init) {
      const series = this,
        chart = series.chart,
        points = series.points,
        { animation } = series.options,
        { startAngleRad } = series;
      function fanAnimate(point, startAngleRad) {
        const graphic = point?.graphic,
          args = point?.shapeArgs;
        if (graphic && args) {
          graphic
            // Set inital animation values
            .attr({
              start: startAngleRad,
              end: startAngleRad,
              opacity: 1,
            })
            // Animate to the final position
            .animate(
              {
                start: args.start,
                end: args.end,
              },
              {
                duration: animation.duration / points.length,
              },
              function () {
                // On complete, start animating the next point
                if (points[point.index + 1]) {
                  fanAnimate(points[point.index + 1], args.end);
                }
                // On the last point, fade in the data labels, then
                // apply the inner size
                if (point.index === series.points.length - 1) {
                  series.dataLabelsGroup.animate(
                    {
                      opacity: 1,
                    },
                    void 0,
                    function () {
                      points.forEach((point) => {
                        point.opacity = 1;
                      });
                      series.update(
                        {
                          enableMouseTracking: true,
                        },
                        false
                      );
                      chart.update({
                        plotOptions: {
                          pie: {
                            innerSize: "40%",
                            borderRadius: 8,
                          },
                        },
                      });
                    }
                  );
                }
              }
            );
        }
      }
      if (init) {
        // Hide points on init
        points.forEach((point) => {
          point.opacity = 0;
        });
      } else {
        fanAnimate(points[0], startAngleRad);
      }
    };
  })(Highcharts);

  const filter_query =
    (filterObj.regionType === 21 && filterObj.regionCode === "11") ||
    (filterObj.regionType === 22 &&
      filterObj.regionCode === distBlockWiseData.districtUdiseCode) ||
    (filterObj.regionType === 23 &&
      filterObj.regionCode === distBlockWiseData.blockUdiseCode);
  const filter_query_by_location =
    // local_state === "All India/National" ||
    local_state === "State Wise" ||
    local_district === "District Wise" ||
    local_block === "Block Wise";
  const filter_query_by_location_for_pinnedBottom =
    local_state !== "All India/National" ||
    local_state === "State Wise" ||
    local_district === "District Wise" ||
    local_block !== "Block Wise";
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
      hide: filter_query_by_location,
    },
    {
      headerName: "School Management(Broad)",
      field: "schManagementBroad",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "School Management(Detailed)",
      field: "schManagementDesc",
      suppressColumnsToolPanel: true,
      hide: true,
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
      headerName: "School Type",
      field: "schTypeDesc",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "Urban/Rural",
      field: "schLocationDesc",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "Total No. of Schools",
      field: "totSch",
      cellClass: "rightAligned",
    },
    {
      headerName: "No. of Schools having Electricity",
      field: "totSchElectricity",
      cellClass: "rightAligned",
    },
    {
      headerName: "Functional Electricity",
      field: "totSchFuncElectricity",
      cellClass: "rightAligned",
    },
    // {
    //   headerName: "Overall",
    //   field: "total",
    //   valueGetter: (params) => params.data ? params.data.total : null,
    //   aggFunc: 'sum',
    // },
  ]);
  useEffect(() => {
    setColumn((prevColumns) =>
      prevColumns.map((column) => {
        if (column.field === "regionName") {
          return {
            ...column,
            hide: !(
              local_state === "State Wise" ||
              local_district === "District Wise" ||
              local_block === "Block Wise"
            ),
          };
        }
        if (column.field === "schManagementBroad") {
          return {
            ...column,
            hide: groupKeys.schManagementBroad ? false : true,
          };
        }
        if (column.field === "schManagementDesc") {
          return {
            ...column,
            hide: groupKeys.schManagementDesc ? false : true,
          };
        }
        if (column.field === "schCategoryBroad") {
          return {
            ...column,
            hide: groupKeys.schCategoryBroad ? false : true,
          };
        }
        if (column.field === "schCategoryDesc") {
          return {
            ...column,
            hide: groupKeys.schCategoryDesc ? false : true,
          };
        }
        if (column.field === "schTypeDesc") {
          return {
            ...column,
            hide: groupKeys.schTypeDesc ? false : true,
          };
        }
        if (column.field === "schLocationDesc") {
          return {
            ...column,
            hide: groupKeys.schLocationDesc ? false : true,
          };
        }
        return column;
      })
    );
  }, [local_state, local_district, local_block, groupKeys]);

  const getLastTrueToShowTotal = () => {
    const lastTrueKey = Object.keys(groupKeys).reduce((lastKey, key) => {
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
    const allFalse = Object.values(groupKeys).every((value) => value === false);
    if (allFalse) {
      schoolLocationRow();
    } else {
      handleCustomKeyInAPIResponse();
      multiGroupingRows();
    }
    /*-----Handle Top Five States/Districts/Block-----*/
    handleTopFunctionalElectricityConnection();
    if (performanceBy === "School Management") {
      handlePerformanceBy("mgt", "schManagementDesc");
    }
    if (performanceBy === "School Category") {
      handlePerformanceBy("cat", "schCategoryDesc");
    }
    /*end here*/
    gridApi?.columnApi?.api.setColumnVisible(
      "regionName",
      filter_query_by_location
    );
  }, [school_data?.data?.data]);
  useEffect(() => {
    const allFalse = Object.values(groupKeys).every((value) => value === false);
    if (allFalse) {
      schoolLocationRow();
    } else {
      multiGroupingRows();
    }
  }, [groupKeys]);
  useEffect(() => {
    /*----------If any of the column is showing by row[disable school type/Urban/Rural]-------------*/
    if (showTransposed || showTransposedMgt) {
      setEnabledSchType(true);
      setEnabledSchLocation(true);
      if (ur === "active") {
        setUR("");
        setCloneUR("active");
      }
      if (sch_type === "active") {
        setCloneSchType("active");
        setSchType("");
      }
    } else {
      if (cloneUr === "active") {
        setUR("active");
        setCloneUR("");
      }
      if (cloneSchtype === "active") {
        setSchType("active");
        setCloneSchType("");
      }
      setEnabledSchType(false);
      setEnabledSchLocation(false);
    }
    /*-----end here------*/
  }, [showTransposed, showTransposedMgt]);
  useEffect(() => {
    multiGroupingRows();
    if (showTransposed) {
      switchColumnsToRows(false, true);
    } else if (showTransposedMgt) {
      switchColumnsToRowsMgt(false, true);
    }
  }, [data]);
  useEffect(() => {
    if (showTransposed) {
      switchColumnsToRows(false, true);
    } else if (showTransposedMgt) {
      switchColumnsToRowsMgt(false, true);
    }
  }, [cloneFilterData, groupKeys]);
  useEffect(() => {
    if (showTransposed || showTransposedMgt) {
      const appendedObj = {};
      columns.forEach((item) => {
        if (item.field === customColumnName) {
          appendedObj[item.field] = "Total";
        } else {
          appendedObj[item.field] = calculateTotal(item.field);
        }
      });
      setPinnedBottomRowDataByRows([appendedObj]);
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
    if (columnId === "schManagementBroad") {
      setGroupKeys((prev) => ({
        ...prev,
        schManagementBroad: visible,
      }));
      setMgt(() => (visible ? "active" : ""));
      setMultiMgt(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schManagementDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schManagementDesc: visible,
      }));
      setMgtDetails(() => (visible ? "active" : ""));
      setMultiMgt(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schCategoryBroad") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryBroad: visible,
      }));
      setCat(() => (visible ? "active" : ""));
      setMultiCat(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schCategoryDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryDesc: visible,
      }));
      setCatDetails(() => (visible ? "active" : ""));
      setMultiCat(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schTypeDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schTypeDesc: visible,
      }));
      setSchType(() => (visible ? "active" : ""));
    }
    if (columnId === "schLocationDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schLocationDesc: visible,
      }));
      setUR(() => (visible ? "active" : ""));
    }
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
        appendedObj.schManagementBroad = "State Government";
      } else if (gov_aided_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Govt. Aided";
      } else if (pvt_uaided_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Private Unaided";
      } else if (ctrl_gov_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Central Government";
      } else if (other_mgt_code.includes(item.schManagementCode)) {
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
      arr.push(appendedObj);
    });
    setData(arr);
  };
  const handleFilter = (value, e) => {
    if (value === "School Management" || value === "Mgt Details") {
      if (value === "School Management") {
        if (mgt === "active") {
          setMgt("");
        } else {
          setMgt("active");
        }
      } else {
        setMgt("");
      }
      if (value === "Mgt Details") {
        if (mgt_Details === "active") {
          setMgtDetails("");
        } else {
          setMgtDetails("active");
        }
      } else {
        setMgtDetails("");
      }
      /*hide and show multi button class for details view*/
      if (value === "School Management") {
        if (mgt === "active") {
          setMultiMgt("");
        } else {
          setMultiMgt("multibtn");
        }
      }
      if (value === "Mgt Details") {
        if (mgt_Details === "active") {
          setMultiMgt("");
        } else {
          setMultiMgt("multibtn");
        }
      }
      /*end here*/
    }
    if (value === "School Category" || value === "Cat Details") {
      if (value === "School Category") {
        if (cat === "active") {
          setCat("");
        } else {
          setCat("active");
        }
      } else {
        setCat("");
      }
      if (value === "Cat Details") {
        if (cat_Details === "active") {
          setCatDetails("");
        } else {
          setCatDetails("active");
        }
      } else {
        setCatDetails("");
      }
      if (value === "School Category") {
        if (cat === "active") {
          setMultiCat("");
        } else {
          setMultiCat("multibtn");
        }
      }
      if (value === "Cat Details") {
        if (cat_Details === "active") {
          setMultiCat("");
        } else {
          setMultiCat("multibtn");
        }
      }
    }
    if (value === "School Type") {
      if (sch_type === "active") {
        setSchType("");
      } else {
        setSchType("active");
      }
    }
    if (value === "Urban/Rural") {
      if (ur === "active") {
        setUR("");
      } else {
        setUR("active");
      }
    }
  };
  const handleGroupButtonClick = (e, currObj) => {
    handleFilter(e, currObj);
    const updatedGroupKeys = { ...groupKeys };
    if (e === "School Management") {
      updatedGroupKeys.schManagementBroad = !groupKeys.schManagementBroad;
      updatedGroupKeys.schManagementDesc = false;
    } else if (e === "Mgt Details") {
      updatedGroupKeys.schManagementDesc = !groupKeys.schManagementDesc;
      updatedGroupKeys.schManagementBroad = false;
    } else if (e === "School Category") {
      updatedGroupKeys.schCategoryBroad = !groupKeys.schCategoryBroad;
      updatedGroupKeys.schCategoryDesc = false;
    } else if (e === "Cat Details") {
      updatedGroupKeys.schCategoryDesc = !groupKeys.schCategoryDesc;
      updatedGroupKeys.schCategoryBroad = false;
    } else if (e === "School Type") {
      updatedGroupKeys.schTypeDesc = !groupKeys.schTypeDesc;
    } else if (e === "Urban/Rural") {
      updatedGroupKeys.schLocationDesc = !groupKeys.schLocationDesc;
    }
    setGroupKeys(updatedGroupKeys);
    const allFalse = Object?.values(updatedGroupKeys).every(
      (value) => value === false
    );
    if (allFalse) {
      schoolLocationRow();
    } else {
      handleCustomKeyInAPIResponse();
      multiGroupingRows();
    }
    if (showTransposed) {
      switchColumnsToRows();
    } else if (showTransposedMgt) {
      switchColumnsToRowsMgt();
    }
  };
  const schoolLocationRow = () => {
    const primaryKeys = ["regionName"];
    const groupedData = groupByKey(updatedSchoolData, primaryKeys);
    const updatedArrGroupedData = [];
    if (groupedData && typeof groupedData === "object") {
      Object?.keys(groupedData)?.forEach((item, idx) => {
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
          totSchElectricity: totalSchoolsHaveElectricity,
          totSchFuncElectricity: totalFunElectricity,
        };
        updatedArrGroupedData.push(appended);
      });
      setArrGroupedData(updatedArrGroupedData);
      setCloneFilterData(updatedArrGroupedData);
    }
    gridApi?.columnApi?.api.setColumnVisible("regionName", true);
    gridApi?.columnApi?.api.setColumnVisible("schManagementBroad", false);
    gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schCategoryBroad", false);
    gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
  };
  const multiGroupingRows = () => {
    const primaryKeys = Object?.keys(groupKeys).filter((key) => groupKeys[key]);
    if (primaryKeys.length > 0) {
      filter_query && primaryKeys.push("regionName");
      const groupedData = groupByKey(data, primaryKeys);
      const updatedArrGroupedData = [];
      if (groupedData && typeof groupedData === "object") {
        Object?.keys(groupedData).forEach((item, idx) => {
          const itemsArray = groupedData[item];
          let totalSchoolsHaveElectricity = 0;
          let totalFunElectricity = 0;
          let totalSchools = 0;
          let regionName = "";
          itemsArray.forEach((dataItem) => {
            regionName = dataItem.regionName;
            totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
            totalSchools += parseInt(dataItem.totSch);
            totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
          });
          const appended = {};
          primaryKeys.forEach((key, index) => {
            appended.regionName = regionName;
            appended[key] = item.split("@")[index];
          });
          appended["Serial Number"] = idx + 1;
          appended.totSchElectricity = totalSchoolsHaveElectricity;
          appended.totSch = totalSchools;
          appended.totSchFuncElectricity = totalFunElectricity;
          updatedArrGroupedData.push(appended);
        });
        setCloneFilterData(updatedArrGroupedData);
        setArrGroupedData(updatedArrGroupedData);
      }
      gridApi?.columnApi?.api.setColumnVisible(
        "schManagementBroad",
        groupKeys.schManagementBroad
      );
      gridApi?.columnApi?.api.setColumnVisible(
        "schManagementDesc",
        groupKeys.schManagementDesc
      );
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
      gridApi?.columnApi?.api.setColumnVisible("regionName", filter_query);
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
    const anyGroupKeyTrue = Object.values(groupKeys).some(
      (value) => value === true
    );
    const pinnedBottomRowDatas =
      (anyGroupKeyTrue || local_state !== "All India/National") &&
      (anyGroupKeyTrue ||
        local_state === "State Wise" ||
        anyGroupKeyTrue ||
        local_district === "District Wise" ||
        anyGroupKeyTrue ||
        local_block === "Block Wise")
        ? showTransposed || showTransposedMgt
          ? pinnedBottomRowDataByRows
          : pinedBottomRowData
        : [];
    const pinnedBottomRow = pinnedBottomRowDatas;
    const date = new Date();
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
    if (pinnedBottomRow && pinnedBottomRow.length > 0) {
      pinnedBottomRow.forEach((row) => {
        const totalRow = headerRow.map((header) => {
          let field = header.text;
          if (row.hasOwnProperty(field.charAt(0).toLowerCase() + field.slice(1))) {
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
          columnHeaderText === "Location"
        ) {
          data.cell.styles.halign = "left";
        } else if (
          columnHeaderText === "SchManagementBroad" ||
          columnHeaderText === "SchCategoryBroad" ||
          columnHeaderText === "SchTypeDesc" ||
          columnHeaderText === "SchLocationDesc" ||
          columnHeaderText === "SchManagementDesc" ||
          columnHeaderText === "SchManagementDesc" ||
          columnHeaderText === "SchCategoryDesc"
        ) {
          data.cell.styles.halign = "left";
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
  /*----------------end here---------------------*/
  /*-----------Transposed rows  and column wise data------------*/
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
  const custom = () => {
    const arr = [];
    const uniqueLocation = new Set();
    const uniqueKeys = new Set();
    let customColumnName = "";
    const primaryKey = Object?.keys(groupKeys).filter((key) => groupKeys[key]);
    // filter_query && primaryKey.push("regionName");
    const groupedData = groupByKey(data, primaryKey);
    /*Grouperd data*/
    const updatedArrGroupedData = [];
    if (groupedData && typeof groupedData === "object") {
      Object?.keys(groupedData).forEach((item) => {
        const itemsArray = groupedData[item];
        let totalSchoolsHaveElectricity = 0;
        let regionName = "";
        itemsArray.forEach((dataItem) => {
          regionName = dataItem.regionName;
          totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
        });
        const appended = {};
        primaryKey.forEach((key, index) => {
          appended.regionName = regionName;
          appended[key] = item.split("@")[index];
        });
        appended.totSchElectricity = totalSchoolsHaveElectricity;
        updatedArrGroupedData.push(appended);
      });
    }
    /*end groupedData*/
    cloneFilterData?.forEach((row) => {
      let location;
      let key;
      /*----If school type and Urban/Rural are false-----*/
      if (
        groupKeys.schTypeDesc === false &&
        groupKeys.schLocationDesc === false
      ) {
        if (groupKeys.schManagementBroad) {
          location = row.schManagementBroad;
          customColumnName = "School Management(Broad)";
          setCustomColumn("School Management(Broad)");
        } else if (groupKeys.schManagementDesc) {
          location = row.schManagementDesc;
          customColumnName = "School Management(Detailed)";
          setCustomColumn("School Management(Detailed)");
        } else {
          location = row.regionName;
          customColumnName = "Location";
          setCustomColumn("Location");
        }
      }
      /*end if block here*/
      /*row wise data for category*/
      if (groupKeys.schCategoryBroad) {
        key = row.schCategoryBroad;
      } else if (groupKeys.schCategoryDesc) {
        key = row.schCategoryDesc;
      }
      /*end here*/
      uniqueLocation.add(location);
      key = key?.replace(/\./g, "");
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
      }
    });
    const primaryKeys = Object?.keys(groupKeys).filter(
      (key) =>
        groupKeys[key] && (key === "schTypeDesc" || key === "schLocationDesc")
    );
    let newArrayCol = primaryKeys.filter((value) => value !== "");
    const columnHeaders = [
      customColumnName,
      newArrayCol,
      ...Array.from(uniqueKeys),
      "Total",
    ];

    /*static grouped data*/
    /*without selecting school type and urban /rural*/
    let counts = {};
    updatedArrGroupedData.forEach((entry) => {
      const {
        schCategoryBroad,
        schManagementBroad,
        totSchElectricity,
        totSch,
      } = entry;
      // If the management type does not exist in the counts object, create it
      if (!counts[schManagementBroad]) {
        counts[schManagementBroad] = {};
      }
      // If the category does not exist in the management type, create it
      if (!counts[schManagementBroad][schCategoryBroad]) {
        counts[schManagementBroad][schCategoryBroad] = 0;
      }
      // Increment the total electricity count
      counts[schManagementBroad][schCategoryBroad] += totSchElectricity;
    });
    /*end here*/
    const newArr = arr.map((item) => {
      return { ...item, Total: countTotalPinnedWithRight(item) };
    });
    //when school type urban/rural selected
    // updatedArrGroupedData.forEach(entry => {
    //       const { schCategoryBroad, totSchElectricity } = entry;
    //       entry[schCategoryBroad] = totSchElectricity;
    //       delete entry.totSchElectricity;
    //       delete entry.schCategoryBroad;
    //   });

    /*static grouped data end here*/
  };
  const switchColumnsToRows = (e, flag = false) => {
    setShowTransposedMgt(false);
    if (flag || !showTransposed) {
      const arr = [];
      const uniqueLocation = new Set();
      const uniqueKeys = new Set();
      let customColumnName = "";
      cloneFilterData?.forEach((row) => {
        let location;
        let key;
        if (groupKeys.schManagementBroad) {
          location = row.schManagementBroad;
          customColumnName = "School Management(Broad)";
          setCustomColumn("School Management(Broad)");
        } else if (groupKeys.schManagementDesc) {
          location = row.schManagementDesc;
          customColumnName = "School Management(Detailed)";
          setCustomColumn("School Management(Detailed)");
        } else {
          location = row.regionName;
          customColumnName = "Location";
          setCustomColumn("Location");
        }
        /*row wise data for category*/
        if (groupKeys.schCategoryBroad) {
          key = row.schCategoryBroad;
        } else if (groupKeys.schCategoryDesc) {
          key = row.schCategoryDesc;
        }
        /*end here*/
        uniqueLocation.add(location);
        key = key?.replace(/\./g, "");
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
        }
        const existingDataIndex = arr.findIndex(
          (data) => data[customColumnName] === location
        );
        if (existingDataIndex !== -1) {
          arr[existingDataIndex][key] =
            (arr[existingDataIndex][key] || 0) + parseInt(row.totSch, 10);
        } else {
          let newData = { [customColumnName]: location, Total: 0 };
          newData[key] = parseInt(row.totSch, 10);
          arr.push(newData);
        }
      });
      const columnHeaders = [
        "Serial Number",
        customColumnName,
        ...Array.from(uniqueKeys),
        "Total",
      ];
      //       columnHeaders.map((header, index) => ({
      //     headerName: header,
      //     field: index === 0 ? header?.replace(/\./g, "") : header, // If it's the first element, modify the field
      //     "Serial Number": index === 0 ? "value for first key" : undefined // Add an additional key for the first element only
      // }))
      setColumn(
        columnHeaders.map((header, idx) => {
          if (idx !== 0) {
            return {
              headerName: header,
              field: header?.replace(/\./g, ""),
              cellClass: idx > 1 ? "rightAligned" : "",
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
          Total: countTotalPinnedWithRight(item),
          "Serial Number": idx + 1,
        };
      });
      setArrGroupedData(newArr);
    } else {
      setArrGroupedData(cloneFilterData);
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
          hide: !filter_query,
        },
        {
          headerName: "School Management(Broad)",
          field: "schManagementBroad",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schManagementBroad,
        },
        {
          headerName: "School Management(Detailed)",
          field: "schManagementDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schManagementDesc,
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
          headerName: "School Type",
          field: "schTypeDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schTypeDesc,
        },
        {
          headerName: "Urban/Rural",
          field: "schLocationDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schLocationDesc,
        },
        {
          headerName: "Total No. of Schools",
          field: "totSch",
          cellClass: "rightAligned",
        },
        {
          headerName: "No. of Schools having Electricity",
          field: "totSchElectricity",
          cellClass: "rightAligned",
        },
        {
          headerName: "Functional Electricity",
          field: "totSchFuncElectricity",
          cellClass: "rightAligned",
        },
      ]);
    }
    if (!flag) {
      setShowTransposed(!showTransposed);
    }
  };
  const switchColumnsToRowsMgt = (e, flag = false) => {
    setShowTransposed(false);
    if (flag || !showTransposedMgt) {
      const arr = [];
      const uniqueLocation = new Set();
      const uniqueKeys = new Set();
      let customColumnName = "";
      cloneFilterData?.forEach((row) => {
        let location;
        let key;
        if (groupKeys.schCategoryBroad) {
          location = row.schCategoryBroad;
          customColumnName = "School Category(Broad)";
          setCustomColumn("School Category(Broad)");
        } else if (groupKeys.schCategoryDesc) {
          location = row.schCategoryDesc;
          customColumnName = "School Category(Detailed)";
          setCustomColumn("School Category(Detailed)");
        } else {
          location = row.regionName;
          customColumnName = "Location";
          setCustomColumn("Location");
        }
        /*row wise data for category*/
        if (groupKeys.schManagementBroad) {
          key = row.schManagementBroad;
        } else if (groupKeys.schManagementDesc) {
          key = row.schManagementDesc;
        }
        /*end here*/
        uniqueLocation.add(location);
        key = key?.replace(/\./g, "");
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
        }
        const existingDataIndex = arr.findIndex(
          (data) => data[customColumnName] === location
        );
        if (existingDataIndex !== -1) {
          arr[existingDataIndex][key] =
            (arr[existingDataIndex][key] || 0) +
            parseInt(row.totSchElectricity, 10);
        } else {
          const newData = { [customColumnName]: location };
          newData[key] = parseInt(row.totSchElectricity, 10);
          arr.push(newData);
        }
      });
      const columnHeaders = [
        "Serial Number",
        customColumnName,
        ...Array.from(uniqueKeys),
        "Total",
      ];
      setColumn(
        columnHeaders.map((header, idx) => {
          if (idx !== 0) {
            return {
              headerName: header,
              field: header?.replace(/\./g, ""),
              cellClass: idx > 1 ? "rightAligned" : "",
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
          Total: countTotalPinnedWithRight(item),
          "Serial Number": idx + 1,
        };
      });
      setArrGroupedData(newArr);
    } else {
      setArrGroupedData(cloneFilterData);
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
          hide: !filter_query,
        },
        {
          headerName: "School Management(Broad)",
          field: "schManagementBroad",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schManagementBroad,
        },
        {
          headerName: "School Management(Detailed)",
          field: "schManagementDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schManagementDesc,
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
          headerName: "School Type",
          field: "schTypeDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schTypeDesc,
        },
        {
          headerName: "Urban/Rural",
          field: "schLocationDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schLocationDesc,
        },
        {
          headerName: "Total No. of Schools",
          field: "totSch",
          cellClass: "rightAligned",
        },
        {
          headerName: "No. of Schools having Electricity",
          field: "totSchElectricity",
          cellClass: "rightAligned",
        },
        {
          headerName: "Functional Electricity",
          field: "totSchFuncElectricity",
          cellClass: "rightAligned",
        },
      ]);
    }
    if (!flag) {
      setShowTransposedMgt(!showTransposedMgt);
    }
  };
  /*------------------End here------------------*/

  const pinedBottomRowData = [
    {
      ...(getLastTrueToShowTotal()
        ? { [getLastTrueToShowTotal()]: "Total" }
        : { regionName: "Total" }),
      totSch: calculateTotal("totSch"),
      totSchElectricity: calculateTotal("totSchElectricity"),
      totSchFuncElectricity: calculateTotal("totSchFuncElectricity"),
      // total: calculateTotal("totSch") + calculateTotal("totSchElectricity") + calculateTotal("totSchFuncElectricity"),
    },
  ];

  const [limit] = useState(5);
  //const [currentIndex, dispatch(handleCurrentIndex] = useState(0);
  const currentIndex = useSelector((state) => state.header.currentIndex);
  const [data_tree, setDataTree] = useState([]);

  useEffect(() => {
    if (connectionBy === "School Management") {
      handleElectricityConnection("mgt_connection", [
        "regionName",
        "schManagementDesc",
      ]);
    }
    if (connectionBy === "School Category") {
      handleElectricityConnection("cat_connection", [
        "regionName",
        "schCategoryDesc",
      ]);
    }
    const result = treeDataGroupByParentID(limit);
    setDataTree(result);
  }, [currentIndex]);

  useEffect(() => {
    const result = treeDataGroupByParentID(limit);
    setDataTree(result);
  }, [updatedTreeData]);

  // current working
  // Treegraph data
  let initial_tree_data = [];
  const treeDataGroupByParentID = (limit) => {
    const groupedD = groupByKey(updatedTreeData, ["parent"]);

    initial_tree_data.push(initialTreeData.data_tree[0]);

    setCurrentDataTreeLength(
      groupedD["IND"]?.slice(currentIndex, currentIndex + limit).length
    );

    groupedD["IND"]
      ?.slice(currentIndex, currentIndex + limit)
      .forEach((item) => {
        // remove percentage value into the name key
        initial_tree_data.push(
          item
          //   {
          //   ...item,
          //   name: item.name.replace(/\s*\d+(\.\d+)?%$/, ""),
          // }
        );
        groupedD[item.id]?.forEach((item) => {
          // remove percentage value into the name key

          initial_tree_data.push(
            item
            //   {
            //   ...item,
            //   name: item.name.replace(/\s*\d+(\.\d+)?%$/, ""),
            // }
          );
        });
      });
    return initial_tree_data;
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      dispatch(handleCurrentIndex(currentIndex - limit));
    }
  };

  const handleNext = () => {
    if (currentDataTreeLength >= limit && currentIndex < 38 - limit) {
      dispatch(handleCurrentIndex(currentIndex + limit));
    }
  };

  /*<><><><><><><><><><>-------Chart Data--------<><><><><><><><><><><><>*/
  /*---Top Five States/Districts/Blocks Having School Having Functional Electricty Connection----*/
  const handleTopFunctionalElectricityConnection = () => {
    const groupedData = groupByKey(updatedSchoolData, ["regionName"]);
    const updatedArrGroupedData = [];
    if (groupedData && typeof groupedData === "object") {
      Object?.keys(groupedData).forEach((item) => {
        const itemsArray = groupedData[item];
        let totalFunElectricity = 0;
        let totalSchools = 0;
        let regionName = "";
        itemsArray.forEach((dataItem) => {
          regionName = dataItem.regionName;
          totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
          totalSchools += parseInt(dataItem.totSch);
        });
        const appended = {};
        appended.regionName = regionName;
        appended.totalFunElectricity = totalFunElectricity;
        appended.totalSchool = totalSchools;
        updatedArrGroupedData.push(appended);
      });
    }

    const final_result = updatedArrGroupedData.map((item) => {
      const percentage = calculatePercentage(
        item.totalSchool,
        item.totalFunElectricity
      );
      const state_name_length = item.regionName.split(" ").length;
      let state_name = "";
      if (state_name_length > 1) {
        state_name =
          item.regionName
            .split(" ")
            .map((item) => {
              return item.charAt(0);
            })
            .join(".") +
          " " +
          percentage +
          "%";
      } else {
        state_name =
          item.regionName
            .split(" ")
            .map((item) => {
              return item.slice(0, 3).toUpperCase();
            })
            .join("") +
          " " +
          percentage +
          "%";
      }
      const full_state_name = item.regionName + " " + percentage + "%";
      return {
        value: percentage,
        fullStateName: full_state_name,
        name: state_name,
        count: item.totalFunElectricity,
        color: getColorCode(percentage),
        totalSchool: item.totalSchool,
      };
    });
    let sortedTopFiveStates = final_result
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    setTopFiveData(sortedTopFiveStates);
    setElectricityConnectionByData(final_result);
  };
  const calculatePercentage = (total, funElectiricity) => {
    return parseFloat(((funElectiricity / total) * 100).toFixed(2));
  };
  function getColorCode(percentage) {
    const colorRanges = [
      { min: 90, color: "#BCE263" },
      { min: 80, max: 89.99, color: "#F5BF55" },
      { min: 0, max: 79.99, color: "#E6694A" },
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
  /*end here*/
  /*---Performance By School Management----*/
  const handlePerformanceBy = (performance_type, groupKey) => {
    const groupedData = groupByKey(updatedSchoolData, [groupKey]);
    const updatedArrGroupedData = [];
    if (groupedData && typeof groupedData === "object") {
      Object?.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];
        let totalFunElectricity = 0;
        let totalSchools = 0;
        let schManagementDesc = "";
        let schCategoryDesc = "";
        let regionName = "";
        if (performance_type === "mgt") {
          itemsArray.forEach((dataItem, idx) => {
            regionName = dataItem.regionName;
            schManagementDesc = dataItem.schManagementDesc;
            totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
            totalSchools += parseInt(dataItem.totSch);
          });
          const appended = {};
          appended.regionName = regionName;
          appended.schManagementDesc = schManagementDesc;
          appended.totalFunElectricity = totalFunElectricity;
          appended.totalSchool = totalSchools;
          updatedArrGroupedData.push(appended);
        }
        if (performance_type === "cat") {
          itemsArray.forEach((dataItem) => {
            regionName = dataItem.regionName;
            schCategoryDesc = dataItem.schCategoryDesc;
            totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
            totalSchools += parseInt(dataItem.totSch);
          });
          const appended = {};
          appended.regionName = regionName;
          appended.schCategoryDesc = schCategoryDesc;
          appended.totalFunElectricity = totalFunElectricity;
          appended.totalSchool = totalSchools;
          updatedArrGroupedData.push(appended);
        }
      });
      const final_result = updatedArrGroupedData.map((item) => {
        const percentage = calculatePercentage(
          item.totalSchool,
          item.totalFunElectricity
        );
        const per =
          performance_type === "mgt"
            ? item["schManagementDesc"] + `</br>${percentage}%`
            : item["schCategoryDesc"] + `</br>${percentage}%`;
        return {
          value: percentage,
          name: per,
          count: item.totalFunElectricity,
          color: getColorCode(percentage),
          totalSchool: item.totalSchool,
          regionName: item.regionName,
        };
      });
      setPerformanceByData(final_result);
    }
  };

  /*-----end here----*/
  /*<><><><><><><><><>-------Chart Data End Here--------<><><><><><><><>*/
  const handlePerformanceByTabChange = (e) => {
    setPerformanceBy(e);
    if (e === "School Management") {
      handlePerformanceBy("mgt", "schManagementDesc");
    } else {
      handlePerformanceBy("cat", "schCategoryDesc");
    }
  };

  dispatch(handleActiveTabs(activeTab));
  // useEffect(() => {
  //   if (headerData.activeTab === "table") {
  //     dispatch(allFilter(initialFilterSchoolData));
  //     dispatch(fetchArchiveServicesSchoolData(initialFilterSchoolData));
  //   } else if (headerData.activeTab === "graph") {
  //     dispatch(allFilter(intialStateWiseFilterSchData));
  //     dispatch(fetchArchiveServicesSchoolData(intialStateWiseFilterSchData));
  //   }
  // }, [headerData.activeTab]);

  useEffect(() => {
    if (activeTab === "table") {
      window.localStorage.setItem("map_state_name", "All India/National");
      window.localStorage.setItem("state", "All India/National");
      window.localStorage.setItem("state_wise", "All India/National");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear);
      dispatch(fetchArchiveServicesSchoolData(initialFilterSchoolData));
    }
    if (activeTab === "graph") {
      window.localStorage.setItem("map_state_name", "State Wise");
      window.localStorage.setItem("state", "State Wise");
      window.localStorage.setItem("state_wise", "State Wise");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("year", selectedDYear);
      dispatch(fetchArchiveServicesSchoolData(intialStateWiseFilterSchData));
    }

    dispatch(handleViewDataByShow(!(headerData.activeTab === "graph")));
  }, [headerData.activeTab]);
  /*-----end here------*/

  const handleConnectionByTabChange = (e) => {
    setConnectionBy(e);
    if (e === "School Management") {
      handleElectricityConnection("mgt_connection", [
        "regionName",
        "schManagementDesc",
      ]);
    } else {
      handleElectricityConnection("cat", ["regionName", "schCategoryDesc"]);
    }
  };

  useEffect(() => {
    handleElectricityConnection("mgt_connection", [
      "regionName",
      "schManagementDesc",
    ]);
  }, [electricityConnectionByData]);

  const handleElectricityConnection = (performance_type, groupKey) => {
    const arr = electricityConnectionByData.map((item) => {
      const per = calculatePercentage(item.totalSchool, item.count);
      return {
        id: item.fullStateName.split(" ")[0],
        parent: "IND",
        name: item.fullStateName,
        color: getColorCode(per),
        value: per,
      };
    });

    arr.unshift({
      id: "IND",
      parent: "",
      name: "INDIA",
      color: "#EBEBEB",
    });

    const groupedData = groupByKey(school_data?.data?.data, groupKey);
    const transformData = (inputData) => {
      const outputData = {};
      for (const key in inputData) {
        const [state, type] = key.split("@");
        if (!outputData[state]) {
          outputData[state] = {};
        }
        outputData[state][type.trim()] = inputData[key];
      }
      return outputData;
    };
    const childArray = [];
    let count = 1;

    if (groupedData && typeof groupedData === "object") {
      const outputData = transformData(groupedData);

      Object?.keys(outputData).forEach((item) => {
        Object?.keys(outputData[item]).forEach((innerItem) => {
          let totalFunElectricity = 0;
          let totalSchools = 0;
          let regionName = "";

          outputData[item][innerItem].forEach((elem) => {
            regionName = elem.regionName;
            totalFunElectricity += parseInt(elem.totSchFuncElectricity);
            totalSchools += parseInt(elem.totSch);
          });
          const appended = {};
          appended.regionName = regionName;
          appended.totalFunElectricity = totalFunElectricity;
          appended.totalSchool = totalSchools;
          const percentage = calculatePercentage(
            appended.totalSchool,
            appended.totalFunElectricity
          );
          const typeName = innerItem + " " + percentage + "%";
          childArray.push({
            id: ++count,
            parent: item.split(" ")[0],
            name: typeName,
            color: getColorCode(percentage),
            value: percentage,
          });
        });
      });
      const final_array = [...arr, ...childArray];
      setUpdatedTreeData(final_array);
    }
  };

  {
    /*<><><><><><><> function for dynamically take state graph start <><><><><><>*/
  }
  const handleNodeClick = (e) => {
    const node = e.point;
    const childNodesCount = countAllChildNodes(node);
    const pixelValue = 10;

    let newHeight = chartHeight;
    if (node.collapsed) {
      newHeight += childNodesCount * pixelValue;
    } else {
      newHeight -= childNodesCount * pixelValue;
    }

    const minHeight = 100;
    newHeight = Math.max(newHeight, minHeight);
    setChartHeight(newHeight);
  };

  const countAllChildNodes = (node) => {
    let count = 0;

    if (node && node.options && node.options.id) {
      const nodeId = node.options.id;

      if (node.series && node.series.data) {
        node.series.data.forEach((data) => {
          if (data.parent === nodeId) {
            count++;
            count += countAllChildNodes(data);
          }
        });
      }
    }

    return count;
  };

  {
    /*<><><><><><><> function for dynamically take state graph end <><><><><><>*/
  }

  /*<><><><><><><><><>-------Chart Data End Here--------<><><><><><><><>*/

  // Remove </br> tag and sort data in increasing order based on the percentage value

  // remove br tag and sort data so when see view map data
  let modifiedPerformanceData = performanceByData
    // remove br tage and percentage value into name key
    ?.map((item) => ({
      ...item,
      name: item.name,
      // name: item.name.split("</br>")[0],
    }))
    .sort((a, b) => {
      const extractPercentage = (name) =>
        parseFloat(name.split("\n")[1]?.replace("%", "").trim()) || 0;
      return extractPercentage(b.name) - extractPercentage(a.name);
    });

  // Function to extract and parse percentage value from formatted name string
  const storedStateWise = window.localStorage.getItem("map_state_name");
  const storedDistrictWise = window.localStorage.getItem("map_district_name");
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
  }, [schoolFilter, arrGroupedData]);

  const handleScrollComplete = () => {
    setIsScrollComplete(true);
  };

  // const arrGroupedDataTable = handleMissingData(arrGroupedData, columns);
  const anyGroupKeyTrue = Object.values(groupKeys).some(
    (value) => value === true
  );
  const pinnedBottomRowDatas =
    (anyGroupKeyTrue || local_state !== "All India/National") &&
    (anyGroupKeyTrue ||
      local_state === "State Wise" ||
      anyGroupKeyTrue ||
      local_district === "District Wise" ||
      anyGroupKeyTrue ||
      local_block === "Block Wise")
      ? showTransposed || showTransposedMgt
        ? pinnedBottomRowDataByRows
        : pinedBottomRowData
      : [];
  const arrGroupedDataTable = handleMissingData(arrGroupedData, columns).map(
    (item) => ({
      ...item,
      total: item.totSch + item.totSchElectricity + item.totSchFuncElectricity,
    })
  );


 
  const result = useReportOverallRegionSum(arrGroupedDataTable);
  return (
    <>
      <ScrollToTopOnMount onScrollComplete={handleScrollComplete} />
      {school_data.isLoading && <GlobalLoading />}
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
                            {t("download_as_pdf")}{" "}
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
          {/* {headerData.isViewDataByShow && ( */}
          <div className="container pb-4">
            <div className="row">
              {activeTab !== "about" && activeTab !== "graph" && (
                <div className="col-md-12 col-lg-12 d-flex align-items-center">
                  <div className="tab-text-infra me-4">{t("view_data_by")}</div>
                  <ul className="nav nav-tabs mul-tab-main">
                    <li className={`nav-item ${multiMgt}`}>
                      <button
                        type="button"
                        className={`nav-link dark-active ${mgt}`}
                        onClick={(e) =>
                          handleGroupButtonClick("School Management", e)
                        }
                      >
                        {t("school_management_board")}
                      </button>
                      <button
                        type="button"
                        className={`nav-link dark-active details-multi ${mgt_Details}`}
                        id="school_mgt_details"
                        onClick={(e) =>
                          handleGroupButtonClick("Mgt Details", e)
                        }
                      >
                        {t("detailed_view")}
                      </button>
                      {/* <button
                          type="button"
                          className={`nav-link dark-active details-multi`}
                          id="mgt_row_column"
                          onClick={(e) => switchColumnsToRowsMgt()}
                        >
                          {t("by")}-
                          {showTransposedMgt ? t("column") : t("rows")}
                        </button> */}
                    </li>
                    <li className={`nav-item ${multiCat}`}>
                      <button
                        type="button"
                        className={`nav-link dark-active1 ${cat}`}
                        onClick={(e) =>
                          handleGroupButtonClick("School Category", e)
                        }
                      >
                        {t("school_category_board")}
                      </button>
                      <button
                        type="button"
                        className={`nav-link details-multi dark-active1 ${cat_Details}`}
                        onClick={(e) =>
                          handleGroupButtonClick("Cat Details", e)
                        }
                      >
                        {t("detailed_view")}
                      </button>
                      {/* <button
                          type="button"
                          className={`nav-link dark-active details-multi`}
                          id="cat_row_column"
                          onClick={(e) => switchColumnsToRows()}
                        >
                          {t("by")}-{showTransposed ? t("column") : t("rows")}
                        </button> */}
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${sch_type}`}
                        onClick={(e) =>
                          handleGroupButtonClick("School Type", e)
                        }
                        disabled={enabledScType}
                      >
                        {t("school_type")}
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${ur}`}
                        onClick={(e) =>
                          handleGroupButtonClick("Urban/Rural", e)
                        }
                        disabled={enabledSchLocation}
                      >
                        {t("urban_rural")}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* )} */}
        </div>
        <div className="bg-grey ptb-30">
          <div className="container tab-for-graph">
            <div className="row align-items-center report-inner-tab">
              <div className="col-md-12 col-lg-12 table-text-i table-brud-card">
                {activeTab !== "about" && (
                  <h4 className="brudcrumb_heading">
                    {t("showing_result_for")} <span>&nbsp;{local_state}</span>
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
                  onSelect={(k) => setActiveTab(k)}
                  className="nav-absolute"
                >
                  <Tab eventKey="about" title={t("about")}>
                    <div className="about-card mt-4">
                      <h2 className="heading-sm2 mb-2">{t("about_us")}</h2>
                      <p>{t("about_us_reports.report_3016.para1")}</p>
                      <p>{t("about_us_reports.report_3016.para2")}</p>
                      <p>{t("about_us_reports.report_3016.para3")}</p>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="table"
                    title={t("table")}
                    className="tabledata-ukkl"
                  >
                    <div
                      className="ag-theme-material ag-theme-custom-height ag-theme-quartz h-300"
                      style={{ height: 450 }}
                    >
                      <AgGridReact
                        rowData={
                          filter_query_by_location &&
                          (groupKeys.schManagementBroad ||
                            groupKeys.schManagementDesc ||
                            groupKeys.schCategoryBroad ||
                            groupKeys.schCategoryDesc ||
                            groupKeys.schLocationDesc ||
                            groupKeys.schTypeDesc)
                            ? result
                            : arrGroupedDataTable
                            ? arrGroupedDataTable
                            : []
                        }

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
                        pinnedBottomRowData={pinnedBottomRowDatas}
                      />
                      {/* <div className="row">
                        <div className="col-md-3">
                          <h6 className="pinnedData">Total</h6>
                        </div>
                        <div className="col-md-3 text-end">  
                          <h6 className="pinnedData">
                            {calculateTotal("totSch")}
                          </h6>
                        </div>
                        <div className="col-md-3 text-end">
                          <h6 className="pinnedData">
                            {calculateTotal("totSchFuncElectricity")}
                          </h6>
                        </div>
                        <div className="col-md-3 text-end">
                          <h6 className="pinnedData">
                            {calculateTotal("totSchElectricity")}
                          </h6>
                        </div>
                      </div> */}
                    </div>
                  </Tab>
                  <Tab eventKey="graph" title={t("chart")}>
                    <div className="card-box-impact tab-for-graph mt-4 tab-content-reduce">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <div className="impact-box-content-education dark-bg-light tab-sdb-blue">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("top_five")} {headerData.regionName}{" "}
                                {t(
                                  "with_schools_that_have_functional_electricity_connection"
                                )}
                              </h2>
                            </div>
                            <Tabs
                              defaultActiveKey="State"
                              id="top-tabs-st-dis-block"
                            >
                              <Tab
                                eventKey="State"
                                title={t("state")}
                                disabled={!isStateTabEnabled}
                              >
                                <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-3">
                                    <div className="chart-left-text">
                                      <h6>{t("kpi")}</h6>
                                      <h2 className="heading-md">
                                        {t("functional_electricity")}
                                      </h2>
                                    </div>
                                  </div>
                                  <div className="col-md-9">
                                    <HighchartsReact
                                      isPureConfig={false}
                                      highcharts={Highcharts}
                                      options={{
                                        chart: {
                                          type: "packedbubble",
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
                                          text: t("kpi_functional_electricity"),
                                        },
                                        tooltip: {
                                          useHTML: true, // Enable HTML for tooltip
                                          formatter: function () {
                                            return (
                                              `<b>${t("name_label")}:</b> ${
                                                this.point.fullStateName
                                              }</br>` +
                                              `<b>${t(
                                                "total_functional_electricity"
                                              )}:</b> ${
                                                this.point.count
                                              }</br>` +
                                              `<b>${t("total_school")}:</b> ${
                                                this.point.totalSchool
                                              }`
                                            );
                                          },
                                        },
                                        credits: {
                                          enabled: false,
                                        },
                                        exporting: {
                                          filename: t(
                                            "kpi_functional_electricity"
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

                                        plotOptions: {
                                          packedbubble: {
                                            minSize: 50,
                                            maxSize: 200,
                                            dataLabels: {
                                              enabled: true,
                                              format: "{point.name}",
                                              style: {
                                                color: "black",
                                                textOutline: "none",
                                                fontWeight: "normal",
                                              },
                                            },
                                            minPointSize: 5,
                                          },
                                        },
                                        series: [
                                          {
                                            showInLegend: false,
                                            data: topFiveData,
                                          },
                                        ],
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
                                <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-3">
                                    <div className="chart-left-text">
                                      <h6>{t("kpi")}</h6>
                                      <h2 className="heading-md">
                                        {t("functional_electricity")}
                                      </h2>
                                    </div>
                                  </div>
                                  <div className="col-md-9"></div>
                                </div>
                              </Tab>
                              <Tab
                                eventKey="Block"
                                title={t("block")}
                                disabled={!isBlockTabEnabled}
                              >
                                <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-3">
                                    <div className="chart-left-text">
                                      <h6>{t("kpi")}</h6>
                                      <h2 className="heading-md">
                                        {t("functional_electricity")}
                                      </h2>
                                    </div>
                                  </div>
                                  <div className="col-md-9"></div>
                                </div>
                              </Tab>
                            </Tabs>
                          </div>
                        </div>

                        <div className="col-md-12 col-lg-12">
                          <div className="impact-box-content-education dark-bg-light dark-bg-text">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("performance_by")}{" "}
                                {t(
                                  performanceBy === "School Management"
                                    ? "school_management"
                                    : "school_category"
                                )}
                              </h2>
                            </div>
                            <Tabs
                              defaultActiveKey={performanceBy}
                              id="uncontrolled-tab-example"
                              onSelect={handlePerformanceByTabChange}
                            >
                              {/* br */}
                              <Tab
                                eventKey="School Management"
                                title={t("school_management")}
                              >
                                <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-12">
                                    <HighchartsReact
                                      isPureConfig={false}
                                      highcharts={Highcharts}
                                      options={{
                                        colorAxis: {
                                          minColor: "#FFFFFF",
                                          maxColor:
                                            Highcharts.getOptions().colors[0],
                                        },
                                        chart: {
                                          marginTop: 50,
                                          height: 400,

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
                                        tooltip: {
                                          useHTML: true,
                                          formatter: function () {
                                            return `<b>${headerData.regionName.slice(
                                              0,
                                              headerData.regionName.length - 1
                                            )} ${t("name_label")}:</b> ${
                                              this.point.regionName
                                            }</br><b>${t(
                                              "total_functional_electricity"
                                            )}: </b> ${
                                              this.point.count
                                            } </br><b>${t(
                                              "total_school"
                                            )}: </b> ${this.point.totalSchool}`;
                                          },
                                          style: {
                                            zIndex: 9,
                                          },
                                        },
                                        credits: {
                                          enabled: false,
                                        },

                                        exporting: {
                                          filename: t(
                                            "performance_by_school_management"
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

                                        legend: {
                                          layout: "vertical",
                                          align: "left",
                                          verticalAlign: "middle",
                                          itemMarginTop: 10,
                                          itemMarginBottom: 10,
                                        },
                                        plotOptions: {
                                          series: {
                                            dataLabels: {
                                              enabled: true,
                                              inside: true,
                                              useHTML: true,
                                              style: {
                                                "text-align": "center",
                                                "white-space": "break-spaces",
                                                "word-wrap": "break-word",
                                                zIndex: 0,
                                              },
                                            },
                                          },
                                        },
                                        series: [
                                          {
                                            borderRadius: 10,
                                            borderWidth: 3,
                                            Padding: 20,
                                            wordWrap: "break-word",
                                            borderColor: "#fafafa",
                                            type: "treemap",
                                            layoutAlgorithm: "strip",
                                            clip: false,
                                            data: modifiedPerformanceData,
                                          },
                                        ],
                                        title: {
                                          text: t(
                                            "performance_by_school_management"
                                          ),
                                        },

                                        responsive: {
                                          rules: [
                                            {
                                              condition: {
                                                maxWidth: 500,
                                              },
                                              chartOptions: {
                                                legend: {
                                                  align: "center",
                                                  verticalAlign: "bottom",
                                                  layout: "horizontal",
                                                },
                                                yAxis: {
                                                  labels: {
                                                    align: "left",
                                                    x: 0,
                                                    y: -5,
                                                  },
                                                  title: {
                                                    text: "",
                                                  },
                                                },
                                                subtitle: {
                                                  text: "",
                                                },
                                                credits: {
                                                  enabled: false,
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      }}
                                      // allowChartUpdate={true}
                                      immutable={true}
                                    />
                                  </div>
                                </div>
                              </Tab>
                              <Tab
                                eventKey="School Category"
                                title={t("school_category")}
                              >
                                <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-12">
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      options={{
                                        colorAxis: {
                                          minColor: "#FFFFFF",
                                          maxColor:
                                            Highcharts.getOptions().colors[0],
                                        },
                                        chart: {
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
                                        tooltip: {
                                          useHTML: true, // Enable HTML for tooltip
                                          formatter: function () {
                                            return `<b>${headerData.regionName.slice(
                                              0,
                                              headerData.regionName.length - 1
                                            )} ${t("name_label")}:</b> ${
                                              this.point.regionName
                                            }</br><b>${t(
                                              "total_functional_electricity"
                                            )}: </b> ${
                                              this.point.count
                                            } </br><b>${t(
                                              "total_school"
                                            )}: </b> ${this.point.totalSchool}`;
                                          },
                                        },
                                        credits: {
                                          enabled: false,
                                        },
                                        exporting: {
                                          filename: t(
                                            "performance_by_school_category"
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

                                        plotOptions: {
                                          series: {
                                            dataLabels: {
                                              enabled: true,
                                              useHTML: true,
                                              style: {
                                                "text-align": "center",
                                              },
                                            },
                                          },
                                        },

                                        series: [
                                          {
                                            borderRadius: 10,
                                            borderWidth: 4,
                                            borderColor: "#fafafa",
                                            type: "treemap",
                                            layoutAlgorithm: "strip",
                                            clip: false,
                                            data: performanceByData,
                                          },
                                        ],
                                        title: {
                                          text: t(
                                            "performance_by_school_category"
                                          ),
                                        },
                                      }}
                                      allowChartUpdate={true}
                                      immutable={true}
                                    />
                                  </div>
                                </div>
                              </Tab>
                            </Tabs>
                          </div>

                          {/* <InfrastructureGraph3016_2
                            handlePerformanceBy={handlePerformanceBy}
                            headerData={headerData}
                            performanceByData={performanceByData}
                            updatedSchoolData={updatedSchoolData}
                            modifiedPerformanceData={modifiedPerformanceData}
                          /> */}
                          {/* Second Graph */}
                        </div>
                        <div className="col-md-12 col-lg-12">
                          <div className="impact-box-content-education">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">
                                {t("electricity_connection_overview")}
                              </h2>
                            </div>
                            <Tabs
                              defaultActiveKey="School Management"
                              id="uncontrolled-tab-connection-by"
                              onSelect={handleConnectionByTabChange}
                            >
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
                                      isPureConfig={false}
                                      highcharts={Highcharts}
                                      options={{
                                        title: {
                                          text: t(
                                            "electricity_connection_overview_by_school_management"
                                          ),
                                        },
                                        credits: {
                                          enabled: false,
                                        },
                                        chart: {
                                          height: chartHeight,
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

                                        exporting: {
                                          filename: t(
                                            "electricity_connection_overview_by_school_management"
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
                                                // 'viewFullscreen',
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

                                        series: [
                                          {
                                            reversed: true,
                                            type: "treegraph",
                                            data: data_tree,
                                            tooltip: {
                                              pointFormat: "{point.name}",
                                            },
                                            marker: {
                                              symbol: "rect",
                                              width: "25%",
                                              height: "30",
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
                                      isPureConfig={false}
                                      highcharts={Highcharts}
                                      options={{
                                        title: {
                                          text: t(
                                            "electricity_connection_overview_by_school_category"
                                          ),
                                        },
                                        credits: {
                                          enabled: false,
                                        },
                                        chart: {
                                          height: chartHeight,
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

                                        exporting: {
                                          filename: t(
                                            "electricity_connection_overview_by_school_category"
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
                                                // 'viewFullscreen',
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

                                        series: [
                                          {
                                            reversed: true,
                                            type: "treegraph",
                                            data: data_tree,
                                            tooltip: {
                                              pointFormat: "{point.name}",
                                            },
                                            marker: {
                                              symbol: "rect",
                                              width: "25%",
                                              height: "30",
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
                          {/* <InfrastructureGraph3016_3
                            school_data={school_data}
                            electricityConnectionByData={
                              electricityConnectionByData
                            }
                            updatedTreeData={updatedTreeData}
                            currentIndex={currentIndex}
                          /> */}
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        {/* devider */}
        <div className="right-devider-icon">
          <img src={Infraicon} alt="icon" className="icon-infra" />
        </div>
      </section>
    </>
  );
}
