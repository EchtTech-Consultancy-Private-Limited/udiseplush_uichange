import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import schoolgraph from "../../assets/images/s-graph.svg";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSchoolStatsData,
  fetchSchoolStatsIntData,
} from "../../redux/thunks/dashboardThunk";
import {
  convertToIndianNumberSystem,
  convertToIndianNumberSystemHindi,
} from "../../utils/index";
import Breadcrumb from "./Breadcrumb";
import { fetchArchiveServicesGraphSchoolData } from "../../redux/thunks/archiveServicesThunk";
import { allFilter } from "../../redux/slice/schoolFilterSlice3016";
import { intialIndiaWiseFilterSchData } from "../../constants/constants";

import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
import { SchoolDashboardGraphA } from "./SchoolDashboardGraphA";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);

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

export default function SchoolDashboard() {
  const { t, i18n } = useTranslation();
  const selectedLanguage = localStorage.getItem("selectedLanguage");
  const languagebasedConvertNumberSystem =
    selectedLanguage === "en"
      ? convertToIndianNumberSystem
      : convertToIndianNumberSystemHindi;
  const [mgtGraph, setMgtGraph] = useState([
    {
      name: t("government"),
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
      name: t("others"),
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
  ]);

  const [schoolType, setSchoolType] = useState([
    {
      name: t("boys"),
      y: 1,
      color: "#57C1BB",
    },
    {
      name: t("girls"),
      y: 1,
      color: "#E6694A",
    },
    {
      name: t("co-ed"),
      y: 1,
      color: "#BCE263",
    },
  ]);

 
  const dashData =
    useSelector((state) => state?.schoolStats?.data?.data?.[0]) || {};

  const dashDataIsLoading = useSelector((state) => state?.schoolStats);

  const dashIntData =
    useSelector((state) => state?.schoolIntStats?.data?.data?.[0]) || {};
  const schoolFilter = useSelector((state) => state?.schoolFilter);
  const [tabsInfraState, setTabsInfraState] = useState("primary");
  const [groupedStats, setGroupedStats] = useState([]);
  const initialGraphData = [
    { name: "Boys", y: 1, color: "#57C1BB" },
    { name: "Girls", y: 1, color: "#E6694A" },
    { name: "Co-Ed", y: 1, color: "#BCE263" },
  ];

  const [infraGraphGT, setInfraGraphGT] = useState([...initialGraphData]);
  const filterObj = structuredClone(schoolFilter);
  const dispatch = useDispatch();
  // This dispatch for Integer value
  useEffect(() => {
    dispatch(fetchSchoolStatsIntData(filterObj)).then((res) => {
      handleMgtWiseGraph(res?.payload?.data[0]);
    });
  }, [dispatch, schoolFilter]);
  useEffect(() => {
    setGroupedStats(dashData);
  }, [dashData]);
  // This dispatch for decimal value
  useEffect(() => {
    filterObj.valueType = 2;
    dispatch(fetchSchoolStatsData(filterObj)).then((res) => {
      handleMgtWiseGraph(res?.payload?.data[0]);
    });
  }, [dispatch, schoolFilter]);
  useEffect(() => {
    dispatch(allFilter(intialIndiaWiseFilterSchData));
    dispatch(fetchArchiveServicesGraphSchoolData(intialIndiaWiseFilterSchData));
    // eslint-disable-next-line
  }, []);

  const getTabData = (tab) => {
    switch (tab) {
      case "primary":
        return {
          boys: groupedStats.totSchoolPryB,
          girls: groupedStats.totSchoolPryG,
          coed: groupedStats.totSchoolPryCoed,
        };
      case "upper-primary":
        return {
          boys: groupedStats.totSchoolUPryB,
          girls: groupedStats.totSchoolUPryG,
          coed: groupedStats.totSchoolUPryCoed,
        };
      case "higher-secondary":
        return {
          boys: groupedStats.totSchoolHSecB,
          girls: groupedStats.totSchoolHSecG,
          coed: groupedStats.totSchoolHSecCoed,
        };
      case "secondary":
        return {
          boys: groupedStats.totSchoolSecB,
          girls: groupedStats.totSchoolSecG,
          coed: groupedStats.totSchoolSecCoed,
        };

      default:
        return {
          boys: 0,
          girls: 0,
          coed: 0,
        };
    }
  };
  useEffect(() => {
    const tabData = getTabData(tabsInfraState);
    const chartData = [
      {
        name: t("boys"),
        y: parseFloat(tabData.boys) || 0,
        color: "#57C1BB",
      },
      {
        name: t("girls"),
        y: parseFloat(tabData.girls) || 0,
        color: "#E6694A",
      },
      {
        name: t("co-ed"),
        y: parseFloat(tabData.coed) || 0,
        color: "#BCE263",
      },
    ];

    setInfraGraphGT(chartData);
  }, [i18n.language, tabsInfraState, groupedStats]);

  useEffect(() => {
    const initializeChartData = () => {
      handleInfraReportsTabs("primary");
    };
    initializeChartData();
  }, [groupedStats]);

  const handleInfraReportsTabs = (tab) => {
    setTabsInfraState(tab);
  };

  useEffect(() => {
    handleMgtWiseGraph(dashData);
  }, [i18n.language, dashData]);

  const handleMgtWiseGraph = (data) => {
    let arr = [];
    const totSchoolGovt = parseFloat(data?.totSchoolGovt);
    const totSchoolGovtAided = parseFloat(data?.totSchoolGovtAided);
    const totSchoolPvt = parseFloat(data?.totSchoolPvt);
    const totSchoolOther = parseFloat(data?.totSchoolOther);

    const totSchoolElementary = parseFloat(data?.totSchoolElementary);
    const totSchoolSec = parseFloat(data?.totSchoolSec);
    const totSchoolHSec = parseFloat(data?.totSchoolHSec);

    const totSchoolB = parseFloat(dashData?.totSchoolB);

    const totSchoolG = parseFloat(data?.totSchoolG);
    const totSchoolCoed = parseFloat(data?.totSchoolCoed);

    arr.push(
      {
        name: t("government"),
        y: totSchoolGovt,
        color: "#F5BF55",
      },
      {
        name: t("private"),
        y: totSchoolPvt,
        color: "#E6694A",
      },
      {
        name: t("aided"),
        y: totSchoolGovtAided,
        color: "#BCE263",
      },
      {
        name: t("others"),
        y: totSchoolOther,
        color: "#751539",
      }
    );
    setMgtGraph(arr);

    arr = [];
    arr.push(
      {
        name: t("elementary"),
        y: totSchoolElementary,
        color: "#BCE263",
      },
      {
        name: t("secondary"),
        y: totSchoolSec,
        color: "#751539",
      },
      {
        name: t("higher_secondary"),
        y: totSchoolHSec,
        color: "#E6694A",
      }
    );
    setLevelOfEducation(arr);

    arr = [];
    arr.push(
      {
        name: t("boys"),
        y: totSchoolB,
        color: "#57C1BB",
      },
      {
        name: t("girls"),
        y: totSchoolG,
        color: "#E6694A",
      },
      {
        name: t("co-ed"),
        y: totSchoolCoed,
        color: "#BCE263",
      }
    );

    setSchoolType(arr);
  };

  return (
    <>
      {dashDataIsLoading.isLoading && <GlobalLoading />}

      <section className="pgicategory vision-mission-card school-dash ptb-30">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-4 p-0">
              <h2 className="heading-blue">{t("school_dashboard")}</h2>
              <Breadcrumb />
            </div>
            <div className="col-md-12 col-lg-12 p-0">
              <div className="common-content text-start right-card-sec">
                <div className="srid-card-se school-dashboard">
                  <div className="row">
                    <div className="col-md-9 col-lg-9">
                      <div className="card-box row">
                        <div className="col-md-6 mb-5">
                          <div className="main-text-c m-big">
                            {languagebasedConvertNumberSystem(
                              dashIntData?.totSchools || 0
                            )}
                          </div>
                          <span className="sub-text-c text-green">
                            {t("total_schools")}
                          </span>
                        </div>
                        <div className="col-md-6 mb-5">
                          <div className="main-text-c m-big">
                            {" "}
                            {languagebasedConvertNumberSystem(
                              dashIntData?.totSchoolSec || 0
                            )}
                          </div>
                          <span className="sub-text-c text-green">
                            {t("secondary_schools")}
                          </span>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="main-text-c m-big">
                            {languagebasedConvertNumberSystem(
                              dashIntData?.totSchoolHSec || 0
                            )}
                          </div>
                          <span className="sub-text-c text-green">
                            {t("higher_sec_school")}
                          </span>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="main-text-c m-big">
                            {languagebasedConvertNumberSystem(
                              dashIntData?.totSchoolElementary || 0
                            )}
                          </div>
                          <span className="sub-text-c text-green">
                            {t("elementary_schools")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <img
                      src={schoolgraph}
                      alt="graph icon"
                      className="school-graph-icon"
                    />
                  </div>
                </div>

                <div className="card-box-impact tab-for-graph mt-4 ">
                  <div className="row">
                    <div className="col-md-12 col-lg-12">
                      <div className="impact-box-content-education">
                        <div className="text-btn-d">
                          <h2 className="heading-sm">
                            {t("number_of_schools_management_wise")}
                          </h2>
                        </div>

                        <div className="piechart-box row mt-4">
                          <div className="col-md-12">
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
                                  text: t("number_of_schools_management_wise"),
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
                                  //     fontSize: '18px',
                                  //   }
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
                                    data: mgtGraph,
                                  },
                                ],
                                exporting: {
                                  filename: t(
                                    "number_of_schools_management_wise"
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
                    </div>
                  </div>
                </div>

                <div className="card-box-impact tab-for-graph mt-4">
                  <div className="row">
                    <div className="col-md-12 col-lg-12">
                      <div className="impact-box-content-education">
                        <div className="text-btn-d">
                          <h2 className="heading-sm">
                            {t("number_of_schools_by_level_of_education")}
                          </h2>
                        </div>

                        <div className="piechart-box row mt-4">
                          <div className="col-md-12">
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
                                  text: t(
                                    "number_of_schools_by_level_of_education"
                                  ),
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
                                  //     fontSize: '18px',
                                  //   }
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
                                    data: levelOfEducation,
                                  },
                                ],
                                exporting: {
                                  filename: t(
                                    "number_of_schools_by_level_of_education"
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
                    </div>
                  </div>
                </div>

                <div className="card-box-impact tab-for-graph mt-4">
                  <div className="row">
                    <div className="col-md-12 col-lg-12">
                      <div className="impact-box-content-education">
                        <div className="text-btn-d">
                          <h2 className="heading-sm">
                            {t("number_of_schools_based_on_school_types")}
                          </h2>
                        </div>
                        <div className="piechart-box row mt-4">
                          <div className="col-md-12">
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
                                  text: t(
                                    "number_of_schools_based_on_school_types"
                                  ),
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
                                  //     fontSize: '18px',
                                  //   }
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
                                    data: schoolType,
                                  },
                                ],
                                exporting: {
                                  filename: t(
                                    "number_of_schools_based_on_school_types"
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
                    </div>
                  </div>
                </div>

                <div className="card-box-impact tab-for-graph mt-4">
                  <SchoolDashboardGraphA t={t} dashData={dashData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
