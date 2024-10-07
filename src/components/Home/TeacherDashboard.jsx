import React, { useEffect, useState } from 'react';
import pen from '../../assets/images/pen.svg'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { convertToIndianNumberSystem,convertToIndianNumberSystemHindi } from '../../utils/index';
import Breadcrumb from './Breadcrumb';
import { fetchTeachersStatsData, fetchTeachersStatsIntData } from '../../redux/thunks/dashboardThunk';
import { GlobalLoading } from '../GlobalLoading/GlobalLoading';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);


(function (H) {
    H.seriesTypes.pie.prototype.animate = function (init) {
        const series = this,
            chart = series.chart,
            points = series.points,
            {
                animation
            } = series.options,
            {
                startAngleRad
            } = series;

        function fanAnimate(point, startAngleRad) {
            const graphic = point?.graphic,
                args = point?.shapeArgs;

            if (graphic && args) {

                graphic
                    // Set inital animation values
                    .attr({
                        start: startAngleRad,
                        end: startAngleRad,
                        opacity: 1
                    })
                    // Animate to the final position
                    .animate({
                        start: args.start,
                        end: args.end
                    }, {
                        duration: animation.duration / points.length
                    }, function () {
                        // On complete, start animating the next point
                        if (points[point.index + 1]) {
                            fanAnimate(points[point.index + 1], args.end);
                        }
                        // On the last point, fade in the data labels, then
                        // apply the inner size
                        if (point.index === series.points.length - 1) {
                            series.dataLabelsGroup.animate({
                                opacity: 1
                            },
                                void 0,
                                function () {
                                    points.forEach(point => {
                                        point.opacity = 1;
                                    });
                                    series.update({
                                        enableMouseTracking: true
                                    }, false);
                                    chart.update({
                                        plotOptions: {
                                            pie: {
                                                innerSize: '40%',
                                                borderRadius: 8
                                            }
                                        }
                                    });
                                });
                        }
                    });
            }
        }

        if (init) {
            // Hide points on init
            points.forEach(point => {
                point.opacity = 0;
            });
        } else {
            fanAnimate(points[0], startAngleRad);
        }
    };
}(Highcharts));


