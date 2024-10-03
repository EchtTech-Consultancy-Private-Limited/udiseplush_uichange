import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

//code for graph 4 in school dashboard
export function SchoolDashboardGraphA({ t, dashData }) {
  const [tabsInfraState, setTabsInfraState] = useState("primary");
  const [groupedStats, setGroupedStats] = useState([]);
  const initialGraphData = [
    { name: "Boys", y: 1, color: "#57C1BB" },
    { name: "Girls", y: 1, color: "#E6694A" },
    { name: "Co-Ed", y: 1, color: "#BCE263" },
  ];

  const [infraGraphGT, setInfraGraphGT] = useState([...initialGraphData]);

  useEffect(() => {
    setGroupedStats(dashData);
  }, [dashData]);

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
  }, [t, tabsInfraState, groupedStats]);

  useEffect(() => {
    const initializeChartData = () => {
      handleInfraReportsTabs("primary");
    };
    initializeChartData();
  }, [groupedStats]);

  const handleInfraReportsTabs = (tab) => {
    setTabsInfraState(tab);
  };

  return (
    <div className="impact-box-content-education">
      <div className="text-btn-d">
        <h2 className="heading-sm">
          {t("number_of_schools_by_type_and_school_category")}
        </h2>
      </div>

      <Tabs
        defaultActiveKey={tabsInfraState}
        id="uncontrolled-tab-example"
        className=""
        onSelect={handleInfraReportsTabs}
      >
        <Tab eventKey="primary" title={t("primary")}>
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
                  title: {
                    text: t("number_of_schools_by_type_and_school_category"),
                  },
                  tooltip: {
                    valueSuffix: "%",
                    valueDecimals: 2,
                  },
                  credits: {
                    enabled: true,
                  },
                  plotOptions: {
                    pie: {
                      size: "100%",
                      dataLabels: {
                        enabled: true,
                        distance: 20,
                        formatter: function () {
                          return "<b>" + this.point.y + "%";
                        },
                        style: {
                          fontSize: "0.6em",
                          textOutline: "none",
                          opacity: 0.7,
                        },
                      },
                      center: ["50%", "50%"],
                      showInLegend: true,
                    },
                  },
                  legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                    itemMarginTop: 10,
                    itemMarginBottom: 10,
                  },
                  series: [{ name: t("percentage"), data: infraGraphGT }],
                  exporting: {
                    filename: t(
                      "number_of_schools_by_type_and_school_category"
                    ),
                    csv: {
                      columnHeaderFormatter: function (item) {
                        if (!item || item instanceof Highcharts.Axis) {
                          return t("category");
                        }
                        return item.name;
                      },
                    },
                  },
                }}
                immutable={true}
              />
            </div>
          </div>
        </Tab>
        <Tab eventKey="upper-primary" title={t("upper_primary")}>
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
                    text: t("number_of_schools_by_type_and_school_category"),
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
                  series: [{ name: t("percentage"), data: infraGraphGT }],
                  exporting: {
                    filename: t(
                      "number_of_schools_by_type_and_school_category"
                    ),
                    csv: {
                      columnHeaderFormatter: function (item) {
                        if (!item || item instanceof Highcharts.Axis) {
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
        <Tab eventKey="higher-secondary" title={t("higher_secondary")}>
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
                    text: t("number_of_schools_by_type_and_school_category"),
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
                  series: [{ name: t("percentage"), data: infraGraphGT }],
                  exporting: {
                    filename: t(
                      "number_of_schools_by_type_and_school_category"
                    ),
                    csv: {
                      columnHeaderFormatter: function (item) {
                        if (!item || item instanceof Highcharts.Axis) {
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
        <Tab eventKey="secondary" title={t("secondary")}>
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
                    text: t("number_of_schools_by_type_and_school_category"),
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
                  series: [{ name: t("percentage"), data: infraGraphGT }],
                  exporting: {
                    filename: t(
                      "number_of_schools_by_type_and_school_category"
                    ),
                    csv: {
                      columnHeaderFormatter: function (item) {
                        if (!item || item instanceof Highcharts.Axis) {
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
  );
}
