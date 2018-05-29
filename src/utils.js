import Line from "~/models/Line";
import Square from "~/models/Square";
import Ellipse from "~/models/Ellipse";
import Group from "~/models/Group";
import {
	LINE_ACTION,
	SQUARE_ACTION,
	MOVING_ACTION,
	ELLIPSE_ACTION,
} from "~/constants";

export const isMovingAction = action => action === MOVING_ACTION;

export const isDrawingAction = action =>
	action === LINE_ACTION ||
	action === SQUARE_ACTION ||
	action === ELLIPSE_ACTION;

export const isLineAction = action => action === LINE_ACTION;

const getMinOrMaxPropertyHelper = (arr, prop, type) => {
	/* IM FCKN GENIUS */
	if (!arr) return undefined;

	return arr.reduce((m, item) => {
		const value = item[prop];

		if (!m) return value;

		if (type === "min" && value < m) return value;
		if (type === "max" && value > m) return value;

		return m;
	}, undefined);
};

export const getMinProperty = (arr, prop) =>
	getMinOrMaxPropertyHelper(arr, prop, "min");

export const getMaxProperty = (arr, prop) =>
	getMinOrMaxPropertyHelper(arr, prop, "max");

export const parseJSONObjects = jsonObjects =>
	jsonObjects.map(o => {
		const type = o.type;
		let Class;
		switch (type) {
			case "LINE":
				Class = Line;
				break;
			case "SQUARE":
				Class = Square;
				break;
			case "ELLIPSE":
				Class = Ellipse;
				break;
			case "GROUP":
				Class = Group;
				break;
			default:
				break;
		}
		if (Class === Group) {
			const grouped = parseJSONObjects(o.objects);
			return new Class({ ...o, objects: grouped });
		}
		return new Class(o);
	});

export const parseSVGObjects = svgObjects =>
	svgObjects.map(tag => {
		const { tagName, dataset } = tag;
		const parsed = {
			...dataset,
			startX: Number(dataset.startX),
			startY: Number(dataset.startY),
			endX: Number(dataset.endX),
			endY: Number(dataset.endY),
			front: Number(dataset.front),
			stroke: Number(dataset.stroke),
		};
		let Class;
		switch (tagName) {
			case "line":
				Class = Line;
				break;
			case "rect":
				Class = Square;
				break;
			case "ellipse":
				Class = Ellipse;
				break;
			default:
				break;
		}
		return new Class(parsed);
	});
