import RectInterface from "./RectInterface";

export default class Ellipse extends RectInterface {
	constructor(props) {
		super(props);
		this.type = "ELLIPSE";
	}
}
