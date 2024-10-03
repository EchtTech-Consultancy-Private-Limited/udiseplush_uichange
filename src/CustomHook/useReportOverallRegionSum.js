import { useMemo } from "react";

const useGroupedDataWithTotals = (arrGroupedDataTable) => {
  const result = useMemo(() => {
    const groupedDataWithTotals = arrGroupedDataTable.reduce((acc, curr) => {
      const {
        regionName,
        "Higher Secondary": HigherSecondary = 0,
        Secondary = 0,
        Primary = 0,
        "Upper Primary": UpperPrimary = 0,

        Overall = 0,
        total = 0,
        "categoriesHigher Secondary only/Jr College":
          categoriesHigherSecondaryonlyJrCollege = 0,
        "categoriesPr Up Pr and Secondary Only":
          categoriesPrUpPrandSecondaryOnly = 0,
        "categoriesPr with UpPr Sec and HSec":
          categoriesPrwithUpPrSecandHSec = 0,
        categoriesPrimary: categoriesPrimary = 0,
        "categoriesPrimary with Upper Primary":
          categoriesPrimarywithUpperPrimary = 0,
        "categoriesSecondary Only": categoriesSecondaryOnly = 0,
        "categoriesSecondary with Higher Secondary":
          categoriesSecondarywithHigherSecondary = 0,
        "categoriesUp Pr Secondary and Higher Sec":
          categoriesUpPrSecondaryandHigherSec = 0,

        "categoriesUpper Pr and Secondary": categoriesUpperPrandSecondary = 0,
        "categoriesUpper Primary only": categoriesUpperPrimaryonly = 0,
        totTchFSocCatCd1 = 0,
        totTchMSocCatCd1 = 0,
        totTchFSocCatCd4 = 0,
        totTchMSocCatCd4 = 0,
        totTchFSocCatCd2 = 0,
        totTchMSocCatCd2 = 0,
        totTchFSocCatCd3 = 0,
        totTchMSocCatCd3 = 0,

        totSchElectricity = 0,

        totSch = 0,
        totSchFuncElectricity = 0,
        totSchSeprateRoomHm = 0,
        totSchLandAvail = 0,
        totSchSolarPanel = 0,
        totSchPlayground = 0,
        totSchLibrary = 0,
        totSchLibrarian = 0,
        totSchNewspaper = 0,
        totSchKitchenGarden = 0,
        totSchFurniture = 0,
        totSchBoysToilet = 0,
        totSchFuncBoysToilet = 0,
        totSchGirlsToilet = 0,
        totSchFuncGirlsToilet = 0,
        schHaveToilet = 0,
        totSchFuncBoysUrinal = 0,
        schHaveFuncUrinals = 0,
        totSchFuncGirlsUrinal = 0,
        totSchDrinkingWater = 0,
        totSchFuncWaterPurifier = 0,
        totSchWaterPurifier = 0,
        totSchRainWaterHarvesting = 0,
        totSchWaterTested = 0,
        totSchIncinerator = 0,
        totSchHandwashMeals = 0,
        totSchRamps = 0,
        totSchHandRails = 0,
        totSchMedicalCheckup = 0,
        schHaveCompleteMedicalCheckup = 0,
        totSchInternet = 0,
        totSchCompAvail = 0,
        totSchHandwashToilet = 0,
      } = curr;

      if (!acc[regionName]) {
        acc[regionName] = {
          records: [],

          totals: {
            regionName: ` ${regionName}`,
            "School Management(Broad)": "Overall",
            "School Management(Detailed)": "Overall",
            schManagementBroad: "Overall",
            schManagementDesc: "Overall",
            schCategoryBroad: "Overall",
            schCategoryDesc: "Overall ",
            schLocationDesc: "Overall ",
            schTypeDesc: "Overall",
            Primary: 0,
            "Upper Primary": 0,
            "Higher Secondary": 0,
            Secondary: 0,
            Overall: 0,
            total: 0,

            "categoriesHigher Secondary only/Jr College": 0,
            "categoriesPr Up Pr and Secondary Only": 0,
            "categoriesPr with UpPr Sec and HSec": 0,
            categoriesPrimary: 0,
            "categoriesPrimary with Upper Primary": 0,
            "categoriesSecondary Only": 0,
            "categoriesSecondary with Higher Secondary": 0,
            "categoriesUp Pr Secondary and Higher Sec": 0,
            "categoriesUpper Pr and Secondary": 0,
            "categoriesUpper Primary only": 0,
            totTchFSocCatCd1: 0,
            totTchMSocCatCd1: 0,
            totTchFSocCatCd4: 0,
            totTchMSocCatCd4: 0,
            totTchFSocCatCd2: 0,
            totTchMSocCatCd2: 0,
            totTchFSocCatCd3: 0,
            totTchMSocCatCd3: 0,

            totSchElectricity: 0,

            totSch: 0,
            totSchFuncElectricity: 0,
            totSchSeprateRoomHm: 0,
            totSchLandAvail: 0,
            totSchSolarPanel: 0,
            totSchPlayground: 0,
            totSchLibrary: 0,
            totSchLibrarian: 0,
            totSchNewspaper: 0,
            totSchKitchenGarden: 0,
            totSchFurniture: 0,
            totSchBoysToilet: 0,
            totSchFuncBoysToilet: 0,
            totSchGirlsToilet: 0,
            totSchFuncGirlsToilet: 0,
            schHaveToilet: 0,
            totSchFuncBoysUrinal: 0,
            schHaveFuncUrinals: 0,
            totSchFuncGirlsUrinal: 0,
            totSchDrinkingWater: 0,
            totSchFuncWaterPurifier: 0,
            totSchWaterPurifier: 0,
            totSchRainWaterHarvesting: 0,
            totSchWaterTested: 0,
            totSchIncinerator: 0,
            totSchHandwashMeals: 0,
            totSchRamps: 0,
            totSchHandRails: 0,
            totSchMedicalCheckup: 0,
            schHaveCompleteMedicalCheckup: 0,
            totSchInternet: 0,
            totSchCompAvail: 0,

            totSchHandwashToilet: 0,
            isTotalRow: true,
          },
        };
      }

      acc[regionName].records.push(curr);

      acc[regionName].totals.Primary += Primary;
      acc[regionName].totals["Upper Primary"] += UpperPrimary;

      acc[regionName].totals["Higher Secondary"] += HigherSecondary;
      acc[regionName].totals.Secondary += Secondary;
      acc[regionName].totals.Overall += Overall;
      acc[regionName].totals.total += total;

      acc[regionName].totals["categoriesHigher Secondary only/Jr College"] +=
        categoriesHigherSecondaryonlyJrCollege;
      acc[regionName].totals["categoriesPr Up Pr and Secondary Only"] +=
        categoriesPrUpPrandSecondaryOnly;
      acc[regionName].totals["categoriesPr with UpPr Sec and HSec"] +=
        categoriesPrwithUpPrSecandHSec;
      acc[regionName].totals["categoriesPrimary"] += categoriesPrimary;
      acc[regionName].totals["categoriesPrimary with Upper Primary"] +=
        categoriesPrimarywithUpperPrimary;
      acc[regionName].totals["categoriesSecondary Only"] +=
        categoriesSecondaryOnly;

      acc[regionName].totals["categoriesSecondary with Higher Secondary"] +=
        categoriesSecondarywithHigherSecondary;
      acc[regionName].totals["categoriesUp Pr Secondary and Higher Sec"] +=
        categoriesUpPrSecondaryandHigherSec;
      acc[regionName].totals["categoriesUpper Pr and Secondary"] +=
        categoriesUpperPrandSecondary;
      acc[regionName].totals["categoriesUpper Primary only"] +=
        categoriesUpperPrimaryonly;

      acc[regionName].totals.totTchFSocCatCd1 += totTchFSocCatCd1;
      acc[regionName].totals.totTchMSocCatCd1 += totTchMSocCatCd1;
      acc[regionName].totals.totTchFSocCatCd4 += totTchFSocCatCd4;
      acc[regionName].totals.totTchMSocCatCd4 += totTchMSocCatCd4;
      acc[regionName].totals.totTchFSocCatCd2 += totTchFSocCatCd2;
      acc[regionName].totals.totTchMSocCatCd2 += totTchMSocCatCd2;

      acc[regionName].totals.totTchFSocCatCd3 += totTchFSocCatCd3;
      acc[regionName].totals.totTchMSocCatCd3 += totTchMSocCatCd3;

      acc[regionName].totals.totSchElectricity += totSchElectricity;

      acc[regionName].totals.totSch += totSch;
      acc[regionName].totals.totSchFuncElectricity += totSchFuncElectricity;
      acc[regionName].totals.totSchSeprateRoomHm += totSchSeprateRoomHm;
      acc[regionName].totals.totSchLandAvail += totSchLandAvail;
      acc[regionName].totals.totSchSolarPanel += totSchSolarPanel;
      acc[regionName].totals.totSchPlayground += totSchPlayground;
      acc[regionName].totals.totSchLibrary += totSchLibrary;
      acc[regionName].totals.totSchLibrarian += totSchLibrarian;
      acc[regionName].totals.totSchNewspaper += totSchNewspaper;
      acc[regionName].totals.totSchKitchenGarden += totSchKitchenGarden;
      acc[regionName].totals.totSchFurniture += totSchFurniture;
      acc[regionName].totals.totSchBoysToilet += totSchBoysToilet;
      acc[regionName].totals.totSchFuncBoysToilet += totSchFuncBoysToilet;
      acc[regionName].totals.totSchGirlsToilet += totSchGirlsToilet;
      acc[regionName].totals.totSchFuncGirlsToilet += totSchFuncGirlsToilet;
      acc[regionName].totals.schHaveToilet += schHaveToilet;
      acc[regionName].totals.totSchFuncBoysUrinal += totSchFuncBoysUrinal;
      acc[regionName].totals.schHaveFuncUrinals += schHaveFuncUrinals;
      acc[regionName].totals.totSchFuncGirlsUrinal += totSchFuncGirlsUrinal;
      acc[regionName].totals.totSchDrinkingWater += totSchDrinkingWater;
      acc[regionName].totals.totSchFuncWaterPurifier += totSchFuncWaterPurifier;
      acc[regionName].totals.totSchWaterPurifier += totSchWaterPurifier;
      acc[regionName].totals.totSchRainWaterHarvesting +=
        totSchRainWaterHarvesting;
      acc[regionName].totals.totSchWaterTested += totSchWaterTested;
      acc[regionName].totals.totSchIncinerator += totSchIncinerator;
      acc[regionName].totals.totSchHandwashMeals += totSchHandwashMeals;
      acc[regionName].totals.totSchRamps += totSchRamps;
      acc[regionName].totals.totSchHandRails += totSchHandRails;
      acc[regionName].totals.totSchMedicalCheckup += totSchMedicalCheckup;
      acc[regionName].totals.schHaveCompleteMedicalCheckup +=
        schHaveCompleteMedicalCheckup;
      acc[regionName].totals.totSchInternet += totSchInternet;
      acc[regionName].totals.totSchCompAvail += totSchCompAvail;
      acc[regionName].totals.totSchHandwashToilet += totSchHandwashToilet;

      return acc;
    }, {});

    const finalResult = Object.values(groupedDataWithTotals).reduce(
      (finalArr, { records, totals }) => {
        return [...finalArr, ...records, totals];
      },
      []
    );
    return finalResult;
  }, [arrGroupedDataTable]);

  return result;
};

export default useGroupedDataWithTotals;
