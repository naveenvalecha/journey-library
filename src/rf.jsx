/**
 * Copyright Morpht Pty Ltd 2020
 */
import React from 'react';
import ReactDOM from 'react-dom';

import App from './Refac.jsx';

 var root = document.getElementById('journey');

ReactDOM.render(
    <App {...(root.dataset)} />,
    root
);

// console.log(root)
//
// window.mount = function (id) {
//
//  console.log(id)
//
//     var root = document.getElementById(id);
//     if (!root) {
//         console.log('No element with  id="' + id + '" available on the page. ' +
//             'Please ensure that it exists and that its rendered before the script is called.')
//     } else {
//         ReactDOM.render(
//             <App {...(root.dataset)} />,
//             root
//         );
//     }
// }

module.hot.accept();
