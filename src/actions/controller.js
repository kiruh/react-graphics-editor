import store from "~/store";
import Group from "~/models/Group";
import RectInterface from "~/models/RectInterface";
import { getMinProperty } from "~/utils";
import {
	setObjects,
	setSelectedObjectIds,
	setHistory,
	setFuture,
} from "./index";

export const updateHistory = async () => {
	const state = store.getState();
	const history = [...state.history, [...state.objects]];
	await Promise.all([
		store.dispatch(setHistory(history)),
		store.dispatch(setFuture([])),
	]);
};

export const undo = () => {
	const state = store.getState();
	const history = [...state.history];

	if (!history.length) return;
	const objects = history.pop();
	const future = [...state.future, [...state.objects]];

	store.dispatch(setObjects(objects));
	store.dispatch(setHistory(history));
	store.dispatch(setFuture(future));
};

export const redo = () => {
	const state = store.getState();
	const future = [...state.future];

	if (!future.length) return;
	const objects = future.pop();
	const history = [...state.history, [...state.objects]];

	store.dispatch(setObjects(objects));
	store.dispatch(setHistory(history));
	store.dispatch(setFuture(future));
};

export const addObject = object => {
	updateHistory();

	const state = store.getState();
	const objects = [...state.objects, object];

	store.dispatch(setObjects(objects));
};

export const changeObjectParams = object => {
	updateHistory();

	const state = store.getState();

	const objects = [...state.objects];
	const old = objects.find(o => o.id === object.id);

	if (old) {
		const index = objects.indexOf(old);
		objects[index] = object;

		store.dispatch(setObjects(objects));
	}
};

export const setColorForSelectedObjects = color => {
	updateHistory();

	const state = store.getState();
	const { selectedObjectIds } = state;

	const objects = [...state.objects];

	selectedObjectIds.forEach(id => {
		const old = objects.find(o => o.id === id);

		if (old) {
			const object = old.copy();
			object.color = color;

			const index = objects.indexOf(old);
			objects[index] = object;
		}
	});

	store.dispatch(setObjects(objects));
};

export const moveSelectedObjectsToFront = () => {
	updateHistory();

	const state = store.getState();
	const { selectedObjectIds } = state;

	const objects = [...state.objects];
	selectedObjectIds.forEach(id => {
		const old = objects.find(o => o.id === id);

		if (old) {
			const index = objects.indexOf(old);
			const object = old.copy();
			object.moveToFront();
			objects[index] = object;
		}
	});

	store.dispatch(setObjects(objects));
};

export const moveSelectedObjectsToBack = () => {
	updateHistory();

	const state = store.getState();
	const { selectedObjectIds } = state;

	const objects = [...state.objects];
	selectedObjectIds.forEach(id => {
		const old = objects.find(o => o.id === id);
		const smallestFrontAttr = getMinProperty(objects, "front");

		if (old) {
			const index = objects.indexOf(old);
			const object = old.copy();
			object.moveToBack(smallestFrontAttr - 1);
			objects[index] = object;
		}
	});

	store.dispatch(setObjects(objects));
};

export const selectObject = (id, isCtrl) => {
	const state = store.getState();
	const { selectedObjectIds } = state;

	const getIds = () => {
		const alreadyIn = selectedObjectIds.includes(id);

		if (isCtrl) {
			if (alreadyIn) {
				return selectedObjectIds.filter(i => i !== id);
			}

			return [...selectedObjectIds, id];
		}

		if (alreadyIn && selectedObjectIds.length > 1) {
			return [...selectedObjectIds];
		}

		return [id];
	};

	const ids = getIds();

	store.dispatch(setSelectedObjectIds(ids));
	return ids;
};

export const groupSelectedObjects = () => {
	updateHistory();

	const state = store.getState();
	const { selectedObjectIds } = state;

	const objects = [...state.objects];
	const grouped = [];

	selectedObjectIds.forEach(id => {
		const object = objects.find(o => o.id === id);

		if (object) {
			grouped.push(object);
			const index = objects.indexOf(object);

			objects.splice(index, 1);
		}
	});

	const group = new Group({
		objects: grouped,
	});

	objects.push(group);

	store.dispatch(setSelectedObjectIds([group.id]));
	store.dispatch(setObjects(objects));
};

export const ungroupObject = group => {
	updateHistory();

	const state = store.getState();
	const objects = [...state.objects];

	const ungrouped = group.objects;
	objects.push(...ungrouped);

	const removed = objects.find(o => o.id === group.id);
	const index = objects.indexOf(removed);
	objects.splice(index, 1);

	const selectedObjectIds = ungrouped.map(s => s.id);

	store.dispatch(setSelectedObjectIds(selectedObjectIds));
	store.dispatch(setObjects(objects));
};

export const setStrokeForLine = (line, stroke) => {
	updateHistory();

	const updated = line.copy();
	updated.stroke = stroke;

	changeObjectParams(updated);
};

export const deleteSelectedObjects = () => {
	updateHistory();

	const state = store.getState();
	const { selectedObjectIds, objects } = state;

	const updated = objects.filter(o => !selectedObjectIds.includes(o.id));

	store.dispatch(setSelectedObjectIds([]));
	store.dispatch(setObjects(updated));
};

export const selectObjectWithRect = selection => {
	const state = store.getState();
	const { objects } = state;
	const { startX, startY, endX, endY } = selection;

	const minX = startX > endX ? endX : startX;
	const maxX = startX > endX ? startX : endX;
	const minY = startY > endY ? endY : startY;
	const maxY = startY > endY ? startY : endY;

	const selected = objects.filter(o => {
		let points = [
			{
				x: "startX",
				y: "startY",
			},
			{
				x: "endX",
				y: "endY",
			},
		];
		if (o instanceof RectInterface) {
			points = [
				...points,
				{
					x: "startX",
					y: "endY",
				},
				{
					x: "endX",
					y: "startY",
				},
			];
		}
		return points.some(
			point =>
				o[point.x] > minX &&
				o[point.x] < maxX &&
				o[point.y] > minY &&
				o[point.y] < maxY,
		);
	});
	const selectedObjectIds = selected.map(o => o.id);
	store.dispatch(setSelectedObjectIds(selectedObjectIds));
};

export const selectAll = () => {
	const state = store.getState();
	const { objects } = state;

	const selectedObjectIds = objects.map(o => o.id);
	store.dispatch(setSelectedObjectIds(selectedObjectIds));
};
