import React, { createContext, useReducer } from "react";
import lodash from "lodash";
// lodash.get(object, nestedPropertyString);
// lodash.set(object, path, value)
export const RoleContext = createContext({});

const Actions = {
	EDIT: "edit",
	CREATE: "create",
	UPDATE: "update",
	ERROR: "error",
	SETUP: "setup",
};

const initialState = {
	editing: false,
	error: null,
	manager: {},
	type: null,
};

const RoleReducer = (state, action) => {
	switch (action.type) {
		case Actions.SETUP:
			return initialState;
		case Actions.EDIT:
			return { ...state, manager: action.manager, type: action.creatingType, editing: true };
		case Actions.CREATE:
			return { ...state, type: action.creatingType };
		case Actions.UPDATE:
			const newState = { ...state };
			lodash.set(newState, action.path, action.value);
            return newState;
        case Actions.ERROR: 
            return {...state, error: {message: action.message}}
		default:
			return state;
	}
};

export const RoleContextProvider = props => {
	const [state, dispatch] = useReducer(RoleReducer, initialState);

	const setup = () => dispatch({ type: Actions.SETUP });

	const create = type => {
		setup();
		dispatch({ type: Actions.CREATE, creatingType: type });
	};

	const edit = (manager, type) => {
		dispatch({ action: Actions.EDIT, manager, creatingType: type });
	};

	const update = (path, value) => {
		dispatch({ action: Actions.UPDATE, path, value });
    };
    
    const error = message => {
        dispatch({action: Actions.ERROR, message})
    }

	return (
		<RoleContext.Provider
			value={{
				state,
				dispatch,
				setup,
				create,
				edit,
                update,
                error
			}}
		>
			{props.children}
		</RoleContext.Provider>
	);
};
