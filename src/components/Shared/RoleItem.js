import styled from "styled-components";

const colorify = number => `#${number === 0 ? "#99aab5" : number.toString(16).padStart(6, '0')}`;

const RoleItem = styled.div`
	height: 12px;
	border-radius: 22px;
	height: 12px;
	padding: 0.25rem 0.5rem;
	font-size: 12px;
	width: max-content;
	display: flex;
	align-items: center;
	background: #2f3136aa;
	border: 2px solid ${props => colorify(props.color)};
    line-height: 1;
    position: relative;
    font-weight: 600;
    color: #ccc;
    &:before{
        display: inline-block;
        content: "";
        width: 12px;
        height: 12px;
        margin-left: -.25rem;
        margin-right: .25rem;
        border-radius: 50%;
        background: ${props => colorify(props.color)};
    }
`;

export default RoleItem;
