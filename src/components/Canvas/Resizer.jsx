/* eslint-env browser */
import React from "react";
import PropTypes from "prop-types";

import Shape from "~/models/Shape";
import Line from "~/models/Line";
import Square from "~/models/Square";
import Group from "~/models/Group";
import Ellipse from "~/models/Ellipse";
import { SVG_ID } from "~/constants";

const RESIZER_COLOR = "#1976D2";

class Resizer extends React.Component {
	static get svgNode() {
		return document.getElementById(SVG_ID);
	}

	static get offsetX() {
		return Resizer.svgNode.getBoundingClientRect().x;
	}

	static get offsetY() {
		return Resizer.svgNode.getBoundingClientRect().y;
	}

	onCircleMouseDown(event) {
		this.resizing = true;

		document.onmousemove = e => {
			this.onCircleMouseMove(e);
		};
		document.onmouseup = () => {
			this.onMouseUp();
		};

		event.stopPropagation();
	}

	onCircleMouseMove(event) {
		if (!this.resizing) return;

		const x = event.clientX - Resizer.offsetX;
		const y = event.clientY - Resizer.offsetY;

		const object = this.props.object.copy();
		object.movePoint(this.paramX, this.paramY, x, y, event.shiftKey);

		this.props.onChange(object);
	}

	onMouseUp() {
		if (!this.resizing || !this.props.object) return;

		this.props.onMouseUp();
		this.resizing = false;
	}

	onRectLineMouseDown(event) {
		this.resizing = true;

		document.onmousemove = e => {
			this.onRectLineMouseMove(e);
		};
		document.onmouseup = () => {
			this.onMouseUp();
		};

		event.stopPropagation();
	}

	onRectLineMouseMove(event) {
		if (!this.resizing) return;

		let value;
		if (this.param.includes("X")) value = event.clientX - Resizer.offsetX;
		if (this.param.includes("Y")) value = event.clientY - Resizer.offsetY;

		const object = this.props.object.copy();
		object.moveCoordinate(this.param, value, event.shiftKey);

		this.props.onChange(object);
	}

	renderLineResizer() {
		return (
			<React.Fragment>
				{this.renderCircle("startX", "startY")}
				{this.renderCircle("endX", "endY")}
			</React.Fragment>
		);
	}

	renderCircle(paramX, paramY) {
		const object = this.props.object;
		const cursor = object.getResizer(paramX, paramY);

		return (
			<React.Fragment>
				<circle
					cx={object[paramX]}
					cy={object[paramY]}
					r="5"
					fill={RESIZER_COLOR}
					onMouseDown={event => {
						this.paramX = paramX;
						this.paramY = paramY;
						this.onCircleMouseDown(event);
					}}
					cursor={cursor}
				/>
			</React.Fragment>
		);
	}

	renderRectLine(coordinate) {
		const object = this.props.object;
		let x1;
		let x2;
		let y1;
		let y2;
		let comparer;
		let cursor;

		if (coordinate === "startX") {
			x1 = "startX";
			x2 = "startX";
			y1 = "startY";
			y2 = "endY";
			comparer = "endX";
			cursor = "col-resize";
		}

		if (coordinate === "startY") {
			x1 = "startX";
			x2 = "endX";
			y1 = "startY";
			y2 = "startY";
			comparer = "endY";
			cursor = "row-resize";
		}

		if (coordinate === "endX") {
			x1 = "endX";
			x2 = "endX";
			y1 = "startY";
			y2 = "endY";
			comparer = "startX";
			cursor = "col-resize";
		}

		if (coordinate === "endY") {
			x1 = "startX";
			x2 = "endX";
			y1 = "endY";
			y2 = "endY";
			comparer = "startY";
			cursor = "row-resize";
		}

		let vX1 = object[x1];
		let vX2 = object[x2];
		let vY1 = object[y1];
		let vY2 = object[y2];

		let offset = 1;

		if (object[coordinate] < object[comparer]) {
			offset *= -1;
		}

		if (coordinate.includes("X")) {
			vX1 += offset;
			vX2 += offset;
		} else {
			vY1 += offset;
			vY2 += offset;
		}

		return (
			<line
				x1={vX1}
				x2={vX2}
				y1={vY1}
				y2={vY2}
				stroke={RESIZER_COLOR}
				strokeWidth={"3px"}
				cursor={cursor || "move"}
				onMouseDown={event => {
					this.param = coordinate;
					this.onRectLineMouseDown(event);
				}}
			/>
		);
	}

	renderRectResizer() {
		return (
			<React.Fragment>
				{this.renderRectLine("startX")}
				{this.renderRectLine("startY")}
				{this.renderRectLine("endX")}
				{this.renderRectLine("endY")}
				{this.renderCircle("startX", "startY")}
				{this.renderCircle("endX", "endY")}
				{this.renderCircle("endX", "startY")}
				{this.renderCircle("startX", "endY")}
			</React.Fragment>
		);
	}

	render() {
		const { object } = this.props;

		if (object instanceof Line) return this.renderLineResizer();

		if (object instanceof Square) return this.renderRectResizer();
		if (object instanceof Group) return this.renderRectResizer();
		if (object instanceof Ellipse) return this.renderRectResizer();

		return null;
	}
}

Resizer.propTypes = {
	object: PropTypes.instanceOf(Shape).isRequired,
	onChange: PropTypes.func.isRequired,
	onMouseUp: PropTypes.func.isRequired,
};

export default Resizer;
