import { useMemo } from "react";

const useGroupedDataWithTotals = (arrGroupedData) => {
  const result = useMemo(() => {
    const groupedDataWithTotals = arrGroupedData.reduce((acc, curr) => {
      const {
        Location,
        "Higher Secondary": HigherSecondary = 0,
        Secondary = 0,
        Primary = 0,
        "Upper Primary": UpperPrimary = 0,

        Overall = 0,
        "categoriesHigher Secondary only/Jr College":
          categoriesHigherSecondaryonlyJrCollege = 0,
        "categoriesPr Up Pr and Secondary Only":
          categoriesPrUpPrandSecondaryOnly = 0,
        "categoriesPr with UpPr Sec and HSec":
          categoriesPrwithUpPrSecandHSec = 0,
        categoriesPrimary = 0,
        "categoriesPrimary with Upper Primary":
          categoriesPrimarywithUpperPrimary = 0,
        "categoriesSecondary Only": categoriesSecondaryOnly = 0,
        "categoriesSecondary with Higher Secondary":
          categoriesSecondarywithHigherSecondary = 0,
        "categoriesUp Pr Secondary and Higher Sec":
          categoriesUpPrSecondaryandHigherSec = 0,

        "categoriesUpper Pr and Secondary": categoriesUpperPrandSecondary = 0,
        "categoriesUpper Primary only": categoriesUpperPrimaryonly = 0,
      } = curr;

      if (!acc[Location]) {
        acc[Location] = {
          records: [],
          totals: {
            Location: ` ${Location}`,
            "School Management(Broad)": "Overall",
            "School Management(Detailed)": "Overall",
            "School Type": "Overall",

            Primary: 0,
            "Upper Primary": 0,
            "Higher Secondary": 0,
            Secondary: 0,
            Overall: 0,

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
            isTotalRow: true,
          },
        };
      }

      acc[Location].records.push(curr);

      acc[Location].totals.Primary += Primary;
      acc[Location].totals["Upper Primary"] += UpperPrimary;
      acc[Location].totals["Higher Secondary"] += HigherSecondary;
      acc[Location].totals.Secondary += Secondary;
      acc[Location].totals.Overall += Overall;
      acc[Location].totals["categoriesHigher Secondary only/Jr College"] +=
        categoriesHigherSecondaryonlyJrCollege;
      acc[Location].totals["categoriesPr Up Pr and Secondary Only"] +=
        categoriesPrUpPrandSecondaryOnly;
      acc[Location].totals["categoriesPr with UpPr Sec and HSec"] +=
        categoriesPrwithUpPrSecandHSec;
      acc[Location].totals.categoriesPrimary += categoriesPrimary;
      acc[Location].totals["categoriesPrimary with Upper Primary"] +=
        categoriesPrimarywithUpperPrimary;
      acc[Location].totals["categoriesSecondary Only"] +=
        categoriesSecondaryOnly;
      acc[Location].totals["categoriesSecondary with Higher Secondary"] +=
        categoriesSecondarywithHigherSecondary;
      acc[Location].totals["categoriesUp Pr Secondary and Higher Sec"] +=
        categoriesUpPrSecondaryandHigherSec;
      acc[Location].totals["categoriesUpper Pr and Secondary"] +=
        categoriesUpperPrandSecondary;
      acc[Location].totals["categoriesUpper Primary only"] +=
        categoriesUpperPrimaryonly;

      return acc;
    }, {});

    const finalResult = Object.values(groupedDataWithTotals).reduce(
      (finalArr, { records, totals }) => {
        return [...finalArr, ...records, totals];
      },
      []
    );

    return finalResult;
  }, [arrGroupedData]);

  return result;
};

export default useGroupedDataWithTotals;
