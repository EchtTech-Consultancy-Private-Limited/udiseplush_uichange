import React, { useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useDispatch } from "react-redux";
import { handleShowDistrict, updateHeaderName } from "../../redux/slice/headerSlice";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { urls } from "../../constants/constants";
import { useSelector } from "react-redux";
import {useTranslation} from "react-i18next";

export default function SlidingTabBar() {
  const header_name = useSelector((state) => state.header);
useEffect(()=>{
  sessionStorage.setItem('handle', '');
},[header_name])
  const location = useLocation();
  const navigate = useNavigate();
  const path_name = location.pathname.split("-")[0]?.toUpperCase()?.slice(1);
  const dispatch = useDispatch();
  function handleSelect(e) {
    dispatch(updateHeaderName(e));
    navigate("/");
 
  }
  function handleNavigate(e) {
    dispatch(updateHeaderName(e));
  }

  const { t } = useTranslation();

 

  return (
    <>
    {location.pathname === "/reports" || urls.includes(location.pathname) ? (
  <>
    {location.pathname === "/reports" ? (
      <Tabs
        defaultActiveKey={'All Reports'}
        id="uncontrolled-tab-example"
        onSelect={(e) => handleSelect(e)}>
        <Tab eventKey="Education Dashboard" title={t("education_dashboard")}></Tab>
        <Tab eventKey="School Dashboard" title={t("school_dashboard")}></Tab>
        <Tab eventKey="Teacher Dashboard" title={t("teacher_dashboard")}></Tab>
        <Tab eventKey="Student Dashboard" title={t("student_dashboard")}></Tab>
        <Tab eventKey="All Reports" title={t("all_reports")}></Tab>
      </Tabs>
    ) : (
      <div className="header-breadcrumb">
        <div className="title-brd">
          <Link
            to="/reports"
            className="text-black"
            onClick={() => handleNavigate("All Reports")}>
            Reports
          </Link>{" "}
          <span className="material-icons-round">chevron_right</span>{" "}
          <span className="internalpagename">{path_name}</span>{" "}
        </div>
      </div>
    )}
  </>
) : (
  <Tabs
    defaultActiveKey={header_name.headerName}
    id="uncontrolled-tab-example"
    onSelect={(e) => handleSelect(e)}
  >
    <Tab eventKey="Education Dashboard" title={t("education_dashboard")}></Tab>
    <Tab eventKey="School Dashboard" title={t("school_dashboard")}></Tab>
    <Tab eventKey="Teacher Dashboard" title={t("teacher_dashboard")}></Tab>
    <Tab eventKey="Student Dashboard" title={t("student_dashboard")}></Tab>
    <Tab eventKey="All Reports" title={t("all_reports")}></Tab>
  </Tabs>
)}
    
    </>
  );
}