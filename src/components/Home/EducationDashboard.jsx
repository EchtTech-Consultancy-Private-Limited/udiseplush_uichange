import React, { useEffect, useState } from "react";
import school from "../../assets/images/school.svg";
import Teachers from "../../assets/images/teachers.svg";
import Students from "../../assets/images/students.svg";
import ArrowUP from "../../assets/images/arrow-upper.svg";
import Arrowdown from "../../assets/images/arrow-lower.svg";
import std1 from "../../assets/images/student1.svg";
import std2 from "../../assets/images/student2.svg";
import drinkinwater from "../../assets/images/noun-drinking-water.svg";
import power from "../../assets/images/noun-power.svg";
import transition_img from "../../assets/images/Transition.svg";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  convertToIndianNumberSystem,
  convertToIndianNumberSystemHindi,
} from "../../utils/index";
import {
  filterGrossEvent,
  setUpdateFlag,
  updateMapLoaded,
} from "../../redux/slice/mapSlice";

import Breadcrumb from "./Breadcrumb";
import {
  fetchDashboardData,
  fetchSchoolStatsData,
  fetchStudentStatsData,
  fetchTeachersStatsData,
  fetchAllStateSchemesData,
  fetchStudentStatsIntData,
} from "../../redux/thunks/dashboardThunk";
import { useLocation } from "react-router-dom";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
import { EducationDashboardGraphA } from "./EducationDashboardGraphA";
import { EducationDashboardGraphB } from "./EducationDashboardGraphB";
import { useRef } from "react";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);

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

