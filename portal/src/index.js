import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'components/main/App';
import reportWebVitals from 'reportWebVitals';
// import 'antd/dist/reset.css';
import regisWindow from 'global';

const root = ReactDOM.createRoot(document.getElementById('root'));
regisWindow().then(() => root.render(<App />));
// reportWebVitals();
