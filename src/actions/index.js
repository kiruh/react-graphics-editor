import {
	SET_OBJECTS,
	SET_CURRENT_OBJECT_TYPE,
	SET_CURRENT_ACTION_TYPE,
	SET_COLOR,
	SET_SELECTED_OBJECT_IDS,
	SET_STROKE,
	SET_HISTORY,
	SET_FUTURE,
} from "./types";

export const oneFieldDispatch = (type, payload) => async dispatch => {
	await dispatch({
		type,
		payload,
	});
};

export const setObjects = payload => oneFieldDispatch(SET_OBJECTS, payload);

export const setCurrentObjectType = payload =>
	oneFieldDispatch(SET_CURRENT_OBJECT_TYPE, payload);

export const setCurrentActionType = payload =>
	oneFieldDispatch(SET_CURRENT_ACTION_TYPE, payload);

export const setColor = payload => oneFieldDispatch(SET_COLOR, payload);

export const setStroke = payload => oneFieldDispatch(SET_STROKE, payload);

export const setSelectedObjectIds = payload =>
	oneFieldDispatch(SET_SELECTED_OBJECT_IDS, payload);

export const setHistory = payload => oneFieldDispatch(SET_HISTORY, payload);

export const setFuture = payload => oneFieldDispatch(SET_FUTURE, payload);
