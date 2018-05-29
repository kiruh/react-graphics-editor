import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Square from "~/models/Square";
import Line from "~/models/Line";
import Shape from "~/models/Shape";
import Ellipse from "~/models/Ellipse";
import ObjectDrawing from "./ObjectDrawing";
import { isDrawingAction, isMovingAction } from "~/utils";
import { setSelectedObjectIds } from "~/actions";
import { addObject, selectObjectWithRect } from "~/actions/controller";
import {
	LINE_ACTION,
	SQUARE_ACTION,
	ELLIPSE_ACTION,
	SVG_ID,
	SELECTION_COLOR,
} from "~/constants";

import styles from "./Canvas.less";

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.state = { object: null, selection: null };
	}

	onMouseDown(event) {
		this.isMouseDown = true;
		let Class = Line;
		switch (this.props.currentActionType) {
			case LINE_ACTION:
				Class = Line;
				break;
			case SQUARE_ACTION:
				Class = Square;
				break;
			case ELLIPSE_ACTION:
				Class = Ellipse;
				break;
			default:
				break;
		}
		const { color, stroke } = this.props;
		const object = new Class({
			startX: event.clientX - this.offsetX,
			startY: event.clientY - this.offsetY,
			color,
			stroke,
		});
		this.setState({ object });
	}

	onMouseMove(event) {
		if (!this.isMouseDown || !this.state.object) return;

		const object = this.state.object.copy();
		if (!object) return;

		const endX = event.clientX - this.offsetX;
		const endY = event.clientY - this.offsetY;
		object.setEndPoint(endX, endY, event.shiftKey);

		this.setState({ object });
	}

	onMouseUp() {
		this.isMouseDown = false;

		if (!this.state.object) return;
		if (!this.state.object.isValid()) return;

		addObject(this.state.object);
		this.setState({ object: null });
	}

	onStartSelecting(event) {
		this.isSelecting = true;
		const selection = new Square({
			startX: event.clientX - this.offsetX,
			startY: event.clientY - this.offsetY,
			color: SELECTION_COLOR,
		});
		this.setState({ selection });
	}

	onSelecting(event) {
		if (!this.isSelecting || !this.state.selection) return;

		const selection = this.state.selection.copy();
		if (!selection) return;

		const endX = event.clientX - this.offsetX;
		const endY = event.clientY - this.offsetY;
		selection.setEndPoint(endX, endY);

		this.setState({ selection });
	}

	onStopSelecting() {
		this.isSelecting = false;
		if (!this.state.selection) return;

		selectObjectWithRect(this.state.selection);
		this.setState({ selection: null });
	}

	getSvgProps() {
		if (this.isDrawingAction()) {
			return {
				onMouseDown: event => {
					this.onMouseDown(event);
				},
				onMouseMove: event => {
					this.onMouseMove(event);
				},
				onMouseUp: () => {
					this.onMouseUp();
				},
				onMouseLeave: () => {
					this.clear();
				},
			};
		}
		if (this.isMovingAction()) {
			return {
				onMouseDown: event => {
					this.props.setSelectedObjectIds([]);
					this.onStartSelecting(event);
				},
				onMouseMove: event => {
					this.onSelecting(event);
				},
				onMouseUp: () => {
					this.onStopSelecting();
				},
				onMouseLeave: () => {
					this.clear();
				},
			};
		}
		return null;
	}

	get offsetX() {
		return this.svgNode.getBoundingClientRect().x;
	}

	get offsetY() {
		return this.svgNode.getBoundingClientRect().y;
	}

	isMovingAction() {
		return isMovingAction(this.props.currentActionType);
	}

	isDrawingAction() {
		return isDrawingAction(this.props.currentActionType);
	}

	clear() {
		this.isMouseDown = false;
		this.isSelecting = false;
		this.setState({ object: null, selection: null });
	}

	renderObjects() {
		const objects = [...this.props.objects];
		if (this.state.object) {
			objects.push(this.state.object);
		}
		objects.sort((a, b) => a.front - b.front);
		return objects.map(object => (
			<ObjectDrawing
				key={object.id}
				object={object}
				moveable={this.isMovingAction()}
			/>
		));
	}

	renderSelection() {
		if (!this.isMovingAction()) return null;

		const { selection } = this.state;
		if (!selection) return null;

		return (
			<ObjectDrawing
				key={selection.id}
				object={selection}
				moveable={false}
			/>
		);
	}

	render() {
		return (
			<div className={styles.svgWrapper}>
				<div className={styles.svgB}>
					<svg
						id={SVG_ID}
						className={styles.svg}
						{...this.getSvgProps()}
						ref={svgNode => {
							this.svgNode = svgNode;
						}}
					>
						{this.renderObjects()}
						{this.renderSelection()}
					</svg>
				</div>
			</div>
		);
	}
}

Canvas.propTypes = {
	objects: PropTypes.arrayOf(PropTypes.instanceOf(Shape)),
	currentActionType: PropTypes.string.isRequired,
	setSelectedObjectIds: PropTypes.func.isRequired,
	color: PropTypes.string.isRequired,
	stroke: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
	objects: state.objects,
	currentActionType: state.currentActionType,
	color: state.color,
	stroke: state.stroke,
});

const mapDispatchToProps = dispatch => ({
	setSelectedObjectIds: value => {
		dispatch(setSelectedObjectIds(value));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
