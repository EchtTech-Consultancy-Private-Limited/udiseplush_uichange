import React, { useEffect, useRef } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import allreportsdata from "../../json-data/allreports.json";
import allReportsHindidata from "../../json-data/allReportsHindi.json";
import { fetchArchiveServicesTeacherDataSocialCatGender } from "../../redux/thunks/archiveServicesThunk";
import {
  initialFilterSchoolData,
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
  district,
  districtWiseName,
  blockWiseName,
  block,
  generateTextContent,
} from "../../constants/constants";

import { allFilter } from "../../redux/slice/schoolFilterSlice";
import { useDispatch, useSelector } from "react-redux";
import { columnsConfig } from "../../constants/constants";

import "./infra.css";
import "./report.scss";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Highcharts from "highcharts";
import HC_more from "highcharts/highcharts-more";
import { useLocation } from "react-router-dom";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
import { useTranslation } from "react-i18next";
import FilterDropdownCommom358 from "../Home/filter/FilterDropdownCommon358";
import { removeAllDistrict } from "../../redux/thunks/districtThunk";
import { removeAllBlock } from "../../redux/thunks/blockThunk";
import { handleActiveTabs } from "../../redux/slice/headerSlice";
import { handleMissingData } from "../../utils/handleMissingData";
import satyamevaimg from "../../assets/images/satyameva-jayate-img.png";
import udise from "../../assets/images/udiseplu.jpg";
import {
  TeacherGraph2008,
  TeacherGraph2009,
  TeacherGraph2010,
} from "./TeacherGraph2008";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";
import { Result } from "antd";

