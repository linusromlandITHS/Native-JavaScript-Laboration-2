//Location
const partialLocation = 'partials/';

initPartials = () => {
	const partialNodes = document.querySelectorAll('[data-partials]');

	partialNodes.forEach(async (element) => {
		const elementName = element.getAttribute('data-partials');
		const request = await fetch(partialLocation + elementName);
		const htmlResponse = await request.text();
		if (request.status == 200) {
			element.innerHTML = htmlResponse;
		} else {
			console.error(`Error! Could not get ${elementName}`);
		}
	});
};
