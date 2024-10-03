import React, { useEffect, useCallback, useId } from "react";
import "./infra.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchArchiveServicesSchoolData } from "../../redux/thunks/archiveServicesThunk";
import allreportsdata from "../../json-data/allreports.json";
import allReportsHindidata from "../../json-data/allReportsHindi.json";
import FilterDropdownCommom358 from "../Home/filter/FilterDropdownCommon358";
import { handleMissingData } from "../../utils/handleMissingData";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import groupByKey from "../../utils/groupBy";
import Infraicon from "../../assets/images/infra-power.svg";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { color } from "highcharts";
import { allFilter } from "../../redux/slice/schoolFilterSlice3016";
import { Select } from "antd";
import {
  block,
  blockWiseName,
  district,
  districtWiseName,
  generateTextContent,
  initialFilterSchoolData,
  intialIndiaWiseFilterSchData,
  intialStateWiseFilterSchData,
  nationalWiseName,
  selectedDYear,
  stateWiseName,
} from "../../constants/constants";
import HC_more from "highcharts/highcharts-more";
import { categoryMappings } from "../../constants/constants";
import {
  handleActiveTabs,
  handleViewDataByShow,
  setArrGroupedGraph3013Data,
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
import InfrastructureReportGraph3013 from "./InfrastructureReportGraph3013";
import InfrastructureReportPieGraph3013 from "./InfrastructureReportPieGraph3013";
import Filter3013Graph from "./Filter3013Graph";
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

export default function Infrastructure3013() {
  const location = useLocation();
  const queryString = window.location.href;
  const urlParams = new URLSearchParams(queryString.replace("#/", ""));
  const paramValue = urlParams.get("type");
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [isScrollComplete, setIsScrollComplete] = useState(false);
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

  const schoolFilter = useSelector((state) => state.schoolFilter3016);
  const distBlockWiseData = useSelector((state) => state.distBlockWise);
  const headerData = useSelector((state) => state.header);
  // const local_state = window.localStorage.getItem("state_wise");
  const [local_state, setLocalStateName] = useState("State Wise");
  const [local_district, setLocalDistrictName] = useState("District");
  const [local_block, setLocalBlockName] = useState("Block");
  const [local_year, setLocalYear] = useState("year");
  // const local_year = window.localStorage.getItem("year");
  const stateName = localStorage.getItem("state");
  const filterObj = structuredClone(schoolFilter);
  const [report, setReport] = useState(null);
  const [gridApi, setGridApi] = useState();
  const [currentDataTreeLength, setCurrentDataTreeLength] = useState(0);
  const [arrGroupedData, setArrGroupedData] = useState([]);
  const [arrGroupedGraphData, setArrGroupedGraphData] = useState([]);
  const [queryParameters] = useSearchParams();
  const id = queryParameters.get("id");
  const type = queryParameters.get("type");
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
    }
    if (headerData.activeTab === "graph") {
      window.localStorage.setItem("state_wise", "State Wise");
      window.localStorage.setItem("state", "State Wise");
      window.localStorage.setItem("map_state_name", "State Wise");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear);
    }
  }, [headerData.activeTab, i18n.language]);
  useEffect(() => {
    setLocalStateName(localStorage.getItem("state_wise"));
    setLocalStateName(localStorage.getItem("state"));
    setLocalStateName(localStorage.getItem("map_state_name"));
    setLocalDistrictName(localStorage.getItem("map_district_name"));
    setLocalBlockName(localStorage.getItem("block"));
    setLocalYear(localStorage.getItem("year"));
  }, [filterObj, headerData.activeTab, paramValue]);
  useEffect(() => {
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
  }, [location.pathname, paramValue]);
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
  const [activeTab, setActiveTab] = useState(type);

  dispatch(handleActiveTabs(activeTab));
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
      headerName: "Separate Room for Headmaster",
      field: "totSchSeprateRoomHm",
      cellClass: "rightAligned",
    },
    {
      headerName: "Land Available",
      field: "totSchLandAvail",
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
    {
      headerName: "Solar Panel",
      field: "totSchSolarPanel",
      cellClass: "rightAligned",
    },
    {
      headerName: "Playground",
      field: "totSchPlayground",
      cellClass: "rightAligned",
    },
    {
      headerName: "Library or Reading Corner or Book Bank",
      field: "totSchLibrary",
      cellClass: "rightAligned",
    },
    {
      headerName: "Librarian",
      cellClass: "rightAligned",
      field: "totSchLibrarian",
    },
    {
      headerName: "Newspaper",
      field: "totSchNewspaper",
      cellClass: "rightAligned",
    },
    {
      headerName: "Kitchen Garden",
      field: "totSchKitchenGarden",
      cellClass: "rightAligned",
    },
    {
      headerName: "Furniture",
      field: "totSchFurniture",
      cellClass: "rightAligned",
    },
    {
      headerName: "Boy's Toilet",
      field: "totSchBoysToilet",
      cellClass: "rightAligned",
    },
    {
      headerName: "Functional Boy's Toilet",
      field: "totSchFuncBoysToilet",
      cellClass: "rightAligned",
    },
    {
      headerName: "Girl's Toilet",
      cellClass: "rightAligned",
      field: "totSchGirlsToilet",
    },
    {
      headerName: "Functional Girl's Toilet",
      cellClass: "rightAligned",
      field: "totSchFuncGirlsToilet",
    },
    {
      headerName: "Toilet Facility",
      cellClass: "rightAligned",
      field: "schHaveToilet",
    },
    {
      headerName: "Functional Toilet Facility",
      cellClass: "rightAligned",
      field: "totSchFuncBoysToilet",
    },

    {
      headerName: "Functional Urinal Boy's",
      cellClass: "rightAligned",
      field: "totSchFuncBoysUrinal",
    },

    {
      headerName: "Functional Urinal",
      cellClass: "rightAligned",
      field: "schHaveFuncUrinals",
      valueGetter: (params) => {
        return params.data.schHaveFuncUrinals
          ? params.data.schHaveFuncUrinals
          : "N/A";
      },
    },

    {
      headerName: "Functional Urinal Girl's",
      cellClass: "rightAligned",
      field: "totSchFuncGirlsUrinal",
    },

    {
      headerName: "Drinking Water",
      cellClass: "rightAligned",
      field: "totSchDrinkingWater",
    },
    {
      headerName: "Functional Drinking Water",
      cellClass: "rightAligned",
      field: "totSchFuncWaterPurifier",
    },
    {
      headerName: "Water Purifier",
      cellClass: "rightAligned",
      field: "totSchWaterPurifier",
    },
    {
      headerName: "Rain Water Harvesting",
      cellClass: "rightAligned",
      field: "totSchRainWaterHarvesting",
    },
    {
      headerName: "Water Tested",
      field: "totSchWaterTested",
    },
    {
      headerName: "Handwash",
      field: "totSchHandwashToilet",
    },
    {
      headerName: "Incinerator",
      field: "totSchIncinerator",
    },
    {
      headerName: "WASH Facility",
      field: "totSchHandwashMeals",
    },
    {
      headerName: "Ramps",
      field: "totSchRamps",
    },
    {
      headerName: "Hand-Rails",
      field: "totSchHandRails",
    },
    {
      headerName: "Medical Checkup",
      field: "totSchMedicalCheckup",
    },
    {
      headerName: "Complete Medical Checkup",
      field: "schHaveCompleteMedicalCheckup",
      valueGetter: (params) => {
        return params.data.schHaveCompleteMedicalCheckup
          ? params.data.schHaveCompleteMedicalCheckup
          : "N/A";
      },
    },
    {
      headerName: "Internet",
      cellClass: "rightAligned",
      field: "totSchInternet",
    },
    {
      headerName: "Computer Available",
      cellClass: "rightAligned",
      field: "totSchCompAvail",
    },
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
    if (allFalse && headerData.activeTab === "table") {
      schoolLocationRow();
    } else {
      handleCustomKeyInAPIResponse();
      multiGroupingRows();
    }
    gridApi?.columnApi?.api.setColumnVisible(
      "regionName",
      filter_query_by_location
    );
  }, [school_data?.data?.data]);
  useEffect(() => {
    const allFalse = Object.values(groupKeys).every((value) => value === false);
    if (allFalse && headerData.activeTab === "table") {
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
    if (allFalse && headerData.activeTab === "table") {
      schoolLocationRow();
    } else {
      handleCustomKeyInAPIResponse();
      multiGroupingRows();
    }
    if (showTransposed && headerData.activeTab === "table") {
      switchColumnsToRows();
    } else if (showTransposedMgt) {
      switchColumnsToRowsMgt();
    }
  };
  const handleChartGroupButtonClick = (e, currObj) => {
    handleFilter(e, currObj);
    const updatedGroupKeys = { ...groupKeys };
    if (e === "School Management") {
      updatedGroupKeys.schManagementBroad = !groupKeys.schManagementBroad;
      updatedGroupKeys.schCategoryBroad = false;
    } else if (e === "School Category") {
      updatedGroupKeys.schCategoryBroad = !groupKeys.schCategoryBroad;
      updatedGroupKeys.schManagementBroad = false;
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

  useEffect(() => {
    if (headerData.activeTab === "graph") {
      schoolLocationRow();
    }
  }, [school_data?.data?.data, headerData.activeTab]);
  const schoolLocationRow = () => {
    const primaryKeys = ["regionName"];
    const groupedData = groupByKey(updatedSchoolData, primaryKeys);
    const updatedArrGroupedData = [];
    if (groupedData && typeof groupedData === "object") {
      Object?.keys(groupedData)?.forEach((item, idx) => {
        const itemsArray = groupedData[item];
        let totalSchoolsHaveElectricity = 0;
        let separateHeadMasterRoom = 0;
        let landAvailable = 0;
        let solarPanelAvailable = 0;
        let playGroundAvail = 0;
        let totalSchoolLibrary = 0;
        let totalSchoolLibrarian = 0;
        let totalNewspaper = 0;
        let totalKitchenGarden = 0;
        let totalFurniture = 0;
        let totalBoysToilet = 0;
        let totalFuncBoysToilet = 0;
        let totalgirlsToilet = 0;
        let totalFuncGirlsToilet = 0;
        let totalToiletfacility = 0;
        let totalFuncToiletfacility = 0;
        let totalFuncBoysurinal = 0;
        let totalFuncUrinal = 0;
        let totalFuncGirlsUrinal = 0;
        let totalDrinkingWater = 0;
        let totalFunctionalDrinkingWater = 0;
        let totalPurifier = 0;
        let totalRainWaterHarvesting = 0;
        let totalWaterTested = 0;
        let totalIncinerator = 0;
        let totalHandWashFacility = 0;
        let totalSchoolRamps = 0;
        let medicalCheckUp = 0;
        let completeMedicalCheckUp = 0;
        let totalHandRails = 0;
        let totalInternet = 0;
        let computerAvailable = 0;
        let totalFunElectricity = 0;
        let totalSchools = 0;
        let totalSchoolsHandWashToilet = 0;

        itemsArray.forEach((dataItem) => {
          totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
          totalSchools += parseInt(dataItem.totSch);
          totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
          totalSchoolsHandWashToilet += parseInt(dataItem.totSchHandwashToilet);
          separateHeadMasterRoom += parseInt(dataItem.totSchSeprateRoomHm);
          landAvailable += parseInt(dataItem.totSchLandAvail);
          solarPanelAvailable += parseInt(dataItem.totSchSolarPanel);
          playGroundAvail += parseInt(dataItem.totSchPlayground);
          totalSchoolLibrary += parseInt(dataItem.totSchLibrary);
          totalSchoolLibrarian += parseInt(dataItem.totSchLibrarian);
          totalNewspaper += parseInt(dataItem.totSchNewspaper);
          totalKitchenGarden += parseInt(dataItem.totSchKitchenGarden);
          totalFurniture += parseInt(dataItem.totSchFurniture);
          totalBoysToilet += parseInt(dataItem.totSchBoysToilet);
          totalFuncBoysToilet += parseInt(dataItem.totSchFuncBoysToilet);
          totalgirlsToilet += parseInt(dataItem.totSchGirlsToilet);
          totalFuncGirlsToilet += parseInt(dataItem.totSchFuncGirlsToilet);
          // totalToiletfacility += parseInt(dataItem.schHaveToilet);
          totalToiletfacility = totalBoysToilet + totalgirlsToilet;
          totalFuncToiletfacility += parseInt(dataItem.totSchFuncBoysToilet);
          totalFuncBoysurinal += parseInt(dataItem.totSchFuncBoysUrinal);
          totalFuncUrinal += parseInt(dataItem.schHaveFuncUrinals);
          totalFuncGirlsUrinal += parseInt(dataItem.totSchFuncGirlsUrinal);
          totalDrinkingWater += parseInt(dataItem.totSchDrinkingWater);
          totalFunctionalDrinkingWater += parseInt(
            dataItem.totSchFuncWaterPurifier
          );
          totalPurifier += parseInt(dataItem.totSchWaterPurifier);
          totalRainWaterHarvesting += parseInt(
            dataItem.totSchRainWaterHarvesting
          );
          totalWaterTested += parseInt(dataItem.totSchWaterTested);
          totalIncinerator += parseInt(dataItem.totSchIncinerator);
          totalHandWashFacility += parseInt(dataItem.totSchHandwashMeals);
          totalSchoolRamps += parseInt(dataItem.totSchRamps);
          medicalCheckUp += parseInt(dataItem.totSchMedicalCheckup);
          completeMedicalCheckUp += parseInt(
            dataItem.schHaveCompleteMedicalCheckup
          );
          totalHandRails += parseInt(dataItem.totSchHandRails);
          totalInternet += parseInt(dataItem.totSchInternet);
          computerAvailable += parseInt(dataItem.totSchCompAvail);
        });
        const appended = {
          "Serial Number": idx + 1,
          regionName: item,
          totSch: totalSchools,
          totSchElectricity: totalSchoolsHaveElectricity,
          totSchFuncElectricity: totalFunElectricity,
          totSchHandwashToilet: totalSchoolsHandWashToilet,
          totSchSeprateRoomHm: separateHeadMasterRoom,
          totSchLandAvail: landAvailable,
          totSchSolarPanel: solarPanelAvailable,
          totSchPlayground: playGroundAvail,
          totSchLibrary: totalSchoolLibrary,
          totSchLibrarian: totalSchoolLibrarian,
          totSchNewspaper: totalNewspaper,
          totSchKitchenGarden: totalKitchenGarden,
          totSchFurniture: totalFurniture,
          totSchBoysToilet: totalBoysToilet,
          totSchFuncBoysToilet: totalFuncBoysToilet,
          totSchGirlsToilet: totalgirlsToilet,
          totSchFuncGirlsToilet: totalFuncGirlsToilet,
          schHaveToilet: totalToiletfacility,
          totSchFuncBoysToilet: totalFuncBoysToilet,
          totSchFuncBoysUrinal: totalFuncBoysurinal,
          schHaveFuncUrinals: totalFuncUrinal,
          totSchFuncGirlsUrinal: totalFuncGirlsUrinal,
          totSchDrinkingWater: totalDrinkingWater,
          totSchFuncWaterPurifier: totalFunctionalDrinkingWater,
          totSchWaterPurifier: totalPurifier,
          totSchRainWaterHarvesting: totalRainWaterHarvesting,
          totSchWaterTested: totalWaterTested,
          totSchIncinerator: totalIncinerator,
          totSchHandwashMeals: totalHandWashFacility,
          totSchRamps: totalSchoolRamps,
          totSchHandRails: totalHandRails,
          totSchMedicalCheckup: medicalCheckUp,
          schHaveCompleteMedicalCheckup: completeMedicalCheckUp,
          totSchInternet: totalInternet,
          totSchCompAvail: computerAvailable,
        };
        updatedArrGroupedData.push(appended);
      });
      setArrGroupedData(updatedArrGroupedData);
      setArrGroupedGraphData(updatedArrGroupedData);
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
          let separateHeadMasterRoom = 0;
          let landAvailable = 0;
          let solarPanelAvailable = 0;
          let playGroundAvail = 0;
          let totalSchoolLibrary = 0;
          let totalSchoolLibrarian = 0;
          let totalNewspaper = 0;
          let totalKitchenGarden = 0;
          let totalFurniture = 0;
          let totalBoysToilet = 0;
          let totalFuncBoysToilet = 0;
          let totalgirlsToilet = 0;
          let totalFuncGirlsToilet = 0;
          let totalToiletfacility = 0;
          let totalFuncToiletfacility = 0;
          let totalFuncBoysurinal = 0;
          let totalFuncUrinal = 0;
          let totalFuncGirlsUrinal = 0;
          let totalDrinkingWater = 0;
          let totalFunctionalDrinkingWater = 0;
          let totalPurifier = 0;
          let totalRainWaterHarvesting = 0;
          let totalWaterTested = 0;
          let totalIncinerator = 0;
          let totalHandWashFacility = 0;
          let totalSchoolRamps = 0;
          let medicalCheckUp = 0;
          let completeMedicalCheckUp = 0;
          let totalHandRails = 0;
          let totalInternet = 0;
          let computerAvailable = 0;
          let totalFunElectricity = 0;
          let totalSchools = 0;
          let totalSchoolsHandWashToilet = 0;
          let regionName = "";
          itemsArray.forEach((dataItem) => {
            regionName = dataItem.regionName;
            totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
            totalSchools += parseInt(dataItem.totSch);
            totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
            totalSchoolsHandWashToilet += parseInt(
              dataItem.totSchHandwashToilet
            );
            separateHeadMasterRoom += parseInt(dataItem.totSchSeprateRoomHm);
            landAvailable += parseInt(dataItem.totSchLandAvail);
            solarPanelAvailable += parseInt(dataItem.totSchSolarPanel);
            playGroundAvail += parseInt(dataItem.totSchPlayground);
            totalSchoolLibrary += parseInt(dataItem.totSchLibrary);
            totalSchoolLibrarian += parseInt(dataItem.totSchLibrarian);
            totalNewspaper += parseInt(dataItem.totSchNewspaper);
            totalKitchenGarden += parseInt(dataItem.totSchKitchenGarden);
            totalFurniture += parseInt(dataItem.totSchFurniture);
            totalBoysToilet += parseInt(dataItem.totSchBoysToilet);
            totalFuncBoysToilet += parseInt(dataItem.totSchFuncBoysToilet);
            totalgirlsToilet += parseInt(dataItem.totSchGirlsToilet);
            totalFuncGirlsToilet += parseInt(dataItem.totSchFuncGirlsToilet);
            // totalToiletfacility += parseInt(dataItem.schHaveToilet);
            totalToiletfacility = totalBoysToilet + totalgirlsToilet;
            totalFuncBoysurinal += parseInt(dataItem.totSchFuncBoysUrinal);
            totalFuncUrinal += parseInt(dataItem.schHaveFuncUrinals);
            totalFuncGirlsUrinal += parseInt(dataItem.totSchFuncGirlsUrinal);
            totalDrinkingWater += parseInt(dataItem.totSchDrinkingWater);
            totalFunctionalDrinkingWater += parseInt(
              dataItem.totSchFuncWaterPurifier
            );
            totalPurifier += parseInt(dataItem.totSchWaterPurifier);
            totalRainWaterHarvesting += parseInt(
              dataItem.totSchRainWaterHarvesting
            );
            totalWaterTested += parseInt(dataItem.totSchWaterTested);
            totalIncinerator += parseInt(dataItem.totSchIncinerator);
            totalHandWashFacility += parseInt(dataItem.totSchHandwashMeals);
            totalSchoolRamps += parseInt(dataItem.totSchRamps);
            medicalCheckUp += parseInt(dataItem.totSchMedicalCheckup);
            completeMedicalCheckUp += parseInt(
              dataItem.schHaveCompleteMedicalCheckup
            );
            totalHandRails += parseInt(dataItem.totSchHandRails);
            totalInternet += parseInt(dataItem.totSchInternet);
            computerAvailable += parseInt(dataItem.totSchCompAvail);
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
          appended.totSchSeprateRoomHm = separateHeadMasterRoom;
          appended.totSchLandAvail = landAvailable;
          appended.totSchSolarPanel = solarPanelAvailable;
          appended.totSchPlayground = playGroundAvail;
          appended.totSchLibrary = totalSchoolLibrary;
          appended.totSchLibrarian = totalSchoolLibrarian;
          appended.totSchNewspaper = totalNewspaper;
          appended.totSchKitchenGarden = totalKitchenGarden;
          appended.totSchFurniture = totalFurniture;
          appended.totSchBoysToilet = totalBoysToilet;
          appended.totSchFuncBoysToilet = totalFuncBoysToilet;
          appended.totSchGirlsToilet = totalgirlsToilet;
          appended.totSchFuncGirlsToilet = totalFuncGirlsToilet;
          appended.schHaveToilet = totalToiletfacility;
          appended.totSchFuncBoysUrinal = totalFuncBoysurinal;
          appended.schHaveFuncUrinals = totalFuncUrinal;
          appended.totSchFuncGirlsUrinal = totalFuncGirlsUrinal;
          appended.totSchDrinkingWater = totalDrinkingWater;
          appended.totSchFuncWaterPurifier = totalFunctionalDrinkingWater;
          appended.totSchWaterPurifier = totalPurifier;
          appended.totSchRainWaterHarvesting = totalRainWaterHarvesting;
          appended.totSchWaterTested = totalWaterTested;
          appended.totSchHandwashToilet = totalSchoolsHandWashToilet;
          appended.totSchIncinerator = totalIncinerator;
          appended.totSchHandwashMeals = totalHandWashFacility;
          appended.totSchRamps = totalSchoolRamps;
          appended.totSchHandRails = totalHandRails;
          appended.totSchMedicalCheckup = medicalCheckUp;
          appended.schHaveCompleteMedicalCheckup = completeMedicalCheckUp;
          appended.totSchInternet = totalInternet;
          appended.totSchCompAvail = computerAvailable;

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
    const pinnedBottomRowDatas = ((anyGroupKeyTrue || (local_state !== "All India/National")) && ((anyGroupKeyTrue || (local_state === "State Wise")) || (anyGroupKeyTrue || (local_district === "District Wise")) || (anyGroupKeyTrue || (local_block === "Block Wise"))))
    ? (showTransposed || showTransposedMgt ? pinnedBottomRowDataByRows : pinedBottomRowData)
    : [];
    const pinnedBottomRow = pinnedBottomRowDatas
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
      format: [18, 30],
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
          } else if (row.hasOwnProperty(field.charAt(0).toUpperCase() + field.slice(1))) {
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
        // cellPadding: 0.15, // Adjust cell padding if needed
        lineColor: [0, 0, 0], // Set border color (black in this case)
        lineWidth: 0.001, // Set border width
        fillColor: [255, 255, 255], // Default background color (white)
        textColor: [0, 0, 0],
      },
      headStyles: {
        // fontSize: 14, // Set the font size for the header row
        fontStyle: "bold", // Make the header text bold (optional)
        textColor: [0, 0, 0],
        // cellPadding: 0.2, // Set text color for the header row
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
        {
          headerName: "Separate Room for Headmaster",
          field: "totSchSeprateRoomHm",
          cellClass: "rightAligned",
        },
        {
          headerName: "Land Available",
          field: "totSchLandAvail",
          cellClass: "rightAligned",
        },

        {
          headerName: "Solar Panel",
          field: "totSchSolarPanel",
          cellClass: "rightAligned",
        },
        {
          headerName: "Playground",
          field: "totSchPlayground",
          cellClass: "rightAligned",
        },
        {
          headerName: "Library or Reading Corner or Book Bank",
          field: "totSchLibrary",
          cellClass: "rightAligned",
        },
        {
          headerName: "Librarian",
          cellClass: "rightAligned",
          field: "totSchLibrarian",
        },
        {
          headerName: "Newspaper",
          field: "totSchNewspaper",
          cellClass: "rightAligned",
        },
        {
          headerName: "Kitchen Garden",
          field: "totSchKitchenGarden",
          cellClass: "rightAligned",
        },
        {
          headerName: "Furniture",
          field: "totSchFurniture",
          cellClass: "rightAligned",
        },
        {
          headerName: "Boy's Toilet",
          field: "totSchBoysToilet",
          cellClass: "rightAligned",
        },
        {
          headerName: "Functional Boy's Toilet",
          field: "totSchFuncBoysToilet",
          cellClass: "rightAligned",
        },
        {
          headerName: "Girl's Toilet",
          cellClass: "rightAligned",
          field: "totSchGirlsToilet",
        },
        {
          headerName: "Functional Girl's Toilet",
          cellClass: "rightAligned",
          field: "totSchFuncGirlsToilet",
        },
        {
          headerName: "Toilet Facility",
          cellClass: "rightAligned",
          field: "schHaveToilet",
        },
        {
          headerName: "Functional Toilet Facility",
          cellClass: "rightAligned",
          field: "totSchFuncBoysToilet",
        },

        {
          headerName: "Functional Urinal Boy's",
          cellClass: "rightAligned",
          field: "totSchFuncBoysUrinal",
        },

        {
          headerName: "Functional Urinal",
          cellClass: "rightAligned",
          field: "schHaveFuncUrinals",
        },

        {
          headerName: "Functional Urinal Girl's",
          cellClass: "rightAligned",
          field: "totSchFuncGirlsUrinal",
        },

        {
          headerName: "Drinking Water",
          cellClass: "rightAligned",
          field: "totSchDrinkingWater",
        },
        {
          headerName: "Functional Drinking Water",
          cellClass: "rightAligned",
          field: "totSchFuncWaterPurifier",
        },
        {
          headerName: "Water Purifier",
          cellClass: "rightAligned",
          field: "totSchWaterPurifier",
        },
        {
          headerName: "Rain Water Harvesting",
          cellClass: "rightAligned",
          field: "totSchRainWaterHarvesting",
        },
        {
          headerName: "Water Tested",
          field: "totSchWaterTested",
        },
        {
          headerName: "Handwash",
          field: "totSchHandwashToilet",
        },
        {
          headerName: "Incinerator",
          field: "totSchIncinerator",
        },
        {
          headerName: "WASH Facility",
          field: "totSchHandwashMeals",
        },
        {
          headerName: "Ramps",
          field: "totSchRamps",
        },
        {
          headerName: "Hand-Rails",
          field: "totSchHandRails",
        },
        {
          headerName: "Medical Checkup",
          field: "totSchMedicalCheckup",
        },
        {
          headerName: "Complete Medical Checkup",
          field: "schHaveCompleteMedicalCheckup",
        },
        {
          headerName: "Internet",
          cellClass: "rightAligned",
          field: "totSchInternet",
        },
        {
          headerName: "Computer Available",
          cellClass: "rightAligned",
          field: "totSchCompAvail",
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
        {
          headerName: "Separate Room for Headmaster",
          field: "totSchSeprateRoomHm",
          cellClass: "rightAligned",
        },
        {
          headerName: "Land Available",
          field: "totSchLandAvail",
          cellClass: "rightAligned",
        },

        {
          headerName: "Solar Panel",
          field: "totSchSolarPanel",
          cellClass: "rightAligned",
        },
        {
          headerName: "Playground",
          field: "totSchPlayground",
          cellClass: "rightAligned",
        },
        {
          headerName: "Library or Reading Corner or Book Bank",
          field: "totSchLibrary",
          cellClass: "rightAligned",
        },
        {
          headerName: "Librarian",
          cellClass: "rightAligned",
          field: "totSchLibrarian",
        },
        {
          headerName: "Newspaper",
          field: "totSchNewspaper",
          cellClass: "rightAligned",
        },
        {
          headerName: "Kitchen Garden",
          field: "totSchKitchenGarden",
          cellClass: "rightAligned",
        },
        {
          headerName: "Furniture",
          field: "totSchFurniture",
          cellClass: "rightAligned",
        },
        {
          headerName: "Boy's Toilet",
          field: "totSchBoysToilet",
          cellClass: "rightAligned",
        },
        {
          headerName: "Functional Boy's Toilet",
          field: "totSchFuncBoysToilet",
          cellClass: "rightAligned",
        },
        {
          headerName: "Girl's Toilet",
          cellClass: "rightAligned",
          field: "totSchGirlsToilet",
        },
        {
          headerName: "Functional Girl's Toilet",
          cellClass: "rightAligned",
          field: "totSchFuncGirlsToilet",
        },
        {
          headerName: "Toilet Facility",
          cellClass: "rightAligned",
          field: "schHaveToilet",
        },
        {
          headerName: "Functional Toilet Facility",
          cellClass: "rightAligned",
          field: "totSchFuncBoysToilet",
        },

        {
          headerName: "Functional Urinal Boy's",
          cellClass: "rightAligned",
          field: "totSchFuncBoysUrinal",
        },

        {
          headerName: "Functional Urinal",
          cellClass: "rightAligned",
          field: "schHaveFuncUrinals",
        },

        {
          headerName: "Functional Urinal Girl's",
          cellClass: "rightAligned",
          field: "totSchFuncGirlsUrinal",
        },

        {
          headerName: "Drinking Water",
          cellClass: "rightAligned",
          field: "totSchDrinkingWater",
        },
        {
          headerName: "Functional Drinking Water",
          cellClass: "rightAligned",
          field: "totSchFuncWaterPurifier",
        },
        {
          headerName: "Water Purifier",
          cellClass: "rightAligned",
          field: "totSchWaterPurifier",
        },
        {
          headerName: "Rain Water Harvesting",
          cellClass: "rightAligned",
          field: "totSchRainWaterHarvesting",
        },
        {
          headerName: "Water Tested",
          field: "totSchWaterTested",
        },
        {
          headerName: "Handwash",
          field: "totSchHandwashToilet",
        },
        {
          headerName: "Incinerator",
          field: "totSchIncinerator",
        },
        {
          headerName: "WASH Facility",
          field: "totSchHandwashMeals",
        },
        {
          headerName: "Ramps",
          field: "totSchRamps",
        },
        {
          headerName: "Hand-Rails",
          field: "totSchHandRails",
        },
        {
          headerName: "Medical Checkup",
          field: "totSchMedicalCheckup",
        },
        {
          headerName: "Complete Medical Checkup",
          field: "schHaveCompleteMedicalCheckup",
        },
        {
          headerName: "Internet",
          cellClass: "rightAligned",
          field: "totSchInternet",
        },
        {
          headerName: "Computer Available",
          cellClass: "rightAligned",
          field: "totSchCompAvail",
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
      totSchSeprateRoomHm: calculateTotal("totSchSeprateRoomHm"),
      totSchLandAvail: calculateTotal("totSchLandAvail"),
      totSchElectricity: calculateTotal("totSchElectricity"),
      totSchFuncElectricity: calculateTotal("totSchFuncElectricity"),
      totSchSolarPanel: calculateTotal("totSchSolarPanel"),
      totSchPlayground: calculateTotal("totSchPlayground"),
      totSchLibrary: calculateTotal("totSchLibrary"),
      totSchLibrarian: calculateTotal("totSchLibrarian"),
      totSchNewspaper: calculateTotal("totSchNewspaper"),
      totSchKitchenGarden: calculateTotal("totSchKitchenGarden"),
      totSchFurniture: calculateTotal("totSchFurniture"),
      totSchBoysToilet: calculateTotal("totSchBoysToilet"),
      totSchFuncBoysToilet: calculateTotal("totSchFuncBoysToilet"),
      totSchGirlsToilet: calculateTotal("totSchGirlsToilet"),
      totSchFuncGirlsToilet: calculateTotal("totSchFuncGirlsToilet"),
      schHaveToilet: calculateTotal("schHaveToilet"),
      totSchFuncBoysToilet: calculateTotal("totSchFuncBoysToilet"),
      totSchFuncBoysUrinal: calculateTotal("totSchFuncBoysUrinal"),
      totSchFuncGirlsUrinal: calculateTotal("totSchFuncGirlsUrinal"),
      totSchDrinkingWater: calculateTotal("totSchDrinkingWater"),
      totSchFuncWaterPurifier: calculateTotal("totSchFuncWaterPurifier"),
      totSchWaterPurifier: calculateTotal("totSchWaterPurifier"),
      totSchRainWaterHarvesting: calculateTotal("totSchRainWaterHarvesting"),
      totSchWaterTested: calculateTotal("totSchWaterTested"),
      totSchHandwashToilet: calculateTotal("totSchHandwashToilet"),
      totSchIncinerator: calculateTotal("totSchIncinerator"),
      totSchHandwashMeals: calculateTotal("totSchHandwashMeals"),
      totSchRamps: calculateTotal("totSchRamps"),
      totSchHandRails: calculateTotal("totSchHandRails"),
      totSchMedicalCheckup: calculateTotal("totSchMedicalCheckup"),
      schHaveCompleteMedicalCheckup: calculateTotal(
        "schHaveCompleteMedicalCheckup"
      ),
      totSchInternet: calculateTotal("totSchInternet"),
      totSchCompAvail: calculateTotal("totSchCompAvail"),
    },
  ];

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
      dispatch(allFilter(intialIndiaWiseFilterSchData));
      dispatch(fetchArchiveServicesSchoolData(intialIndiaWiseFilterSchData));
    } else if (activeTab === "graph") {
      window.localStorage.setItem("map_state_name", "State Wise");
      window.localStorage.setItem("state", "State Wise");
      window.localStorage.setItem("state_wise", "State Wise");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("year", selectedDYear);
      dispatch(allFilter(intialStateWiseFilterSchData));
      dispatch(fetchArchiveServicesSchoolData(intialStateWiseFilterSchData));
    }

    dispatch(handleViewDataByShow(!(headerData.activeTab === "graph")));
  }, [headerData.activeTab, dispatch]);
  const handleScrollComplete = () => {
    setIsScrollComplete(true);
  };

  const result = useReportOverallRegionSum(arrGroupedData);

  const anyGroupKeyTrue = Object.values(groupKeys).some((value) => value === true);
  const pinnedBottomRowDatas = ((anyGroupKeyTrue || (local_state !== "All India/National")) && ((anyGroupKeyTrue || (local_state === "State Wise")) || (anyGroupKeyTrue || (local_district === "District Wise")) || (anyGroupKeyTrue || (local_block === "Block Wise"))))
  ? (showTransposed || showTransposedMgt ? pinnedBottomRowDataByRows : pinedBottomRowData)
  : [];
  return (
    <>
      <ScrollToTopOnMount onScrollComplete={handleScrollComplete} />
      {school_data.isLoading && <GlobalLoading />}

      <section
        className="infrastructure-main-card p-0 report-3013"
        id="content"
      >
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
          <div className="container pb-4">
            <div className="row">
              {activeTab !== "about" && activeTab !== "graph" && (
                <div className="col-md-12 col-lg-12 d-flex align-items-center mt-2">
                  <div className="tab-text-infra me-4">{t("view_data_by")}</div>
                  <ul className="nav nav-tabs mul-tab-main">
                    <li className={`nav-item ${multiMgt}`}>
                      <button
                        type="button"
                        className={`nav-link dark-active1 ${mgt}`}
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
                      className="ag-theme-quartz ag-theme-custom-height h-300"
                      style={{ height: 450, wordBreak: "none" }}
                    >
                      {/* schManagementDesc: false,
    schManagementBroad: false,
    schCategoryDesc: false,
    schCategoryBroad: false,
    schTypeDesc: false,
    schLocationDesc: false, */}

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
                            : arrGroupedData
                            ? arrGroupedData
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
                       
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  </Tab>
                  <Tab eventKey="graph" title={t("chart")}>
                    <div className="card-box-impact tab-for-graph mt-4">
                      <div className="row">
                        <Filter3013Graph
                          arrGroupedGraphData={arrGroupedGraphData}
                        />
                        <InfrastructureReportGraph3013
                          arrGroupedGraphData={arrGroupedGraphData}
                        />
                        <InfrastructureReportPieGraph3013 />
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
      <FilterDropdownCommom358 />
    </>
  );
}