import useReportOverallRegionSum from "../../CustomHook/useReportOverallRegionSum";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/treemap")(Highcharts);
require("highcharts/modules/treegraph")(Highcharts);
HC_more(Highcharts);
export default function TeacherReport2008() {
  const dispatch = useDispatch();
  const location = useLocation();
  const schData = useSelector((state) => state.schoolsocialcat);
  const school_data = useSelector((state) => state.schoolsocialcat?.data?.data);
  const [local_state, setLocalStateName] = useState("All India/National");
  const [local_district, setLocalDistrictName] = useState("District");
  const [local_block, setLocalBlockName] = useState("Block");
  const [isScrollComplete, setIsScrollComplete] = useState(false);
  const schoolFilter = useSelector((state) => state.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const headerData = useSelector((state) => state.header);
  const local_year = window.localStorage.getItem("year");
  const stateName = localStorage.getItem("state");
  const [groupKeys, setGroupKeys] = useState({
    schManagementBroad: false,
    schManagementDesc: false,
    schCategoryBroad: false,
    schCategoryDesc: false,
    schLocationDesc: false,
  });

  useEffect(() => {
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
  }, []);
  useEffect(() => {
    window.localStorage.setItem("state", "All India/National");
    window.localStorage.setItem("map_state_name", "All India/National");
    window.localStorage.setItem("map_district_name", "District");
    window.localStorage.setItem("district", "District");
    window.localStorage.setItem("block", "Block");
  }, []);

  useEffect(() => {
    setLocalStateName(localStorage.getItem("state"));
    setLocalStateName(localStorage.getItem("map_state_name"));
    setLocalDistrictName(localStorage.getItem("map_district_name"));
    setLocalBlockName(localStorage.getItem("block"));
  }, [filterObj, headerData.activeTab]);

  const [mgt, setMgt] = useState("");
  const [mgt_Details, setMgtDetail] = useState("");
  const [cat, setCat] = useState("");
  const [cat_Details, setCatDetail] = useState("");
  const [ur, setUR] = useState("");
  const [multiMgt, setMultiMgts] = useState("");
  const [multiCat, setMultiCats] = useState("");
  const [queryParameters] = useSearchParams();
  const id = queryParameters.get("id");
  const type = queryParameters.get("type");
  const [intialTeacherData, setIntialTeacherData] = useState(school_data);
  const gridApiRef = useRef(null);
  const [activeTab, setActiveTab] = useState(type);
  const { t, i18n } = useTranslation();
  dispatch(handleActiveTabs(activeTab));
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
    dispatch(allFilter(initialFilterSchoolData));
    dispatch(
      fetchArchiveServicesTeacherDataSocialCatGender(initialFilterSchoolData)
    );
  }, [dispatch]);
  const [report, setReport] = useState(null);
  const [gridApi, setGridApi] = useState();
  const [arrGroupedData, setArrGroupedData] = useState([]);
  const [arrGroupedGraphData, setArrGroupedGraphData] = useState([]);
  const [gridRefreshKey, setGridRefreshKey] = useState(0);
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);

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
      headerName: "",
      children: [
        {
          headerName: "",
          children: [
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
              headerName: "Urban/Rural",
              field: "schLocationDesc",
              suppressColumnsToolPanel: true,
              hide: true,
            },
          ],
        },
      ],
    },
    {
      headerName: "Social Category",
      children: [
        {
          headerName: "General",
          hide: false,
          children: [
            { headerName: "Female", field: "totTchFSocCatCd1", hide: false },
            { headerName: "Male", field: "totTchMSocCatCd1", hide: false },
          ],
        },
        {
          headerName: "OBC",
          hide: false,
          children: [
            { headerName: "Female", field: "totTchFSocCatCd4" },
            { headerName: "Male", field: "totTchMSocCatCd4" },
          ],
        },
        {
          headerName: "SC",
          hide: false,
          children: [
            { headerName: "Female", field: "totTchFSocCatCd2", hide: false },
            { headerName: "Male", field: "totTchMSocCatCd2", hide: false },
          ],
        },
        {
          headerName: "ST",
          hide: false,
          children: [
            { headerName: "Female", field: "totTchFSocCatCd3" },
            { headerName: "Male", field: "totTchMSocCatCd3" },
          ],
        },

        {
          headerName: "Overall",
          hide: false,
          children: [
            {
              headerName: "Overall",
              field: "total",
              valueGetter: (params) => (params.data ? params.data.total : null),
              aggFunc: "sum",
            },
          ],
        },
      ],
    },
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
  function onColumnVisible(event) {
    const columnId = event?.column?.colId;
    const visible = event.visible;
    if (columnId === "schManagementBroad") {
      setGroupKeys((prev) => ({
        ...prev,
        schManagementBroad: visible,
      }));
      setMgt(() => (visible ? "active" : ""));
      setMultiMgts(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schManagementDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schManagementDesc: visible,
      }));
      setMgtDetail(() => (visible ? "active" : ""));
      setMultiMgts(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schCategoryBroad") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryBroad: visible,
      }));
      setCat(() => (visible ? "active" : ""));

      setMultiCats(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schCategoryDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryDesc: visible,
      }));
      setCatDetail(() => (visible ? "active" : ""));

      setMultiCats(() => (visible ? "multibtn" : ""));
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
    if (!params) {
      return;
    }
    gridApiRef.current = params?.api;
    setColumnVisibility(groupKeys);
    setGridApi(params);
  };

  const setColumnVisibility = (keys) => {
    if (gridApiRef.current) {
      const gridApi = gridApiRef.current;
      Object.keys(keys)?.forEach((key) => {
        gridApi?.columnApi?.setColumnVisible(key, keys[key]);
      });
    }
  };
  const handleCustomKeyInAPIResponse = () => {
    const arr = [];
    school_data?.forEach((item, idx) => {
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
    setGraphData(arr);
  };

  const generateKey = (item, filters) => {
    const {
      regionName,
      schManagementBroad,
      schManagementDesc,
      schCategoryBroad,
      schCategoryDesc,
      schLocationDesc,
    } = item;
    let keyParts = [regionName];

    if (filters.schManagementBroad) keyParts.push(schManagementBroad);
    if (filters.schManagementDesc) keyParts.push(schManagementDesc);
    if (filters.schCategoryBroad) keyParts.push(schCategoryBroad);
    if (filters.schCategoryDesc) keyParts.push(schCategoryDesc);
    if (filters.schLocationDesc) keyParts.push(schLocationDesc);

    return keyParts.join("-");
  };

  const groupData = (data, filters) => {
    const groupedData = {};

    data.forEach((item) => {
      const key = generateKey(item, filters);
      if (!groupedData[key]) {
        groupedData[key] = {
          ...item,
          totTchFSocCatCd1: 0,
          totTchMSocCatCd1: 0,
          totTchFSocCatCd2: 0,
          totTchMSocCatCd2: 0,
          totTchFSocCatCd3: 0,
          totTchMSocCatCd3: 0,
          totTchFSocCatCd4: 0,
          totTchMSocCatCd4: 0,
        };
      }

      groupedData[key].totTchFSocCatCd1 += parseInt(item.totTchFSocCatCd1, 10);
      groupedData[key].totTchMSocCatCd1 += parseInt(item.totTchMSocCatCd1, 10);
      groupedData[key].totTchFSocCatCd2 += parseInt(item.totTchFSocCatCd2, 10);
      groupedData[key].totTchMSocCatCd2 += parseInt(item.totTchMSocCatCd2, 10);
      groupedData[key].totTchFSocCatCd3 += parseInt(item.totTchFSocCatCd3, 10);
      groupedData[key].totTchMSocCatCd3 += parseInt(item.totTchMSocCatCd3, 10);
      groupedData[key].totTchFSocCatCd4 += parseInt(item.totTchFSocCatCd4, 10);
      groupedData[key].totTchMSocCatCd4 += parseInt(item.totTchMSocCatCd4, 10);
    });

    return Object.values(groupedData);
  };
  const handleButtonClick = (type, detailType) => {
    handleFilterClick(type, detailType);

    if (type === "School Management") {
      setMgt((prevMgt) =>
        detailType === "broad" ? (prevMgt === "active" ? "" : "active") : ""
      );
      setMgtDetail((prevMgtDetail) =>
        detailType === "desc"
          ? prevMgtDetail === "active"
            ? ""
            : "active"
          : ""
      );
    }

    if (type === "School Category") {
      setCat((prevCat) =>
        detailType === "broad" ? (prevCat === "active" ? "" : "active") : ""
      );
      setCatDetail((prevCatDetail) =>
        detailType === "desc"
          ? prevCatDetail === "active"
            ? ""
            : "active"
          : ""
      );
    }
  };

  useEffect(() => {
    setColumn((prevColumns) => {
      const updatedColumns = [...prevColumns];
      const firstChild = updatedColumns[1].children[0].children;

      const updateColumnVisibility = (field, isVisible) => {
        const index = firstChild.findIndex((col) => col.field === field);
        if (index !== -1) {
          firstChild[index].hide = !isVisible;
        }
      };

      if (groupKeys.schManagementBroad !== undefined) {
        updateColumnVisibility(
          "schManagementBroad",
          groupKeys.schManagementBroad
        );
      }
      if (groupKeys.schManagementDesc !== undefined) {
        updateColumnVisibility(
          "schManagementDesc",
          groupKeys.schManagementDesc
        );
      }
      if (groupKeys.schCategoryBroad !== undefined) {
        updateColumnVisibility("schCategoryBroad", groupKeys.schCategoryBroad);
      }
      if (groupKeys.schCategoryDesc !== undefined) {
        updateColumnVisibility("schCategoryDesc", groupKeys.schCategoryDesc);
      }
      if (groupKeys.schLocationDesc !== undefined) {
        updateColumnVisibility("schLocationDesc", groupKeys.schLocationDesc);
      }
      updateColumnVisibility("regionName", filter_query_by_location);
      const updatedDefs = updatedColumns.map((colGroup) => ({
        ...colGroup,
        children: colGroup.children?.map((col) => ({
          ...col,
          hide: firstChild.find((c) => c.field === col.field)?.hide || col.hide,
        })),
      }));

      return updatedDefs;
    });

    const grouped = groupData(data, groupKeys);
    setArrGroupedData(grouped);
    setColumnVisibility(groupKeys);
  }, [groupKeys, data, filter_query_by_location, school_data]);

  // using use effect to translate the data
  useEffect(() => {
    const translateColumns = (columnsArray) => {
      return columnsArray?.map((col) => ({
        ...col,
        headerName: t(col.headerNameKey),
        children: col.children ? translateColumns(col.children) : col.children,
      }));
    };

    const translatedColumns = translateColumns(columnsConfig);

    setColumn(translatedColumns);
  }, [t]);

  const handleFilterClick = (type, detailType) => {
    setGroupKeys((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (type === "School Management") {
        if (detailType === "broad") {
          newFilters.schManagementBroad = !prevFilters.schManagementBroad;
          newFilters.schManagementDesc = false;
        } else if (detailType === "desc") {
          newFilters.schManagementDesc = !prevFilters.schManagementDesc;
          newFilters.schManagementBroad = false;
        }
      } else if (type === "School Category") {
        if (detailType === "broad") {
          newFilters.schCategoryBroad = !prevFilters.schCategoryBroad;
          newFilters.schCategoryDesc = false;
        } else if (detailType === "desc") {
          newFilters.schCategoryDesc = !prevFilters.schCategoryDesc;
          newFilters.schCategoryBroad = false;
        }
      } else if (type === "Urban/Rural") {
        newFilters.schLocationDesc = !prevFilters.schLocationDesc;
      }

      return newFilters;
    });
  };

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

  const pinedBottomRowDatas = [
    {
      ...(getLastTrueToShowTotal()
        ? { [getLastTrueToShowTotal()]: "Total" }
        : { regionName: "Total" }),
      totTchFSocCatCd1: calculateTotal("totTchFSocCatCd1"),
      totTchMSocCatCd1: calculateTotal("totTchMSocCatCd1"),
      totTchFSocCatCd2: calculateTotal("totTchFSocCatCd2"),
      totTchMSocCatCd2: calculateTotal("totTchMSocCatCd2"),
      totTchFSocCatCd3: calculateTotal("totTchFSocCatCd3"),
      totTchMSocCatCd3: calculateTotal("totTchMSocCatCd3"),
      totTchFSocCatCd4: calculateTotal("totTchFSocCatCd4"),
      totTchMSocCatCd4: calculateTotal("totTchMSocCatCd4"),
      // Correct total calculation
      total:
        calculateTotal("totTchFSocCatCd1") +
        calculateTotal("totTchFSocCatCd2") +
        calculateTotal("totTchFSocCatCd3") +
        calculateTotal("totTchFSocCatCd4") +
        calculateTotal("totTchMSocCatCd1") +
        calculateTotal("totTchMSocCatCd2") +
        calculateTotal("totTchMSocCatCd3") +
        calculateTotal("totTchMSocCatCd4"),
    },
  ];

  /*------------Export data to Excel and PDF-------------*/
  const getHeaderToExport = (gridApi) => {
    if (!gridApi) {
      return;
    }
    const columns = gridApi?.api?.getAllDisplayedColumns();
    const headerCellSerialNumber = {
      text: "Serial Number",
      headerName: "S.NO.",
      bold: true,
      margin: [0, 12, 0, 0],
    };
    const headerRow = columns?.map((column) => {
      const { field, headerName } = column?.getColDef();
      const sort = column?.getSort();
      const headerNameUppercase = field[0]?.toUpperCase() + field?.slice(1);
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
    if (!gridApi) {
      return;
    }
    const columns = gridApi?.api?.getAllDisplayedColumns();
    const getCellToExport = (column, node) => ({
      text: gridApi.api.getValue(column, node) ?? "",
    });
    const rowsToExport = [];
    gridApi?.api?.forEachNodeAfterFilterAndSort((node) => {
      const rowToExport = [];
      rowToExport.push({ text: rowsToExport.length + 1 });
      if (!columns) {
        return;
      }
      columns?.forEach((column) => {
        rowToExport?.push(getCellToExport(column, node));
      });
      rowsToExport.push(rowToExport);
    });
    return rowsToExport;
  };
  const getDocument = (gridApi) => {
    if (!gridApi) {
      return;
    }
    const headerRow = getHeaderToExport(gridApi);
    const rows = getRowsToExport(gridApi);
    const anyGroupKeyTrue = Object.values(groupKeys).some((value) => value === true);
    const pinnedBottomRowData = ((anyGroupKeyTrue || (local_state !== "All India/National")) && ((anyGroupKeyTrue || (local_state === "State Wise")) || (anyGroupKeyTrue || (local_district === "District Wise")) || (anyGroupKeyTrue || (local_block === "Block Wise"))))
    ? (pinedBottomRowDatas)
    : [];
    const pinnedBottomRow = pinnedBottomRowData
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
          } else if (row.hasOwnProperty(field.charAt(0).toUpperCase() + field.slice(1))) {
            field = field.charAt(0).toUpperCase() + field.slice(1);
          }
          return row[field] !== undefined ? row[field].toString() : "";
        });
    
        table.push(totalRow);
      });
    }
    const headers = [];
    // First row: Social Category spanning all columns
    headers.push([
      {
        content: "Social Category",
        colSpan: table[0].length,
        styles: { halign: "center" },
      },
    ]);

    // Second row: Category headers
    const secondRow = [
      { content: "", colSpan: 1, styles: { halign: "center" } },
    ];
    columns[2].children.forEach((category) => {
      secondRow.push({
        content: category.headerName,
        colSpan: category.children.length,
        styles: { halign: "center" },
      });
    });

    const numberOfColumns = table[0].length;
    const baseValue = 10;
    const extraCells = numberOfColumns - baseValue;
    // Add empty cells to the start of secondRow
    if (extraCells > 0) {
      for (let i = 0; i < extraCells; i++) {
        secondRow.unshift({ content: "", colSpan: 1 });
      }
    }

    const thirdRow = [{ content: "", styles: { halign: "center" } }];
    table[0].forEach((header) => {
      thirdRow.push({ content: header, styles: { halign: "center" } });
    });
    thirdRow.shift();
    headers.push(secondRow);
    headers.push(thirdRow);

    addHeader();
    doc.autoTable({
      head: headers,
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
        halign: "center",
      },

      didParseCell: function (data) {
        const headerRow = getHeaderToExport(gridApi); // Get the header row

        // Get the header text for this column
        const columnHeaderText = headerRow[data.column.index]?.text;
        const columnHeaderHeaderName = headerRow[data.column.index]?.headerName;
        // Check if the current column header is "Serial Number"
        if (columnHeaderText === "Serial Number") {
          data.cell.styles.halign = "center";
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
    if (!gridApi) {
      return;
    }
    const doc = getDocument(gridApi);
    doc.save(`${report.report_name}.pdf`);
  };
  const exportToExcel = () => {
    if (gridApi) {
      const allData = [];
      const visibleColumns = gridApi?.api?.getAllDisplayedColumns();
      const columnHeaders = visibleColumns?.map((column) => ({
        headerName: column?.getColDef().headerName,
        field: column?.getColDef().field,
      }));
      columnHeaders?.unshift({
        headerName: "S.NO.",
        field: "Serial Number",
      });
      gridApi?.api?.forEachNode((node, index) => {
        const data = node.data;
        const rowDataWithSerial = { ...data, "Serial Number": index + 1 };
        allData.push(rowDataWithSerial);
      });
      const columnKeys = columnHeaders?.map((column) => column?.field);
      const columnNames = columnHeaders?.map((column) => column?.headerName);
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
      if (!gridApi) {
        return;
      }
      exportToPDF();
    }
    if (value === "export_excel") {
      exportToExcel();
    }
    document.getElementById("export_data").selectedIndex = 0;
  };
  useEffect(() => {
    if (intialTeacherData && intialTeacherData.length > 0) {
      handleCustomKeyInAPIResponse();
    }
  }, [intialTeacherData, school_data, location.pathname]);
  //  ........................Graph code statr here.....................
  // ...Start Total No. of Teacher by School Management & School Category.....
  const generateKeyGraph = (item, filters) => {
    const { schManagementBroad, schCategoryBroad } = item;
    let keyParts = [schManagementBroad, schCategoryBroad];
    return keyParts.join("-");
  };

  const groupGraphData = (data, filters) => {
    const groupedData = {};

    data.forEach((item) => {
      const key = generateKeyGraph(item, filters);
      if (!groupedData[key]) {
        groupedData[key] = {
          ...item,
          totTchSocCatCd1: 0,
          totTchSocCatCd2: 0,
          totTchSocCatCd3: 0,
          totTchSocCatCd4: 0,
          totalSchCatWise: 0,
        };
      }

      groupedData[key].totTchSocCatCd1 += parseInt(item.totTchSocCatCd1, 10);
      groupedData[key].totTchSocCatCd2 += parseInt(item.totTchSocCatCd2, 10);
      groupedData[key].totTchSocCatCd3 += parseInt(item.totTchSocCatCd3, 10);
      groupedData[key].totTchSocCatCd4 += parseInt(item.totTchSocCatCd4, 10);

      groupedData[key].totalSchCatWise =
        groupedData[key].totTchSocCatCd1 +
        groupedData[key].totTchSocCatCd2 +
        groupedData[key].totTchSocCatCd3 +
        groupedData[key].totTchSocCatCd4;
    });

    return Object.values(groupedData);
  };

  useEffect(() => {
    const grouped = groupGraphData(data, groupKeys);
    setArrGroupedGraphData(grouped);
  }, [groupKeys, graphData, filter_query_by_location, school_data]);

  //Code For Graph 1

  // Taking Objects for category and management
  const categoryTranslations = {
    "Primary (PRY)": t("categories_school.Primary (PRY)"),
    "Upper Primary (UPR)": t("categories_school.Upper Primary (UPR)"),
    "Higher Secondary (HSEC)": t("categories_school.Higher Secondary (HSEC)"),
    "Secondary (SEC)": t("categories_school.Secondary (SEC)"),
  };

  const managementTranslations = {
    "State Government": t("managements.State Government"),
    "Govt. Aided": t("managements.Govt. Aided"),
    "Private Unaided": t("managements.Private Unaided"),
    "Central Government": t("managements.Central Government"),
    Others: t("managements.Others"),
  };

  // function to translate the data dynamically
  const translateDataKeys = (
    data,
    categoryTranslations,
    managementTranslations
  ) => {
    return data.map((item) => ({
      ...item,
      schCategoryBroad:
        categoryTranslations[item.schCategoryBroad] || item.schCategoryBroad,
      schManagementBroad:
        managementTranslations[item.schManagementBroad] ||
        item.schManagementBroad,
    }));
  };

  const processGraphData = (data) => {
    const translatedData = translateDataKeys(
      data,
      categoryTranslations,
      managementTranslations
    );

    // Define categories and managements in Hindi
    const categories = Object.values(categoryTranslations);
    const managements = [
      { name: managementTranslations["State Government"], color: "#751539" },
      { name: managementTranslations["Govt. Aided"], color: "#E6694A" },
      { name: managementTranslations["Private Unaided"], color: "#F5BF55" },
      { name: managementTranslations["Central Government"], color: "#BCE263" },
      { name: managementTranslations["Others"], color: "#57C1BB" },
    ];
    const abbreviateCategory = (category) => {
      return category.replace(/\s*\([^)]*\)/, "");
    };

    const seriesData = managements.map((management) => ({
      name: management.name,
      data: categories.map((category) => {
        const total = translatedData
          .filter(
            (item) =>
              item.schCategoryBroad === category &&
              item.schManagementBroad === management.name
          )
          .reduce((acc, curr) => acc + curr.totalSchCatWise, 0);
        return total;
      }),
      color: management.color,
    }));

    const abbreviatedCategories = categories.map(abbreviateCategory);

    const abbreviatedSeriesData = seriesData.map((series) => ({
      ...series,
      name: series.name.replace("Government", "Govt."),
    }));

    return {
      categories: abbreviatedCategories,
      series: abbreviatedSeriesData,
    };
  };

  const graphScmSchData = processGraphData(arrGroupedGraphData);

  useEffect(() => {
    if (headerData.activeTab === "table") {
      window.localStorage.setItem("state", "All India/National");
      window.localStorage.setItem("map_state_name", "All India/National");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear);
      dispatch(
        fetchArchiveServicesTeacherDataSocialCatGender(initialFilterSchoolData)
      );
    }
    if (headerData.activeTab === "graph") {
      window.localStorage.setItem("state", "All India/National");
      window.localStorage.setItem("map_state_name", "All India/National");
      window.localStorage.setItem("map_district_name", "District");
      window.localStorage.setItem("district", "District");
      window.localStorage.setItem("block", "Block");
      window.localStorage.setItem("year", selectedDYear);
      dispatch(
        fetchArchiveServicesTeacherDataSocialCatGender(initialFilterSchoolData)
      );
    }
  }, [headerData.activeTab, dispatch]);

  const handleScrollComplete = () => {
    setIsScrollComplete(true);
  };
  // Use `arrGroupedData` as the source data and apply the `handleMissingData` function to replace null values with "0".
  // The `handleMissingData` function is used to process data and ensure missing values are replaced,
  // which is then displayed in AG Grid using the processed data.

  const arrGroupedDataTable = handleMissingData(arrGroupedData, columns).map(
    (item) => ({
      ...item,
      total:
        item.totTchFSocCatCd1 +
        item.totTchFSocCatCd2 +
        item.totTchFSocCatCd3 +
        item.totTchFSocCatCd4 +
        item.totTchMSocCatCd1 +
        item.totTchMSocCatCd2 +
        item.totTchMSocCatCd3 +
        item.totTchMSocCatCd4,
    })
  );


  const result = useReportOverallRegionSum(arrGroupedDataTable);

  const anyGroupKeyTrue = Object.values(groupKeys).some((value) => value === true);
  const pinnedBottomRowData = ((anyGroupKeyTrue || (local_state !== "All India/National")) && ((anyGroupKeyTrue || (local_state === "State Wise")) || (anyGroupKeyTrue || (local_district === "District Wise")) || (anyGroupKeyTrue || (local_block === "Block Wise"))))
  ? (  pinedBottomRowDatas)
  : [];
  return (
    <>
      <ScrollToTopOnMount onScrollComplete={handleScrollComplete} />
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
                  <div className="tab-text-infra me-4">
                    {" "}
                    {t("view_data_by")}
                  </div>
                  <ul className="nav nav-tabs mul-tab-main">
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
                      <button
                        type="button"
                        className={`nav-link dark-active details-multi ${mgt_Details}`}
                        id="school_mgt_details"
                        onClick={(e) =>
                          handleButtonClick("School Management", "desc", e)
                        }
                      >
                        {t("detailed_view")}
                      </button>
                    </li>
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
                      <button
                        type="button"
                        className={`nav-link dark-active1 details-multi ${cat_Details}`}
                        onClick={(e) =>
                          handleButtonClick("School Category", "desc", e)
                        }
                      >
                        {t("detailed_view")}
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
                  className="nav-absolute"
                  onSelect={(k) => setActiveTab(k)}
                >
                  <Tab eventKey="about" title={t("about")}>
                    <div className="about-card mt-4">
                      <h2 className="heading-sm2 mb-2">{t("about_us")}</h2>
                      <p>{t("about_us_reports.report_2008.para1")}</p>
                      <p>{t("about_us_reports.report_2008.para2")}</p>
                      <p>{t("about_us_reports.report_2008.para3")}</p>
                    </div>
                  </Tab>
                  <Tab eventKey="table" title={t("table")}>
                    <div className="multi-header-table">
                      <div
                        className=" multi-header-table ag-theme-quartz ag-theme-custom-height h-300"
                        style={{ height: 450 }}
                      >
                        <AgGridReact
                          key={gridRefreshKey}
                          rowData={
                            filter_query_by_location &&
                            (groupKeys.schManagementBroad ||
                              groupKeys.schManagementDesc ||
                              groupKeys.schCategoryBroad ||
                              groupKeys.schCategoryDesc ||
                              groupKeys.schLocationDesc)
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
                          onColumnVisible={onColumnVisible}
                          onGridReady={onGridReady}
                          groupDisplayType="custom"
                          groupHideOpenParents={true}
                          pinnedBottomRowData={pinnedBottomRowData}
                        />
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="graph" title={t("chart")}>
                    <div className="card-box-impact tab-for-graph report-2008 mt-4 tab-content-reduce">
                      <div className="row">
                        <div className="col-md-6 col-lg-6">
                          <TeacherGraph2008 graphScmSchData={graphScmSchData} />
                        </div>

                        <div className="col-md-6 col-lg-6">
                          <TeacherGraph2009 graphData={graphData} />
                        </div>
                        <div className="col-md-6 col-lg-6">
                          <TeacherGraph2010 graphData={graphData} />
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
