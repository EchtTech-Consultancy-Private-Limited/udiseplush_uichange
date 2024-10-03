import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux';
import { useTranslation } from "react-i18next";


export default function Breadcrumb() {
    const dashData = useSelector(state=>state.dashboard);
    const { t } = useTranslation();
    const dashDataTeacher=useSelector((state)=>state?.teacherStats?.data?.data?.[0]) || {}; 
    const dashDataStudent=useSelector((state)=>state?.studentStats?.data?.data?.[0]) || {}; 
    const dashDataSchool=useSelector((state)=>state?.schoolStats?.data?.data?.[0]) || {};
    const stateName = localStorage.getItem("map_state_name")
    const yearData = localStorage.getItem("year")
    const [map_dist_name , setMapDistName] = useState("District");
    useEffect(()=>{
        setMapDistName(localStorage.getItem("map_district_name"));
    },[dashData,dashDataTeacher,dashDataStudent,dashDataSchool]);

    return (
        <div className="col-md-12">
            <h4 className="brudcrumb_heading mb-0 mt-2">{t("showing_result_for")} <span>&nbsp;{stateName}</span>

           <span className="material-icons-round">chevron_right</span>
           {map_dist_name !== "District" && (<><span>{map_dist_name}</span><span className="material-icons-round">chevron_right</span></>)}
           
                <span>{yearData}</span>
            </h4>
        </div>
    )
}
