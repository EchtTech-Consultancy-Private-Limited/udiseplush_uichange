import React, { useEffect } from "react";
import Mapimage from "../../assets/images/ind_map.svg";
import IndiaMapComponent from "../Report/map-report/india-map/India-map.component";
import { useTranslation } from "react-i18next";
import IndiaMapComponentN from "../Report/map-report/india-map/India-map.componentN";



export default function HomeMap({ handleClass }) {
  useEffect(() => {
    window.localStorage.setItem("map_state_name", "All India/National");
    window.localStorage.setItem("map_district_name", "District");
  }, []);
  
  const handleChangeClass = (class_value) => {
    handleClass(class_value);
  };

 
  const { t } = useTranslation();
  return (
    
      <section className="map-main-card ptb-30">
        <div className="container">
          <div className="row">
            <div className="col-md-12 p-0">
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
                  {/* {t("close_map_button")}  */}
                </button>
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