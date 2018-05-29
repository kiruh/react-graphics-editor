/* eslint-env browser */
import React from "react";
import PropTypes from "prop-types";
import randomWord from "sillyname";
import { connect } from "react-redux";

import { SVG_ID } from "~/constants";

class SaveSvg extends React.Component {
	static getDataURI() {
		const svgold = document.getElementById(SVG_ID);
		if (!svgold) return null;

		const children = Array.from(svgold.children)
			.filter(child => child.dataset.isValidDrawing)
			.map(c => c.cloneNode());

		const svg = svgold.cloneNode();

		children.forEach(child => {
			svg.appendChild(child);
		});

		const serializer = new XMLSerializer();
		let source = serializer.serializeToString(svg);

		if (
			!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)
		) {
			source = source.replace(
				/^<svg/,
				'<svg xmlns="http://www.w3.org/2000/svg"',
			);
		}
		if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
			source = source.replace(
				/^<svg/,
				'<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
			);
		}

		source = `<?xml version="1.0" standalone="no"?>\r\n${source}`;

		const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
			source,
		)}`;

		return url;
	}

	download() {
		this.link.setAttribute("href", SaveSvg.getDataURI());
		this.link.setAttribute("download", `${randomWord()}.svg`);
		this.link.click();
		this.props.done();
	}

	render() {
		return (
			<React.Fragment>
				<button
					title="Save as SVG"
					className="btn btn-light"
					onClick={() => {
						this.download();
					}}
				>
					<i className="fas fa-save" />
				</button>
				<a
					className="d-none"
					ref={link => {
						this.link = link;
					}}
				>
					DOWNLOAD
				</a>
			</React.Fragment>
		);
	}
}

SaveSvg.propTypes = {
	done: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	state,
});

export default connect(mapStateToProps, null)(SaveSvg);
