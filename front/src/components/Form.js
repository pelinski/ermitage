import React from "react";

export const FieldNoLabel = ({ field, data, example = {}, type = "text", handleInputChange, color = "black" }) => (
  <div className="field">
    <input type={type} name={field} value={data[field]} placeholder={example[field]} onChange={handleInputChange} required style={{ borderColor: color }} />
  </div>
)
