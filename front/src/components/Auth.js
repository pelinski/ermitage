import React, { useState } from "react"
import { FormButton } from "../components/Buttons"
import { FieldNoLabel } from "../components/Form"
import { withRouter } from "react-router-dom";
import { doLogin, doSignup, useUserSetter, colorSecurityPassword } from "../api/auth.api"


const example = {
  username: "username",
  password: "*******",
  email: "your@email.com"
}


export const Login = withRouter(({ history }) => {
  const [data, setData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");


  const setUser = useUserSetter();

  const handleInputChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    setData({ ...data, [name]: value });
  };



  const handleSubmit = () => {
    const user = { ...data };
    doLogin(user).then((res) => {
      if (res.status != 200) {
        console.log(res.data.message)
        setError(res.data.message)
      }
      else {
        setUser(user);
        console.log(res.data.message);
        history.push(`${user.username}/dashboard`);
      }
    })

  };



  return (

    <form onSubmit={e => {
      e.preventDefault();
      handleSubmit(data);
    }}>
      <FieldNoLabel field="username" {...{ example, data, handleInputChange }} />
      <FieldNoLabel field="password" type="password" {...{ example, data, handleInputChange }} />
      <p>{error}</p>
      <FormButton type="submit">
        <u>log in</u>
      </FormButton>

    </form>)
});





export const Signup = withRouter(({ history }) => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleInputChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    setData({ ...data, [name]: value });
  };
  const setUser = useUserSetter();


  const handleSubmit = () => {
    const user = { ...data };
    doSignup(user).then((res) => {
      if (res.status != 200) {
        console.log(res)
        console.log(res.data.message)
        setError(res.data.message)
      }
      else {
        setUser(user)
        console.log(res.data.message);
        history.push("/")
      }
    }).catch(e => console.log(e))

  };



  return (

    <form onSubmit={e => {
      e.preventDefault();
      handleSubmit(data);
    }}>
      <FieldNoLabel field="username" {...{ example, data, handleInputChange }} />
      <FieldNoLabel field="password" type="password" {...{ example, data, handleInputChange }} color={colorSecurityPassword(data)} />
      <FieldNoLabel field="email" type="email" {...{ example, data, handleInputChange }} />
      <p>{error}</p>
      <FormButton type="submit" >
        <u>join now</u>
      </FormButton>

    </form>
  )
});


