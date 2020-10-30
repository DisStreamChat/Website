import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { AppContextProvider } from "./contexts/Appcontext";

ReactDOM.render(
	<React.StrictMode>
		<AppContextProvider>
			<App />
		</AppContextProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
