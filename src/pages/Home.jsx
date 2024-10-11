import React, { useEffect, useState, lazy, Suspense } from "react";
import HomeMap from "../components/Home/HomeMap";
import "../components/Home/home.scss";
import EducationDashboard from "../components/Home/EducationDashboard";
import { useDispatch, useSelector } from "react-redux";
import Reports from "../components/Report/Reports";
import { useTranslation } from "react-i18next";
import FilterDropdown3016 from "../components/Home/filter/FilterDropdown3016";
import { handleShowDistrict, handleShowFilter } from "../redux/slice/headerSlice";
import { fetchDashboardData, fetchMaptatsData, fetchMaptatsOtherData } from "../redux/thunks/dashboardThunk";
import { modifiedFilterObjForReset } from "../constants/constants";

const SchoolDashboard = lazy(() => import("../components/Home/SchoolDashboard"));
const TeacherDashboard = lazy(() => import("../components/Home/TeacherDashboard"));
const StudentDashboard = lazy(() => import("../components/Home/StudentDashboard"));

export default function Home() {
  const dispatch = useDispatch();
  const header_name = useSelector((state) => state.header);
  const schoolFilter = useSelector((state) => state?.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const mapsFilter = useSelector((state) => state.mapFilters);
  let mapFilterObj = structuredClone(mapsFilter);
  const [customClass, setCustomClass] = useState("");

  const handleClass = (e) => setCustomClass(e);
  const handleRemoveClass = () => setCustomClass("open_map_sec");

  useEffect(() => {
    window.localStorage.setItem("map_district_name", "District");
    window.localStorage.setItem("district", "District");
    window.localStorage.setItem("map_state_name", "All India/National");
    window.localStorage.setItem("state_wise", "All India/National");
    window.localStorage.setItem("state", "All India/National");
    window.localStorage.setItem("year", "2021-22");

    dispatch(handleShowFilter(false));
    dispatch(handleShowDistrict(false));

    let newDataObject = {
      yearId: filterObj.yearId,
      regionType: 10,
      regionCode: "99",
      dType: 10,
      dCode: 99,
      categoryCode: 0,
      managementCode: 0,
      locationCode: 0,
      schoolTypeCode: 0,
      dashboardRegionType: 10,
      dashboardRegionCode: "09",
    };
    // dispatch(fetchDashboardData(newDataObject));
    // if(header_name.headerName === "Education Dashboard"){
    //   dispatch(fetchMaptatsData(mapFilterObj));
    //   mapFilterObj.valueType=2
    //   dispatch(fetchMaptatsOtherData(mapFilterObj));
    //   console.log(mapFilterObj, "mapFilterObj")
    // }else{
    //   dispatch(fetchMaptatsData(modifiedFilterObjForReset));
    //   dispatch(fetchMaptatsOtherData(modifiedFilterObjForReset));
    // }
    dispatch(fetchMaptatsData(modifiedFilterObjForReset));
    dispatch(fetchMaptatsOtherData(modifiedFilterObjForReset));
 
  }, [header_name.headerName]);

  const { t } = useTranslation();

  return (
    <>
      <section
        className={`${header_name.headerName !== "All Reports"
            ? header_name.removeBeforeAfterClass
            : ""
          } ptb-0 bg-white ${customClass}`}
        id="content"
      >
        <div className="container bg-grey border-r-b">
          <div className="row">
            {header_name.headerName === "All Reports" ? (
              <Reports />
            ) : (
              <>
                <button
                  className="header-dropdown-btn open-map-btn"
                  title="Open Map"
                  onClick={() => handleRemoveClass("close_map_sec")}
                >
                  {t("open_map_button")}
                </button>
                <div className="col-sm-12 col-md-6 col-lg-6 map_hide_on_click_btn">
                  <div className="map-sec-h">
                    <HomeMap
                      handleClass={handleClass}
                      customClass={customClass}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 sec_full_width">
                  <div className="right-content-box">
                    {header_name.headerName === "Education Dashboard" ? (
                      <EducationDashboard />
                    ) : (
                      <Suspense fallback={<div></div>}>
                        {header_name.headerName === "School Dashboard" ? (
                          <SchoolDashboard />
                        ) : header_name.headerName === "Teacher Dashboard" ? (
                          <TeacherDashboard />
                        ) : header_name.headerName === "Student Dashboard" ? (
                          <StudentDashboard />
                        ) : (
                          <EducationDashboard />
                        )}
                      </Suspense>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {header_name.headerName !== "All Reports" && <FilterDropdown3016 />}
    </>
  );
}