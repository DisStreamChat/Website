import styled from "styled-components";
export const ActionButton = styled.div`
	cursor: pointer;
	display: flex;
	&:first-child {
		transform: scale(1.5);
	}
`;

export const ActionBody = styled.div`
	width: 100% !important;
	box-sizing: border-box;
	padding: 1rem;
	justify-content: space-between;
	margin: 0.25rem;
	margin-left: 0rem;
	background: #1a1a1a;
	position: relative;
	align-items: center;
	border-radius: 0.25rem;
	z-index: 100;
	h3,
	h2,
	h4,
	h1,
	p {
		margin: 0;
	}
	& > div:not(:first-child) {
		margin-left: 0.5rem;
		margin-right: 0.5rem;
	}
`;

export const ActionHead = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	& > div {
		flex: 1;
		&:last-child,
		&:first-child {
			flex: 0.1;
		}
		&:first-child {
			display: flex;
			align-items: center;
			.twemoji {
				width: 50px;
			}
		}

		&:last-child {
			align-items: center;
			display: flex;
			justify-content: space-between;
			margin-left: 1.5rem;
			max-width: 100px;
		}
	}
`;

export const ActionFooter = styled.div`
	overflow: ${props => (props.open ? "visible" : "hidden")};
	height: ${props => (props.open ? "60px" : "0px")};
	margin-top: ${props => (props.open ? ".5rem" : "0px")};
	// margin-top: 0.5rem;
	display: flex;
	padding-left: 0.5rem;
	align-items: center;
	margin-left: 0;
	justify-content: space-between;
	transition: height 0.25s;
	& > div {
		flex: 1;
		&:last-child,
		&:first-child {
			flex: 0.1;
		}
		&:first-child {
			display: flex;
			align-items: center;
			.twemoji {
				width: 50px;
			}
		}

		&:last-child {
			align-items: center;
			display: flex;
			justify-content: space-between;
			margin-left: 1.5rem;
		}
	}
`;

export const ChannelParent = styled.span`
	color: #aaa;
	font-size: 14px;
	margin-left: 0.25rem;
`;

export const ManagerBody = styled.div`
	margin: 1rem 0;
	display: flex;
	position: relative;
	padding: 0.5rem 1rem;
	border: 1px solid black;
	background: #1f1f1f;
	flex-direction: column;
`;
