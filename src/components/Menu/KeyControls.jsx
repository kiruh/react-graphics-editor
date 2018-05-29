import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import KeyHandler, { KEYDOWN } from "react-key-handler";

import { isMovingAction } from "~/utils";
import { selectAll, undo, redo } from "~/actions/controller";

class KeyControls extends React.Component {
	static handleUndo(event) {
		if (event.ctrlKey) {
			if (event.shiftKey) redo();
			else undo();
			event.preventDefault();
		}
	}

	static handleRedo(event) {
		if (event.ctrlKey) {
			redo();
			event.preventDefault();
		}
	}

	handleSelectAll(event) {
		if (event.ctrlKey) {
			if (isMovingAction(this.props.currentActionType)) selectAll();
			event.preventDefault();
		}
	}

	render() {
		const handleUndo = event => KeyControls.handleUndo(event);
		const handleRedo = event => KeyControls.handleRedo(event);
		const handleSelectAll = event => this.handleSelectAll(event);

		return (
			<React.Fragment>
				<KeyHandler
					keyEventName={KEYDOWN}
					keyValue={"z"}
					onKeyHandle={handleUndo}
				/>
				<KeyHandler
					keyEventName={KEYDOWN}
					keyValue={"Z"}
					onKeyHandle={handleUndo}
				/>
				<KeyHandler
					keyEventName={KEYDOWN}
					keyValue={"y"}
					onKeyHandle={handleRedo}
				/>
				<KeyHandler
					keyEventName={KEYDOWN}
					keyValue={"Y"}
					onKeyHandle={handleRedo}
				/>
				<KeyHandler
					keyEventName={KEYDOWN}
					keyValue={"a"}
					onKeyHandle={handleSelectAll}
				/>
				<KeyHandler
					keyEventName={KEYDOWN}
					keyValue={"A"}
					onKeyHandle={handleSelectAll}
				/>
			</React.Fragment>
		);
	}
}

KeyControls.propTypes = {
	currentActionType: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	currentActionType: state.currentActionType,
});

export default connect(mapStateToProps, null)(KeyControls);
