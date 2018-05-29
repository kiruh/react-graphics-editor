/* eslint-disable no-mixed-operators */
import Shape from "./Shape";

const TAN22_5 = Math.tan(0.3926991);
const TAN67_5 = Math.tan(1.178097);
const TAN112_5 = Math.tan(1.9634954);
const TAN157_5 = Math.tan(2.7488936);

const PERPENDICULAR_DICT = {
	vertical: "horizontal",
	horizontal: "vertical",
	diagonalOne: "diagonalTwo",
	diagonalTwo: "diagonalOne",
	halfOne: "halfThree",
	halfTwo: "halfFour",
	halfThree: "halfOne",
	halfFour: "halfTwo",
};

export default class Line extends Shape {
	constructor(props) {
		super(props);
		this.stroke = props.stroke;
		this.type = "LINE";
	}

	static getStraights(x, y) {
		return {
			vertical: {
				A: 1,
				B: 0,
				C: -x,
			},
			horizontal: {
				A: 0,
				B: 1,
				C: -y,
			},
			diagonalOne: {
				A: -1,
				B: 1,
				C: x - y,
			},
			diagonalTwo: {
				A: 1,
				B: 1,
				C: -x - y,
			},
			halfOne: {
				A: -TAN22_5,
				B: 1,
				C: TAN22_5 * x - y,
			},
			halfTwo: {
				A: -TAN67_5,
				B: 1,
				C: TAN67_5 * x - y,
			},
			halfThree: {
				A: -TAN112_5,
				B: 1,
				C: TAN112_5 * x - y,
			},
			halfFour: {
				A: -TAN157_5,
				B: 1,
				C: TAN157_5 * x - y,
			},
		};
	}

	static findCrossPoint(lineOne, lineTwo) {
		const delta = lineOne.A * lineTwo.B - lineOne.B * lineTwo.A;
		const deltaX = -1 * lineOne.C * lineTwo.B - lineOne.B * -1 * lineTwo.C;
		const deltaY = lineOne.A * -1 * lineTwo.C - -1 * lineOne.C * lineTwo.A;

		const x = deltaX / delta;
		const y = deltaY / delta;

		return { x, y };
	}

	static findNerestLineToPoint(x, y, lines) {
		return Object.entries(lines).reduce((minPair, [lineName, line]) => {
			const { A, B, C } = line;

			const distance =
				Math.abs(A * x + B * y + C) / Math.sqrt(A ** 2 + B ** 2);

			const pair = { lineName, distance };

			if (!minPair) return pair;

			return minPair.distance > pair.distance ? pair : minPair;
		}, null).lineName;
	}

	setEndPoint(endX, endY, adjust = false) {
		this.movePoint("endX", "endY", endX, endY, adjust);
	}

	movePoint(paramX, paramY, valueX, valueY, adjust = false) {
		if (!adjust) {
			this[paramX] = valueX;
			this[paramY] = valueY;
			return;
		}

		const anchorX = paramX === "startX" ? "endX" : "startX";
		const anchorY = paramY === "startY" ? "endY" : "startY";

		const straights = Line.getStraights(this[anchorX], this[anchorY]);
		const nearest = Line.findNerestLineToPoint(valueX, valueY, straights);

		const perpendiculars = Line.getStraights(valueX, valueY);
		const perpendicularToNearest = PERPENDICULAR_DICT[nearest];

		const lineOne = straights[nearest];
		const lineTwo = perpendiculars[perpendicularToNearest];

		const { x, y } = Line.findCrossPoint(lineOne, lineTwo);

		this[paramX] = x;
		this[paramY] = y;
	}
}
