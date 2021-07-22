import {BrowserRouter as Router} from 'react-router-dom';

import React from 'react'
import './index.css';
import App from "./App";
import ReactDOM from 'react-dom';
import './i18n';

ReactDOM.render((
    <React.StrictMode>
        <Router basename={`${process.env.PUBLIC_URL}#`}>
            <App/>
        </Router>
    </React.StrictMode>
), document.getElementById('root'));
