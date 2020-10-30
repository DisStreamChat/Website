import { memo } from "react";
import "./Feature.scss";

const Feature = memo(props => {
	const innerBody = [
		<>
			<h1>{props.title}</h1>
			{props.subtitle && <h2>{props.subtitle}</h2>}
			<h3>{props.body}</h3>
		</>,
		<>
			{props.images.map((image, idx) => (
				<img key={image} src={image} alt="" className={props.imageClassNames?.[idx]} />
			))}
		</>,
	];

	return (
		<section className="feature">
			<div className={`left ${props.images.length === 2 ? "two-images" : ""}`}>
				{innerBody[props.reversed ? 1 : 0]}
			</div>
			<div className={`right ${props.images.length === 2 ? "two-images" : ""}`}>
				{innerBody[!props.reversed ? 1 : 0]}
			</div>
		</section>
	);
});

export default Feature;