export default function TeacherDashboard() {
    const { t ,i18n } = useTranslation();
    const selectedLanguage=localStorage.getItem("selectedLanguage")
    const languagebasedConvertNumberSystem=selectedLanguage==="en"?convertToIndianNumberSystem:convertToIndianNumberSystemHindi
    const [mgtGraph, setMgtGraph] = useState([
        {
            name:t("government"),
            y: 1,
            color: "#F5BF55",
        },
        {
            name: t("private"),
            y: 1,
            color: "#E6694A",
        },
        {
            name: t("aided"),
            y: 1,
            color: "#BCE263",
        },
        {
            name:t("others"),
            y: 1,
            color: "#751539",
        },
    ]);


    const [levelOfEducation, setLevelOfEducation] = useState([
        {
            name: t("elementary"),
            y: 1,
            color: "#BCE263",
        },
        {
            name: t("secondary"),
            y: 1,
            color: "#751539",
        },
        {
            name: t("higher_secondary"),
            y: 1,
            color: "#E6694A",
        },
    ])
    const [schoolType, setSchoolType] = useState([
        {
            name: "Boys",
            y: 1,
            color: "#57C1BB",
        },
        {
            name: "Girls",
            y: 1,
            color: "#E6694A",
        },
        {
            name: "Co-Ed",
            y: 1,
            color: "#BCE263",
        },
    ])
    const male_female = [{
        name: 'Female',
        data: [1, 1, 1, 1],
        color: "#751539"
    }, {

        name: 'Male',
        data: [1, 1, 1, 1],
        color: "#57C1BB"
    }];

    const [totalMaleFemale, setTotalMaleFemale] = useState(male_female);

    const teacher_ratio = [{
        name: 'Primary',
        color: '#BCE263',
        data: [{
            name: 'Primary',
            y: 1,
            x: 0,
            color: '#BCE263'
        }]
    }, {
        name: 'Upper Primary',
        color: '#751539',
        data: [{
            name: 'Upper Primary',
            y: 1,
            x: 1,
            color: '#751539'
        }]
    }, {
        name: 'Secondary',
        color: '#E6694A',
        data: [{
            name: 'Secondary',
            y: 1,
            x: 2,
            color: '#E6694A'
        }]
    }, {
        name: 'Higher Secondary',
        color: '#57C1BB',
        data: [{
            name: 'Higher Secondary',
            y: 1,
            x: 3,
            color: '#57C1BB'
        }]
    }];
    const [peopleTeacherRatio, setPeopleTeacherRatio] = useState(teacher_ratio);

    const dashData = useSelector((state) => state?.teacherStats?.data?.data?.[0]) || {};
    const dashDataIsLoading = useSelector((state) => state?.teacherStats) ;

    const dashIntData = useSelector((state) => state?.teacherIntStats?.data?.data?.[0]) || {};
    const schoolFilter = useSelector((state) => state?.schoolFilter);

    const filterObj = structuredClone(schoolFilter);
    const dispatch = useDispatch();

    useEffect(() => {
        filterObj.valueType = 2
        dispatch(fetchTeachersStatsData(filterObj)).then((res) => {
            handleMgtWiseGraph(res?.payload?.data[0]);
        });
    }, [dispatch, schoolFilter]);
    useEffect(() => {
        dispatch(fetchTeachersStatsIntData(filterObj)).then((res) => {
            handleMgtWiseIntGraph(res?.payload?.data[0]);
        });
    }, [dispatch, schoolFilter]);
    useEffect(() => {
        handleMgtWiseGraph(dashData)
    }, [i18n.language,dashData]);
    useEffect(() => {
        handleMgtWiseIntGraph(dashIntData)
    }, [i18n.language,dashIntData]);
    const breaks = [];
    const handleMgtWiseGraph = (data) => {
        let arr = [];

        const totalTeacher = parseInt(data?.totTch);

        const totTchGovt = parseFloat(data?.totTchGovt);
        const totTchGovtAided = parseFloat(data?.totTchGovtAided);
        const totTchPvt = parseFloat(data?.totTchPvt);
        const totTchOther = parseFloat(data?.totTchOther);



        const totTchEle = parseFloat(data?.totTchEle);
        const totTchSec = parseFloat(data?.totTchSec);
        const totTchHSec = parseFloat(data?.totTchHSec);


        arr.push({
            name: t("government"),
            y: totTchGovt,
            color: "#F5BF55",
        },
            {
                name: t("private"),
                y: totTchPvt,
                color: "#E6694A",
            },
            {
                name:t("aided"),
                y: totTchGovtAided,
                color: "#BCE263",
            },
            {
                name: t("others"),
                y: totTchOther,
                color: "#751539",
            });
        setMgtGraph(arr);

        arr = [];
        arr.push(
          { name: t("elementary"), y: totTchEle, color: "#BCE263" },
          {  name: t("secondary"), y: totTchSec, color: "#751539" },
          { name: t("higher_secondary"), y: totTchHSec, color: "#E6694A" }
        );
        setLevelOfEducation(arr);


        arr = [];
        const male_female = [{
            name: i18n.language === "en" ? "Female" : "महिला",
            data: [parseInt(data?.totTchGovtF), parseInt(data?.totTchGovtAidedF), parseInt(data?.totTchPvtF), parseInt(data?.totTchOtherF)],
            color: "#751539"
        }, {

            name: i18n.language === "en" ? "Male" : "पुरुष",
            data: [parseInt(data?.totTchGovtM), parseInt(data?.totTchGovtAidedM), parseInt(data?.totTchPvtM), parseInt(data?.totTchOtherM)],
            color: "#57C1BB"
        }];
        setTotalMaleFemale(male_female);

        const pupilTeacherRPry = parseFloat(data?.ptrPry)
        const pupilTeacherRUPry = parseFloat(data?.ptrUPry)
        const pupilTeacherRSec = parseFloat(data?.ptrSec)
        const pupilTeacherHSec = parseFloat(data?.ptrHSec)

        arr = [];
        const teacherRatioData = [{
            name: t("primary"),
            color: '#BCE263',
            data: [{
                name:t("primary"),
                y: pupilTeacherRPry,
                x: 0,
                color: '#BCE263'
            }]
        }, {
            name:t("upper_primary"),
            color: '#751539',
            data: [{
                name: t("upper_primary"),
                y: pupilTeacherRUPry,
                x: 1,
                color: '#751539'
            }]
        }, {
            name: t("secondary"),
            color: '#E6694A',
            data: [{
                name: t("secondary"),
                y: pupilTeacherRSec,
                x: 2,
                color: '#E6694A'
            }]
        }, {
            name:t("higher_secondary"),
            color: '#57C1BB',
            data: [{
                name: t("higher_secondary"),
                y: pupilTeacherHSec,
                x: 3,
                color: '#57C1BB'
            }]
        }];

        setPeopleTeacherRatio(teacherRatioData);
    }
    const handleMgtWiseIntGraph = (data) => {
        let arr = []

        const male_female = [{
            name: t("female"),
            data: [parseInt(data?.totTchGovtF), parseInt(data?.totTchGovtAidedF), parseInt(data?.totTchPvtF), parseInt(data?.totTchOtherF)],
            color: "#751539"
        }, {

            name: t("male"),
            data: [parseInt(data?.totTchGovtM), parseInt(data?.totTchGovtAidedM), parseInt(data?.totTchPvtM), parseInt(data?.totTchOtherM)],
            color: "#57C1BB"
        }];
        setTotalMaleFemale(male_female);

    }


    return (
        <>
        {dashDataIsLoading.isLoading && <GlobalLoading />}
            <section className="pgicategory vision-mission-card ptb-30">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-4 p-0">
                            <h2 className="heading-blue">{t("message_on_map")}</h2>
                            <Breadcrumb />
                        </div>
                        <div className="col-md-12 col-lg-12 p-0">
                            <div className="common-content text-start right-card-sec">
                                <div className="srid-card-se school-dashboard">
                                    <div className="row">
                                        <div className="col-md-9 col-lg-9">
                                            <div className="card-box row">
                                                <div className="col-md-6 mb-5">
                                                    <div className="main-text-c m-big">{languagebasedConvertNumberSystem((dashIntData?.totTch) || 0)}</div>
                                                    <span className="sub-text-c text-green">{t("total_teachers")}</span>
                                                </div>
                                                <div className="col-md-6 mb-5">
                                                    <div className="main-text-c m-big">{languagebasedConvertNumberSystem((dashIntData?.totTchEle) || 0)}</div>
                                                    <span className="sub-text-c text-green">{t("elementary_teachers")}</span>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="main-text-c m-big">{languagebasedConvertNumberSystem((dashIntData?.totTchSec) || 0)}</div>
                                                    <span className="sub-text-c text-green">{t("secondary_teachers")}</span>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="main-text-c m-big">{languagebasedConvertNumberSystem((dashIntData?.totTchHSec) || 0)}</div>
                                                    <span className="sub-text-c text-green">{t("higher_sec_teachers")}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <img src={pen} alt="graph icon" className='school-graph-icon icon-h-big Teacher_dashboard-icon' />
                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">{t("number_of_teachers_management_wise")}</h2>
                                                    {/* <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1 highcharts-button-normal'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div> */}
                                                </div>

                                                <div className="piechart-box row mt-4">
                                                    <div className="col-md-12">
                                                        <HighchartsReact
                                                            highcharts={Highcharts}
                                                            options={{
                                                                chart: {
                                                                    type: 'pie',
                                                                    marginTop: 50,
                                                                    events: {
                                                                        beforePrint:function() {
                                                                          this.exportSVGElements[0].box.hide();
                                                                         this.exportSVGElements[1].hide();
                                                                       },
                                                                       afterPrint:function() {
                                                                          this.exportSVGElements[0].box.show();
                                                                         this.exportSVGElements[1].show();
                                                                       }
                                                                     }
                                                                },
                                                                events: {
                                                                    beforePrint: function () {

                                                                    },
                                                                    afterPrint: function () {

                                                                    }
                                                                },
                                                                title: {
                                                                    text: t("number_of_teachers_management_wise")
                                                                },
                                                                tooltip: {
                                                                    valueSuffix: '%',
                                                                    valueDecimals: 2,

                                                                },
                                                                credits: {
                                                                    enabled: false
                                                                },
                                                                plotOptions: {
                                                                    pie: {
                                                                        size: '100%',
                                                                        dataLabels: {
                                                                            enabled: true,
                                                                            distance: -40,
                                                                            formatter: function () {
                                                                                return '<b>' + this.point.y + '%';
                                                                            },
                                                                            style: {
                                                                                fontSize: "16px",
                                                                                textOutline: "none",
                                                                                opacity: 0.7,
                                                                            },
                                                                        },
                                                                        center: ['50%', '50%'],
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
                                                                    //     text: "Key",
                                                                    //     style: {
                                                                    //       fontSize: '18px',                                       
                                                                    //     }
                                                                    //   },
                                                                    layout: 'horizontal',
                                                                    align: 'center',
                                                                    verticalAlign: 'bottom',
                                                                    itemMarginTop: 10,
                                                                    itemMarginBottom: 10
                                                                },
                                                                series: [
                                                                    {
                                                                        name: t('percentage'),
                                                                        colorByPoint: true,
                                                                        data: mgtGraph
                                                                    }
                                                                ],
                                                                exporting: {
                                                                    filename: t("number_of_teachers_management_wise"),
                                                                    csv: {
                                                                        columnHeaderFormatter: function (item) {
                                                                            if (!item || item instanceof Highcharts.Axis) {
                                                                                return t('category'); 
                                                                            }
                                                                            return item.name;
                                                                        }
                                                                    },
                                                                }
                                                            }}
                                                            // allowChartUpdate={true}
                                                            immutable={true}
                                                        />
                                                    </div>
                                                </div>

                                            </div>


                                        </div>

                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">{t("number_of_teachers_by_level_of_education")}</h2>
                                                    {/* <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div> */}
                                                </div>

                                                <div className="piechart-box row mt-4">
                                                    <div className="col-md-12">
                                                        <HighchartsReact
                                                            highcharts={Highcharts}
                                                            options={{
                                                                chart: {
                                                                    type: 'pie',
                                                                    marginTop: 50,
                                                                    events: {
                                                                        beforePrint:function() {
                                                                          this.exportSVGElements[0].box.hide();
                                                                         this.exportSVGElements[1].hide();
                                                                       },
                                                                       afterPrint:function() {
                                                                          this.exportSVGElements[0].box.show();
                                                                         this.exportSVGElements[1].show();
                                                                       }
                                                                     }
                                                                },
                                                                events: {
                                                                    beforePrint: function () { },
                                                                    afterPrint: function () { }
                                                                },
                                                                title: {
                                                                    text: t("number_of_teachers_by_level_of_education")
                                                                },
                                                                tooltip: {
                                                                    valueSuffix: '%',
                                                                    valueDecimals: 2
                                                                },
                                                                credits: {
                                                                    enabled: false
                                                                },
                                                                plotOptions: {
                                                                    pie: {
                                                                        size: '100%',
                                                                        dataLabels: {
                                                                            enabled: true,
                                                                            distance: -40,
                                                                            formatter: function () {
                                                                                return '<b>' + this.point.y + '%';
                                                                            },
                                                                            style: {
                                                                                fontSize: "16px",
                                                                                textOutline: "none",
                                                                                opacity: 0.7,
                                                                            },
                                                                        },
                                                                        center: ['50%', '50%'],
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
                                                                    //     text: "Key",
                                                                    //     style: {
                                                                    //       fontSize: '18px',                                       
                                                                    //     }
                                                                    //   },
                                                                    layout: 'horizontal',
                                                                    align: 'center',
                                                                    verticalAlign: 'bottom',
                                                                    itemMarginTop: 10,
                                                                    itemMarginBottom: 10
                                                                },
                                                                series: [{
                                                                    name: t('percentage'),
                                                                    colorByPoint: true,
                                                                    data: levelOfEducation
                                                                }],
                                                                exporting: {
                                                                    filename:   t("number_of_teachers_by_level_of_education"),
                                                                    csv: {
                                                                        columnHeaderFormatter: function (item) {
                                                                            if (!item || item instanceof Highcharts.Axis) {
                                                                                return t('category'); 
                                                                            }
                                                                            return item.name;
                                                                        }
                                                                    },
                                                                }
                                                            }}
                                                            // allowChartUpdate={true}
                                                            immutable={true}
                                                        />

                                                    </div>
                                                </div>

                                            </div>


                                        </div>

                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph number_of_male_female_teacher mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">{t("number_of_male_female_teacher")}</h2>
                                                    {/* <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div> */}
                                                </div>

                                                <div className="piechart-box row mt-4">
                                                    <div className="col-md-12">
                                                        <HighchartsReact
                                                            highcharts={Highcharts}
                                                            options={{
                                                                chart: {
                                                                    type: 'column',
                                                                    marginTop: 50,
                                                                    events: {
                                                                        beforePrint:function() {
                                                                          this.exportSVGElements[0].box.hide();
                                                                         this.exportSVGElements[1].hide();
                                                                       },
                                                                       afterPrint:function() {
                                                                          this.exportSVGElements[0].box.show();
                                                                         this.exportSVGElements[1].show();
                                                                       }
                                                                     }
                                                                },
                                                                xAxis: {
                                                                    categories: [ t('government'),
                                                                        t('aided'),
                                                                        t('private'),
                                                                        t('others')],
                                                                    title: {
                                                                        text: null
                                                                    },
                                                                    gridLineWidth: 1,
                                                                    lineWidth: 0
                                                                },
                                                                yAxis: {
                                                                    min: 0,
                                                                    title: {
                                                                        // text: 'Population (millions)',
                                                                        // align: 'high'
                                                                        enabled: false
                                                                    },
                                                                    labels: {
                                                                        overflow: 'justify'
                                                                    },
                                                                    gridLineWidth: 0
                                                                },
                                                               
                                                                tooltip: {
                                                                    valueSuffix: '',
                                                                    valueFormatter: function () {
                                                                        return this.y.toFixed(2);
                                                                    },
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
                                                                title: {
                                                                    text: t("number_of_male_female_teacher")
                                                                },
                                                                plotOptions: {


                                                                    column: { // Use 'column' instead of 'bar' for column charts

                                                                        dataLabels: {
                                                                            enabled: true,
                                                                            formatter: function () {
                                                                                return this.y.toLocaleString('en-IN');
                                                                            }
                                                                        },
                                                                        groupPadding: 0
                                                                    }
                                                                },
                                                                legend: {
                                                                    layout: "horizontal",
                                                                    align: "center",
                                                                    verticalAlign: "bottom",
                                                                    itemMarginTop: 10,
                                                                    itemMarginBottom: 10,
                                                                },
                                                                events: {
                                                                    load: function () {
                                                                        const chart = this;
                                                                        // When the chart is loaded and the table is rendered, format the table cells
                                                                        const table = document.querySelector('.highcharts-data-table table');
                                                                        if (table) {
                                                                            const cells = table.querySelectorAll('tbody td');
                                                                            cells.forEach(cell => {
                                                                                const cellValue = parseFloat(cell.innerText.replace(/,/g, ''));
                                                                                if (!isNaN(cellValue)) {
                                                                                    cell.innerText = cellValue.toLocaleString('en-IN');
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                },
                                                                credits: {
                                                                    enabled: false
                                                                },
                                                                series: totalMaleFemale ,
                                                                exporting: {
                                                                    filename: t("number_of_male_female_teacher"),
                                                                    csv: {
                                                                        columnHeaderFormatter: function (item) {
                                                                            if (!item || item instanceof Highcharts.Axis) {
                                                                                return t('category'); 
                                                                            }
                                                                            return item.name;
                                                                        }
                                                                    },
                                                                }
                                                            }}
                                                            // allowChartUpdate={true}
                                                            immutable={true}
                                                        />
                                                    </div>
                                                </div>

                                            </div>


                                        </div>

                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">{t("pupil_teacher_ratio")}</h2>
                                                    {/* <div className='d-flex w-20'>
                                                        <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
                                                        <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
                                                    </div> */}
                                                </div>

                                                <div className="piechart-box row mt-4">
                                                    <div className="col-md-12">
                                                        <HighchartsReact
                                                            highcharts={Highcharts}
                                                            options={{
                                                                chart: {
                                                                    type: 'column',
                                                                    marginTop: 50,
                                                                    ignoreHiddenSeries: true,
                                                                    events: {
                                                                        load: function () {
                                                                            Highcharts.each(this.series, function () {
                                                                                breaks.push({});
                                                                            });
                                                                        },
                                                                        beforePrint:function() {
                                                                            this.exportSVGElements[0].box.hide();
                                                                           this.exportSVGElements[1].hide();
                                                                         },
                                                                         afterPrint:function() {
                                                                            this.exportSVGElements[0].box.show();
                                                                           this.exportSVGElements[1].show();
                                                                         }
                                                                    }
                                                                },
                                                                plotOptions: {
                                                                    column: {
                                                                        grouping: false,
                                                                        pointPlacement: null,
                                                                        dataLabels: {
                                                                            enabled: true,
                                                                        },
                                                                        events: {
                                                                            legendItemClick: function () {
                                                                                if (!this.visible) {
                                                                                    breaks[this.index] = {}
                                                                                    this.chart.xAxis[0].update({
                                                                                        breaks: breaks
                                                                                    });
                                                                                } else {
                                                                                    breaks[this.index] = {
                                                                                        from: this.xData[0] - 0.5,
                                                                                        to: this.xData[0] + 0.5,
                                                                                        breakSize: 0
                                                                                    }
                                                                                    this.chart.xAxis[0].update({
                                                                                        breaks: breaks
                                                                                    });
                                                                                }
                                                                            }
                                                                        },
                                                                        series: {
                                                                            format: '{point.y:.2f}%',
                                                                        },
                                                                    },
                                                                },
                                                                title: {
                                                                    text: t("pupil_teacher_ratio")
                                                                },
                                                                xAxis: {
                                                                    categories: [ t('primary'),
                                                                        t('upper_primary'),
                                                                        t('secondary'),
                                                                        t('higher_secondary')],
                                                                    startOnTick: true
                                                                },
                                                                yAxis: {
                                                                    min: 0,
                                                                    title: {
                                                                        // text: 'Population (millions)',
                                                                        // align: 'high'
                                                                        enabled: false
                                                                    },
                                                                    labels: {
                                                                        overflow: 'justify'
                                                                    },
                                                                    gridLineWidth: 0
                                                                },
                                                                legend: {
                                                                    layout: "horizontal",
                                                                    align: "center",
                                                                    verticalAlign: "bottom",
                                                                    itemMarginTop: 10,
                                                                    itemMarginBottom: 10,
                                                                },
                                                                tooltip: {
                                                                    valueSuffix: '',
                                                                    valueDecimals: 2
                                                                },
                                                                credits: {
                                                                    enabled: false
                                                                },
                                                                series: peopleTeacherRatio,
                                                                exporting: {
                                                                    filename:  t("pupil_teacher_ratio"),
                                                                    csv: {
                                                                        columnHeaderFormatter: function (item) {
                                                                            if (!item || item instanceof Highcharts.Axis) {
                                                                                return t('category'); 
                                                                            }
                                                                            return item.name;
                                                                        }
                                                                    },
                                                                }
                                                            }}
                                                            // allowChartUpdate={true}
                                                            immutable={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>


                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>

    )
}


