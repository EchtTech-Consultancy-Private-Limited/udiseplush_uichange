// useAspirationalGraphData.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import aspirationalData from "../../aspirational-reports-data/aspirational.json";

const getLocationName = (item, selectedState, selectedDistrict, selectedBlock) => {
  if (selectedBlock && selectedBlock !== "Block Wise" && selectedBlock !== "Block") {
    return `${item.lgd_block_name}`;
  } else if (selectedDistrict && selectedDistrict !== "District Wise" && selectedDistrict !== "District") {
    return `${item.lgd_block_name}`;
  } else if (selectedState && selectedState !== "State Wise") {
    return `${item.lgd_district_name}`;
  }
  return `${item.lgd_state_name}`;
};

const compressData = (data, groupBy, sortTopBy, sortBottomBy) => {
  const groupedData = data.reduce((acc, curr) => {
    let groupKey = curr[groupBy];
    let group = acc.find((item) => item[groupBy] === groupKey);

    if (group) {
      group.upri_t = parseFloat(
        ((group.upri_t * group.blocks + curr.upri_t) / (group.blocks + 1)).toFixed(2)
      );
      group.sec_t = parseFloat(
        ((group.sec_t * group.blocks + curr.sec_t) / (group.blocks + 1)).toFixed(2)
      );
      group.blocks += 1;
    } else {
      acc.push({
        ...curr,
        [groupBy]: groupKey,
        upri_t: parseFloat(curr.upri_t.toFixed(2)),
        sec_t: parseFloat(curr.sec_t.toFixed(2)),
        blocks: 1,
      });
    }
    return acc;
  }, []);

  const x = groupedData.sort((a, b) => b[sortTopBy] - a[sortTopBy]).slice(0, 10);
  const y = groupedData.sort((a, b) => a[sortBottomBy] - b[sortBottomBy]).slice(0, 10);
  return [x, y];
};

export const useAspirationalGraphData = () => {
  const dispatch = useDispatch();
  const [queryParameters] = useSearchParams();
  const id = queryParameters.get('id');
  const type = queryParameters.get('type');
  const [categoriesTop, setCategoriesTop] = useState([]);
  const [seriesDataTop, setSeriesDataTop] = useState([]);
  const [categoriesBottom, setCategoriesBottom] = useState([]);
  const [seriesDataBottom, setSeriesDataBottom] = useState([]);
  const [selectedTopSeries, setSelectedTopSeries] = useState("upri_t");
  const [selectedBottomSeries, setSelectedBottomSeries] = useState("upri_t");
  const { selectedState, selectedDistrict, selectedBlock } = useSelector(
      (state) => state.locationAdp
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    let filteredData = aspirationalData;

    if (selectedState && selectedState !== "State Wise") {
      filteredData = filteredData.filter(
        (item) => item.lgd_state_name === selectedState
      );
    }

    if (selectedDistrict && selectedDistrict !== "District Wise" && selectedDistrict !== "District") {
      filteredData = filteredData.filter(
        (item) => item.lgd_district_name === selectedDistrict
      );
    }

    if (selectedBlock && selectedBlock !== "Block Wise" && selectedBlock !== "Block") {
      filteredData = filteredData.filter(
        (item) => item.lgd_block_name === selectedBlock
      );
    }

    filteredData = filteredData.map((item) => ({
      ...item,
      Location: getLocationName(item, selectedState, selectedDistrict, selectedBlock),
    }));

    setData(filteredData);
  }, [selectedState, selectedDistrict, selectedBlock]);

  const compressedData = useMemo(() => {
    if (selectedState && selectedState !== "State Wise") {
      if (selectedDistrict && selectedDistrict !== "District Wise" && selectedDistrict !== "District") {
        return compressData(data, "lgd_block_name", selectedTopSeries, selectedBottomSeries);
      }
      return compressData(data, "lgd_district_name", selectedTopSeries, selectedBottomSeries);
    }
    return compressData(data, "lgd_state_name", selectedTopSeries, selectedBottomSeries);
  }, [data, selectedState, selectedDistrict, selectedBlock, selectedTopSeries, selectedBottomSeries]);

  useEffect(() => {
    const categoriesTop = compressedData[0].map((item) => item.Location);
    const seriesDataTop = [
      {
        name: selectedTopSeries === "upri_t" ? "Upper Primary to Secondary" : "Secondary to Higher Secondary",
        color: "#b0dbcd",
        data: compressedData[0].map((item) => item[selectedTopSeries]),
      },
    ];

    setCategoriesTop(categoriesTop);
    setSeriesDataTop(seriesDataTop);
  }, [compressedData, selectedTopSeries]);

  useEffect(() => {
    const categoriesBottom = compressedData[1].map((item) => item.Location);
    const seriesDataBottom = [
      {
        name: selectedBottomSeries === "upri_t" ? "Upper Primary to Secondary" : "Secondary to Higher Secondary",
        color: "#FFBCBC",
        data: compressedData[1].map((item) => item[selectedBottomSeries]),
      },
    ];

    setCategoriesBottom(categoriesBottom);
    setSeriesDataBottom(seriesDataBottom);
  }, [compressedData, selectedBottomSeries]);

  const handleTopSeriesChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedTopSeries(value === "Upper Primary to Secondary" ? "upri_t" : "sec_t");
  }, []);

  const handleBottomSeriesChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedBottomSeries(value === "Upper Primary to Secondary" ? "upri_t" : "sec_t");
  }, []);

  const [isStateTabEnabled, setIsStateTabEnabled] = useState(true);
  const [isDistrictTabEnabled, setIsDistrictTabEnabled] = useState(false);
  const [isBlockTabEnabled, setIsBlockTabEnabled] = useState(false);

  useEffect(() => {
    if (['State Wise'].includes(selectedState)) {
      setIsStateTabEnabled(true);
      setIsDistrictTabEnabled(false);
      setIsBlockTabEnabled(false);
    } else if (['District'].includes(selectedDistrict)) {
      setIsStateTabEnabled(false);
      setIsDistrictTabEnabled(true);
      setIsBlockTabEnabled(false);
    } else {
      setIsStateTabEnabled(false);
      setIsDistrictTabEnabled(false);
      setIsBlockTabEnabled(true);
    }
  }, [compressedData, selectedState, selectedDistrict, selectedBlock]);

  const tabTitles = {
    isStateTabEnabled: "States",
    isDistrictTabEnabled: "Districts",
    isBlockTabEnabled: "Blocks"
};

function getTabTitle() {
    if (isStateTabEnabled) {
        return tabTitles.isStateTabEnabled;
    } else if (isDistrictTabEnabled) {
        return tabTitles.isDistrictTabEnabled;
    } else if (isBlockTabEnabled) {
        return tabTitles.isBlockTabEnabled;
    }
    return "";
}
const titles = getTabTitle();
  return {
    categoriesTop,
    seriesDataTop,
    categoriesBottom,
    seriesDataBottom,
    handleTopSeriesChange,
    handleBottomSeriesChange,
    isStateTabEnabled,
    isDistrictTabEnabled,
    isBlockTabEnabled,
    titles
  };
};
