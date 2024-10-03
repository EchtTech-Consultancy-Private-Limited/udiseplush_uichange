import React from 'react';
import '../components/Report/report.scss'
import FilterDropdown3016 from '../components/Home/filter/FilterDropdown3016';
import InfrastructureReport from '../components/Report/InfrastructureReport';
import {useSearchParams} from "react-router-dom"
import InfrastructureReport1003 from '../components/Report/InfrastructureReport1003';
export default function AllReport() {
    const [queryParameters] = useSearchParams();
    

    return (
        <>  
        
        <FilterDropdown3016/>
        <InfrastructureReport id={queryParameters.get('id')} report_name={queryParameters.get('report_name')} type={queryParameters.get('type')}/>
       
        </>
    )
}

