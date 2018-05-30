/* eslint-disable indent, no-tabs */
const rightNavbar = document.getElementsByClassName('right-menu')[0];
const token = window.localStorage.getItem('token');

// perseJwt function from stackoverflow >> https://stackoverflow.com/a/38552302
const parseJwt = (jwToken) => {
  const base64Url = jwToken.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
};

const noOrExpiredToken = () => 
	'<li><a href="/login.html" class="nav-item">Login</a></li><li><a href="/signup.html" class="nav-item">Sign Up</a></li>';

const adminToken = () =>
	`<li class="admin">
			<div>
					<a href="#" class="nav-item"><span id="display-username">Welcome &nbsp;</span>
							<span class="not-mobile">
									<i class="icon ion-android-arrow-dropdown"></i>
							</span>
					</a>
			</div>
			<div class="drop-down-menu hide">
					<a href="/admin-profile.html">Profile</a>
					<a href="/admin-dashboard.html">Dashboard</a>
					<a href="#">Logout</a>
			</div>
	</li>`;

const userToken = () =>
	`<li class="request">
			<div>
					<a href="#" class="nav-item">Requests
							<span class="not-mobile"><i class="icon ion-android-arrow-dropdown"></i></span>
					</a>
			</div>
			<div class="drop-down-menu hide">
					<a href="/make-request.html">Make Request</a><a href="/view-requests.html">View Requests</a>
			</div>
	</li>
	<li class="user">
			<div>
					<a href="#" class="nav-item"><span  id="display-username">Welcome &nbsp;</span>
							<span class="not-mobile"><i class="icon ion-android-arrow-dropdown"></i></span>
					</a>
			</div>
			<div class="drop-down-menu hide">
				<a href="/user-profile.html">Profile</a><a href="#">Logout</a>
			</div>
	</li>`;

const init = () => {
  if (!token) {
		rightNavbar.innerHTML = noOrExpiredToken();
		return;
	}
	const userDetails = parseJwt(token);
	const currentTime = Math.floor(Date.now() / 1000);
	if (userDetails.exp < currentTime) {
		rightNavbar.innerHTML = noOrExpiredToken();
		return;
	}
	if (userDetails.role === 'admin') {
		rightNavbar.innerHTML = adminToken();
		const displayUsername = document.getElementById('display-username');
		displayUsername.append(userDetails.username);
		return;
	}
	if (userDetails.role === 'user') {
		rightNavbar.innerHTML = userToken();
		const displayUsername = document.getElementById('display-username');
		displayUsername.append(userDetails.username);
	}
};

window.onload = init();
