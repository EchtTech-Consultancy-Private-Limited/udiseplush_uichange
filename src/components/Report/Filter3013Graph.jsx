import React, { useEffect, useState, useMemo } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setArrGroupedGraph3013Data,
  setSelectedField3013graph,
} from "../../redux/slice/headerSlice";

export default function Filter3013Graph({ arrGroupedGraphData }) {
  const dispatch = useDispatch();


  const filterDatawithHeaderName = useSelector(
    (state) => state.header.arrGroupedGraph3013Data.graphData
  );

  const selectedMgtSch = useSelector(
    (state) => state.header.pieGraph3013mngSchSelected
  );
  const selectedField = useSelector(
    (state) => state.header.selectedField3013graph.field
  );

  const columnData = useMemo(
    () => [
      { headerName: "Land Available", field: "totSchLandAvail" },
      { headerName: "Separate Room for Headmaster", field: "totSchSeprateRoomHm" },
      { headerName: "No. of Schools having Electricity", field: "totSchElectricity" },
      { headerName: "Functional Electricity", field: "totSchFuncElectricity" },
      { headerName: "Solar Panel", field: "totSchSolarPanel" },
      { headerName: "Playground", field: "totSchPlayground" },
      { headerName: "Library or Reading Corner or Book Bank", field: "totSchLibrary" },
      { headerName: "Librarian", field: "totSchLibrarian" },
      { headerName: "Newspaper", field: "totSchNewspaper" },
      { headerName: "Kitchen Garden", field: "totSchKitchenGarden" },
      { headerName: "Furniture", field: "totSchFurniture" },
      { headerName: "Boy's Toilet", field: "totSchBoysToilet" },
      { headerName: "Functional Boy's Toilet", field: "totSchFuncBoysToilet" },
      { headerName: "Girl's Toilet", field: "totSchGirlsToilet" },
      { headerName: "Functional Girl's Toilet", field: "totSchFuncGirlsToilet" },
      { headerName: "Total No. of Schools", field: "totSch" },
      { headerName: "Toilet Facility", field: "schHaveToilet" },
      { headerName: "Functional Toilet Facility", field: "totSchFuncBoysToilet" },
      { headerName: "Functional Urinal Boy's", field: "totSchFuncBoysUrinal" },
      { headerName: "Functional Urinal", field: "schHaveFuncUrinals" },
      { headerName: "Functional Urinal Girl's", field: "totSchFuncGirlsUrinal" },
      { headerName: "Drinking Water", field: "totSchDrinkingWater" },
      { headerName: "Functional Drinking Water", field: "totSchFuncWaterPurifier" },
      { headerName: "Water Purifier", field: "totSchWaterPurifier" },
      { headerName: "Rain Water Harvesting", field: "totSchRainWaterHarvesting" },
      { headerName: "Water Tested", field: "totSchWaterTested" },
      { headerName: "Handwash", field: "totSchHandwashToilet" },
      { headerName: "Incinerator", field: "totSchIncinerator" },
      { headerName: "WASH Facility", field: "totSchHandwashMeals" },
      { headerName: "Ramps", field: "totSchRamps" },
      { headerName: "Hand-Rails", field: "totSchHandRails" },
      { headerName: "Medical Checkup", field: "totSchMedicalCheckup" },
      { headerName: "Complete Medical Checkup", field: "schHaveCompleteMedicalCheckup" },
      { headerName: "Internet", field: "totSchInternet" },
      { headerName: "Computer Available", field: "totSchCompAvail" },
    ],
    []
  );


  const handleChangeheaderName = (selectedField) => {
    if (!arrGroupedGraphData) {
      return;
    }

    const filtered = arrGroupedGraphData.map((item) => ({
      SerialNumber: item["Serial Number"],
      regionName: item.regionName,
      [selectedField]: item[selectedField],
    }));

    dispatch(
      setArrGroupedGraph3013Data({
        graphData: filtered,
        pieGraphData: [],
        pieGraphDatas: [],
      })
    );
  };

  useEffect(() => {
    if (selectedField) {
      handleChangeheaderName(selectedField);
    }
  }, [arrGroupedGraphData, selectedField, selectedMgtSch]);

  return (
    <div className="graph-filter-drop">
      <div className="indicator-select">
        <Select
          key="columnDataSelect"
          mode="single"
          showSearch={true}
          style={{ width: "100%" }}
          value={selectedField}
          onChange={(value) => {
            const selectedOption = columnData.find(
              (data) => data.field === value
            );
            if (selectedOption) {
              dispatch(
                setSelectedField3013graph({
                  field: selectedOption.field,
                  label: selectedOption.headerName,
                })
              );
            }
          }}
          placeholder="Select Indicator"
          options={columnData.map((data,index) => ({
            value: data.field,
            label: data.headerName,
            key: index,
          }))}
        />
      </div>
    </div>
  );
}
