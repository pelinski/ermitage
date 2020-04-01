import React, { useState } from "react"
import { FormButton } from "../components/Buttons"
import { Field } from "../components/Form";
import { doSignup } from "../lib/auth.api"
import { withRouter } from "react-router-dom";

export const SignupPage = withRouter(({ history }) => {
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

  const example = {
    username: "kunderart",
    password: "*******",
    email: "kunder@art.com"
  }

  const handleSubmit = () => {
    const user = { ...data };
    doSignup(user).then((res) => {
      if (res.status != 200) {
        console.log(res.data.message)
        setError(res.data.message)
      }
      else {
        console.log(res.data.message);
        history.push("/")
      }
    })

  };

  return (
    <>
      <h1>Эж</h1>
      <form onSubmit={e => {
        e.preventDefault();
        handleSubmit(data);
      }}>
        <Field field="username" {...{ example, data, handleInputChange }} />
        <Field field="password" type="password" {...{ example, data, handleInputChange }} />
        <Field field="email" type="email" {...{ example, data, handleInputChange }} />
        {error}
        <FormButton type="submit" {...{ handleSubmit }}>
          Sign up
         </FormButton>

      </form>

    </>)
});