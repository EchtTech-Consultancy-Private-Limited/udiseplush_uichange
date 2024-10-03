import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import "./infra.css";
import "./report.scss";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "jspdf-autotable";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_more from "highcharts/highcharts-more";
import { useTranslation } from "react-i18next";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/treemap")(Highcharts);
require("highcharts/modules/treegraph")(Highcharts);
HC_more(Highcharts);

//Function for Graph 1
export function TeacherGraph2008({ graphScmSchData }) {
  const { t } = useTranslation();

  return (
    <div className="impact-box-content-education">
      <div className="text-btn-d">
        <h2 className="heading-sm">
          {t("total_teachers_by_management_category")}
        </h2>
      </div>
      <div className="piechart-box mt-5 pb-5">
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
              categories: graphScmSchData.categories,
            },
            yAxis: {
              allowDecimals: false,
              min: 0,
              title: {
                text: "",
              },
            },
            title: {
              text: t("total_teachers_by_management_category"),
              style: {
                fontSize: '15px'  
              }
            },
            tooltip: {
              headerFormat: "<b>{point.x}</b><br/>",
              pointFormat: "{series.name}: {point.y}",
              pointFormatter: function () {
                return `<span style="color:${this.color}">\u25CF</span> ${
                  this.series.name
                }: <b>${this.y.toLocaleString("en-IN")}</b><br/>`;
              },
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
                    // return parseFloat(
                    //   this.y
                    // ).toFixed(0);
                    return this.y.toLocaleString("en-IN");
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
            },
            credits: {
              enabled: false,
            },
            series: graphScmSchData.series,
            exporting: {
              filename: t("total_teacher_by_management_category"),
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
  );
}

//Code for Graph 2

