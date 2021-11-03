const _githubPersonalToken = localStorage.getItem('githubpersonaltoken');
_params = {};

if (_githubPersonalToken)
	_params.headers = {
		Authorization: `Bearer ${_githubPersonalToken}`
	};

/**
 * @param  {string} username github accounts username
 *
 * Retrives Github User from GitHub's API
 */
getUser = async (username) => {
	const request = await fetch(`https://api.github.com/users/${username}`, _params);
	outOfRequests(request);
	if (request.status === 404) return null;
	const data = await request.json();
	return data;
};

/**
 * @param  {string} username github accounts username
 *
 * Retrives Github User Repos from GitHub's API
 */
getUserRepos = async (username) => {
	const request = await fetch(`https://api.github.com/users/${username}/repos`, _params);
	outOfRequests(request);
	if (request.status === 404) return null;
	const data = await request.json();
	return data;
};

/**
 * @param  {string} url URL to make request to
 *
 * Makes a fetch and includes _params
 */
fetchURL = async (url) => {
	const request = await fetch(url, _params);
	outOfRequests(request);
	if (request.status === 404) return null;
	const data = await request.json();
	return data;
};

/**
 * @param  {string} repo github repo name
 *
 * Retrives Github Repository from GitHub's API
 */
getRepo = async (repo) => {
	const request = await fetch(`https://api.github.com/repos/${repo}`, _params);
	outOfRequests(request);
	if (request.status === 404) return null;
	const data = await request.json();
	return data;
};

/**
 * @param  {string} username
 *
 * Searches for username that matches input in GitHub's API
 */
searchUser = async (username) => {
	const request = await fetch(`https://api.github.com/search/users?q=${username}`, _params);
	outOfRequests(request);
	const data = await request.json();
	const users = data.items;
	// while (true) {
	//     const index = users.findIndex(o => o.type === "Organization")
	//     if (index === -1) {
	//         break;
	//     } else {
	//         users.splice(index, 1)
	//     }
	// }
	return users;
};

/**
 * @param  {string} user github accounts username
 *
 * Retrives all events for user from GitHub's API
 */
getEvents = async (user) => {
	let i = 1;
	let commits = [];
	while (true) {
		const request = await fetch(`https://api.github.com/users/${user}/events?sort=pushed&per_page=100&page=${i}`, _params);
		if (request.status !== 200) break;
		outOfRequests(request);
		const data = await request.json();
		commits = commits.concat(data);
		i++;
	}
	while (true) {
		const index = commits.findIndex((e) => e.type !== 'PushEvent');
		if (index == -1) break;
		else commits.splice(index, 1);
	}

	return commits;
};

/**
 * @param  {string} repo github repo
 *
 * Retrives all events from repo from GitHub's API
 */
getRepositoryEvents = async (repo) => {
	let i = 1;
	let commits = [];
	while (true) {
		const request = await fetch(`https://api.github.com/repos/${repo}/events?sort=pushed&per_page=100&page=${i}`, _params);
		if (request.status !== 200) break;
		outOfRequests(request);
		const data = await request.json();
		commits = commits.concat(data);
		i++;
	}
	while (true) {
		const index = commits.findIndex((e) => e.type !== 'PushEvent');
		if (index == -1) break;
		else commits.splice(index, 1);
	}

	return commits;
};

/**
 * @param  {Response} request response object from fetch request
 *
 * Checks if your out of request on GitHub's API and displays error if you're out.
 */
outOfRequests = (request) => {
	if (request.status === 403) {
		const path = `${window.location.origin + window.location.pathname.substring(0, window.location.pathname.length - 9)}/authenticate.html`;
		window.location = path;
	}
};

/**
 * @param  {array} repoArray
 *
 * Converts repoarray to the top languages
 */
reposToLanguages = (repoArray) => {
	const topLangs = [];
	repoArray.forEach(async (repo) => {
		const languages = await fetchURL(repo.languages_url);
		for (const lang in languages) {
			const index = topLangs.findIndex((e) => e.lang == lang);
			if (index == -1) {
				topLangs.push({
					lang: lang,
					amount: languages[lang]
				});
			} else {
				topLangs[index].amount += languages[lang];
			}
			topLangs.sort((a, b) => b.amount - a.amount);
		}
	});
	return topLangs;
};

/**
 * @param  {array} repoArray
 *
 * Converts repoarray to the issues
 */
reposToIssues = (repoArray) => {
	const issues = [];
	repoArray.forEach(async (repo) => {
		const issueFromRepo = await fetchURL(`${repo.url}/issues?state=all`);
		issues.push(...issueFromRepo);
	});
	return issues;
};

/**
 * @param  {array} repoArray
 *
 * Converts repoarray to the pulls
 */
reposToPullRequests = async (repoArray) => {
	const pullRequests = [];
	repoArray.forEach(async (repo) => {
		const pullRequestsFromRepo = await fetchURL(`${repo.url}/pulls?state=all`);
		pullRequests.push(...pullRequestsFromRepo);
	});
	return pullRequests;
};

/**
 * @param  {object} repo
 *
 * Converts repo to the pulls
 */
repoToPullRequests = async (repo) => {
	return await fetchURL(`${repo.url}/pulls?state=all`);
};

/**
 * @param  {object} repo
 *
 * Converts repo to the issues
 */
repoToIssues = async (repo) => {
	return await fetchURL(`${repo.url}/issues?state=all`);
};

/**
 * @param  {object} repo
 *
 * Converts repo to the top languages
 */
repoToLanguages = async (repo) => {
	const topLangs = [];
	const languages = await fetchURL(repo.languages_url);
	for (const lang in languages) {
		topLangs.push({
			lang: lang,
			amount: languages[lang]
		});
		topLangs.sort((a, b) => b.amount - a.amount);
	}
	return topLangs;
};
