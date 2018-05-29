/* eslint-env browser */
import store from "~/store";
import { setObjects } from "~/actions/index";
import { updateHistory } from "~/actions/controller";

export default class MoveSelected {
	static get lastX() {
		return MoveSelected.lastMouseLocation.x;
	}
	static get lastY() {
		return MoveSelected.lastMouseLocation.y;
	}

	static move(event) {
		MoveSelected.dragged = true;
		MoveSelected.updateLocation(event);

		updateHistory();

		document.onmousemove = e => {
			MoveSelected.onMouseMove(e);
		};
		document.onmouseup = () => {
			MoveSelected.onMouseUp();
		};
	}

	static updateLocation(event) {
		MoveSelected.lastMouseLocation = {
			x: event.clientX,
			y: event.clientY,
		};
	}

	static moveSingleObject(old, event) {
		const object = old.copy();
		const diffX = event.clientX - MoveSelected.lastX;
		const diffY = event.clientY - MoveSelected.lastY;

		object.move(diffX, diffY);

		return object;
	}

	static onMouseMove(event) {
		if (!MoveSelected.dragged) return;

		const state = store.getState();
		const { selectedObjectIds } = state;

		const objects = [...state.objects];

		selectedObjectIds.forEach(id => {
			const old = objects.find(o => o.id === id);

			if (old) {
				const object = MoveSelected.moveSingleObject(old, event);
				const index = objects.indexOf(old);

				objects[index] = object;
			}
		});

		MoveSelected.updateLocation(event);

		store.dispatch(setObjects(objects));
	}

	static onMouseUp() {
		document.onmousemove = null;
		document.onmouseup = null;
		MoveSelected.dragged = false;
	}
}
