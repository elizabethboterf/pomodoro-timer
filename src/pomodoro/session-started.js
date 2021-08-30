import React from "react";
import ProgressBar from "./progress-bar.js"
import {minutesToDuration, secondsToDuration} from "../utils/duration";

function SessionStarted( {isTimerRunning, session, focusDuration, breakDuration} ){
    if(isTimerRunning || (!isTimerRunning && session)){
        return(<div>
            <div className="row mb-2">
            <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) total duration ***********/}
            <h2 data-testid="session-title">
                {session.label} for {session.label=="Focusing" ? (minutesToDuration(focusDuration)) : (minutesToDuration(breakDuration))} minutes
            </h2>
            {/* TODO: Update message below correctly format the time remaining in the current session ************/}
            <p className="lead" data-testid="session-sub-title">
                {secondsToDuration(session.timeRemaining)} remaining
            </p>
            </div>
        </div>
        <div className="row mb-2">
            <div className="col">
            <div className="progress" style={{ height: "20px" }}>
                <ProgressBar session={session} focusDuration={focusDuration} breakDuration={breakDuration} />
            </div>
            </div>
        </div>
        </div>
    );
    }
    return null;
}

export default SessionStarted;