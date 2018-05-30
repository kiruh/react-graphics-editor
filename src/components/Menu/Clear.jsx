import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setObjects } from "~/actions";
import { updateHistory } from "~/actions/controller";

const Clear = props => (
	<button
		title="Clear all"
		className="btn btn-light ml-2"
		onClick={async () => {
			await updateHistory();
			props.setObjects([]);
			props.done();
		}}
	>
		<i className="fas fa-trash" />
	</button>
);

/* eslint-disable react/no-unused-prop-types */
Clear.propTypes = {
	setObjects: PropTypes.func.isRequired,
	done: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
	setObjects: objects => {
		dispatch(setObjects(objects));
	},
});

export default connect(null, mapDispatchToProps)(Clear);
