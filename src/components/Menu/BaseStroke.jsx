import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import StrokePicker from "./StrokePicker";
import { setStroke } from "~/actions";
import { isLineAction } from "~/utils";

const BaseStroke = props =>
	isLineAction(props.currentActionType) && (
		<StrokePicker
			stroke={props.stroke}
			setStroke={stroke => props.setStroke(stroke)}
		/>
	);

BaseStroke.propTypes = {
	stroke: PropTypes.number,
	setStroke: PropTypes.func.isRequired,
	currentActionType: PropTypes.string,
};

const mapStateToProps = state => ({
	stroke: state.stroke,
	currentActionType: state.currentActionType,
});

const mapDispatchToProps = dispatch => ({
	setStroke: stroke => {
		dispatch(setStroke(stroke));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(BaseStroke);
