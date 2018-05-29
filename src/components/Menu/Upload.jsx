/* eslint-env browser */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { SVG_ID } from "~/constants";
import { setObjects } from "~/actions";
import { updateHistory } from "~/actions/controller";
import { parseJSONObjects, parseSVGObjects } from "~/utils";

class Upload extends React.Component {
	upload(files) {
		if (files.length <= 0) {
			return;
		}

		const fr = new FileReader();
		const file = files.item(0);

		if (file.type === "application/json") {
			fr.onload = async e => {
				try {
					const result = JSON.parse(e.target.result);

					await updateHistory();
					this.props.setObjects(parseJSONObjects(result));
					this.props.done();
				} catch (error) {
					console.error(error);
				}
			};
		}

		if (file.type === "image/svg+xml") {
			fr.onload = async e => {
				try {
					const parser = new DOMParser();
					const doc = parser.parseFromString(
						e.target.result,
						"image/svg+xml",
					);
					const svg = doc.getElementById(SVG_ID);
					const children = Array.from(svg.children);

					await updateHistory();
					this.props.setObjects(parseSVGObjects(children));
					this.props.done();
				} catch (error) {
					console.error(error);
				}
			};
		}

		fr.readAsText(files.item(0));
	}

	render() {
		return (
			<div className="custom-file mb-2 mt-2">
				<input
					type="file"
					accept=".json,.svg"
					className="custom-file-input"
					id="upload-file"
					onChange={event => {
						const { files } = event.target;
						this.upload(files);
					}}
				/>
				<label className="custom-file-label" htmlFor="upload-file">
					Upload
				</label>
			</div>
		);
	}
}

/* eslint-disable react/no-unused-prop-types */
Upload.propTypes = {
	setObjects: PropTypes.func.isRequired,
	done: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
	setObjects: objects => {
		dispatch(setObjects(objects));
	},
});

export default connect(null, mapDispatchToProps)(Upload);
