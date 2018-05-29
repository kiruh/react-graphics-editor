import _ from "lodash";
import uuid from "uuid/v4";

export default class Shape {
	constructor(props = {}) {
		this.id = props.id || uuid();
		this.startX = props.startX;
		this.startY = props.startY;
		this.endX = props.endX;
		this.endY = props.endY;
		this.color = props.color;

		this.front = props.front || new Date().getTime();
	}

	getResizer(paramX, paramY) {
		const isMinX = ["startX", "endX"].every(
			coordinate => this[paramX] <= this[coordinate],
		);
		const isMinY = ["startY", "endY"].every(
			coordinate => this[paramY] <= this[coordinate],
		);
		if (isMinX && isMinY) return "nw-resize";
		if (isMinX && !isMinY) return "sw-resize";
		if (!isMinX && isMinY) return "ne-resize";
		if (!isMinX && !isMinY) return "se-resize";

		return "col-resize";
	}

	moveToFront() {
		if (this.objects) {
			this.objects.forEach(o => {
				o.moveToFront();
			});
			return;
		}
		this.front = new Date().getTime();
	}

	moveToBack(smallest) {
		if (this.objects) {
			this.objects.forEach((o, index) => {
				o.moveToBack(smallest - index - 1);
			});
			return;
		}
		this.front = smallest - 1;
	}

	isValid() {
		return this.startX && this.startY && this.endX && this.endY;
	}

	copy() {
		return _.cloneDeep(this);
	}

	move(diffX, diffY) {
		this.startX += diffX;
		this.startY += diffY;
		this.endX += diffX;
		this.endY += diffY;
	}
}
