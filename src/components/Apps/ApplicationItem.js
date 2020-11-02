import A from "../Shared/A";
import { Button } from "@material-ui/core";

const ApplicationItem = props => {
	return (
		<li className="application-item">
			<h2 className="application--title">{props.title}</h2>
			<h3 className="application--subtitle">{props.subtitle}</h3>
			<img className="application--image" src={props.displayImage} alt=""></img>
			<h4 className="application-description">{props.description}</h4>
			<A local href={`/apps/${props.pageLink}`}>
				<Button className="application--link">{props.linkText}</Button>
			</A>
		</li>
	);
};

export default ApplicationItem;
