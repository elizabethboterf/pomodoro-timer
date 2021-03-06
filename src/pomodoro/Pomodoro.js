import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import {minutesToDuration} from "../utils/duration";
import SessionStarted from "./session-started.js";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}



/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.
  const initialFocus=(25);
  const initialBreak=(5);
  
  const [focusDuration, setFocusDuration] = useState(initialFocus);
  const [breakDuration, setBreakDuration] = useState(initialBreak);
  
  const handleMinusFocus=()=>setFocusDuration((currentDuration)=>(Math.max(5, currentDuration-5)));
  const handleMinusBreak=()=>setBreakDuration((currentDuration)=>(Math.max(1, currentDuration-1)));
  const handlePlusFocus=()=>setFocusDuration((currentDuration)=>(Math.min(60, currentDuration+5)));
  const handlePlusBreak=()=>setBreakDuration((currentDuration)=>(Math.min(15, currentDuration+1)));

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }
  
  function handleStop(){
    
      setIsTimerRunning((currentState) => false);
      setSession(null);
      if(session){
        setFocusDuration(initialFocus);
        setBreakDuration(initialBreak);
      }
  }


  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session *********************************/}
              <button
                type="button"
                className="plusMinus btn btn-secondary"
                data-testid="decrease-focus"
                //value="decrease-focus"
                onClick={handleMinusFocus}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session ***************************/}
              <button
                type="button"
                className="plusMinus btn btn-secondary"
                data-testid="increase-focus"
                //value="increase-focus"
                onClick={handlePlusFocus}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session******************************/}
                <button
                  type="button"
                  className="plusMinus btn btn-secondary"
                  data-testid="decrease-break"
                  //value="decrease-break"
                  onClick={handleMinusBreak}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session***************************/}
                <button
                  type="button"
                  className="plusMinus btn btn-secondary"
                  data-testid="increase-break"
                  id="increase-break"
                  onClick={handlePlusBreak}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session ****************************************/}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={handleStop}
              //disabled={!isTimerRunning}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div>
        <SessionStarted isTimerRunning={isTimerRunning} session={session} focusDuration={focusDuration} breakDuration={breakDuration} />
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused *********************************/}
       </div>
   </div>
  );
}

export default Pomodoro;
