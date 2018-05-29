import RectInterface from "./RectInterface";
import { DEFAULT_COLOR } from "~/constants";
import { getMinProperty, getMaxProperty } from "~/utils";

export default class Group extends RectInterface {
	constructor(props) {
		super(props);
		this.objects = props.objects || [];
		this.type = "GROUP";
	}

	getMinOrMax(prop) {
		const possibleProps = ["minX", "minY", "maxX", "maxY"];
		if (possibleProps.indexOf(prop) === -1) return undefined;

		let func;
		let propFunc;
		let coordinates;

		if (prop.includes("min")) {
			func = Math.min;
			propFunc = getMinProperty;
		}

		if (prop.includes("max")) {
			func = Math.max;
			propFunc = getMaxProperty;
		}

		if (prop.includes("X")) {
			coordinates = ["startX", "endX"];
		}

		if (prop.includes("Y")) {
			coordinates = ["startY", "endY"];
		}

		return func(...coordinates.map(c => propFunc(this.objects, c)));
	}

	get minX() {
		return this.getMinOrMax("minX");
	}

	get minY() {
		return this.getMinOrMax("minY");
	}

	get maxX() {
		return this.getMinOrMax("maxX");
	}

	get maxY() {
		return this.getMinOrMax("maxY");
	}

	get color() {
		if (this.objects.length === 0) return DEFAULT_COLOR;
		return this.objects[0].color;

		// const clr = this.objects
		// 	.map(s => s.color)
		// 	.reduce((common, color) => (common === color ? common : undefined));

		// return clr || DEFAULT_COLOR;
	}

	set color(value) {
		if (!this.objects || !value) return;

		this.objects = this.objects.map(shape => {
			const s = shape.copy();
			s.color = value;
			return s;
		});
	}

	get startX() {
		return this.switchX ? this.maxX : this.minX;
	}

	get startY() {
		return this.switchY ? this.maxY : this.minY;
	}

	get endX() {
		return this.switchX ? this.minX : this.maxX;
	}

	get endY() {
		return this.switchY ? this.minY : this.maxY;
	}

	static getChangeCoordinateParams(coordinate) {
		let anchorName;
		let dimensionName;
		let points;
		let switchDimension;
		let anchorSign;

		/*
		if anchor value is bigger than coordinate value, anchorSign should be 1
		(e.g.
			if coordinate is startX
			and anchor is endX
			startX > endX => anchorSign = 1
		)

		if anchor value is smaller than coordinate value, anchorSign should be -1
		(e.g.
			if coordinate is endX
			and anchor is startX
			endX < startX => anchorSign = -1
		)
		*/

		if (coordinate === "startX") {
			anchorName = "endX";
			anchorSign = 1;
		}

		if (coordinate === "startY") {
			anchorName = "endY";
			anchorSign = 1;
		}

		if (coordinate === "endX") {
			anchorName = "startX";
			anchorSign = -1;
		}

		if (coordinate === "endY") {
			anchorName = "startY";
			anchorSign = -1;
		}

		if (coordinate.includes("X")) {
			dimensionName = "width";
			points = ["startX", "endX"];
			switchDimension = "switchX";
		}

		if (coordinate.includes("Y")) {
			dimensionName = "height";
			points = ["startY", "endY"];
			switchDimension = "switchY";
		}

		return {
			anchorName,
			dimensionName,
			points,
			switchDimension,
			anchorSign,
		};
	}

	changeCoordinate(coordinate, value) {
		if (!this.objects || !value) return;

		const possibleCoordinates = ["startX", "startY", "endX", "endY"];
		if (possibleCoordinates.indexOf(coordinate) === -1) return;

		const {
			anchorName,
			dimensionName,
			points,
			switchDimension,
			anchorSign,
		} = Group.getChangeCoordinateParams(coordinate);

		const anchor = this[anchorName];
		const oldFullDimension = this[dimensionName];
		const switchSign = this[switchDimension] ? -1 : 1;
		const newFullDimension = (anchor - value) * switchSign * anchorSign;

		if (!newFullDimension) return;

		this.objects = this.objects.map(shape => {
			const s = shape.copy();

			points.forEach(point => {
				// DFATP - distance from anchor to point
				const oldDFATP = anchor - s[point];
				const coef = oldDFATP / oldFullDimension;

				const newDFATP = newFullDimension * coef;
				const newPoint = anchor - newDFATP;
				s[point] = newPoint;
			});
			return s;
		});

		if (newFullDimension < 0) {
			this[switchDimension] = !this[switchDimension];
		}
	}

	set startX(newStartX) {
		this.changeCoordinate("startX", newStartX);
	}

	set startY(newStartY) {
		this.changeCoordinate("startY", newStartY);
	}

	set endX(newEndX) {
		this.changeCoordinate("endX", newEndX);
	}

	set endY(newEndY) {
		this.changeCoordinate("endY", newEndY);
	}

	/* eslint-disable class-methods-use-this*/
	set front(value) {
		// DO NOTHING
	}
	/* eslint-enable */

	get front() {
		return getMinProperty(this.objects, "front");
	}
}
