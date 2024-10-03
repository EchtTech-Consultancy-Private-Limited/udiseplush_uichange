import React, { useEffect, useCallback, useId, useRef } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { useState } from "react";
import { useSearchParams } from "react-router-dom"
import allreportsdata from '../../json-data/allreports.json';
import { fetchArchiveServicesTeacherDataSocialCatGender } from "../../redux/thunks/archiveServicesThunk";
import { initialFilterSchoolData } from "../../constants/constants";
import { allFilter } from "../../redux/slice/schoolFilterSlice";
import { useDispatch, useSelector } from "react-redux";

import "./infra.css";
import "./report.scss"

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import groupByKey from "../../utils/groupBy";
import Infraicon from "../../assets/images/infra-power.svg";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import Highcharts from "highcharts";
import HC_more from 'highcharts/highcharts-more';
import { useLocation } from "react-router-dom";
import FilterDropdown3016 from "../Home/filter/FilterDropdown3016";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/treemap")(Highcharts);
require("highcharts/modules/treegraph")(Highcharts);
HC_more(Highcharts);
export default function TeacherReport() {
    const dispatch = useDispatch()
    const location = useLocation()
    const schData = useSelector((state) => state.schoolsocialcat)
    const school_data = useSelector((state) => state.schoolsocialcat?.data?.data)
    const [local_state, setLocalStateName] = useState("State Wise");
    const [local_district, setLocalDistrictName] = useState("District");
    const [local_block, setLocalBlockName] = useState("Block");
    const [isScrollComplete, setIsScrollComplete] = useState(false);
    const [previousGroup, setPreviousGroup] = useState(null);

    const local_year = window.localStorage.getItem("year");
    const stateName = localStorage.getItem("state");
    const [groupKeys, setGroupKeys] = useState({
        schManagementBroad: false,
        schManagementDesc: false,
        schCategoryBroad: false,
        schCategoryDesc: false,
        schLocationDesc: false,
    });

    const [show, setShow] = useState(false);
    const [mgt, setMgt] = useState("active");
    const [mgt_Details, setMgtDetail] = useState("");
    const [cat, setCat] = useState("active");
    const [cat_Details, setCatDetail] = useState("");
    const [ur, setUR] = useState("");
    const [multiMgt, setMultiMgts] = useState("multibtn");
    const [multiCat, setMultiCats] = useState("multibtn");
    const [queryParameters] = useSearchParams();
    const id = queryParameters.get('id');
    const type = queryParameters.get('type');
    const [intialTeacherData, setIntialTeacherData] = useState(school_data)

    const gridApiRef = useRef(null);
    useEffect(() => {
        setIntialTeacherData(school_data);
    }, [school_data]);
    useEffect(() => {
        for (const category in allreportsdata) {
            const foundReport = allreportsdata[category].find(
                (report) => report.id === parseInt(id)
            );
            if (foundReport) {
                setReport(foundReport);
                break;
            }
        }
    }, [id]);


    useEffect(() => {
        dispatch(allFilter(initialFilterSchoolData));
        dispatch(fetchArchiveServicesTeacherDataSocialCatGender(initialFilterSchoolData))
    }, [])
    const [report, setReport] = useState(null);
    const [gridApi, setGridApi] = useState();
    const [arrGroupedData, setArrGroupedData] = useState([]);
    const [gridRefreshKey, setGridRefreshKey] = useState(0);
    const [data, setData] = useState([]);
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
                            hide: false,
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
                }
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
                        { headerName: "Male", field: "totTchMSocCatCd1", hide: false }
                    ]
                },
                {
                    headerName: "SC",
                    hide: false,
                    children: [
                        { headerName: "Female", field: "totTchFSocCatCd2", hide: false },
                        { headerName: "Male", field: "totTchMSocCatCd2", hide: false }
                    ]
                },
                {
                    headerName: "ST",
                    hide: false,
                    children: [
                        { headerName: "Female", field: "totTchFSocCatCd3" },
                        { headerName: "Male", field: "totTchMSocCatCd3" }
                    ]
                },
                {
                    headerName: "OBC",
                    hide: false,
                    children: [
                        { headerName: "Female", field: "totTchFSocCatCd4" },
                        { headerName: "Male", field: "totTchMSocCatCd4" }
                    ]
                },


            ]
        }
    ]);




    useEffect(() => {
        for (const category in allreportsdata) {
            const foundReport = allreportsdata[category].find(
                (report) => report.id === parseInt(id)
            );
            if (foundReport) {
                setReport(foundReport);
                break;
            }
        }
    }, [id]);


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
            setMultiMgts("multibtn")
        }
        if (columnId === "schManagementDesc") {
            setGroupKeys((prev) => ({
                ...prev,
                schManagementDesc: visible,
            }));
            setMgtDetail(() => (visible ? "active" : ""));
            setMultiMgts("multibtn")
        }
        if (columnId === "schCategoryBroad") {
            setGroupKeys((prev) => ({
                ...prev,
                schCategoryBroad: visible,
            }));
            setCat(() => (visible ? "active" : ""));

            setMultiCats("multibtn")
        }
        if (columnId === "schCategoryDesc") {
            setGroupKeys((prev) => ({
                ...prev,
                schCategoryDesc: visible,
            }));
            setCatDetail(() => (visible ? "active" : ""));

            setMultiCats("multibtn")
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
        let state_gov_mgt_code = ["1", "2", "3", "6", "89", "90", "91"];
        let gov_aided_mgt_code = ["4", "7"];
        let pvt_uaided_mgt_code = ["5"];
        let ctrl_gov_mgt_code = ["92", "93", "94", "95", "96", "101"];
        let other_mgt_code = ["8", "97", "99", "98", "102"];
        let pr_sch_code = ["1"];
        let upr_pr_code = ["2", "4"];
        let hr_sec_code = ["3", "5", "10", "11"];
        let sec_sch_code = ["6", "7", "8"];
        let pre_pr_sch_code = ["12"];
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
    };


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
        handleCustomKeyInAPIResponse()
    }, [intialTeacherData])


    const generateKey = (item, filters) => {
        const { regionName, schManagementBroad, schManagementDesc, schCategoryBroad, schCategoryDesc, schLocationDesc } = item;
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
    const handleButtonClick = (type, detailType, e) => {
        handleFilterClick(type, detailType);
        if (type === "School Management" && detailType === "desc") {
            setMgtDetail("active");
            setMgt("");
        } else if (type === "School Management" && detailType === "broad") {
            setMgt("active");
            setMgtDetail("");
        }
        if (type === "School Category" && detailType === "desc") {
            setCatDetail("active");
            setCat("");
        } else if (type === "School Category" && detailType === "broad") {
            setCat("active");
            setCatDetail("");
        }

        handleFilter(type, e);
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
                updateColumnVisibility("schManagementBroad", groupKeys.schManagementBroad);
            }
            if (groupKeys.schManagementDesc !== undefined) {
                updateColumnVisibility("schManagementDesc", groupKeys.schManagementDesc);
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

            const updatedDefs = updatedColumns.map(colGroup => ({
                ...colGroup,
                children: colGroup.children?.map(col => ({
                    ...col,
                    hide: firstChild.find(c => c.field === col.field)?.hide || col.hide
                }))
            }));

            return updatedDefs;
        });

        const grouped = groupData(data, groupKeys);
        setArrGroupedData(grouped);
        setColumnVisibility(groupKeys);
    }, [groupKeys, data]);


    const handleFilterClick = (type, detailType) => {
        setGroupKeys((prevFilters) => {
            const newFilters = { ...prevFilters };
            if (type === "School Management") {
                newFilters.schManagementBroad = detailType === 'broad';
                newFilters.schManagementDesc = detailType === 'desc';
            } else if (type === "School Category") {
                newFilters.schCategoryBroad = detailType === 'broad';
                newFilters.schCategoryDesc = detailType === 'desc';
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
        },
    ];
    /*------------Export data to Excel and PDF-------------*/
    const getHeaderToExport = (gridApi) => {
        const columns = gridApi.api.getAllDisplayedColumns();
        const headerCellSerialNumber = {
            text: "Serial Number",
            headerName: "Serial Number",
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
        const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(date);
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [20, 20],
        });
        // Function to add header
        const addHeader = () => {
            doc.setFontSize(25);
            doc.setTextColor("blue");
            doc.setFont("bold");
            doc.text("UDISE+", 0.6, 1);
            doc.setFontSize(20);
            doc.setTextColor("blue");
            doc.text(`${report.report_name}`, 0.6, 1.4, {
                fontSize: 12,
                color: "red",
            });
            doc.setFontSize(20);
            doc.setTextColor("blue");
            doc.text(`Report type : ${stateName}`, 0.6, 1.8, {
                fontSize: 12,
                color: "red",
            });
            doc.setTextColor("blue");
            doc.setFont("bold");
            doc.text(`Report Id : ${id}`, doc.internal.pageSize.width - 1, 1, {
                align: "right",
            });
            doc.text(
                `Academic Year : ${local_year}`,
                doc.internal.pageSize.width - 1,
                1.8,
                { align: "right" }
            );
            doc.setFontSize(20);
            doc.text(
                `Report generated on : ${formattedDate}`,
                doc.internal.pageSize.width - 1,
                doc.internal.pageSize.height - 0.2,
                { align: "right" }
            );
        };
        // Function to add footer
        const addFooter = () => {
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.width - 1,
                    doc.internal.pageSize.height - 0.5,
                    { align: "right" }
                );
            }
        };
        const table = [];
        table.push(headerRow.map((cell) => cell.headerName));
        rows.forEach((row) => {
            table.push(row.map((cell) => cell.text));
        });
        addHeader();
        doc.autoTable({
            head: [table[0]],
            body: table.slice(1),
            startY: 2.2,
            afterPageContent: addFooter,
        });
        const totalPages = doc.internal.getNumberOfPages();
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
                headerName: "Serial Number",
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
        handleButtonClick("School Management", "broad", true);
    }, [data]);
    useEffect(() => {
        handleButtonClick("School Category", "broad", true);
    }, [data]);
    const handleScrollComplete = () => {
        setIsScrollComplete(true); 
      };

    return (
        <>
         <ScrollToTopOnMount onScrollComplete={handleScrollComplete} />
            {schData.isLoading && isScrollComplete && <GlobalLoading />}
            <section className="infrastructure-main-card p-0" id='content'>

                <div className="bg-grey2 pb-0 pt-0 header-bar tab-for-graph">
                    <div className="blue-strip">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-10 col-lg-10">
                                    <div className="common-content text-start map-heading-map">
                                        {report && (
                                            <div className="common-content text-start map-heading-map d-flex align-items-center">
                                                <span className="me-3">Reports ID: {report.id}</span>
                                                <h2 className="heading-sm1 mb-0 mt-0">
                                                    {report.report_name}
                                                </h2>
                                            </div>
                                        )}
                                    </div>
                                </div>

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
                                                    Download Report
                                                </option>
                                                <option value="export_pdf">Download as PDF </option>
                                                <option value="export_excel">
                                                    Download as Excel
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="container pb-4">
                        <div className="row">
                            <div className="col-md-12 col-lg-12 d-flex align-items-center">
                                <div className="tab-text-infra me-4">View Data By</div>
                                <ul className="nav nav-tabs mul-tab-main">
                                    <li className={`nav-item ${multiMgt}`}>
                                        <button
                                            type="button"
                                            className={`nav-link dark-active ${mgt}`}
                                            onClick={(e) => handleButtonClick("School Management", 'broad', e)}
                                        >
                                            School Management(Broad)
                                        </button>
                                        <button
                                            type="button"
                                            className={`nav-link dark-active details-multi ${mgt_Details}`}
                                            id="school_mgt_details"
                                            onClick={(e) => handleButtonClick("School Management", 'desc', e)}
                                        >
                                            Detailed View
                                        </button>
                                    </li>
                                    <li className={`nav-item ${multiCat}`}>
                                        <button
                                            type="button"
                                            className={`nav-link dark-active1 ${cat}`}
                                            onClick={(e) => handleButtonClick("School Category", 'broad', e)}
                                        >
                                            School Category(Broad)
                                        </button>
                                        <button
                                            type="button"
                                            className={`nav-link dark-active1 details-multi ${cat_Details}`}
                                            onClick={(e) => handleButtonClick("School Category", 'desc', e)}
                                        >
                                            Detailed View
                                        </button>
                                    </li>
                                    <li className="nav-item mb-1">
                                        <button
                                            type="button"
                                            className={`nav-link ${ur}`}
                                            onClick={(e) => handleButtonClick("Urban/Rural", 'broad', e)}
                                        >
                                            Urban / Rural
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-grey ptb-30">
                    <div className="container tab-for-graph">
                        <div className="row align-items-center report-inner-tab">
                            <div className="col-md-12">
                                <h4 className="brudcrumb_heading">
                                    Showing Result for : <span>&nbsp;{local_state}</span>
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
                            </div>
                            <div className="col-md-12 col-lg-12 table-text-i">
                                <Tabs defaultActiveKey={type} id="uncontrolled-tab-example" className="">
                                    <Tab eventKey="about" title="About">
                                        <div className="about-card mt-4">
                                            <h2 className="heading-sm2 mb-2">About Us</h2>
                                            <p>
                                                This comprehensive report delves into the educational landscape, examining the distribution of schools based on the availability of infrastructure and facilities, school management structures, and categorization by facility offerings. The study meticulously analyzes the diverse spectrum of educational institutions, shedding light on the correlation between the presence of infrastructure, effective management practices, and the categorization of schools based on the facilities they provide.
                                            </p>
                                            <p>
                                                Through a meticulous data-driven approach, the report classifies schools into distinct categories, discerning the variance in facilities and resources offered across different segments of the education sector. By exploring the nexus between school management structures and the quality of infrastructure, the report aims to provide valuable insights into the critical factors that contribute to a conducive learning environment.
                                            </p>
                                            <p>
                                                Stakeholders in education, policymakers, and researchers will find this report instrumental in understanding the nuanced interplay between infrastructure availability, school management strategies, and the diverse array of facilities that contribute to a well-rounded educational experience. The findings within offer a roadmap for informed decision-making, allowing for targeted interventions and improvements in the educational landscape to ensure equitable access to quality education for all.
                                            </p>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="table" title="Table">
                                        <div className="multi-header-table">
                                            <div
                                                className=" multi-header-table ag-theme-material ag-theme-custom-height ag-theme-quartz h-300"
                                                style={{ height: 450 }}
                                            >
                                                <AgGridReact
                                                    key={gridRefreshKey}
                                                    rowData={arrGroupedData}
                                                    columnDefs={columns}
                                                    defaultColDef={defColumnDefs}
                                                    onColumnVisible={onColumnVisible}
                                                    onGridReady={onGridReady}
                                                    groupDisplayType="custom"
                                                    groupHideOpenParents={true}
                                                    pinnedBottomRowData={pinedBottomRowDatas}
                                                />


                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="graph" title="Chart" disabled>
                                    </Tab>

                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FilterDropdown3016 />
        </>
    )
}