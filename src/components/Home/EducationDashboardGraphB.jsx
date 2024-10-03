import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export function EducationDashboardGraphB({ t, dashDataSchool }) {
  const initialGraphData = [
    { name: "Government", y: 1, color: "#BCE263" },
    { name: "Private", y: 1, color: "#BCE263" },
    { name: "Aided", y: 1, color: "#BCE263" },
    { name: "Other", y: 1, color: "#BCE263" },
    { name: "Total", y: 1, color: "#BCE263" },
  ];

  const [infraGraphGT, setInfraGraphGT] = useState([...initialGraphData]);
  const [tabsInfraState, setTabsInfraState] = useState("girl_toilet");

  const handleInfrGT = (data) => {
    let arr = [];
    const totGirlsToiletGovt = parseFloat(data?.totSchGToiletGovt);
    const totGirlsToiletGovtAided = parseFloat(data?.totSchGToiletGovtAided);
    const totGirlsToiletPvt = parseFloat(data?.totSchGToiletPvt);
    const totGirlsToiletOther = parseFloat(data?.totSchGToiletOther);
    const total = parseFloat(data?.totSchGToilet);
    arr.push(
      {
        name: t("government"),
        y: totGirlsToiletGovt,
        color: "#BCE263",
      },
      {
        name: t("private"),
        y: totGirlsToiletPvt,
        color: "#BCE263",
      },
      {
        name: t("aided"),
        y: totGirlsToiletGovtAided,
        color: "#BCE263",
      },
      {
        name: t("others"),
        y: totGirlsToiletOther,
        color: "#BCE263",
      },

      {
        name: t("total"),
        y: total,
        color: "#BCE263",
      }
    );
    setInfraGraphGT(arr);
  };

  const handleInfrLibrary = (data) => {
    let arr = [];

    const totLibraryGovt = parseFloat(data?.totSchLibraryGovt);
    const totLibraryGovtAided = parseFloat(data?.totSchLibraryGovtAided);
    const totLibraryPvt = parseFloat(data?.totSchLibraryPvt);
    const totLibraryOther = parseFloat(data?.totSchLibraryOther);
    const total = parseFloat(data?.totSchLibrary);
    arr.push(
      {
        name: t("government"),
        y: totLibraryGovt,
        color: "#BCE263",
      },
      {
        name: t("private"),
        y: totLibraryPvt,
        color: "#BCE263",
      },
      {
        name: t("aided"),
        y: totLibraryGovtAided,
        color: "#BCE263",
      },
      {
        name: t("others"),
        y: totLibraryOther,
        color: "#BCE263",
      },

      {
        name: t("total"),
        y: total,
        color: "#BCE263",
      }
    );
    setInfraGraphGT(arr);
  };

  const handleInfrLibraryWBooks = (data) => {
    let arr = [];
    const totLibraryWBooksGovt = parseFloat(data?.totSchLibraryBooksGovt);
    const totLibraryWBooksGovtAided = parseFloat(
      data?.totSchLibraryBooksGovtAided
    );
    const totLibraryWBooksPvt = parseFloat(data?.totSchLibraryBooksPvt);
    const totLibraryWBooksOther = parseFloat(data?.totSchLibraryBooksOther);
    const total = parseFloat(data?.totSchLibraryBooks);
    arr.push(
      {
        name: t("government"),
        y: totLibraryWBooksGovt,
        color: "#BCE263",
      },
      {
        name: t("private"),
        y: totLibraryWBooksPvt,
        color: "#BCE263",
      },
      {
        name: t("aided"),
        y: totLibraryWBooksGovtAided,
        color: "#BCE263",
      },
      {
        name: t("others"),
        y: totLibraryWBooksOther,
        color: "#BCE263",
      },

      {
        name: t("total"),
        y: total,
        color: "#BCE263",
      }
    );
    setInfraGraphGT(arr);
  };

  const handleInfrElec = (data) => {
    let arr = [];
    const totElectGovt = parseFloat(data?.totSchElectricityGovt);
    const totElectGovtAided = parseFloat(data?.totSchElectricityGovtAided);
    const totElectPvt = parseFloat(data?.totSchElectricityPvt);
    const totElectOther = parseFloat(data?.totSchElectricityOther);
    const total = parseFloat(data?.totSchElectricity);
    arr.push(
      {
        name: t("government"),
        y: totElectGovt,
        color: "#BCE263",
      },
      {
        name: t("private"),
        y: totElectPvt,
        color: "#BCE263",
      },
      {
        name: t("aided"),
        y: totElectGovtAided,
        color: "#BCE263",
      },
      {
        name: t("others"),
        y: totElectOther,
        color: "#BCE263",
      },

      {
        name: t("total"),
        y: total,
        color: "#BCE263",
      }
    );
    setInfraGraphGT(arr);
  };

  const handleInfrDrinkW = (data) => {
    let arr = [];
    const totDrinkWGovt = parseFloat(data?.totSchDrinkwaterGovt);
    const totDrinkWGovtAided = parseFloat(data?.totSchDrinkwaterGovtAided);
    const totDrinkWPvt = parseFloat(data?.totSchDrinkwaterPvt);
    const totDrinkWOther = parseFloat(data?.totSchDrinkwaterOther);
    const total = parseFloat(data?.totSchDrinkwater);
    arr.push(
      {
        name: t("government"),
        y: totDrinkWGovt,
        color: "#BCE263",
      },
      {
        name: t("private"),
        y: totDrinkWPvt,
        color: "#BCE263",
      },
      {
        name: t("aided"),
        y: totDrinkWGovtAided,
        color: "#BCE263",
      },
      {
        name: t("others"),
        y: totDrinkWOther,
        color: "#BCE263",
      },

      {
        name: t("total"),
        y: total,
        color: "#BCE263",
      }
    );
    setInfraGraphGT(arr);
  };

  const handleInfrHandWash = (data) => {
    let arr = [];
    const totHandWashGovt = parseFloat(data?.totSchHandwashGovt);
    const totHandWashGovtAided = parseFloat(data?.totSchHandwashGovtAided);
    const totHandWashPvt = parseFloat(data?.totSchHandwashPvt);
    const totHandWashOther = parseFloat(data?.totSchHandwashOther);
    const total = parseFloat(data?.totSchHandwash);
    arr.push(
      {
        name: t("government"),
        y: totHandWashGovt,
        color: "#BCE263",
      },
      {
        name: t("private"),
        y: totHandWashPvt,
        color: "#BCE263",
      },
      {
        name: t("aided"),
        y: totHandWashGovtAided,
        color: "#BCE263",
      },
      {
        name: t("others"),
        y: totHandWashOther,
        color: "#BCE263",
      },

      {
        name: t("total"),
        y: total,
        color: "#BCE263",
      }
    );
    setInfraGraphGT(arr);
  };

  const handleInfrMedicalFac = (data) => {
    let arr = [];
    const totMedicalFacGovt = parseFloat(data?.totSchMedicalGovt);
    const totMedicalFacGovtAided = parseFloat(data?.totSchMedicalGovtAided);
    const totMedicalFacPvt = parseFloat(data?.totSchMedicalPvt);
    const totMedicalFacOther = parseFloat(data?.totSchMedicalOther);
    const total = parseFloat(data?.totSchMedical);
    arr.push(
      {
        name: t("government"),
        y: totMedicalFacGovt,
        color: "#BCE263",
      },
      {
        name: t("private"),
        y: totMedicalFacPvt,
        color: "#BCE263",
      },
      {
        name: t("aided"),
        y: totMedicalFacGovtAided,
        color: "#BCE263",
      },
      {
        name: t("others"),
        y: totMedicalFacOther,
        color: "#BCE263",
      },

      {
        name: t("total"),
        y: total,
        color: "#BCE263",
      }
    );
    setInfraGraphGT(arr);
  };

  const notAvailableDataInfraGT = infraGraphGT?.map((item) => {
    return {
      name: item.name,
      y: parseFloat((100 - item.y).toFixed(2)),
      color: "#E6694A",
    };
  });

  const handleInfraReportsTabs = (e) => {
    if (e === "girl_toilet") {
      handleInfrGT(dashDataSchool);
    }
    if (e === "library") {
      handleInfrLibrary(dashDataSchool);
    }
    if (e === "library_with_books") {
      handleInfrLibraryWBooks(dashDataSchool);
    }
    if (e === "electricity") {
      handleInfrElec(dashDataSchool);
    }
    if (e === "drinking_water") {
      handleInfrDrinkW(dashDataSchool);
    }
    if (e === "handwash") {
      handleInfrHandWash(dashDataSchool);
    }
    if (e === "medical_facility") {
      handleInfrMedicalFac(dashDataSchool);
    }

    setTabsInfraState(e);
  };

  useEffect(() => {
    if (tabsInfraState === "girl_toilet") {
      handleInfrGT(dashDataSchool);
    } else if (tabsInfraState === "library") {
      handleInfrLibrary(dashDataSchool);
    } else if (tabsInfraState === "library_with_books") {
      handleInfrLibraryWBooks(dashDataSchool);
    } else if (tabsInfraState === "electricity") {
      handleInfrElec(dashDataSchool);
    } else if (tabsInfraState === "drinking_water") {
      handleInfrDrinkW(dashDataSchool);
    } else if (tabsInfraState === "handwash") {
      handleInfrHandWash(dashDataSchool);
    } else if (tabsInfraState === "medical_facility") {
      handleInfrMedicalFac(dashDataSchool);
    }
  }, [t, dashDataSchool, tabsInfraState]);
  return (
    <div className="row">
      <div className="col-md-12 col-lg-12">
        <div className="impact-box-content-education">
          <div className="text-btn-d">
            <h2 className="heading-sm">
              {t("status_of_infrastructure_in_schools")}
            </h2>
            </div>

          <Tabs
            activeKey={tabsInfraState}
            id="uncontrolled-tab-example"
            className=""
            onSelect={handleInfraReportsTabs}
          >
            <Tab eventKey="girl_toilet" title={t("girl_toilet")}>
              <div className="piechart-box row mt-4">
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
                          t("private"),
                          t("aided"),
                          t("others"),
                          t("total"),
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
                        text: t("status_of_infrastructure_in_schools"),
                      },
                      tooltip: {
                        format:
                          "<b>{key}</b><br/>{series.name}: {y}%<br/>" +
                          "Total: {point.stackTotal}%",
                        valueSuffix: "%",
                        valueDecimals: 2,
                      },
                      tooltip: {
                        valueSuffix: "%",
                        valueFormatter: function () {
                          return this.y.toFixed(2);
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
                              color: "black",
                              font: "10px Arial, sans-serif",
                              fontWeight: "normal",
                            },
                            position: "top",
                            formatter: function () {
                              return parseFloat(this.y).toFixed(2) + "%";
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
                          name: t("not_available"),
                          data: notAvailableDataInfraGT,
                          color: "#E6694A",
                        },
                        {
                          name: t("available"),
                          data: infraGraphGT,
                          color: "#BCE263",
                        },
                      ],
                      exporting: {
                        filename: t("status_of_infrastructure_in_schools"),
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
            <Tab eventKey="library" title={t("library")}>
              <div className="piechart-box row mt-4">
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
                          t("private"),
                          t("aided"),
                          t("others"),
                          t("total"),
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
                        text: t("status_of_infrastructure_in_schools"),
                      },

                      tooltip: {
                        format:
                          "<b>{key}</b><br/>{series.name}: {y}%<br/>" +
                          "Total: {point.stackTotal}%",
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
                              color: "black",
                              font: "10px Arial, sans-serif",
                              fontWeight: "normal",
                            },
                            position: "top",
                            formatter: function () {
                              return parseFloat(this.y).toFixed(2) + "%";
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
                          name: t("not_available"),
                          data: notAvailableDataInfraGT,
                          color: "#E6694A",
                        },
                        {
                          name: t("available"),
                          data: infraGraphGT,
                          color: "#BCE263",
                        },
                      ],
                      exporting: {
                        filename: t("status_of_infrastructure_in_schools"),
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
            <Tab eventKey="library_with_books" title={t("library_with_books")}>
              <div className="piechart-box row mt-4">
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
                          t("private"),
                          t("aided"),
                          t("others"),
                          t("total"),
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
                        text: t("status_of_infrastructure_in_schools"),
                      },
                      tooltip: {
                        format:
                          "<b>{key}</b><br/>{series.name}: {y}%<br/>" +
                          "Total: {point.stackTotal}%",
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
                              color: "black",
                              font: "10px Arial, sans-serif",
                              fontWeight: "normal",
                            },
                            position: "top",
                            formatter: function () {
                              return parseFloat(this.y).toFixed(2) + "%";
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
                          name: t("not_available"),
                          data: notAvailableDataInfraGT,
                          color: "#E6694A",
                        },
                        {
                          name: t("available"),
                          data: infraGraphGT,
                          color: "#BCE263",
                        },
                      ],
                      exporting: {
                        filename: t("status_of_infrastructure_in_schools"),
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
            <Tab eventKey="electricity" title={t("electricity")}>
              <div className="piechart-box row mt-4">
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
                          t("private"),
                          t("aided"),
                          t("others"),
                          t("total"),
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
                        text: t("status_of_infrastructure_in_schools"),
                      },
                      tooltip: {
                        format:
                          "<b>{key}</b><br/>{series.name}: {y}%<br/>" +
                          "Total: {point.stackTotal}%",
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
                              color: "black",
                              font: "10px Arial, sans-serif",
                              fontWeight: "normal",
                            },
                            position: "top",
                            formatter: function () {
                              return parseFloat(this.y).toFixed(2) + "%";
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
                          name: t("not_available"),
                          data: notAvailableDataInfraGT,
                          color: "#E6694A",
                        },
                        {
                          name: t("available"),
                          data: infraGraphGT,
                          color: "#BCE263",
                        },
                      ],
                      exporting: {
                        filename: t("status_of_infrastructure_in_schools"),
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
            <Tab eventKey="drinking_water" title={t("drinking_water")}>
              <div className="piechart-box row mt-4">
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
                          t("private"),
                          t("aided"),
                          t("others"),
                          t("total"),
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
                        text: t("status_of_infrastructure_in_schools"),
                      },
                      tooltip: {
                        format:
                          "<b>{key}</b><br/>{series.name}: {y}%<br/>" +
                          "Total: {point.stackTotal}%",
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
                              color: "black",
                              font: "10px Arial, sans-serif",
                              fontWeight: "normal",
                            },
                            position: "top",
                            formatter: function () {
                              return parseFloat(this.y).toFixed(2) + "%";
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
                          name: t("not_available"),
                          data: notAvailableDataInfraGT,
                          color: "#E6694A",
                        },
                        {
                          name: t("available"),
                          data: infraGraphGT,
                          color: "#BCE263",
                        },
                      ],
                      exporting: {
                        filename: t("status_of_infrastructure_in_schools"),
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
            <Tab eventKey="handwash" title={t("handwash")}>
              <div className="piechart-box row mt-4">
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
                          t("private"),
                          t("aided"),
                          t("others"),
                          t("total"),
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
                        text: t("status_of_infrastructure_in_schools"),
                      },
                      tooltip: {
                        format:
                          "<b>{key}</b><br/>{series.name}: {y}%<br/>" +
                          "Total: {point.stackTotal}%",
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
                              color: "black",
                              font: "10px Arial, sans-serif",
                              fontWeight: "normal",
                            },
                            position: "top",
                            formatter: function () {
                              return parseFloat(this.y).toFixed(2) + "%";
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
                          name: t("not_available"),
                          data: notAvailableDataInfraGT,
                          color: "#E6694A",
                        },
                        {
                          name: t("available"),
                          data: infraGraphGT,
                          color: "#BCE263",
                        },
                      ],
                      exporting: {
                        filename: t("status_of_infrastructure_in_schools"),
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
            <Tab eventKey="medical_facility" title={t("medical_facility")}>
              <div className="piechart-box row mt-4">
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
                          t("private"),
                          t("aided"),
                          t("others"),
                          t("total"),
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
                        text: t("status_of_infrastructure_in_schools"),
                      },
                      tooltip: {
                        format:
                          "<b>{key}</b><br/>{series.name}: {y}%<br/>" +
                          "Total: {point.stackTotal}%",
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
                              color: "black",
                              font: "10px Arial, sans-serif",
                              fontWeight: "normal",
                            },
                            position: "top",
                            formatter: function () {
                              return parseFloat(this.y).toFixed(2) + "%";
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
                          name: t("not_available"),
                          data: notAvailableDataInfraGT,
                          color: "#E6694A",
                        },
                        {
                          name: t("available"),
                          data: infraGraphGT,
                          color: "#BCE263",
                        },
                      ],
                      exporting: {
                        filename: t("status_of_infrastructure_in_schools"),
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
    </div>
  );
}
