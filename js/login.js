async function loginStart() {
	let loginForm = document.querySelector('div.login');
	let errorForm = document.querySelector('div.login .errors');
	let lInput = loginForm.querySelector('input[name="login"]');
	let pInput = loginForm.querySelector('input[name="passphrase"]');
	let login = lInput.value;
	if( !login ){
		lInput.classList.add('error');
	}
	let passphrase = pInput.value;
	if( !passphrase ){
		pInput.classList.add('error');
	}
	if( !login || !passphrase ){
		return false;
	}
	await doRequest({
		pre_auth: false,
		method: 'get',
		url: `${HOST}/api/login`,
		params: {login:login,password:passphrase},
	}).then((ret)=>{
		if( ret.status == 401 ){
			errorForm.style.bottom = "-80px";
			setTimeout(()=>{
				errorForm.style.bottom = 0;
			}, 5000);
		} else if (ret.status == 200) {
			document.getElementById('login_submit').setAttribute('disabled', true);
			setCookie('token', ret.body.token.Token, ret.body.token.Expires);
			window.location = '/admin.html';
		}
	});
}