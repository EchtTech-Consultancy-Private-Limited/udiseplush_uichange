// utils/handleMissingData.js
export const handleMissingData = (data, columns) => {
    return data.map(row => {
      const updatedRow = { ...row };
      columns.forEach(col => {
        if (updatedRow[col.field] === null || updatedRow[col.field] === undefined) {
          updatedRow[col.field] = 0;
        }
      });
      return updatedRow;
    });
  };
  