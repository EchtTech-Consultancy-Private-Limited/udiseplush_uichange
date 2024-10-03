import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "./slice/headerSlice";
import districtSlice from "./slice/districtSlice";
import yearSlice from "./slice/yearSlice";
import stateSlice from "./slice/stateSlice";
import blockSlice from "./slice/blockSlice";
import archiveServicesSlice from "./slice/archiveServicesSlice";
import archiveServicesPtrYearSlice from "./slice/archiveServicesPtrYearSlice";
import archiveServicesYearSliceManagementWise from "./slice/archiveServicesYearSliceManagementWise";
import archiveServicesGraphSlice from "./slice/archiveServicesGraphSlice";
import archiveServicesPieGraphSlice from "./slice/archiveServicesPieGraphSlice";
import schoolFilterSlice from "./slice/schoolFilterSlice";
import schoolFilterSlices from "./slice/schoolFilterSlicereport";
import testschoolFilterSlice from "./slice/testschoolFilterSlice";
import darkLightMode from "./slice/darkLightModeSlice";
import dataGridAPISlice from "./slice/dataGridAPISlice";
import dashboardSlice from "./slice/dashboardSlice";
import dashboardFilterSlice from "./slice/dashboardFilter.slice";
import Column3016Slice from "./slice/Column3016Slice";
import DistBlockWiseSlice from "./slice/DistBlockWiseSlice";
import schoolFilterSlice3016 from "./slice/schoolFilterSlice3016";
import mapSlice from "./slice/mapSlice";
import dashboardTeacherStatSlice from "./slice/dashboardTeacherStatSlice";
import dashboardSchoolStatsSlice from "./slice/dashboardSchoolStatsSlice";
import dashboardSchoolStatsYearSlice from "./slice/dashboardSchoolYearStatsSlice";
import dashboardStudentsSlice from "./slice/dashboardStudentsSlice";
import dashboardSchoolStatsIntSlice from "./slice/dashboardSchoolStatsIntSlice";
import dashboardStudentsIntSlice from "./slice/dashboardStudentsIntSlice";
import dashboardTeacherStatIntSlice from "./slice/dashboardTeacherStatIntSlice";
import dashboardAllStateSchemesSlice from "./slice/dashboardAllStateSchemesSlice";
import archiveServicesSocialCatSlice from "./slice/archiveServicesSocialCatSlice";
import archiveServicesPtRSlice from "./slice/archiveServicesPtRSlice";
import schoolFilter2007Slice from "./slice/schoolFilter2007Slice";
import DashBoardMapDataSlice from "./slice/DashBoardMapDataSlice";
import DashBoardMapOtherDataSlice from "./slice/DashBoardMapOtherDataSlice";
import mapFilterSlice from "./slice/mapFilterSlice";

const store = configureStore({
  reducer: {
    header: headerSlice,
    mapData: mapSlice,
    schoolFilter: schoolFilterSlice,
    mapFilters:mapFilterSlice,
    schoolFilterreport: schoolFilterSlices,
    schoolFilter3016: schoolFilterSlice3016,
    schoolFilter2007Slice: schoolFilter2007Slice,
    state: stateSlice,
    distrct: districtSlice,
    block: blockSlice,
    year: yearSlice,
    school: archiveServicesSlice,
    schoolgraph: archiveServicesGraphSlice,
    schoolPieGraph: archiveServicesPieGraphSlice,
    schoolsocialcat: archiveServicesSocialCatSlice,
    pupilteacherratio: archiveServicesPtRSlice,
    pupilteacherratioyear: archiveServicesPtrYearSlice,
    pupilteacherratioyearmanagement: archiveServicesYearSliceManagementWise,
    toggle: darkLightMode,
    column: dataGridAPISlice,
    column3016: Column3016Slice,
    testschoolFilter: testschoolFilterSlice,
    dashboard: dashboardSlice,
    dashboardFilter: dashboardFilterSlice,
    distBlockWise: DistBlockWiseSlice,
    schoolStats: dashboardSchoolStatsSlice,
    schoolStatsYear: dashboardSchoolStatsYearSlice,
    teacherStats: dashboardTeacherStatSlice,
    MapStats: DashBoardMapDataSlice,
    MapStatsPercentage: DashBoardMapOtherDataSlice,
    studentStats: dashboardStudentsSlice,
    schoolIntStats: dashboardSchoolStatsIntSlice,
    teacherIntStats: dashboardTeacherStatIntSlice,
    studentIntStats: dashboardStudentsIntSlice,
    schemesAllState: dashboardAllStateSchemesSlice,
  },
});

export default store;
