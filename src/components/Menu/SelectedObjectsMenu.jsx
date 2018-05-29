import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import KeyHandler, { KEYPRESS } from "react-key-handler";

import ColorPicker from "./ColorPicker";
import StrokePicker from "./StrokePicker";
import Shape from "~/models/Shape";
import Group from "~/models/Group";
import Line from "~/models/Line";
import { isMovingAction } from "~/utils";
import {
	setColorForSelectedObjects,
	groupSelectedObjects,
	ungroupObject,
	setStrokeForLine,
	deleteSelectedObjects,
	moveSelectedObjectsToFront,
	moveSelectedObjectsToBack,
} from "~/actions/controller";

class SelectedObjectsMenu extends React.Component {
	static renderRemoveButton() {
		const handle = () => {
			deleteSelectedObjects();
		};

		return (
			<React.Fragment>
				<KeyHandler
					keyEventName={KEYPRESS}
					keyCode={127}
					onKeyHandle={handle}
				/>
				<button title="Delete" className="btn mr-2" onClick={handle}>
					<i className="fas fa-trash" />
				</button>
			</React.Fragment>
		);
	}

	static renderMoveToFront() {
		return (
			<button
				title="Move to the front"
				className="btn mr-2"
				onClick={() => moveSelectedObjectsToFront()}
			>
				<i className="fas fa-angle-up" />
			</button>
		);
	}

	static renderMoveToBack() {
		return (
			<button
				title="Move to the back"
				className="btn mr-2"
				onClick={() => moveSelectedObjectsToBack()}
			>
				<i className="fas fa-angle-down" />
			</button>
		);
	}

	getSelectedObjects() {
		return this.props.objects.filter(o =>
			this.props.selectedObjectIds.includes(o.id),
		);
	}

	getColor() {
		const objects = this.getSelectedObjects();
		if (objects.length === 0) return null;
		return objects[0].color;
	}

	getObjectToUngroup() {
		const objects = this.getSelectedObjects();
		if (objects.length !== 1) return null;

		const object = objects[0];
		if (object instanceof Group) return object;

		return null;
	}

	getLineObject() {
		const objects = this.getSelectedObjects();
		if (objects.length !== 1) return null;

		const object = objects[0];
		if (object instanceof Line) return object;

		return null;
	}

	renderColorPicker() {
		const color = this.getColor();
		if (!color) return null;

		return (
			<ColorPicker
				color={color}
				setColor={value => {
					setColorForSelectedObjects(value);
				}}
			/>
		);
	}

	renderStrokePicker() {
		const line = this.getLineObject();
		if (!line) return null;

		return (
			<StrokePicker
				stroke={line.stroke}
				setStroke={value => {
					setStrokeForLine(line, value);
				}}
			/>
		);
	}

	renderGroupButton() {
		const objects = this.getSelectedObjects();
		if (objects.length < 2) return null;

		return (
			<button
				title="Group"
				className="btn mr-2"
				onClick={() => {
					groupSelectedObjects();
				}}
			>
				<i className="fas fa-object-group" />
			</button>
		);
	}

	renderUngroupButton() {
		const group = this.getObjectToUngroup();
		if (!group) return null;

		return (
			<button
				title="Ungroup"
				className="btn mr-2"
				onClick={() => {
					ungroupObject(group);
				}}
			>
				<i className="fas fa-object-ungroup" />
			</button>
		);
	}

	renderButtons() {
		return (
			<div
				className="btn-group mb-3"
				role="group"
				aria-label="Basic example"
			>
				{this.renderGroupButton()}
				{this.renderUngroupButton()}
				{SelectedObjectsMenu.renderRemoveButton()}
				{SelectedObjectsMenu.renderMoveToFront()}
				{SelectedObjectsMenu.renderMoveToBack()}
			</div>
		);
	}

	render() {
		if (!isMovingAction(this.props.currentActionType)) {
			return null;
		}

		const objects = this.getSelectedObjects();
		if (objects.length === 0) return null;

		return (
			<React.Fragment>
				{this.renderButtons()}
				{this.renderStrokePicker()}
				{this.renderColorPicker()}
			</React.Fragment>
		);
	}
}

SelectedObjectsMenu.propTypes = {
	selectedObjectIds: PropTypes.arrayOf(PropTypes.string),
	objects: PropTypes.arrayOf(PropTypes.instanceOf(Shape)),
	currentActionType: PropTypes.string,
};

const mapStateToProps = state => ({
	selectedObjectIds: state.selectedObjectIds,
	objects: state.objects,
	currentActionType: state.currentActionType,
});

export default connect(mapStateToProps, null)(SelectedObjectsMenu);
