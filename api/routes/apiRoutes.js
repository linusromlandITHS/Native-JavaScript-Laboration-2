module.exports = (function () {
	//Dependencies import
	const express = require('express');
	const router = express.Router();

	//STUPID FUCKING IMPORT OF node-fetch! FIX YOUR SHIT node-fetch! THIS IF FKN UGLY!!!!!!!!!!!!!!!!
	const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

	router.get('/callback', async (req, res) => {
		//Makes request to GitHub to authenticate
		const request = await fetch('https://github.com/login/oauth/access_token', {
			body: `{ "client_id": "${process.env.CLIENT_ID}", "client_secret": "${process.env.SECRET}", "code": "${req.query.code}" }`,
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			},
			method: 'POST'
		});

		//Converts repsonse to text
		const authResponse = await request.text();

		//gets token from response text and send to client
		res.send(JSON.parse(authResponse)['access_token']).status(200);
	});

	return router;
})();
