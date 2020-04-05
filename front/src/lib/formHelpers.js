import _ from "lodash";

export const  handleInputChange = (e,data,setData) => {
    const value = e.target.value;
    const name = e.target.name;
    setData({ ...data, [name]: value });
  };


export const handlePost = ({fields,data,apiFunction,setError,setChanges}) => {
  const postObj = _.pick({ ...data }, fields);
  apiFunction(postObj).then((res) => {
    if (res.status != 200) {
      console.log(res.data.message)
      setError(res.data.message)
    }
    else {
      console.log(res.data.message);
    }
    setChanges(true)
  }).catch(e => console.log(e))


};