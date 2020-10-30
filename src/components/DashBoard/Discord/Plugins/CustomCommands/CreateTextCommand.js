import { useContext } from "react";
import { CommandContext } from "../../../../../contexts/CommandContext";

const CreateTextCommand = () => {
	const { response, setResponse } = useContext(CommandContext);
	return (
		<>
			<h4 className="plugin-section-title">Command Response</h4>
			<div className="plugin-section">
				<textarea
					placeholder="Hi, {user}!"
					value={response}
					onChange={e => setResponse(e.target.value)}
					rows="8"
					className="message"
				></textarea>
				<div className="variables">
					<h4 className="plugin-section-title">Available variables</h4>
					<ul>
						<li className="variable">
							{"{author} - The user who sent the command (mentions the user)"}
							<ul>
								<li>{"{author.name} - the users name"}</li>
								<li>{"{author.nickname} - the users nickname"}</li>
								<li>{"{author.color} - the users color based on roles"}</li>
							</ul>
						</li>
						<li className="variable">
							{"{n} - get the 'nth' argument passed to the command"}
						</li>
					</ul>
					<h4 className="plugin-section-title">Available functions</h4>
					<ul>
						<li className="variable">
							{
								"(time {timezone}) - returns the current time in specified timezone code"
							}
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default CreateTextCommand;
