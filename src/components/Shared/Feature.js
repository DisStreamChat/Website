import { memo } from "react";
import "./Feature.scss";

import LazyLoad from "react-lazy-load";

const Feature = memo(props => {
	const innerBody = [
		<>
			<h1>{props.title}</h1>
			{props.subtitle && <h2>{props.subtitle}</h2>}
			<p>{props.body}</p>
		</>,
		<>
			{props.images.map((image, idx) => (
				<LazyLoad offsetVertical={700} offsetTop={700}>
					<img key={image} src={image} alt="" className={props.imageClassNames?.[idx]} />
				</LazyLoad>
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