export function TeacherGraph2009({ graphData }) {
  const [connectionBy, setConnectionBy] = useState("School Category");

  const { t } = useTranslation();

  // Start CODE FOR GRAPH 2 SHOW THE DATA FOR SCHOOL MANAGEMENT AND SCHOOL CATEGORY BY SOCIAL CATEGORY
  const handleCategoryAndManagementByTabChange = (e) => {
    setConnectionBy(e);
  };

  const groupedDataForGraph = graphData.reduce((acc, curr) => {
    let state;

    if (connectionBy === "School Category") {
      state = acc.find(
        (item) => item.schCategoryBroad === curr.schCategoryBroad
      );
    } else if (connectionBy === "School Management") {
      state = acc.find(
        (item) => item.schManagementBroad === curr.schManagementBroad
      );
    }

    if (state) {
      state.totTchSocCatCd1 += parseInt(curr.totTchSocCatCd1, 10);
      state.totTchSocCatCd2 += parseInt(curr.totTchSocCatCd2, 10);
      state.totTchSocCatCd3 += parseInt(curr.totTchSocCatCd3, 10);
      state.totTchSocCatCd4 += parseInt(curr.totTchSocCatCd4, 10);
    } else {
      acc.push({
        schCategoryBroad: curr.schCategoryBroad,
        schManagementBroad: curr.schManagementBroad,
        totTchSocCatCd1: parseInt(curr.totTchSocCatCd1, 10),
        totTchSocCatCd2: parseInt(curr.totTchSocCatCd2, 10),
        totTchSocCatCd3: parseInt(curr.totTchSocCatCd3, 10),
        totTchSocCatCd4: parseInt(curr.totTchSocCatCd4, 10),
      });
    }
    return acc;
  }, []);

  const totalGeneral = groupedDataForGraph.map(
    (items) => items.totTchSocCatCd1
  );
  const totalOBC = groupedDataForGraph.map((items) => items.totTchSocCatCd2);
  const totalSC = groupedDataForGraph.map((items) => items.totTchSocCatCd3);
  const totalST = groupedDataForGraph.map((items) => items.totTchSocCatCd4);

  return (
    <div className="impact-box-content-education">
      <div className="text-btn-d">
        <h2 className="heading-sm">{t("total_teachers_by_social_category")}</h2>
      </div>
      <div className="piechart-box mt-0">
        <Tabs
          defaultActiveKey="School Category"
          id="uncontrolled-tab-example"
          className=""
          onSelect={handleCategoryAndManagementByTabChange}
        >
          <Tab eventKey="School Category" title={t("school_category")}>
            <div className="piechart-box row mt-4 pb-2">
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
                      categories: [
                        t("primary"),
                        t("upper_primary"),
                        t("higher_secondary"),
                        t("secondary"),
                      ],
                    },

                    yAxis: {
                      allowDecimals: false,
                      min: 0,
                      title: {
                        text: "",
                      },
                    },
                    title: {
                      text: t("total_teachers_by_social_category"),
                      style: {
                        fontSize: '15px'  
                      }
                    },
                    tooltip: {
                      headerFormat: "<b>{point.x}</b><br/>",

                      pointFormat: "{series.name}: {point.y}",
                      pointFormatter: function () {
                        return `<span style="color:${
                          this.color
                        }">\u25CF</span> ${
                          this.series.name
                        }: <b>${this.y.toLocaleString("en-IN")}</b><br/>`;
                      },
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
                            // return parseFloat(
                            //   this.y
                            // ).toFixed(0);
                            return this.y.toLocaleString("en-IN");
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
                    },
                    credits: {
                      enabled: false,
                    },
                    series: [
                      {
                        name: t("social_categories.General"),
                        data: totalGeneral,
                        color: "#751539",
                      },
                      {
                        name: t("social_categories.OBC"),
                        data: totalOBC,
                        color: "#E6694A",
                      },
                      {
                        name: t("social_categories.SC"),
                        data: totalSC,
                        color: "#F5BF55",
                      },
                      {
                        name: t("social_categories.ST"),
                        data: totalST,
                        color: "#BCE263",
                      },
                    ],
                    exporting: {
                      filename: t("total_teacher_by_social_category"),
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
          <Tab eventKey="School Management" title={t("school_management")}>
            <div className="piechart-box row mt-4 pb-2">
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
                      categories: [
                        t("state_government"),
                        t("govt_aided"),
                        t("privateUnaided"),
                        t("others"),
                        t("centralGovernment"),
                        ,
                      ],
                    },

                    yAxis: {
                      allowDecimals: false,
                      min: 0,
                      title: {
                        text: "",
                      },
                    },
                    title: {
                      text: t("total_teachers_by_social_category"),
                      style: {
                        fontSize: '15px'  
                      }
                    },
                    tooltip: {
                      headerFormat: "<b>{point.x}</b><br/>",

                      pointFormat: "{series.name}: {point.y}",
                      pointFormatter: function () {
                        return `<span style="color:${
                          this.color
                        }">\u25CF</span> ${
                          this.series.name
                        }: <b>${this.y.toLocaleString("en-IN")}</b><br/>`;
                      },
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
                            // return parseFloat(
                            //   this.y
                            // ).toFixed(0);
                            return this.y.toLocaleString("en-IN");
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
                    },
                    credits: {
                      enabled: false,
                    },
                    series: [
                      {
                        name: t("social_categories.General"),
                        data: totalGeneral,
                        color: "#751539",
                      },
                      {
                        name: t("social_categories.OBC"),
                        data: totalOBC,
                        color: "#E6694A",
                      },
                      {
                        name: t("social_categories.SC"),
                        data: totalSC,
                        color: "#F5BF55",
                      },
                      {
                        name: t("social_categories.ST"),
                        data: totalST,
                        color: "#BCE263",
                      },
                      // {
                      //   name: "Others",
                      //   data: [1508, 1200, 1000, 855, 500],
                      //   color: "#57C1BB",
                      // },
                    ],
                    exporting: {
                      filename: t("total_teacher_by_social_category"),
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
    </div>
  );
}

