/* eslint-env browser */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Shape from "~/models/Shape";
import Line from "~/models/Line";
import Square from "~/models/Square";
import Group from "~/models/Group";
import Ellipse from "~/models/Ellipse";
import Resizer from "./Resizer";
import MoveSelected from "./MoveSelected";
import { changeObjectParams, selectObject } from "~/actions/controller";

class ObjectDrawing extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.getInitialState();
	}

	getInitialState() {
		return {
			focused: false,
			object: null,
		};
	}

	onMouseDown(event) {
		const ids = selectObject(this.props.object.id, event.ctrlKey);
		if (!ids.includes(this.props.object.id)) return;

		if (ids.length > 1) {
			MoveSelected.move(event);
			return;
		}

		this.dragged = true;
		this.startPoint = {
			x: event.clientX,
			y: event.clientY,
		};
		document.onmousemove = e => {
			this.onMouseMove(e);
		};
		document.onmouseup = () => {
			this.onMouseUp();
		};
	}

	onMouseMove(event) {
		if (!this.dragged) return;

		const object = this.props.object.copy();
		const diffX = event.clientX - this.startPoint.x;
		const diffY = event.clientY - this.startPoint.y;

		object.move(diffX, diffY);
		this.setState({ object });
	}

	onMouseUp() {
		if (!this.dragged) return;

		if (this.state.object) {
			this.changeObjectParams();
		}

		document.onmousemove = null;
		document.onmouseup = null;
		this.dragged = false;
	}

	setInFocus(focused) {
		this.setState({ focused });
	}

	getMoveableProps() {
		return {
			cursor: "move",
			onMouseOver: () => {
				this.setInFocus(true);
			},
			onMouseOut: () => {
				this.setInFocus(false);
			},
			onMouseDown: event => {
				this.onMouseDown(event);
				event.stopPropagation();
			},
		};
	}

	getObject() {
		return this.state.object || this.props.object;
	}

	getResizer() {
		if (!this.isActive()) return null;

		const object = this.getObject();

		return (
			<Resizer
				object={object}
				onChange={o => this.setState({ object: o })}
				onMouseUp={() => {
					this.changeObjectParams();
				}}
			/>
		);
	}
	getDataset() {
		const object = this.getObject();

		return {
			"data-is-valid-drawing": true,
			"data-start-x": object.startX,
			"data-start-y": object.startY,
			"data-end-x": object.endX,
			"data-end-y": object.endY,
			"data-color": object.color,
			"data-front": object.front,
			"data-stroke": object.stroke,
		};
	}

	changeObjectParams() {
		if (!this.state.object) return;
		changeObjectParams(this.state.object);
		this.setState({ object: null });
	}

	isActive() {
		const object = this.getObject();
		return (
			this.props.moveable &&
			this.props.selectedObjectIds.indexOf(object.id) >= 0
		);
	}

	renderMoveableLine() {
		if (!this.props.moveable) return null;

		const object = this.getObject();

		return (
			<line
				x1={object.startX}
				y1={object.startY}
				x2={object.endX}
				y2={object.endY}
				stroke="transparent"
				strokeWidth="3px"
				{...this.getMoveableProps()}
			/>
		);
	}

	renderMoveableRect() {
		if (!this.props.moveable) return null;

		const object = this.getObject();

		return (
			<rect
				x={object.x}
				y={object.y}
				width={object.width}
				height={object.height}
				fill="transparent"
				{...this.getMoveableProps()}
			/>
		);
	}

	renderLine() {
		const object = this.getObject();

		return (
			<React.Fragment>
				<line
					x1={object.startX}
					y1={object.startY}
					x2={object.endX}
					y2={object.endY}
					stroke={object.color}
					strokeWidth={object.stroke}
					{...this.getDataset()}
				/>
				{this.getResizer()}
				{this.renderMoveableLine()}
			</React.Fragment>
		);
	}

	renderSquare() {
		const object = this.getObject();

		return (
			<React.Fragment>
				<rect
					x={object.x}
					y={object.y}
					width={object.width}
					height={object.height}
					fill={object.color}
					{...this.getDataset()}
				/>
				{this.getResizer()}
				{this.renderMoveableRect()}
			</React.Fragment>
		);
	}

	renderGroupChildren() {
		const group = this.getObject();

		const objects = [...group.objects];
		objects.sort((a, b) => a.front - b.front);

		return objects.map(object => (
			<ObjectDrawing key={object.id} object={object} moveable={false} />
		));
	}

	renderGroup() {
		const object = this.getObject();

		return (
			<React.Fragment>
				<rect
					x={object.x}
					y={object.y}
					width={object.width}
					height={object.height}
					fill={"transparent"}
				/>
				{this.renderGroupChildren()}
				{this.getResizer()}
				{this.renderMoveableRect()}
			</React.Fragment>
		);
	}

	renderEllipse() {
		const object = this.getObject();

		return (
			<React.Fragment>
				<ellipse
					cx={object.centerX}
					cy={object.centerY}
					rx={object.halfWidth}
					ry={object.halfHeight}
					fill={object.color}
					{...this.getDataset()}
				/>
				{this.getResizer()}
				{this.renderMoveableRect()}
			</React.Fragment>
		);
	}

	render() {
		const { object } = this.props;

		if (!object.isValid()) return null;

		if (object instanceof Line) return this.renderLine();
		if (object instanceof Square) return this.renderSquare();
		if (object instanceof Group) return this.renderGroup();
		if (object instanceof Ellipse) return this.renderEllipse();

		return null;
	}
}

ObjectDrawing.propTypes = {
	object: PropTypes.instanceOf(Shape).isRequired,
	moveable: PropTypes.bool.isRequired,
	selectedObjectIds: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = state => ({
	selectedObjectIds: state.selectedObjectIds,
});

export default connect(mapStateToProps)(ObjectDrawing);
