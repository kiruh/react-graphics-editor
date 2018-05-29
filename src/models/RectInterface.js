/* eslint-disable no-mixed-operators */
import Shape from "./Shape";

export default class RectInterface extends Shape {
	get xDiff() {
		return this.endX - this.startX;
	}

	get yDiff() {
		return this.endY - this.startY;
	}

	get x() {
		return this.xDiff > 0 ? this.startX : this.startX + this.xDiff;
	}

	get y() {
		return this.yDiff > 0 ? this.startY : this.startY + this.yDiff;
	}

	get width() {
		return Math.abs(this.xDiff);
	}

	get height() {
		return Math.abs(this.yDiff);
	}

	get halfWidth() {
		return this.width / 2;
	}

	get halfHeight() {
		return this.height / 2;
	}

	get centerX() {
		return this.x + this.halfWidth;
	}

	get centerY() {
		return this.y + this.halfHeight;
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

		const horizontalDiff = Math.abs(this[anchorX] - valueX);
		const verticalDiff = Math.abs(this[anchorY] - valueY);

		if (horizontalDiff > verticalDiff) {
			this[paramX] = valueX;
			const dirCondition =
				(this.xDiff > 0 !== this.yDiff < 0) !== (paramY === "startY");
			const direction = dirCondition ? 1 : -1;
			this[paramY] = this[anchorY] + direction * this.xDiff;
			return;
		}

		this[paramY] = valueY;
		const dirCondition =
			(this.yDiff > 0 !== this.xDiff < 0) !== (paramX === "startX");
		const direction = dirCondition ? 1 : -1;
		this[paramX] = this[anchorX] + direction * this.yDiff;
	}

	moveCoordinate(param, value, adjust = false) {
		if (!adjust) {
			this[param] = value;
			return;
		}

		let anchor;
		let diff;

		if (param === "startX") anchor = "endX";
		if (param === "endX") anchor = "startX";
		if (param === "startY") anchor = "endY";
		if (param === "endY") anchor = "startY";

		if (param.includes("Y")) diff = "xDiff";
		if (param.includes("X")) diff = "yDiff";

		const diff1 = this[anchor] + this[diff] - value;
		const diff2 = this[anchor] - this[diff] - value;

		let coef = 1;

		if (Math.abs(diff1) > Math.abs(diff2)) {
			coef *= -1;
		}

		this[param] = this[anchor] + coef * this[diff];
	}
}
