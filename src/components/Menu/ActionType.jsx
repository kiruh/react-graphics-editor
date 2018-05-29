import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Toggle from "../Toggle";
import { setCurrentActionType } from "~/actions";
import { ACTION_MENU } from "~/constants";

const ActionType = props => (
	<Toggle
		title="Action"
		options={ACTION_MENU}
		value={props.currentActionType}
		onChange={value => {
			props.setCurrentActionType(value);
		}}
	/>
);

ActionType.propTypes = {
	currentActionType: PropTypes.oneOf(ACTION_MENU.map(o => o.key)).isRequired,
	setCurrentActionType: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	currentActionType: state.currentActionType,
});

const mapDispatchToProps = dispatch => ({
	setCurrentActionType: value => {
		dispatch(setCurrentActionType(value));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionType);
