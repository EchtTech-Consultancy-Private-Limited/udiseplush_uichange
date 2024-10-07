import React, { useEffect, useState } from 'react';
import dashboard from '../../assets/images/S_dashboard.svg'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { convertToIndianNumberSystem,convertToIndianNumberSystemHindi} from '../../utils/index';
import Breadcrumb from './Breadcrumb';
import { fetchStudentStatsData, fetchStudentStatsIntData } from '../../redux/thunks/dashboardThunk';
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

export default function StudentDashboard() {
    const { t ,i18n} = useTranslation();
    const selectedLanguage=localStorage.getItem("selectedLanguage")
    const languagebasedConvertNumberSystem=selectedLanguage==="en"?convertToIndianNumberSystem:convertToIndianNumberSystemHindi
    const dashData = useSelector((state) => state.studentStats.data.data?.[0]) || {};
    const dashDataIsLoading = useSelector((state) => state.studentStats) ;

    const dashDataInt = useSelector((state) => state.studentIntStats.data.data?.[0]) || {};
    const [mgtGraph, setMgtGraph] = useState([
        {
            name: t("government"),            
            y: 1,
            color: "#F5BF55",
        },
        {
            name:t("private"),
            y: 1,
            color: "#E6694A",
        },
        {
            name:t("aided"),            
            y: 1,
            color: "#BCE263",
        },
        {
            name:t("others"),            
            y: 1,
            color: "#751539",
        },
    ]);

    const [grossEnrollmentRatio, setGrossEnrollmentRatio] = useState([{
        name:t("girls_student"),
        data: [1, 1, 1, 1],
        color: "#E6694A"
    }, {

        name: t("boys_student"),
        data: [1, 1, 1, 1],
        color: "#751539"
    }])

    const [netEnrollmentRatio, setNetEnrollmentRatio] = useState([{
        name: t("girls_student"),
        data: [1, 1, 1, 1],
        color: "#BCE263"
    }, {

        name: t("boys_student"),
        data: [1, 1, 1, 1],
        color: "#751539"
    }]);

    const [totalBoysGirls, setTotalBoysGirls] = useState([{
        name:t("girls"),
        data: [1, 1, 1, 1],
        color: "#751539"
    }, {

        name:t("boys"),
        data: [1, 1, 1, 1],
        color: "#57C1BB"
    }]);

    const schoolFilter = useSelector((state) => state.schoolFilter);

    const filterObj = structuredClone(schoolFilter);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchStudentStatsIntData(filterObj))

    }, [dispatch, schoolFilter]);
    useEffect(() => {
        const updatedFilterObj = { ...filterObj, valueType: 2 };

        dispatch(fetchStudentStatsData(updatedFilterObj)).then((res) => {
            handleMgtWiseGraph(res?.payload?.data[0]);
        });

    }, [dispatch, schoolFilter]);


    useEffect(() => {
        handleMgtWiseGraph(dashData)
    }, [i18n.language,dashData]);
    useEffect(() => {
        handleMgtWiseIntGraph(dashDataInt)
    }, [i18n.language,dashDataInt]);
    const handleMgtWiseGraph = (data) => {
        let arr = [];

        const totStudents = parseInt(data?.totStudents);

        const totStudentGovt = parseFloat(data?.totStudentGovt);
        const totStudentGovtAided = parseFloat(data?.totStudentGovtAided);
        const totStudentPvt = parseFloat(data?.totStudentPvt);
        const totStudentOther = parseFloat(data?.totStudentOther);

        arr.push({
            name:t("government"),            
            y: totStudentGovt,
            color: "#F5BF55",
        },
            {
                name: t("private"),                
                y: totStudentPvt,
                color: "#E6694A",
            },
            {
                name: t("aided"),                
                y: totStudentGovtAided,
                color: "#BCE263",
            },
            {
                name: t("others"),                
                y: totStudentOther,
                color: "#751539",
            });
        setMgtGraph(arr);

        arr = [];
        arr.push({
            name: t("girls_student"),
            data: [parseInt(data?.gerPryG), parseInt(data?.gerUPryG), parseInt(data?.gerSecG), parseInt(data?.gerHSecG)],
            color: "#E6694A"
        }, {

            name: t("boys_student"),
            data: [parseInt(data?.gerPryB), parseInt(data?.gerUPryB), parseInt(data?.gerSecB), parseInt(data?.gerHSecB)],
            color: "#751539"
        })
        setGrossEnrollmentRatio(arr);


        arr = [];
        arr.push({
            name:t("girls_student"),
            data: [parseInt(data?.nerPryG), parseInt(data?.nerUPryG), parseInt(data?.nerSecG), parseInt(data?.nerHSecG)],
            color: "#BCE263"
        }, {

            name:t("boys_student"),
            data: [parseInt(data?.nerPryB), parseInt(data?.nerUPryB), parseInt(data?.nerSecB), parseInt(data?.nerHSecB)],
            color: "#751539"
        });

        setNetEnrollmentRatio(arr);


    }

    const handleMgtWiseIntGraph = (data) => {
        let arr = [];


        arr.push({
            name: t("girls"),
            data: [parseInt(data?.pryG), parseInt(data?.upryG), parseInt(data?.secG), parseInt(data?.hsecG)],
            color: "#751539"
        }, {
            name: t("boys"),
            data: [parseInt(data?.pryB), parseInt(data?.upryB), parseInt(data?.secB), parseInt(data?.hsecB)],
            color: "#57C1BB"
        });
        setTotalBoysGirls(arr);
    }
    return (
        <>
        {dashDataIsLoading.isLoading && <GlobalLoading/>}
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
                                                    <div className="main-text-c m-big">{languagebasedConvertNumberSystem(dashDataInt?.totStudents || 0)}</div>
                                                    <span className="sub-text-c text-green">{t("total_students")}</span>
                                                </div>
                                                <div className="col-md-6 mb-5">
                                                    <div className="main-text-c m-big">{languagebasedConvertNumberSystem(dashDataInt?.elementary|| 0)}</div>
                                                    <span className="sub-text-c text-green">{t("elementary_students")}</span>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="main-text-c m-big">{languagebasedConvertNumberSystem(dashDataInt?.sec || 0)}</div>
                                                    <span className="sub-text-c text-green">{t("secondary_students")}</span>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="main-text-c m-big">{languagebasedConvertNumberSystem(dashDataInt?.hsec|| 0)}</div>
                                                    <span className="sub-text-c text-green">{t("higher_secondary_students")}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <img src={dashboard} alt="graph icon" className='school-graph-icon icon-h-big student-icon-g' />
                                    </div>
                                </div>

                                <div className="card-box-impact tab-for-graph mt-4">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12">
                                            <div className="impact-box-content-education">
                                                <div className="text-btn-d">
                                                    <h2 className="heading-sm">{t("number_of_students_management_wise")}</h2>
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
                                                                    text: t("number_of_students_management_wise")
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
                                                                    //       fontSize: '16px',
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
                                                                    filename:  t("number_of_students_management_wise"),
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
                                                    <h2 className="heading-sm">{t("gross_enrolment_ratio")}</h2>
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
                                                                    categories:[t('primary'), t('upper_primary'), t('secondary'), t('higher_secondary')],
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
                                                                title: {
                                                                    text: t("gross_enrolment_ratio")
                                                                },
                                                                tooltip: {
                                                                    valueSuffix: ''
                                                                },
                                                                plotOptions: {
                                                                    column: {
                                                                        dataLabels: {
                                                                            enabled: true
                                                                        },
                                                                        groupPadding: 0.1,
                                                                    }
                                                                },
                                                                legend: {
                                                                    layout: "horizontal",
                                                                    align: "center",
                                                                    verticalAlign: "bottom",
                                                                    itemMarginTop: 10,
                                                                    itemMarginBottom: 10,

                                                                },
                                                                credits: {
                                                                    enabled: false
                                                                },
                                                                series: grossEnrollmentRatio,
                                                                exporting: {
                                                                    filename:  t("gross_enrolment_ratio"),
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
                                                    <h2 className="heading-sm">{t("net_enrolment_ratio")}</h2>
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
                                                                    categories:[t('primary'), t('upper_primary'), t('secondary'), t('higher_secondary')],
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
                                                                title: {
                                                                    text: t("net_enrolment_ratio")
                                                                },
                                                                tooltip: {
                                                                    valueSuffix: ''
                                                                },
                                                                plotOptions: {
                                                                    column: {
                                                                        dataLabels: {
                                                                            enabled: true
                                                                        },
                                                                        groupPadding: 0.1,
                                                                    }
                                                                },
                                                                legend: {
                                                                    layout: "horizontal",
                                                                    align: "center",
                                                                    verticalAlign: "bottom",
                                                                    itemMarginTop: 10,
                                                                    itemMarginBottom: 10,
                                                                },
                                                                credits: {
                                                                    enabled: false
                                                                },
                                                                series: netEnrollmentRatio,
                                                                exporting: {
                                                                    filename:t("net_enrolment_ratio"),
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
                                                    <h2 className="heading-sm">{t("number_boys_and_girls")}</h2>
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
                                                                    categories:[t('primary'), t('upper_primary'), t('secondary'), t('higher_secondary')],
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
                                                                title: {
                                                                    text: t("number_boys_and_girls")
                                                                },
                                                                tooltip: {
                                                                    valueSuffix: '',
                                                                    formatter: function () {
                                                                        return this.y.toLocaleString('en-IN');
                                                                    }
                                                                },
                                                                plotOptions: {
                                                                    column: {
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
                                                                
                                                                credits: {
                                                                    enabled: false
                                                                },
                                                                series: totalBoysGirls,
                                                                exporting: {
                                                                    filename:t("number_boys_and_girls"),
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