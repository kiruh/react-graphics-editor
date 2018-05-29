import React from "react";

import Menu from "./Menu";
import Canvas from "./Canvas";

const App = () => (
	<React.Fragment>
		<div className="d-none d-md-block">
			<div className="row ">
				<div className="col-md-2">
					<Menu />
				</div>
				<div className="col-md-10">
					<Canvas />
				</div>
			</div>
		</div>
		<div className="d-md-none mt-4 alert alert-warning">
			We do not support mobile version yet
		</div>
	</React.Fragment>
);

export default App;