export default function EducationDashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const handleRef=useRef(null)

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

  const [educationGender, setEducationGender] = useState([
    {
      name: t("male"),
      data: [1, 1, 1, 1, 1],
      color: "#751539",
    },
    {
      name: t("female"),
      data: [1, 1, 1, 1, 1],
      color: "#E6694A  ",
    },
  ]);

  const dashData =
    useSelector((state) => state?.dashboard?.data?.data?.[0]) || {};
    
  const dashDataSchool =
    useSelector((state) => state?.schoolStats?.data?.data?.[0]) || {};
    
  const dashDataSchoolIsLoading = useSelector((state) => state?.schoolStats);

  const dashDataTeacher =
    useSelector((state) => state?.teacherStats?.data?.data?.[0]) || {};
  const dashDataStudent =
  useSelector((state) => state?.studentStats?.data?.data?.[0]) || {};
  const dashIntDataStudent =
    useSelector((state) => state?.studentIntStats?.data?.data?.[0]) || {};
  const totalTeachers =
    parseInt(dashData?.totTeachersMale) +
      parseInt(dashData?.totTeachersFemale) || 0;
  const totalStudents =
    parseInt(dashData?.totStudentBoys) + parseInt(dashData?.totStudentGirls) ||
    0;

  const schoolFilter = useSelector((state) => state?.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchStudentStatsIntData(filterObj));
  // }, [dispatch, schoolFilter]);
  useEffect(() => {
    const updatedFilterObj = { ...filterObj, valueType: 2 };
    dispatch(fetchSchoolStatsData(updatedFilterObj));
     dispatch(fetchStudentStatsData(updatedFilterObj))
    dispatch(fetchTeachersStatsData(updatedFilterObj));
    dispatch(fetchDashboardData(updatedFilterObj));
    dispatch(fetchAllStateSchemesData(filterObj));
    dispatch(fetchStudentStatsIntData(filterObj)); // add here
  }, [dispatch, schoolFilter]);

  useEffect(() => {
    handleEducationGender(dashIntDataStudent);
  }, [i18n.language, dashData, dashDataStudent, dashIntDataStudent]);


  const handleEducationGender = (data) => {
    const arr = [];

    arr.push(
      {
        name: t("male"),
        data: [
          parseInt(data?.hsecB),
          parseInt(data?.secB),
          parseInt(data?.upryB),
          parseInt(data?.pryB),
          parseInt(data?.prePryB),
        ],
        color: "#751539",
      },
      {
        name: t("female"),
        data: [
          parseInt(data?.hsecG),
          parseInt(data?.secG),
          parseInt(data?.upryG),
          parseInt(data?.pryG),
          parseInt(data?.prePryG),
        ],
        color: "#E6694A  ",
      }
    );

    setEducationGender(arr);
  };

  

  const initialGraphData = [
    { name: "Government", y: 1, color: "#BCE263" },
    { name: "Private", y: 1, color: "#BCE263" },
    { name: "Aided", y: 1, color: "#BCE263" },
    { name: "Other", y: 1, color: "#BCE263" },
    { name: "Total", y: 1, color: "#BCE263" },
  ];

  const [infraGraphGT, setInfraGraphGT] = useState([...initialGraphData]);

  const commonhandleGERData = (e, text) => {
   const target = e.currentTarget;
    if (!target.classList.contains("impact-box-content")) {
      return;
    }

    sessionStorage.setItem("handle", text);
    const elements = document.querySelectorAll(".impact-box-content.active");
    elements.forEach((element) => {
      element.classList.remove("active");
    });
    target.classList.add("active");
    dispatch(filterGrossEvent(text));
    dispatch(setUpdateFlag(true));
    dispatch(updateMapLoaded(false));
    // dispatch(handleShowDistrict(false));
  };


  useEffect(() => {
    if (handleRef.current) {
      commonhandleGERData({ currentTarget: handleRef.current }, "gross_enrollment_ratio");
    }
  }, []);
  return (
    <>
      {dashDataSchoolIsLoading.isLoading && <GlobalLoading />}
    
      <section className="pgicategory vision-mission-card ptb-30">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-4 p-0">
              <h2 className="heading-blue">{t("message_on_map")}</h2>
              <Breadcrumb />
            </div>

            <div className="col-md-12 col-lg-12 p-0">
              <div className="common-content text-start right-card-sec">
                <div className="srid-card-se">
                  <div className="row">
                    <div className="col-md-4 col-lg-4">
                      <div className="card-box">
                        <img src={school} alt="school" className="card-img" />
                        <i className="sub-text-c text-green">
                          {t("no_of_schools")}
                        </i>

                        <div className="main-text-c m-big">
                          {dashData?.totSchools || 0}
                        </div>

                        <span className="sub-text-c">{t("urban")}</span>
                        <div className="main-text-c">
                          {languagebasedConvertNumberSystem(
                            dashData?.totSchoolUrban || 0
                          )}
                        </div>

                        <span className="sub-text-c">{t("rural")}</span>
                        <div className="main-text-c">
                          {languagebasedConvertNumberSystem(
                            dashData?.totSchoolRural || 0
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                      <div className="card-box">
                        <img
                          src={Teachers}
                          alt="Teachers"
                          className="card-img"
                        />
                        <i className="sub-text-c text-green">
                          {t("no_of_teachers")}
                        </i>
                        <div className="main-text-c m-big">{totalTeachers}</div>

                        <span className="sub-text-c">{t("male")}</span>
                        <div className="main-text-c">
                          {languagebasedConvertNumberSystem(
                            dashData?.totTeachersMale || 0
                          )}
                        </div>

                        <span className="sub-text-c">{t("female")}</span>
                        <div className="main-text-c">
                          {languagebasedConvertNumberSystem(
                            dashData?.totTeachersFemale || 0
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                      <div className="card-box">
                        <img
                          src={Students}
                          alt="Students"
                          className="card-img"
                        />
                        <i className="sub-text-c text-green">
                          {t("no_of_students")}
                        </i>
                        <div className="main-text-c m-big">{totalStudents}</div>

                        <span className="sub-text-c">{t("boys")}</span>
                        <div className="main-text-c">
                          {languagebasedConvertNumberSystem(
                            dashData?.totStudentBoys || 0
                          )}
                        </div>

                        <span className="sub-text-c">{t("girls")}</span>
                        <div className="main-text-c">
                          {languagebasedConvertNumberSystem(
                            dashData?.totStudentGirls || 0
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-box-impact mt-4">
                  <div className="row">
                    <div className="col-md-12 mb-4">
                      <h2 className="heading-sm">
                        {t("impact_of_various_schemes_and_initiatives")}
                      </h2>
                    </div>

                    <div className="col-md-4 col-lg-4">
                      <div
                        className="impact-box-content"
                        onClick={(e) =>
                          commonhandleGERData(e, "gross_enrollment_ratio")
                        }
                        ref={handleRef}
                      >
                        <img
                          src={ArrowUP}
                          alt="school"
                          className="card-img-impact"
                        />
                        <div
                          className="main-text-c m-big"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {t("gross_enrollment_ratio")}
                        </div>

                        <div className="main-text-c">{t("elementary")}</div>
                        <span className="sub-text-c">
                          {dashDataStudent?.gerElementary || 0}%
                        </span>

                        <div className="main-text-c">{t("secondary")}</div>
                        <span className="sub-text-c">
                          {dashDataStudent?.gerSec || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="col-md-4 col-lg-4">
                      <div
                        className="impact-box-content"
                        onClick={(e) => commonhandleGERData(e, "dropout_rate")}
                      >
                        <img
                          src={Arrowdown}
                          alt="school"
                          className="card-img-impact"
                        />
                        <div
                          className="main-text-c m-big"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {t("dropout_rate")}
                        </div>

                        <div className="main-text-c">{t("primary")}</div>
                        <span className="sub-text-c">
                          {dashDataStudent?.dropoutPry || 0}%
                        </span>

                        <div className="main-text-c">{t("secondary")}</div>
                        <span className="sub-text-c">
                          {dashDataStudent?.dropoutSec || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="col-md-4 col-lg-4">
                      <div
                        className="impact-box-content"
                        onClick={(e) =>
                          commonhandleGERData(e, "transition_rate")
                        }
                      >
                        <img
                          src={transition_img}
                          alt="school"
                          className="card-img-impact"
                        />

                        <div
                          className="main-text-c m-big"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {t("transition_rate")}
                        </div>

                        <div className="main-text-c">
                          {t("primary_to_upper_primary")}
                        </div>
                        <span className="sub-text-c">
                          {dashDataStudent?.transPryUPry || 0}%
                        </span>

                        <div className="main-text-c">
                          {t("upper_primary_to_secondary")}
                        </div>
                        <span className="sub-text-c">
                          {dashDataStudent?.transUPrySec || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="col-md-4 col-lg-4">
                      <div
                        className="impact-box-content"
                        onClick={(e) =>
                          commonhandleGERData(e, "pupil_teacher_ratio")
                        }
                      >
                        <div className="img-multi-box">
                          <img src={std1} alt="school" />
                          <img src={std2} alt="school" className="big-img" />
                          <img src={std1} alt="school" />
                        </div>
                        <div
                          className="main-text-c m-big"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {t("pupil_teacher_ratio")}
                        </div>

                        <div className="main-text-c">{t("primary")}</div>

                        <span className="sub-text-c">
                          {dashData?.ptrPry || 0}
                        </span>

                        <div className="main-text-c">{t("upper_primary")}</div>
                        <span className="sub-text-c">
                          {dashData?.ptrUPry || 0}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-4 col-lg-4">
                      <div
                        className="impact-box-content"
                        onClick={(e) =>
                          commonhandleGERData(e, "schools_with_drinking_water")
                        }
                      >
                        <img
                          src={drinkinwater}
                          alt="school"
                          className="card-img-impact"
                        />
                        <div
                          className="main-text-c m-big"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {t("schools_with_drinking_water")}
                        </div>

                        <span className="sub-text-c sub-main-text">
                          {(
                            (dashData.schWithDrinkWater / dashData.totSchools) *
                              100 || 0
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>

                    <div className="col-md-4 col-lg-4">
                      <div
                        className="impact-box-content"
                        onClick={(e) =>
                          commonhandleGERData(
                            e,
                            "schools_with_electricity_connection"
                          )
                        }
                      >
                        <img
                          src={power}
                          alt="school"
                          className="card-img-impact"
                        />
                        <div
                          className="main-text-c m-big"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {t("schools_with_electricity_connection")}
                        </div>
                        <span className="sub-text-c sub-main-text">
                          {(
                            (dashData.schWithElectricity /
                              dashData.totSchools) *
                              100 || 0
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-box-impact tab-for-graph mt-4">
                  <EducationDashboardGraphA
                    t={t}
                    dashDataSchool={dashDataSchool}
                    dashDataTeacher={dashDataTeacher}
                    dashDataStudent={dashDataStudent}
                    dashData = {dashData}
                  />
                </div>

                <div className="card-box-impact tab-for-graph Enrollment_Level  mt-4">
                  <div className="row">
                    <div className="col-md-12 col-lg-12">
                      <div className="impact-box-content-education">
                        <div className="text-btn-d">
                          <h2 className="heading-sm">
                            {t("enrollment_by_level_of_education_gender")}
                          </h2>
                        </div>
                        <div className="piechart-box row mt-4">
                          <div className="col-md-12">
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={{
                                chart: {
                                  type: "bar",
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
                                    t("higher_secondary"),
                                    t("secondary"),
                                    t("upper_primary"),
                                    t("primary"),
                                    t("prePrimary"),
                                  ],
                                  title: {
                                    text: null,
                                  },
                                  gridLineWidth: 1,
                                  lineWidth: 0,
                                },
                                yAxis: {
                                  min: 0,
                                  title: {
                                    enabled: false,
                                  },
                                  labels: {
                                    overflow: "justify",
                                  },
                                  gridLineWidth: 0,
                                },
                                title: {
                                  text: t(
                                    "enrollment_by_level_of_education_gender"
                                  ),
                                },
                                tooltip: {
                                  valueSuffix: "",
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
                                plotOptions: {
                                  bar: {
                                    borderRadius: "50%",
                                    dataLabels: {
                                      enabled: true,
                                      formatter: function () {
                                        return this.y.toLocaleString("en-IN");
                                      },
                                    },
                                    groupPadding: 0.1,
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
                                series: educationGender,
                                exporting: {
                                  filename: t(
                                    "enrollment_by_level_of_education_gender"
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

                <div className="card-box-impact tab-for-graph education-chart-f mt-4">
                  <EducationDashboardGraphB
                    t={t}
                    dashDataSchool={dashDataSchool}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
