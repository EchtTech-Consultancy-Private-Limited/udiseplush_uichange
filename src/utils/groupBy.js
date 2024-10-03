const groupByKey = (arr, keys) => {
    if (Array.isArray(arr)) {
      return arr.reduce((acc, obj) => {
        const key = keys.map(k => obj[k]).join('@');
        acc[key] = acc[key] || [];
        acc[key].push(obj);
        return acc;
      }, {});
    }
  }
  


  
export default groupByKey;

