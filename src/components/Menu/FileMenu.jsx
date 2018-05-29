import React from "react";
import { Popover, PopoverBody } from "reactstrap";
import Download from "./Download";
import Upload from "./Upload";
import Clear from "./Clear";
import SaveSvg from "./SaveSvg";

class ColorPicker extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			popoverOpen: false,
		};
	}

	toggle() {
		this.setState({
			popoverOpen: !this.state.popoverOpen,
		});
	}

	render() {
		const props = {
			done: () => this.toggle(),
		};
		return (
			<div>
				<button
					className="btn btn-light menu-btn"
					id="File-Menu-Popover"
					onClick={() => {
						this.toggle();
					}}
				>
					Settings
				</button>
				<Popover
					placement="right"
					isOpen={this.state.popoverOpen}
					target="File-Menu-Popover"
					toggle={() => {
						this.toggle();
					}}
				>
					<PopoverBody>
						<Upload {...props} />
						<SaveSvg {...props} />
						<Download {...props} />
						<Clear {...props} />
					</PopoverBody>
				</Popover>
			</div>
		);
	}
}

export default ColorPicker;
