import React, { useEffect } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState } from "react";
import {useSearchParams} from "react-router-dom"
import allreportsdata from '../../json-data/allreports.json';

export default function SchoolReport() {

    const [show, setShow] = useState(false);
    const [queryParameters] = useSearchParams();
    const id = queryParameters.get('id');
    const type = queryParameters.get('type');
    const [report, setReport] = useState(null);
     // Find the report with the given id
  useEffect(() => {
    for (const category in allreportsdata) {
      const foundReport = allreportsdata[category].find(
        (report) => report.id === parseInt(id)
      );
      if (foundReport) {
        setReport(foundReport);
        break;
      }
    }
  }, [id]);

    return (
        <section className="infrastructure-main-card p-0" id='content'>
            <div className="bg-grey2 ptb-30">
                <div className="container tab-for-graph">
                    <div className="row align-items-center">
                        <div className="col-md-6 col-lg-6">
                            <div className="common-content text-start map-heading-map">
                            {report && (
                <div className="common-content text-start map-heading-map">
                  <span>Reports ID: {report.id}</span>
                  <h2 className="heading-sm1 mb-3">{report.report_name}</h2>
                </div>
              )}
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4">
                            <div className="tab-text-infra mb-1">View Data </div>
                            <Tabs defaultActiveKey="School Category" id="uncontrolled-tab-example" className="">
                                <Tab eventKey="School Category" title="School Category">

                                </Tab>
                                <Tab eventKey="School Management" title="School Management">

                                </Tab>
                                <Tab eventKey="Urban/Rural" title="Urban / Rural">

                                </Tab>

                            </Tabs>
                        </div>

                        {/* Customize Filter Start*/}

                        <div className="col-md-2 col-lg-2 text-right pt-1 pe-0">
                            {/* <button className="header-dropdown-btn customize-btn" onClick={() => setShow(!show)}><span className="material-icons-round">dashboard</span> Customize</button> */}

                            <div className={`custmize-filter-column ${show ? "show" : ""}`} id="customize_filter">

                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="heading-sm heading-sm2">
                                        <span className="material-icons-round text-blue me-2">dashboard</span> Add Column
                                    </div>
                                    <button className="close-btn" onClick={() => setShow(!show)}><span className="material-icons-round">close</span></button>
                                </div>

                                <div className="box-cont-cust">
                                    <form action="">

                                        <div className="form-group search">
                                            <input type="search" className="form-control" placeholder="search..." />
                                        </div>

                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="Location" name="Location" />
                                            <label htmlFor="Location">Location</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="Rural_Urban" name="Rural_Urban" />
                                            <label htmlFor="Rural_Urban">Rural/Urban</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="School_category" name="School_category" />
                                            <label htmlFor="School_category">School Category</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="School_Management" name="School_Management" />
                                            <label htmlFor="School_Management">School Management</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="School_type" name="School_type" />
                                            <label htmlFor="School_type">School Type</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="Total_school" name="Total_school" />
                                            <label htmlFor="Total_school">Total No. Of School</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="Separate_room" name="Separate_room" />
                                            <label htmlFor="Separate_room">Separate Room For Headmaster</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="Land_available" name="Land_available" />
                                            <label htmlFor="Land_available">Land Available</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="Solar_panel" name="Solar_panel" />
                                            <label htmlFor="Solar_panel">Solar Panel</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="Playground" name="Playground" />
                                            <label htmlFor="Playground">Playground</label>
                                        </div>
                                        <div className="form-group checkbox">
                                            <input type="checkbox" className="" id="Library" name="Library" />
                                            <label htmlFor="Library">Library</label>
                                        </div>


                                    </form>
                                </div>


                            </div>





                        </div>

                        {/* Customize Filter END*/}

                        <div className="col-md-12 col-lg-12">
                            <div className="tab-text-infra download-rep">Download Report <span className="material-icons-round">download</span></div>
                        </div>


                    </div>
                </div>
            </div>
            <div className="bg-grey ptb-30">
                <div className="container tab-for-graph">
                    <div className="row align-items-center report-inner-tab">
                        <div className="col-md-12 col-lg-12">
                            <Tabs defaultActiveKey={type} id="uncontrolled-tab-example" className="">
                                <Tab eventKey="about" title="About">
                                    <div className="about-card mt-4">
                                        <h2 className="heading-sm2 mb-2">About Us</h2>
                                        <p>
                                            This comprehensive report delves into the educational landscape, examining the distribution of schools based on the availability of infrastructure and facilities, school management structures, and categorization by facility offerings. The study meticulously analyzes the diverse spectrum of educational institutions, shedding light on the correlation between the presence of infrastructure, effective management practices, and the categorization of schools based on the facilities they provide.
                                        </p>
                                        <p>
                                            Through a meticulous data-driven approach, the report classifies schools into distinct categories, discerning the variance in facilities and resources offered across different segments of the education sector. By exploring the nexus between school management structures and the quality of infrastructure, the report aims to provide valuable insights into the critical factors that contribute to a conducive learning environment.
                                        </p>
                                        <p>
                                            Stakeholders in education, policymakers, and researchers will find this report instrumental in understanding the nuanced interplay between infrastructure availability, school management strategies, and the diverse array of facilities that contribute to a well-rounded educational experience. The findings within offer a roadmap for informed decision-making, allowing for targeted interventions and improvements in the educational landscape to ensure equitable access to quality education for all.
                                        </p>
                                    </div>
                                </Tab>
                                <Tab eventKey="table" title="Table">
                                    <TableContainer className="mt-4">
                                        <Table className="teble table-bordered">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Location</TableCell>
                                                    <TableCell>Type of School</TableCell>
                                                    <TableCell>PS (I-V)</TableCell>
                                                    <TableCell>UPS (I-VIII)</TableCell>
                                                    <TableCell>HSS (I-XII)</TableCell>
                                                    <TableCell>UPS (VI-VIII)</TableCell>
                                                    <TableCell>HSS (VI-XII)</TableCell>
                                                    <TableCell>SS (I-X)</TableCell>
                                                    <TableCell>SS (VI-X)</TableCell>
                                                    <TableCell>SS (IX-X)</TableCell>
                                                    <TableCell>HSS (IX-XII)</TableCell>
                                                    <TableCell>HSS (XI-XII)</TableCell>
                                                    <TableCell> <div className="btn-add-more"><span className="material-icons-round">add</span> </div> </TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>National</TableCell>
                                                    <TableCell>Boys</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>National</TableCell>
                                                    <TableCell>Co-Ed</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>National</TableCell>
                                                    <TableCell>Girls</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                    <TableCell>256955</TableCell>
                                                    <TableCell>64355</TableCell>
                                                </TableRow>
                                                                                              
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Tab>
                                <Tab eventKey="graph" title="Chart">
                                </Tab>

                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}