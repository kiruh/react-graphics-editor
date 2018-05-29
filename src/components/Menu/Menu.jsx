import React from "react";

import BaseColor from "./BaseColor";
import ActionType from "./ActionType";
import SelectedObjectsMenu from "./SelectedObjectsMenu";
import BaseStroke from "./BaseStroke";
import FileMenu from "./FileMenu";
import KeyControls from "./KeyControls";

import styles from "./Menu.less";

const Menu = () => (
	<nav id="sidebar" className={styles.sidebar}>
		<ActionType />
		<BaseStroke />
		<BaseColor />
		<SelectedObjectsMenu />
		<FileMenu />
		<KeyControls />
	</nav>
);

export default Menu;
