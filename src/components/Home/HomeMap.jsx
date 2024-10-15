import React, { useEffect, useState } from "react";
import Mapimage from "../../assets/images/ind_map.svg";
import IndiaMapComponent from "../Report/map-report/india-map/India-map.component";
import { useTranslation } from "react-i18next";
import IndiaMapComponentN from "../Report/map-report/india-map/India-map.componentN";
import { useSelector } from "react-redux";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";

import { animateScroll as scroll } from 'react-scroll';

export default function HomeMap({ handleClass }) {
  useEffect(() => {
    window.localStorage.setItem("map_state_name", "All India/National");
    window.localStorage.setItem("map_district_name", "District");
  }, []);
  
  const handleChangeClass = (class_value) => {
    scroll.scrollToTop();
    handleClass(class_value);
  };

 
  const { t } = useTranslation();
  const grossEData = useSelector((state) => state?.mapData?.grossEData)
  const [updateGrossEData, setUpdateGrossEData] = useState("Gross Enrollment Ratio")
  
  useEffect(() => {
    if (grossEData === "gross_enrollment_ratio") {
      setUpdateGrossEData("Gross Enrollment Ratio")
    }
    else if (grossEData === "dropout_rate") {
      setUpdateGrossEData("Dropout Rate")
    }
    else if (grossEData === "transition_rate") {
      setUpdateGrossEData("Transition Rate")

    }
    else if (grossEData === "pupil_teacher_ratio") {
      setUpdateGrossEData("Pupil Teacher Ratio")
    }
    else if (grossEData === "schools_with_drinking_water") {
      setUpdateGrossEData("Schools with Drinking Water")
    }
    else if (grossEData === "schools_with_electricity_connection") {
      setUpdateGrossEData("Schools with Electricity Connection")

    }


  }, [grossEData])
  return (
    
      <section className="map-main-card ptb-30">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="common-content text-start map-heading-map">
                {/* <h2
                  className="heading-blue mb-3"
                  style={{ whiteSpace: "pre-line" }}
                >
                  
                </h2> */}
                <button
                  className="header-dropdown-btn close-map-btn"
                  title="Close Map"
                  onClick={() => handleChangeClass("close_map_sec")}
                >
                  {" "}
                  <span className="material-icons-round">close</span>{" "}
                  {t("close_map_button")}
                </button>

                <div className="updated-gross-text ps-2">{updateGrossEData}</div>

              </div>
            </div>
            <div className="col-md-12 p-0">
              <div className="common-content text-start map-heading-map">
                <div className="mapindia">
                  {/* <img src={Mapimage} alt="India Map" /> */}
                  {/* <IndiaMapComponent/> */}
                  <IndiaMapComponentN/>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
  );
}