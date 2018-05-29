import React from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";

import "rc-slider/assets/index.css";

const Handle = props => {
	const { value, dragging, index, ...restProps } = props;
	return (
		<Tooltip
			prefixCls="rc-slider-tooltip"
			overlay={value}
			visible={dragging}
			placement="top"
			key={index}
		>
			<Slider.Handle value={value} {...restProps} />
		</Tooltip>
	);
};

Handle.propTypes = {
	value: PropTypes.instanceOf(PropTypes.any),
	dragging: PropTypes.instanceOf(PropTypes.any),
	index: PropTypes.instanceOf(PropTypes.any),
};

const StrokePicker = props => (
	<div className="mb-3">
		<h6>Line Stroke</h6>
		<Slider
			min={1}
			max={6}
			step={0.5}
			handle={Handle}
			value={props.stroke}
			onChange={value => {
				props.setStroke(value);
			}}
		/>
	</div>
);

StrokePicker.propTypes = {
	stroke: PropTypes.number,
	setStroke: PropTypes.func.isRequired,
};

export default StrokePicker;
