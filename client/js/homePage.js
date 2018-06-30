/**
 * ========================================================
 * Import required function(s) from additional scripts
 * (these scripts are present in the appropriate html file)
 * ========================================================
 * import parseJwt from './helpers/parseJwt.js';
 */

/* eslint-disable indent, no-tabs */
const baseUrl = window.location.origin;
const rightNavbar = document.getElementsByClassName('right-menu')[0];
const getStarted = document.getElementsByClassName('get-started');
const token = window.localStorage.getItem('token');

/**
 * update navbar if user is not logged in
 */
const noOrExpiredToken = () => 
	'<li><a href="/login.html" class="nav-item">Login</a></li><li><a href="/signup.html" class="nav-item">Sign Up</a></li>';

/**
 * update navbar if logged in user is an admin
 */
const adminToken = () =>
	`<li class="admin">
			<div>
					<a href="#" class="nav-item"><span id="display-username">Welcome &nbsp;</span>
							<span>
									<i class="icon ion-android-arrow-dropdown"></i>
							</span>
					</a>
			</div>
			<div class="drop-down-menu hide">
					<a href="/admin-dashboard.html">Dashboard</a>
					<a id="logout" href="#">Logout</a>
			</div>
	</li>`;

/**
 * update navbar if logged in user is a regular user
 */
const userToken = () =>
	`<li class="request">
			<div>
					<a href="#" class="nav-item">Requests
							<span><i class="icon ion-android-arrow-dropdown"></i></span>
					</a>
			</div>
			<div class="drop-down-menu hide">
					<a href="/make-request.html">Make Request</a><a href="/view-requests.html">View Requests</a>
			</div>
	</li>
	<li class="user">
			<div>
					<a href="#" class="nav-item"><span  id="display-username">Welcome &nbsp;</span>
							<span><i class="icon ion-android-arrow-dropdown"></i></span>
					</a>
			</div>
			<div class="drop-down-menu hide">
				<a id="logout" href="#">Logout</a>
			</div>
	</li>`;

/**
 * call this on page load
 */
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
		for (let i = 0; i < getStarted.length; i += 1) {
			getStarted[i].setAttribute('href', '/admin-dashboard.html');
		}
		return;
	}
	if (userDetails.role === 'user') {
		rightNavbar.innerHTML = userToken();
		const displayUsername = document.getElementById('display-username');
		displayUsername.append(userDetails.username);
		for (let i = 0; i < getStarted.length; i += 1) {
			getStarted[i].setAttribute('href', '/view-requests.html');
		}
	}
};

window.onload = init();
