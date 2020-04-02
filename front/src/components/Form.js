import React from "react";
import styled from "styled-components";




export const Field = ({ field, data, example = {}, type = "text", handleInputChange, color = "black" }) => (
  <div className="field">
    <label htmlFor={field}>{field}</label>
    <input type={type} name={field} value={data[field]} placeholder={example[field]} onChange={handleInputChange} required style={{ borderColor: color }} />
  </div>
)
