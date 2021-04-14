import ready from 'domready';

import App from './App';

ready(() => {
	// const appFace = new App('.container');
	const appMap = new App('.container2','map');
	window.app = new App('.container2','map');
	// appFace.init();
	window.app.init();
});
