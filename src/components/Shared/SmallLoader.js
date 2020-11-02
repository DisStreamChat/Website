import Loader from "react-loader";

const SmallLoader = ({ loaded }) => {
	return (
		<Loader
			loaded={loaded}
			lines={15}
			length={0}
			width={15}
			radius={35}
			corners={1}
			rotate={0}
			direction={1}
			color={"#fff"}
			speed={1}
			trail={60}
			shadow={true}
			hwaccel={true}
			className="spinner"
			zIndex={2e9}
			top="50%"
			left="50%"
			scale={1.0}
			loadedClassName="loadedContent"
		/>
	);
};

export default SmallLoader;
