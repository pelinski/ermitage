import React from "react";

export const DeleteAlert = ({ alerts, setAlerts, handleRemove }) => {
  return (
    <div className="delete-alert">
      <div>
        <p>
          Are you sure you want to delete this element? <br />
    You cannot undo this.
  </p>
      </div>
      <div>
        <button onClick={() => {
          handleRemove({ element: alerts.remove })
          setAlerts({ ...alerts, showAlert: false, remove: "" });
        }}>Yes</button>
        <button onClick={() => setAlerts({ ...alerts, showAlert: false, remove: "" })}>Cancel</button>
      </div>
    </div>
  )
}