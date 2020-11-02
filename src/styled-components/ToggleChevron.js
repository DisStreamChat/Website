import styled from "styled-components"

const ToggleChevron = styled.span`
	& > * {
		transition: 0.25s;
		transform: rotate(${props => (!props.closed ? "180deg" : "0deg")});
	}
`;

export default ToggleChevron