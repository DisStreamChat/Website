import {StrictMode} from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { AppContextProvider } from "./contexts/Appcontext";

ReactDOM.render(
	<StrictMode>
		<AppContextProvider>
			<App />
		</AppContextProvider>
	</StrictMode>,
	document.getElementById("root")
);
