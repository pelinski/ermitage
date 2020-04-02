import React, { useState } from "react"
import { FormButton } from "../components/Buttons"
import { Field } from "../components/Form"
import { withRouter } from "react-router-dom";
import { doLogin, useUserSetter } from "../lib/auth.api"


export const LoginPage = withRouter(({ history }) => {
    const [data, setData] = useState({
        username: "",
        password: ""
    });


    const setUser = useUserSetter();

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
        doLogin(user).then((res) => {
            if (res.status != 200) {
                console.log(res.data.message)
                setError(res.data.message)
            }
            else {
                setUser(user);
                console.log(res.data.message);
                history.push("/");
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
                <FormButton type="submit" {...{ handleSubmit }}>
                    Login
                </FormButton>

            </form>

        </>)
});