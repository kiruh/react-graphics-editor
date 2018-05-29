// import Square from "~/models/Square";
// import Group from "~/models/Group";
// import Line from "~/models/Line";
// import Ellipse from "~/models/Ellipse";

import {
	SET_OBJECTS,
	SET_CURRENT_OBJECT_TYPE,
	SET_CURRENT_ACTION_TYPE,
	SET_COLOR,
	SET_SELECTED_OBJECT_IDS,
	SET_STROKE,
	SET_HISTORY,
	SET_FUTURE,
} from "~/actions/types";
import {
	DEFAULT_OBJECT,
	DEFAULT_ACTION,
	DEFAULT_COLOR,
	DEFAULT_STROKE,
} from "~/constants";

export const ONE_FIELD_SETTERS = {
	[SET_OBJECTS]: "objects",
	[SET_CURRENT_OBJECT_TYPE]: "currentObjectType",
	[SET_CURRENT_ACTION_TYPE]: "currentActionType",
	[SET_SELECTED_OBJECT_IDS]: "selectedObjectIds",
	[SET_COLOR]: "color",
	[SET_STROKE]: "stroke",
	[SET_HISTORY]: "history",
	[SET_FUTURE]: "future",
};

export const getInitialState = () => ({
	color: DEFAULT_COLOR,
	objects: [
		// new Line({
		// 	startX: 183.34375,
		// 	startY: 81,
		// 	endX: 184.34375,
		// 	endY: 314,
		// 	color: "black",
		// 	stroke: 3.5,
		// }),
		// new Line({
		// 	id: "0d4e0623-295f-486d-9a35-fb9eb34270f7",
		// 	startX: 42.671875,
		// 	startY: 26,
		// 	endX: 66.671875,
		// 	endY: 179,
		// 	color: "#cddc39",
		// 	stroke: 6,
		// }),
		// new Group({
		// 	id: "myid",
		// 	objects: [
		// 		new Group({
		// 			objects: [
		// 				new Square({
		// 					startX: 225.171875,
		// 					startY: 127,
		// 					endX: 404.171875,
		// 					endY: 257,
		// 					color: "blue",
		// 				}),
		// 				new Line({
		// 					startX: 85.171875,
		// 					startY: 26,
		// 					endX: 134.171875,
		// 					endY: 221,
		// 					color: "red",
		// 					stroke: 6,
		// 				}),
		// 			],
		// 		}),
		// 		new Square({
		// 			startX: 516.84375,
		// 			startY: 20,
		// 			endX: 661.84375,
		// 			endY: 386,
		// 			color: "yellow",
		// 		}),
		// 	],
		// }),
		// new Ellipse({
		// 	id: "34e3f00a-4560-4474-b7f2-9369af8d983c",
		// 	startX: 200,
		// 	startY: 200,
		// 	endX: 300,
		// 	endY: 300,
		// 	color: "red",
		// }),
	],
	currentObjectType: DEFAULT_OBJECT,
	currentActionType: DEFAULT_ACTION,
	selectedObjectIds: [],
	stroke: DEFAULT_STROKE,
	history: [],
	future: [],
});
