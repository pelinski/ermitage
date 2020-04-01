import React, { useState } from "react"
import { FormButton } from "../components/Buttons"
import { Field } from "../components/Form"
import { withRouter } from "react-router-dom";
import {doLogin} from "../lib/auth.api"


export const LoginPage = withRouter(({ history }) => {
    const [data, setData] = useState({
        username: "",
        password: ""
    });

    const handleInputChange = e => {
        const value = e.target.value;
        const name = e.target.name;
        console.log({ ...data, [name]: value });
        setData({ ...data, [name]: value });
    };

    const example = {
        username: "kunderart",
        password: "*******",
        email: "kunder@art.com"
    }

    const handleSubmit = () => {

        const user = { ...data };
        console.log(user)
        try {
            doLogin(user).then(res => { console.log(res); history.push("/") })
        }
        catch{
            (e) => { setError(e.message); console.log(e.message) }
        };
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