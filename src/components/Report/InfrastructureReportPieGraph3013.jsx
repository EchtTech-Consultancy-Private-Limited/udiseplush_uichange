import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useLocation } from "react-router-dom";
import { fetchArchiveServicesPieGraphSchoolData } from "../../redux/thunks/archiveServicesThunk";
import groupByKey from "../../utils/groupBy";

import {
  selectedDYear,
  initialFilterPieGraphSchoolData,
  modifyobjectFor358Combine
} from "../../constants/constants";
import { categoryMappings } from "../../constants/constants";

import {
  state_gov_mgt_code,
  gov_aided_mgt_code,
  pvt_uaided_mgt_code,
  ctrl_gov_mgt_code,
  other_mgt_code,
  pr_sch_code,
  upr_pr_code,
  hr_sec_code,
  sec_sch_code,
  pre_pr_sch_code,
} from "../../constants/constants";

import { removeAllDistrict } from "../../redux/thunks/districtThunk";
import { removeAllBlock } from "../../redux/thunks/blockThunk";

export default function InfrastructureReportPieGraph3013(school_dataforpiegraph) {

  const location = useLocation();
  const queryString = location.search; 
  const urlParams = new URLSearchParams(queryString);

  const paramValue = urlParams.get("type");
  const dispatch = useDispatch();

  const selectedField = useSelector(
    (state) => state.header.selectedField3013graph.field
  );

  const updatedSchoolData = useMemo(() => {
    return school_dataforpiegraph?.school_dataforpiegraph?.data?.data?.map((school) => {
      if (categoryMappings?.hasOwnProperty(school?.schCategoryDesc)) {
        return {
          ...school,
          schCategoryDesc: categoryMappings[school.schCategoryDesc],
        };
      }
      return school;
    });
  }, [school_dataforpiegraph, categoryMappings]);
  const selectedleble = useSelector((state) => state.header.selectedField3013graph.label)
  const headerData = useSelector((state) => state.header);
  const schoolFilter = useSelector((state) => state.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const [arrGroupedschManagementBroadData, setArrGroupedschManagementBroadData] = useState([]);
  const [arrGroupedschCategoryBroadData, setArrGroupedschCategoryBroadData] = useState([]);
  const [data, setData] = useState([]);

  const [groupKeys, setGroupKeys] = useState({
    schManagementBroad: true,  
  });

  const [CategoryGroupKeys, setCategoryGroupKeys] = useState({
    schCategoryBroad: true,
  });


  useEffect(() => {
    dispatch(removeAllDistrict());
    dispatch(removeAllBlock());
  }, [ location.pathname]);

  useEffect(() => {
    if (updatedSchoolData?.length >= 0) {
      handleCustomKeyInAPIResponse();
    }
  }, [updatedSchoolData]);

  useEffect(() => {
    if (data.length >= 0) {
      multiGroupingRows();
      multiGroupingCategoryRows();
    }
  }, [data]);

  const handleCustomKeyInAPIResponse = () => {
    const arr = updatedSchoolData?.map((item) => { 
      let appendedObj = { ...item };

      // Broad management key added
      if (state_gov_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "State Government";
      } else if (gov_aided_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Govt. Aided";
      } else if (pvt_uaided_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Private Unaided";
      } else if (ctrl_gov_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Central Government";
      } else if (other_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Others";
      }

      // Broad category key added
      if (pr_sch_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Primary (PRY)";
      } else if (upr_pr_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Upper Primary (UPR)";
      } else if (hr_sec_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Higher Secondary (HSEC)";
      } else if (sec_sch_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Secondary (SEC)";
      } else if (pre_pr_sch_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Pre-Primary (PRY)";
      }

      return appendedObj;
    });
    setData(arr);
  };

  const multiGroupingRows = () => {
    const primaryKeys = Object?.keys(groupKeys).filter((key) => groupKeys[key]);
    if (primaryKeys.length > 0) {
       primaryKeys.push("regionName");
      const groupedData = groupByKey(data, primaryKeys);
      const updatedArrGroupedData = [];
      if (groupedData && typeof groupedData === "object") {
        Object?.keys(groupedData).forEach((item, idx) => {
          const itemsArray = groupedData[item];
          let totalSchoolsHaveElectricity = 0;
          let separateHeadMasterRoom = 0;
          let landAvailable = 0;
          let solarPanelAvailable = 0;
          let playGroundAvail = 0;
          let totalSchoolLibrary = 0;
          let totalSchoolLibrarian = 0;
          let totalNewspaper = 0;
          let totalKitchenGarden = 0;
          let totalFurniture = 0;
          let totalBoysToilet = 0;
          let totalFuncBoysToilet = 0;
          let totalgirlsToilet = 0;
          let totalFuncGirlsToilet = 0;
          let totalToiletfacility = 0;
          let totalFuncToiletfacility = 0;
          let totalFuncBoysurinal = 0;
          let totalFuncUrinal = 0;
          let totalFuncGirlsUrinal = 0;
          let totalDrinkingWater = 0;
          let totalFunctionalDrinkingWater = 0;
          let totalPurifier = 0;
          let totalRainWaterHarvesting = 0;
          let totalWaterTested = 0;
          let totalIncinerator = 0;
          let totalHandWashFacility = 0;
          let totalSchoolRamps = 0;
          let medicalCheckUp = 0;
          let completeMedicalCheckUp = 0;
          let totalHandRails = 0;
          let totalInternet = 0;
          let computerAvailable = 0;
          let totalFunElectricity = 0;
          let totalSchools = 0;
          let totalSchoolsHandWashToilet = 0;
          let regionName = "";
          itemsArray.forEach((dataItem) => {
            regionName = dataItem?.regionName;
            totalSchoolsHaveElectricity += parseInt(dataItem?.totSchElectricity);
            totalSchools += parseInt(dataItem?.totSch);
            totalFunElectricity += parseInt(dataItem?.totSchFuncElectricity);
            totalSchoolsHandWashToilet += parseInt(
              dataItem?.totSchHandwashToilet
            );
            separateHeadMasterRoom += parseInt(dataItem?.totSchSeprateRoomHm);
            landAvailable += parseInt(dataItem?.totSchLandAvail);
            solarPanelAvailable += parseInt(dataItem?.totSchSolarPanel);
            playGroundAvail += parseInt(dataItem?.totSchPlayground);
            totalSchoolLibrary += parseInt(dataItem?.totSchLibrary);
            totalSchoolLibrarian += parseInt(dataItem?.totSchLibrarian);
            totalNewspaper += parseInt(dataItem?.totSchNewspaper);
            totalKitchenGarden += parseInt(dataItem?.totSchKitchenGarden);
            totalFurniture += parseInt(dataItem?.totSchFurniture);
            totalBoysToilet += parseInt(dataItem?.totSchBoysToilet);
            totalFuncBoysToilet += parseInt(dataItem?.totSchFuncBoysToilet);
            totalgirlsToilet += parseInt(dataItem?.totSchGirlsToilet);
            totalFuncGirlsToilet += parseInt(dataItem?.totSchFuncGirlsToilet);
            // totalToiletfacility += parseInt(dataItem?.schHaveToilet);
            totalToiletfacility = totalBoysToilet + totalgirlsToilet;
            totalFuncBoysurinal += parseInt(dataItem?.totSchFuncBoysUrinal);
            totalFuncUrinal += parseInt(dataItem?.schHaveFuncUrinals);
            totalFuncGirlsUrinal += parseInt(dataItem?.totSchFuncGirlsUrinal);
            totalDrinkingWater += parseInt(dataItem?.totSchDrinkingWater);
            totalFunctionalDrinkingWater += parseInt(
              dataItem?.totSchFuncWaterPurifier
            );
            totalPurifier += parseInt(dataItem?.totSchWaterPurifier);
            totalRainWaterHarvesting += parseInt(
              dataItem?.totSchRainWaterHarvesting
            );
            totalWaterTested += parseInt(dataItem?.totSchWaterTested);
            totalIncinerator += parseInt(dataItem?.totSchIncinerator);
            totalHandWashFacility += parseInt(dataItem?.totSchHandwashMeals);
            totalSchoolRamps += parseInt(dataItem?.totSchRamps);
            medicalCheckUp += parseInt(dataItem?.totSchMedicalCheckup);
            completeMedicalCheckUp += parseInt(
              dataItem?.schHaveCompleteMedicalCheckup
            );
            totalHandRails += parseInt(dataItem?.totSchHandRails);
            totalInternet += parseInt(dataItem?.totSchInternet);
            computerAvailable += parseInt(dataItem?.totSchCompAvail);
          });
          const appended = {};
          primaryKeys.forEach((key, index) => {
            appended.regionName = regionName;
            appended[key] = item.split("@")[index];
          });
          appended["Serial Number"] = idx + 1;
          appended.totSchElectricity = totalSchoolsHaveElectricity;
          appended.totSch = totalSchools;
          appended.totSchFuncElectricity = totalFunElectricity;
          appended.totSchSeprateRoomHm = separateHeadMasterRoom;
          appended.totSchLandAvail = landAvailable;
          appended.totSchSolarPanel = solarPanelAvailable;
          appended.totSchPlayground = playGroundAvail;
          appended.totSchLibrary = totalSchoolLibrary;
          appended.totSchLibrarian = totalSchoolLibrarian;
          appended.totSchNewspaper = totalNewspaper;
          appended.totSchKitchenGarden = totalKitchenGarden;
          appended.totSchFurniture = totalFurniture;
          appended.totSchBoysToilet = totalBoysToilet;
          appended.totSchFuncBoysToilet = totalFuncBoysToilet;
          appended.totSchGirlsToilet = totalgirlsToilet;
          appended.totSchFuncGirlsToilet = totalFuncGirlsToilet;
          appended.schHaveToilet = totalToiletfacility;
          appended.totSchFuncBoysUrinal = totalFuncBoysurinal;
          appended.schHaveFuncUrinals = totalFuncUrinal;
          appended.totSchFuncGirlsUrinal = totalFuncGirlsUrinal;
          appended.totSchDrinkingWater = totalDrinkingWater;
          appended.totSchFuncWaterPurifier = totalFunctionalDrinkingWater;
          appended.totSchWaterPurifier = totalPurifier;
          appended.totSchRainWaterHarvesting = totalRainWaterHarvesting;
          appended.totSchWaterTested = totalWaterTested;
          appended.totSchHandwashToilet = totalSchoolsHandWashToilet;
          appended.totSchIncinerator = totalIncinerator;
          appended.totSchHandwashMeals = totalHandWashFacility;
          appended.totSchRamps = totalSchoolRamps;
          appended.totSchHandRails = totalHandRails;
          appended.totSchMedicalCheckup = medicalCheckUp;
          appended.schHaveCompleteMedicalCheckup = completeMedicalCheckUp;
          appended.totSchInternet = totalInternet;
          appended.totSchCompAvail = computerAvailable;
          updatedArrGroupedData.push(appended);
        });

        setArrGroupedschManagementBroadData(updatedArrGroupedData);
    
      }
     
    }
  };
  

  const multiGroupingCategoryRows = () => {
    const primaryKeys = Object?.keys(CategoryGroupKeys).filter((key) => CategoryGroupKeys[key]);
    if (primaryKeys.length > 0) {
       primaryKeys.push("regionName");
      const groupedData = groupByKey(data, primaryKeys);
      const updatedArrGroupedData = [];
      if (groupedData && typeof groupedData === "object") {
        Object?.keys(groupedData).forEach((item, idx) => {
          const itemsArray = groupedData[item];
          let totalSchoolsHaveElectricity = 0;
          let separateHeadMasterRoom = 0;
          let landAvailable = 0;
          let solarPanelAvailable = 0;
          let playGroundAvail = 0;
          let totalSchoolLibrary = 0;
          let totalSchoolLibrarian = 0;
          let totalNewspaper = 0;
          let totalKitchenGarden = 0;
          let totalFurniture = 0;
          let totalBoysToilet = 0;
          let totalFuncBoysToilet = 0;
          let totalgirlsToilet = 0;
          let totalFuncGirlsToilet = 0;
          let totalToiletfacility = 0;
          let totalFuncToiletfacility = 0;
          let totalFuncBoysurinal = 0;
          let totalFuncUrinal = 0;
          let totalFuncGirlsUrinal = 0;
          let totalDrinkingWater = 0;
          let totalFunctionalDrinkingWater = 0;
          let totalPurifier = 0;
          let totalRainWaterHarvesting = 0;
          let totalWaterTested = 0;
          let totalIncinerator = 0;
          let totalHandWashFacility = 0;
          let totalSchoolRamps = 0;
          let medicalCheckUp = 0;
          let completeMedicalCheckUp = 0;
          let totalHandRails = 0;
          let totalInternet = 0;
          let computerAvailable = 0;
          let totalFunElectricity = 0;
          let totalSchools = 0;
          let totalSchoolsHandWashToilet = 0;
          let regionName = "";
          itemsArray.forEach((dataItem) => {
            regionName = dataItem.regionName;
            totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
            totalSchools += parseInt(dataItem.totSch);
            totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
            totalSchoolsHandWashToilet += parseInt(
              dataItem.totSchHandwashToilet
            );
            separateHeadMasterRoom += parseInt(dataItem.totSchSeprateRoomHm);
            landAvailable += parseInt(dataItem.totSchLandAvail);
            solarPanelAvailable += parseInt(dataItem.totSchSolarPanel);
            playGroundAvail += parseInt(dataItem.totSchPlayground);
            totalSchoolLibrary += parseInt(dataItem.totSchLibrary);
            totalSchoolLibrarian += parseInt(dataItem.totSchLibrarian);
            totalNewspaper += parseInt(dataItem.totSchNewspaper);
            totalKitchenGarden += parseInt(dataItem.totSchKitchenGarden);
            totalFurniture += parseInt(dataItem.totSchFurniture);
            totalBoysToilet += parseInt(dataItem.totSchBoysToilet);
            totalFuncBoysToilet += parseInt(dataItem.totSchFuncBoysToilet);
            totalgirlsToilet += parseInt(dataItem.totSchGirlsToilet);
            totalFuncGirlsToilet += parseInt(dataItem.totSchFuncGirlsToilet);
            // totalToiletfacility += parseInt(dataItem.schHaveToilet);
            totalToiletfacility = totalBoysToilet + totalgirlsToilet;
            totalFuncBoysurinal += parseInt(dataItem.totSchFuncBoysUrinal);
            totalFuncUrinal += parseInt(dataItem.schHaveFuncUrinals);
            totalFuncGirlsUrinal += parseInt(dataItem.totSchFuncGirlsUrinal);
            totalDrinkingWater += parseInt(dataItem.totSchDrinkingWater);
            totalFunctionalDrinkingWater += parseInt(
              dataItem.totSchFuncWaterPurifier
            );
            totalPurifier += parseInt(dataItem.totSchWaterPurifier);
            totalRainWaterHarvesting += parseInt(
              dataItem.totSchRainWaterHarvesting
            );
            totalWaterTested += parseInt(dataItem.totSchWaterTested);
            totalIncinerator += parseInt(dataItem.totSchIncinerator);
            totalHandWashFacility += parseInt(dataItem.totSchHandwashMeals);
            totalSchoolRamps += parseInt(dataItem.totSchRamps);
            medicalCheckUp += parseInt(dataItem.totSchMedicalCheckup);
            completeMedicalCheckUp += parseInt(
              dataItem.schHaveCompleteMedicalCheckup
            );
            totalHandRails += parseInt(dataItem.totSchHandRails);
            totalInternet += parseInt(dataItem.totSchInternet);
            computerAvailable += parseInt(dataItem.totSchCompAvail);
          });
          const appended = {};
          primaryKeys.forEach((key, index) => {
            appended.regionName = regionName;
            appended[key] = item.split("@")[index];
          });
          appended["Serial Number"] = idx + 1;
          appended.totSchElectricity = totalSchoolsHaveElectricity;
          appended.totSch = totalSchools;
          appended.totSchFuncElectricity = totalFunElectricity;
          appended.totSchSeprateRoomHm = separateHeadMasterRoom;
          appended.totSchLandAvail = landAvailable;
          appended.totSchSolarPanel = solarPanelAvailable;
          appended.totSchPlayground = playGroundAvail;
          appended.totSchLibrary = totalSchoolLibrary;
          appended.totSchLibrarian = totalSchoolLibrarian;
          appended.totSchNewspaper = totalNewspaper;
          appended.totSchKitchenGarden = totalKitchenGarden;
          appended.totSchFurniture = totalFurniture;
          appended.totSchBoysToilet = totalBoysToilet;
          appended.totSchFuncBoysToilet = totalFuncBoysToilet;
          appended.totSchGirlsToilet = totalgirlsToilet;
          appended.totSchFuncGirlsToilet = totalFuncGirlsToilet;
          appended.schHaveToilet = totalToiletfacility;
          appended.totSchFuncBoysUrinal = totalFuncBoysurinal;
          appended.schHaveFuncUrinals = totalFuncUrinal;
          appended.totSchFuncGirlsUrinal = totalFuncGirlsUrinal;
          appended.totSchDrinkingWater = totalDrinkingWater;
          appended.totSchFuncWaterPurifier = totalFunctionalDrinkingWater;
          appended.totSchWaterPurifier = totalPurifier;
          appended.totSchRainWaterHarvesting = totalRainWaterHarvesting;
          appended.totSchWaterTested = totalWaterTested;
          appended.totSchHandwashToilet = totalSchoolsHandWashToilet;
          appended.totSchIncinerator = totalIncinerator;
          appended.totSchHandwashMeals = totalHandWashFacility;
          appended.totSchRamps = totalSchoolRamps;
          appended.totSchHandRails = totalHandRails;
          appended.totSchMedicalCheckup = medicalCheckUp;
          appended.schHaveCompleteMedicalCheckup = completeMedicalCheckUp;
          appended.totSchInternet = totalInternet;
          appended.totSchCompAvail = computerAvailable;
  
          updatedArrGroupedData.push(appended);
        });
        setArrGroupedschCategoryBroadData(updatedArrGroupedData);
      
      }
     
    }
  };
  

  const colorMapSch = {
    "Primary (PRY)": "#f5bf55",
    "Upper Primary (UPR)": "#e6694a",
    "Higher Secondary (HSEC)": "#bce263",
    "Secondary (SEC)": "#751539",
  };
  const colorMapmgt = {
    "State Government": "#751539",
    "Govt. Aided": "#e6694a",
    "Private Unaided": "#f5bf55",
    "Others": "#57c1bb",
    "Central Government": "#bce263"
  };
  const pieChartmanagementData = arrGroupedschManagementBroadData?.map((item) => ({
    name: item.schManagementBroad,
    regionName: item.regionName,
    y: parseFloat(item[selectedField]),
    color: colorMapmgt[item.schManagementBroad] || "#57c1bb",
  }));
  const pieChartCategoryData = arrGroupedschCategoryBroadData?.map((item) => ({
    name: item.schCategoryBroad,
    regionName: item.regionName,
    y: parseFloat(item[selectedField]),
    color: colorMapSch[item.schCategoryBroad] || "#57c1bb",
  }));
  return (
    <>
      <div className="col-md-6 col-lg-6">
        <div className="impact-box-content-education mt-3">
          <div className="text-btn-d mb-0">
            <h2 className="heading-sm">Status of Infrastructure in Schools Management Wise</h2>
          </div>
          <div className="mt-3 tab-content-reduce">
            <div className="piechart-box row mt-3">
              <div className="col-md-12 p-0">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: "pie",
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
                    events: {
                      beforePrint: function () { },
                      afterPrint: function () { },
                    },
                    title: {
                      text: "",
                    },
                 
                    credits: {
                      enabled: false,
                    },
                    plotOptions: {
                      pie: {
                        size: "100%",
                        dataLabels: {
                          enabled: true,
                          distance: -40,
                          formatter: function () {
                            return "<b>" + this.point.y ;
                          },
                          style: {
                            fontSize: "16px",
                            textOutline: "none",
                            opacity: 0.7,
                          },
                        },
                        center: ["50%", "50%"],
                        showInLegend: true,
                      },
                      series: {
                        allowPointSelect: true,
                        cursor: "pointer",
                        dataLabels: [
                          {
                            enabled: true,
                            distance: 20,
                          },
                          {
                            enabled: false,
                            distance: -40,
                            format: "{point.y:.2f}",
                            style: {
                              fontSize: "0.6em",
                              textOutline: "none",
                              opacity: 0.7,
                            },

                            filter: {
                              operator: ">",
                              property: "percentage",
                              value: 0,
                            },
                          },
                        ],
                      },
                    },
                    legend: {
                      layout: "horizontal",
                      align: "center",
                      verticalAlign: "bottom",
                      itemMarginTop: 10,
                      itemMarginBottom: 10,
                    },
                    series: [
                      {
                        name: String(selectedleble),
                        colorByPoint: true,
                        data: pieChartmanagementData,
                      },
                    ],
                    exporting: {
                      filename: "Category",
                      csv: {
                        columnHeaderFormatter: function (item) {
                          if (!item || item instanceof Highcharts.Axis) {
                            return "category";
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

      <div className="col-md-6 col-lg-6">
        <div className="impact-box-content-education mt-3">
          <div className="text-btn-d mb-0">
            <h2 className="heading-sm">Status of Infrastructure in Schools Category <br /> Wise</h2>
          </div>
          <div className="mt-3 tab-content-reduce">

            <div className="piechart-box row mt-3">
              <div className="col-md-12 p-0">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: "pie",
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
                    events: {
                      beforePrint: function () { },
                      afterPrint: function () { },
                    },
                    title: {
                      text: "",
                    },
                  
                    credits: {
                      enabled: false,
                    },
                    plotOptions: {
                      pie: {
                        size: "100%",
                        dataLabels: {
                          enabled: true,
                          distance: -40,
                          formatter: function () {
                            return "<b>" + this.point.y;
                          },
                          style: {
                            fontSize: "16px",
                            textOutline: "none",
                            opacity: 0.7,
                          },
                        },
                        center: ["50%", "50%"],
                        showInLegend: true,
                      },
                      series: {
                        allowPointSelect: true,
                        cursor: "pointer",
                        dataLabels: [
                          {
                            enabled: true,
                            distance: 20,
                          },
                          {
                            enabled: false,
                            distance: -40,
                            format: "{point.y:.2f}",
                            style: {
                              fontSize: "0.6em",
                              textOutline: "none",
                              opacity: 0.7,
                            },

                            filter: {
                              operator: ">",
                              property: "percentage",
                              value: 0,
                            },
                          },
                        ],
                      },
                    },
                    legend: {
                      layout: "horizontal",
                      align: "center",
                      verticalAlign: "bottom",
                      itemMarginTop: 10,
                      itemMarginBottom: 10,
                    },
                    series: [
                      {
                        name: String(selectedleble),
                        colorByPoint: true,
                        data: pieChartCategoryData
                      },
                    ],
                    exporting: {
                      filename: "Category",
                      csv: {
                        columnHeaderFormatter: function (item) {
                          if (!item || item instanceof Highcharts.Axis) {
                            return "category";
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
    </>
  );
}