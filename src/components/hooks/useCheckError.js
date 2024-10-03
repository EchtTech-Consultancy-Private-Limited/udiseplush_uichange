import { error } from "../../utils/toaster";
function useCheckError (){
const handleSchoolAPIResopnse = (school_data)=>{
    if(school_data.data.errorDetails!==""){
        error(school_data.data.errorDetails?.message);
    }
}
return {handleSchoolAPIResopnse};
}

export default useCheckError;