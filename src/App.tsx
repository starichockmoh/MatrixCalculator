import React from 'react';
import './App.css';
import {Provider} from "react-redux";
import {Matrix} from "./Matrix/MatrixComponent";
import {MatrixStore} from "./Matrix/MatrixState";


function App() {
    return (
        <React.StrictMode>
            <Provider store={MatrixStore}>
                <Matrix/>
            </Provider>
        </React.StrictMode>
    );
}

export default App;
