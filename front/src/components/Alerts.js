import React from "react";

export const DeleteAlert = ({ open, setOpen, handleRemove }) => {
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
          handleRemove({ element: open.alerts.remove })
          setOpen({ ...open, alerts: { showAlert: false, remove: "" } });
        }}>Yes</button>
        <button onClick={() => setOpen({ ...open, alerts: { showAlert: false, remove: "" } })}>Cancel</button>
      </div>
    </div>
  )
}