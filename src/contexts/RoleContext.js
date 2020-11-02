import { createContext, useReducer } from "react";
import lodash from "lodash";
export const RoleContext = createContext({});

const Actions = {
	EDIT: "edit",
	CREATE: "create",
	UPDATE: "update",
	ERROR: "error",
	SETUP: "setup",
	ADD_REACTION: "add_reaction",
};

const initialState = () => ({
	editing: false,
	error: null,
	manager: {},
	type: null,
});

const RoleReducer = (state, action) => {
	switch (action.type) {
	case Actions.SETUP:
		console.log("reseting to ", initialState());
		return { ...initialState() };
	case Actions.EDIT:
		return { ...state, manager: action.manager, type: action.creatingType, editing: true };
	case Actions.CREATE:
		return { ...initialState(), type: action.creatingType };
	case Actions.UPDATE:
		const newState = { ...state };
		lodash.set(newState, action.path, action.value);
		return newState;
	case Actions.ERROR:
		return { ...state, error: { message: action.message } };
	case Actions.ADD_REACTION:
		if (state.manager?.actions) {
			return { ...state, manager: { ...state.manager, actions: [...state.manager.actions, action.reaction] } };
		} else {
			return { ...state, manager: { ...state.manager, actions: [action.reaction] } };
		}
	default:
		return state;
	}
};

export const RoleContextProvider = props => {
	const [state, dispatch] = useReducer(RoleReducer, { ...initialState() });
	const setup = () => dispatch({ type: Actions.SETUP });

	const create = type => {
		setup();
		dispatch({ type: Actions.CREATE, creatingType: type });
	};

	const edit = (manager, type) => {
		dispatch({ type: Actions.EDIT, manager, creatingType: type });
	};

	const update = (path, value) => {
		dispatch({ type: Actions.UPDATE, path, value });
	};

	const error = message => {
		dispatch({ type: Actions.ERROR, message });
	};

	const addReaction = reaction => {
		dispatch({ type: Actions.ADD_REACTION, reaction });
	};

	return (
		<RoleContext.Provider
			value={{
				state,
				dispatch,
				setup,
				create,
				edit,
				update,
				error,
				addReaction,
			}}
		>
			{props.children}
		</RoleContext.Provider>
	);
};
