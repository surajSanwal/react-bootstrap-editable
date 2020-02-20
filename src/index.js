import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "reactstrap";
import "./style.scss";

const Editable = ({
  text = "",
  type = "text",
  placeholder = "Empty",
  errorText = "**Required",
  paramName = "_data",
  extraPram = {},
  onSave = () => {},
  inlineButton = false,
  ...props
}) => {
  const [isEditing, setEditing] = useState(false);
  const [task, setTask] = useState(text);
  const [isError, setError] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
    if (inputRef && inputRef.current && isEditing) {
      inputRef.current.focus();
    }
  }, [inputRef, isEditing]);

  const saveEvent = useCallback(() => {
    text !== task && onSave({ paramName, task, ...extraPram });
    setEditing(false);
  }, [extraPram, onSave, paramName, task, text]);

  const handleKeyDown = useCallback(
    (event, type) => {
      const { key } = event;
      const keys = ["Escape", "Tab"];
      const enterKey = "Enter";
      const allKeys = [...keys, enterKey];
      if (
        (type === "textarea" && keys.indexOf(key) > -1) ||
        (type !== "textarea" && allKeys.indexOf(key) > -1)
      ) {
        saveEvent();
      }
    },
    [saveEvent]
  );

  const toggleInput = useCallback(() => {
    setEditing(!isEditing);
  }, [isEditing]);

  const clearInput = useCallback(() => {
    setTask("");
    toggleInput();
  }, [toggleInput]);

  return (
    <>
      {!isEditing ? (
        <div className="form-group" onClick={toggleInput}>
          <span>{task || placeholder || "Empty"}</span>
        </div>
      ) : (
        <div
          className={`form-group ${inlineButton ? "inlineButton" : ""}`}
          onKeyDown={(e) => isEditing && handleKeyDown(e, type)}
        >
          {type === "textarea" ? (
            <textarea
              name={paramName}
              className="form-control"
              placeholder={placeholder}
              value={task}
              onChange={(e) => {
                isError && setError();
                setTask(e.target.value);
              }}
            ></textarea>
          ) : (
            <input
              ref={inputRef}
              type={"text"}
              name={paramName}
              className="form-control"
              placeholder={placeholder}
              value={task}
              onChange={(e) => {
                isError && setError();
                setTask(e.target.value);
              }}
            />
          )}
          {isError && <span className="help-block">{errorText}</span>}
          <div className="editable-container">
            <Button
              className="editable-btn"
              color="success"
              onClick={() => {
                !task.length ? setError(true) : saveEvent();
              }}
            >
              <i className="fa fa-check" aria-hidden="true"></i>
            </Button>
            <Button
              className="editable-btn"
              color="danger"
              onClick={clearInput}
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Editable;
