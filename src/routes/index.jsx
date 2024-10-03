import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Reports from '../components/Report/Reports';
import AllReport from '../pages/AllReport';
// import SchoolReport from '../components/Report/SchoolReport';
import TeacherReport2008 from '../components/Report/TeacherReport2008';
import TeacherReport2007 from '../components/Report/TeacherReport2007';
import Infrastructure3013 from '../components/Report/InfrastructureReport3013';
import ScreenReader from '../pages/ScreenReader';
import HelpLineNumber from "../pages/HelpLineNumber";
import Infrastructure1003 from '../components/Report/InfrastructureReport1003';
import Infrastructure1005 from '../components/Report/InfrastructureReport1005';


export const routes = (
   
    <Routes >
        <Route exact path="/" element={<Home />} />
        <Route exact path="/reports" element={<Reports />} />
        <Route exact path="/school-reports" element={<AllReport />} />
        {/* <Route exact path="/school-reports" element={<SchoolReport />} /> */}
        <Route exact path="/school-reports-1005" element={<Infrastructure1005/>} />
        <Route exact path="/school-reports-1003" element={<Infrastructure1003/>} />
        <Route exact path="/teacher-reports-2008" element={<TeacherReport2008 />} />
        <Route exact path="/teacher-reports-2007" element={<TeacherReport2007 />} />
        <Route exact path="/infrastructure-reports3013" element={<Infrastructure3013 />} />
        <Route exact path="/screen-reader-access" element={<ScreenReader />} />
        <Route exact path="/help-line-numbers" element={<HelpLineNumber />} />
        <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
)  