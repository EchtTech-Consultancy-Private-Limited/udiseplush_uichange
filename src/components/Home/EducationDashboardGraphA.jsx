import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  fetchStudentStatsData,
  fetchDashboardData,
} from "../../redux/thunks/dashboardThunk";
import { useDispatch, useSelector } from "react-redux";

export function EducationDashboardGraphA({
  t,
  dashDataSchool,
  dashDataTeacher,
  dashDataStudent,
  dashData,
}) {
  const schoolFilter = useSelector((state) => state?.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const dispatch = useDispatch();
  const [tabsState, setTabsState] = useState("School");
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

  const handleMgtWiseGraph = (data) => {
    let arr = [];

    const totSchoolGovt = parseFloat(data?.totSchoolGovt);
    const totSchoolGovtAided = parseFloat(data?.totSchoolGovtAided);
    const totSchoolPvt = parseFloat(data?.totSchoolPvt);
    const totSchoolOther = parseFloat(data?.totSchoolOther);

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
        name: "Male",
        data: [1, 1, 1, 1, 1],
        color: "#751539",
      },
      {
        name: "Female",
        data: [1, 1, 1, 1, 1],
        color: "#E6694A  ",
      }
    );
  };

  const handleTeacherGraph = (data) => {
    let arr = [];

    const totSchoolGovt = parseFloat(data?.totTchGovt);
    const totSchoolGovtAided = parseFloat(data?.totTchGovtAided);
    const totSchoolPvt = parseFloat(data?.totTchPvt);
    const totSchoolOther = parseFloat(data?.totTchOther);

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
  };

  const handleStudentGraph = (data) => {
    let arr = [];
    let sumOfData;
    const totSchoolGovt = parseFloat(data?.totStudentGovt);
    const totSchoolGovtAided = parseFloat(data?.totStudentGovtAided);
    const totSchoolPvt = parseFloat(data?.totStudentPvt);
    const totSchoolOther = parseFloat(data?.totStudentOther);
    sumOfData =
      totSchoolGovt + totSchoolGovtAided + totSchoolPvt + totSchoolOther;
    arr.push(
      {
        name: t("government"),
        y: totSchoolGovt,
        showInLegend: true,
        color: "#F5BF55",
      },
      {
        name: t("private"),
        y: totSchoolPvt,
        showInLegend: true,
        color: "#E6694A",
      },
      {
        name: t("aided"),
        y: totSchoolGovtAided,
        showInLegend: true,
        color: "#BCE263",
      },
      {
        name: t("others"),
        y: totSchoolOther,
        showInLegend: true,
        color: "#751539",
      }
    );
    setMgtGraph(arr);
  };

  const handleTabs = (e) => {
    if (e === "School") {
      handleMgtWiseGraph(dashDataSchool);
    }
    if (e === "Teacher") {
      handleTeacherGraph(dashDataTeacher);
    }
    if (e === "Student") {
      handleStudentGraph(dashDataStudent);
    }

    setTabsState(e);
  };

  useEffect(() => {
    const updatedFilterObj = { ...filterObj, valueType: 2 };
    dispatch(fetchStudentStatsData(updatedFilterObj)).then((res) => {
      handleMgtWiseGraph(res?.payload?.data[0]);
    });
    dispatch(fetchDashboardData(updatedFilterObj)).then((res) => {
      handleMgtWiseGraph(res?.payload?.data[0]);
    });
  }, [dispatch, schoolFilter]);

  useEffect(() => {
    if (tabsState === "School") {
      handleMgtWiseGraph(dashDataSchool);
    } else if (tabsState === "Teacher") {
      handleTeacherGraph(dashDataTeacher);
    } else if (tabsState === "Student") {
      handleStudentGraph(dashDataStudent);
    }
  }, [
    t,
    dashDataSchool,
    dashDataStudent,
    dashData,
    dashDataTeacher,
    dashDataTeacher,
  ]);

  return (
    <div className="row">
      <div className="col-md-12 col-lg-12">
        <div className="impact-box-content-education ">
          <div className="text-btn-d">
            <h2 className="heading-sm">
              {t("education_data_by_management_type")}
            </h2>
            {/* <div className='d-flex w-20'>
            <button className='view-table-btn'> <span className="material-icons-round">table_view</span> View Table </button>
            <button className='view-table-btn view-more-btn ms-1'> <span className="material-icons-round me-0">more_horiz</span></button>
            </div> */}
          </div>

          <Tabs
            defaultActiveKey={tabsState}
            id="uncontrolled-tab-example"
            className=""
            onSelect={handleTabs}>
            <Tab eventKey="School" title={t("school")}>
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
                        text: t("education_data_by_management_type"),
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
                        //     text: "Key",
                        //     style: {
                        //       fontSize: '18px',
                        //     },
                        //     x:0
                        //   },
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
                        filename: t("education_data_by_management_type"),
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
            <Tab eventKey="Teacher" title={t("teacher")}>
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
                        text: t("education_data_by_management_type"),
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
                        //     text: "Key",
                        //     style: {
                        //       fontSize: '18px',
                        //     }
                        //   },
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
                        filename: t("education_data_by_management_type"),
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
            <Tab eventKey="Student" title={t("student")}>
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
                        text: t("education_data_by_management_type"),
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
                        //     text: "Key",
                        //     style: {
                        //       fontSize: '18px',
                        //     }
                        //   },
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
                        filename: t("education_data_by_management_type"),
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
