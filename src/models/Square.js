import RectInterface from "./RectInterface";

export default class Square extends RectInterface {
	constructor(props) {
		super(props);
		this.type = "SQUARE";
	}
}
