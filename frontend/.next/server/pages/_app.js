/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction App({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        // Redirect to login if on home page\n        if (router.pathname === \"/\") {\n            const token = localStorage.getItem(\"token\");\n            const user = localStorage.getItem(\"user\");\n            if (token && user) {\n                const userData = JSON.parse(user);\n                if (userData.role === \"admin\") {\n                    router.push(\"/admin\");\n                } else {\n                    router.push(\"/user\");\n                }\n            } else {\n                router.push(\"/login\");\n            }\n        }\n    }, [\n        router.pathname\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\ritik\\\\OneDrive\\\\Desktop\\\\inventory-management\\\\frontend\\\\pages\\\\_app.js\",\n        lineNumber: 27,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBK0I7QUFDRztBQUNNO0FBRXpCLFNBQVNFLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDbEQsTUFBTUMsU0FBU0osc0RBQVNBO0lBRXhCRCxnREFBU0EsQ0FBQztRQUNSLG9DQUFvQztRQUNwQyxJQUFJSyxPQUFPQyxRQUFRLEtBQUssS0FBSztZQUMzQixNQUFNQyxRQUFRQyxhQUFhQyxPQUFPLENBQUM7WUFDbkMsTUFBTUMsT0FBT0YsYUFBYUMsT0FBTyxDQUFDO1lBRWxDLElBQUlGLFNBQVNHLE1BQU07Z0JBQ2pCLE1BQU1DLFdBQVdDLEtBQUtDLEtBQUssQ0FBQ0g7Z0JBQzVCLElBQUlDLFNBQVNHLElBQUksS0FBSyxTQUFTO29CQUM3QlQsT0FBT1UsSUFBSSxDQUFDO2dCQUNkLE9BQU87b0JBQ0xWLE9BQU9VLElBQUksQ0FBQztnQkFDZDtZQUNGLE9BQU87Z0JBQ0xWLE9BQU9VLElBQUksQ0FBQztZQUNkO1FBQ0Y7SUFDRixHQUFHO1FBQUNWLE9BQU9DLFFBQVE7S0FBQztJQUVwQixxQkFBTyw4REFBQ0g7UUFBVyxHQUFHQyxTQUFTOzs7Ozs7QUFDakMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbnZlbnRvcnktZnJvbnRlbmQvLi9wYWdlcy9fYXBwLmpzP2UwYWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIC8vIFJlZGlyZWN0IHRvIGxvZ2luIGlmIG9uIGhvbWUgcGFnZVxyXG4gICAgaWYgKHJvdXRlci5wYXRobmFtZSA9PT0gJy8nKSB7XHJcbiAgICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbiAgICAgIGNvbnN0IHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xyXG4gICAgICBcclxuICAgICAgaWYgKHRva2VuICYmIHVzZXIpIHtcclxuICAgICAgICBjb25zdCB1c2VyRGF0YSA9IEpTT04ucGFyc2UodXNlcik7XHJcbiAgICAgICAgaWYgKHVzZXJEYXRhLnJvbGUgPT09ICdhZG1pbicpIHtcclxuICAgICAgICAgIHJvdXRlci5wdXNoKCcvYWRtaW4nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcm91dGVyLnB1c2goJy91c2VyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJvdXRlci5wdXNoKCcvbG9naW4nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFtyb3V0ZXIucGF0aG5hbWVdKTtcclxuXHJcbiAgcmV0dXJuIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz47XHJcbn0iXSwibmFtZXMiOlsidXNlRWZmZWN0IiwidXNlUm91dGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwicm91dGVyIiwicGF0aG5hbWUiLCJ0b2tlbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJ1c2VyIiwidXNlckRhdGEiLCJKU09OIiwicGFyc2UiLCJyb2xlIiwicHVzaCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();