//code for graph 3
export function TeacherGraph2010({ graphData }) {
  const [categoryAndGender, setCategoryAndGender] = useState("School Category");

  const { t } = useTranslation();

  // Graph 3rd Get   Total No. of Teachers by School Category & Gender
  const handleCategoryAndGenderByTabChange = (e) => {
    setCategoryAndGender(e);
  };

  const compressedData = graphData.reduce((acc, curr) => {
    let state;

    if (categoryAndGender === "School Category") {
      state = acc.find(
        (item) => item.schCategoryBroad === curr.schCategoryBroad
      );
    } else if (categoryAndGender === "School Management") {
      state = acc.find(
        (item) => item.schManagementBroad === curr.schManagementBroad
      );
    }
    if (state) {
      state.totTchF += parseInt(curr.totTchF);
      state.totTchM += parseInt(curr.totTchM);
    } else {
      acc.push({
        schCategoryBroad: curr.schCategoryBroad,
        schManagementBroad: curr.schManagementBroad,
        totTchF: parseInt(curr.totTchF),

        totTchM: parseInt(curr.totTchM),
      });
    }
    return acc;
  }, []);
  const totalFemale = compressedData.map((items) => {
    return items.totTchF;
  });
  const totalMale = compressedData.map((items) => {
    return items.totTchM;
  });
  // End Graph 3rd Get   Total No. of Teachers by School Category & Gender

  return (
    <div className="impact-box-content-education">
      <div className="text-btn-d">
        <h2 className="heading-sm">
          {t("total_teachers_by_category_and_gender")}
        </h2>
      </div>
      <div className="piechart-box mt-0">
        <Tabs
          defaultActiveKey="School Category"
          id="uncontrolled-tab-example"
          className=""
          onSelect={handleCategoryAndGenderByTabChange}
        >
          <Tab eventKey="School Category" title={t("school_category")}>
            <div className="piechart-box row mt-4 pb-2">
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
                      categories: [
                        t("primary"),
                        t("upper_primary"),
                        t("higher_secondary"),
                        t("secondary"),
                      ],
                    },

                    yAxis: {
                      allowDecimals: false,
                      min: 0,
                      title: {
                        text: "",
                      },
                    },
                    title: {
                      text: t("total_teachers_by_category_and_gender"),
                      style: {
                        fontSize: '15px'  
                      }
                    },
                    tooltip: {
                      headerFormat: "<b>{point.x}</b><br/>",

                      pointFormat: "{series.name}: {point.y}",
                      pointFormatter: function () {
                        return `<span style="color:${
                          this.color
                        }">\u25CF</span> ${
                          this.series.name
                        }: <b>${this.y.toLocaleString("en-IN")}</b><br/>`;
                      },
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
                            // return parseFloat(
                            //   this.y
                            // ).toFixed(0);
                            return this.y.toLocaleString("en-IN");
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
                    },
                    credits: {
                      enabled: false,
                    },
                    series: [
                      {
                        name: t("female"),
                        data: totalFemale,
                        color: "#F5BF55",
                      },
                      {
                        name: t("male"),
                        data: totalMale,
                        color: "#BCE263",
                      },
                    ],
                    exporting: {
                      filename: t("total_teacher_by_category_and_gender"),
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
          <Tab eventKey="School Management" title={t("school_management")}>
            <div className="piechart-box row mt-4 pb-2">
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
                      categories: [
                        t("government"),
                        t("aided"),
                        t("private"),
                        t("others"),
                        t("central"),
                      ],
                    },

                    yAxis: {
                      allowDecimals: false,
                      min: 0,
                      title: {
                        text: "",
                      },
                    },
                    title: {
                      text: t("total_teachers_by_category_and_gender"),
                      style: {
                        fontSize: '15px'  
                      }
                    },
                    tooltip: {
                      headerFormat: "<b>{point.x}</b><br/>",

                      pointFormat: "{series.name}: {point.y}",
                      pointFormatter: function () {
                        return `<span style="color:${
                          this.color
                        }">\u25CF</span> ${
                          this.series.name
                        }: <b>${this.y.toLocaleString("en-IN")}</b><br/>`;
                      },
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
                            // return parseInt(this.y);
                            return this.y.toLocaleString("en-IN");
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
                    },
                    credits: {
                      enabled: false,
                    },
                    series: [
                      {
                        name: t("female"),
                        data: totalFemale,
                        color: "#F5BF55",
                      },
                      {
                        name: t("male"),
                        data: totalMale,
                        color: "#BCE263",
                      },
                    ],
                    exporting: {
                      filename: t("total_teachers_by_category_and_gender"),
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
    </div>
  );
}
