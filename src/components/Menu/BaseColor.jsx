import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ColorPicker from "./ColorPicker";
import { setColor } from "~/actions";
import { isDrawingAction } from "~/utils";

const BaseColor = props =>
	isDrawingAction(props.currentActionType) && (
		<ColorPicker
			color={props.color}
			setColor={color => props.setColor(color)}
		/>
	);

BaseColor.propTypes = {
	color: PropTypes.string,
	setColor: PropTypes.func.isRequired,
	currentActionType: PropTypes.string,
};

const mapStateToProps = state => ({
	color: state.color,
	currentActionType: state.currentActionType,
});

const mapDispatchToProps = dispatch => ({
	setColor: color => {
		dispatch(setColor(color));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(BaseColor);
