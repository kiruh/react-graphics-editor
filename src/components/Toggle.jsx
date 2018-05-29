import React from "react";
import PropTypes from "prop-types";
import uuidv4 from "uuid/v4";

const layouts = ["RADIO", "DROPMENU"];

class Toggle extends React.Component {
	constructor(props) {
		super(props);
		this.toggleId = `toggle-${uuidv4()}`;
	}

	isChecked(value) {
		return this.props.value === value;
	}

	renderTitle() {
		if (!this.props.title) return null;
		return <h6>{this.props.title}</h6>;
	}

	renderRadioOptions() {
		return this.props.options.map(option => (
			<div key={option.key} className="custom-control custom-radio">
				<input
					className="custom-control-input"
					type="radio"
					name={this.toggleId}
					id={option.key}
					value={option.key}
					onChange={input => {
						this.props.onChange(input.target.value);
					}}
					checked={this.isChecked(option.key)}
				/>
				<label className="custom-control-label" htmlFor={option.key}>
					{option.value}
				</label>
			</div>
		));
	}

	renderRadioGroup() {
		return <React.Fragment>{this.renderRadioOptions()}</React.Fragment>;
	}

	renderDropMenuOptions() {
		return this.props.options.map(option => (
			<option key={option.key} value={option.key}>
				{option.value}
			</option>
		));
	}

	renderDropMenu() {
		return (
			<select
				className="form-control"
				onChange={input => {
					const value = input.target.value;
					this.props.onChange(value);
				}}
			>
				{this.renderDropMenuOptions()}
			</select>
		);
	}

	renderLayout() {
		switch (this.props.layout) {
			case "DROPMENU":
				return this.renderDropMenu();
			case "RADIO":
			default:
				return this.renderRadioGroup();
		}
	}

	render() {
		return (
			<div className="mb-3">
				{this.renderTitle()}
				{this.renderLayout()}
			</div>
		);
	}
}

Toggle.defaultProps = {
	layout: "RADIO",
};

Toggle.propTypes = {
	value: PropTypes.string,
	title: PropTypes.string,
	options: PropTypes.arrayOf(PropTypes.object).isRequired,
	onChange: PropTypes.func.isRequired,
	layout: PropTypes.oneOf(layouts),
};

export default Toggle;
