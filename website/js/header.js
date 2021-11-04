checkToken = async () => {
	const authArea = document.querySelector('#authArea');
	const personalToken = localStorage.getItem('githubpersonaltoken');
	authArea.innerHTML = '';
	if (personalToken) {
		const request = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${personalToken}`
			}
		});
		const data = await request.json();
		if (data.login) {
			const name = data.name ? data.name : data.login;

			const p = document.createElement('p');
			p.textContent = `Authenticated as ${name}`;

			// Profile Image
			const profileImage = document.createElement('img');
			profileImage.alt = 'Authenticated Profile Image';
			profileImage.src = `${data.avatar_url}&s=55`;
			profileImage.width = 35;
			profileImage.height = 35;
			profileImage.style.borderRadius = '999px';

			const logOut = document.createElement('button');
			logOut.textContent = `Logout`;
			logOut.onclick = () => {
				localStorage.removeItem('githubpersonaltoken');
				console.log(localStorage.getItem('githubpersonaltoken'));
				checkToken();
			};
			authArea.append(p, profileImage, logOut);
		} else {
			const a = document.createElement('a');
			a.href = './authenticate.html';
			a.textContent = 'Authenticate';
			authArea.appendChild(a);
		}
	} else {
		const a = document.createElement('a');
		a.href = './authenticate.html';
		a.textContent = 'Authenticate';
		authArea.appendChild(a);
	}
};
