import React from "react";
import PropTypes from "prop-types";
import { Button, Popover, PopoverBody } from "reactstrap";
import { BlockPicker, SketchPicker } from "react-color";

import styles from "./ColorPicker.less";

const DEFAULT_COLORS = [
	"#000000",
	"#f44336",
	"#e91e63",
	"#9c27b0",
	"#673ab7",
	"#3f51b5",
	"#2196f3",
	"#03a9f4",
	"#00bcd4",
	"#009688",
	"#4caf50",
	"#8bc34a",
	"#cddc39",
	"#ffeb3b",
	"#ffc107",
	"#ff9800",
	"#ff5722",
	"#795548",
	"#607d8b",
	"#ffffff",
];

class ColorPicker extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			popoverOpen: false,
		};
	}

	getColorProps() {
		const getRGBA = rgba =>
			`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

		return {
			color: this.props.color,
			onChange: color => {
				this.props.setColor(getRGBA(color.rgb));
			},
		};
	}

	toggle() {
		this.setState({
			popoverOpen: !this.state.popoverOpen,
		});
	}

	render() {
		return (
			<React.Fragment>
				<h6>Color</h6>
				<BlockPicker
					triangle="hide"
					colors={DEFAULT_COLORS}
					{...this.getColorProps()}
				/>
				<Button
					id="Color-Popover"
					className={"menu-btn"}
					color="light"
					onClick={() => {
						this.toggle();
					}}
				>
					More colors
				</Button>
				<Popover
					placement="right"
					isOpen={this.state.popoverOpen}
					target="Color-Popover"
					toggle={() => {
						this.toggle();
					}}
				>
					<PopoverBody className={styles.colorPickerPopover}>
						<SketchPicker {...this.getColorProps()} />
					</PopoverBody>
				</Popover>
			</React.Fragment>
		);
	}
}

ColorPicker.propTypes = {
	color: PropTypes.string,
	setColor: PropTypes.func.isRequired,
};

export default ColorPicker;
