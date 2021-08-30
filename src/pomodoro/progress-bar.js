import React from "react";

function ProgressBar({ session, focusDuration, breakDuration}) {
    const timePassed=(session.label==="Focusing" ? (((focusDuration*60 - session.timeRemaining)/(focusDuration*60))*100) : (((breakDuration*60 - session.timeRemaining)/(breakDuration*60))*100) );
    return (
      <div
        className="progress-bar progress-bar-striped"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={timePassed} 
        style={{ width: timePassed + "%" }} 
      />
  );
}

export default ProgressBar;