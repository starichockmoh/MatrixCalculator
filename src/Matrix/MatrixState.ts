import {combineReducers, compose, createStore} from "redux";


type PropertiesType<T> = T extends {[key: string]: infer U} ? U : never

export type ActionsType<T extends {[key: string]: (...arg: any[]) => any} > = ReturnType<PropertiesType<T>>


let InitialState= {
    isClear: true,
    wasError: false,
    wasClicked: false,
    Matrix_A_Size: [2,2],
    Matrix_B_Size: [2,2],
}

type InitialStateType = typeof InitialState

let MatrixReducer = (state = InitialState, action:MatrixActionsType): InitialStateType  => {
    switch (action.type) {
        case "MATRIX_CLEAR": {
            return {
                ...state,
                isClear: action.isClear
            }
        }
        case "MATRIX_WAS_CLICKED": {
            return {
                ...state,
                wasClicked: action.wasClicked
            }
        }
        case "MATRIX_WAS_ERROR":{
            return {
                ...state,
                wasError: action.wasError
            }
        }
        case "SET_MATRIX_SIZE":{
            if (action.MatrixName === "A") {
                return {
                    ...state,
                    Matrix_A_Size: action.size
                }
            } else return {
                ...state,
                Matrix_B_Size: action.size
            }
        }
        default:
            return state

    }
}

type MatrixActionsType = ActionsType<typeof MatrixActions>

export const MatrixActions = {
    isClear:(isClear: boolean) => ({type: 'MATRIX_CLEAR', isClear} as const),
    wasClicked:(wasClicked: boolean) => ({type: 'MATRIX_WAS_CLICKED', wasClicked} as const),
    wasError:(wasError: boolean) => ({type: 'MATRIX_WAS_ERROR', wasError} as const),
    setMatrixSize:(MatrixName: "A" | "B", size: Array<number>) => ({type: "SET_MATRIX_SIZE", MatrixName, size} as const)
}


const MainReducer = combineReducers({
    Matrix: MatrixReducer
})
export type MatrixStateType = ReturnType<typeof MainReducer>

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const MatrixStore = createStore(MainReducer,composeEnhancers())