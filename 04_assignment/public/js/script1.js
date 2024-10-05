function windowOnLoad(){
    const token=localStorage.getItem("token");
    const signupSigninDiv=document.getElementById("signup-signin-div");
    const logoutBtn=document.getElementById("logout");

    document.getElementById("logout").addEventListener('click',(e)=>{
            localStorage.removeItem("token");
            signupSigninDiv.classList.remove('hide');
            signupSigninDiv.classList.add('show');

            e.target.classList.remove('show');
            e.target.classList.add('hide');
            window.location.reload();
    })
    if(token){
        signupSigninDiv.classList.remove('show');
        signupSigninDiv.classList.add('hide');

        logoutBtn.classList.remove('hide');
        logoutBtn.classList.add('show');

        //now call for user-information
        userInformation();
    }else{
        logoutBtn.classList.remove('show');
        logoutBtn.classList.add('hide');
    }
}
async function handleSubmit(event) {
    try {
        event.preventDefault();
        const targetElem = event.target;
        const targetElemId = targetElem.id;
        const usernameInput = targetElem.firstElementChild.children[1].value;
        const passwordInput = targetElem.children[1].children[1].value;
        if (targetElemId === "signup-form") {
            const res = await axios.post('/signup', {
                username: usernameInput,
                password: passwordInput
            });
            console.log(res.data);
        }
        else if (targetElemId === "signin-form") {
            console.log('signin-form condition')
            const res = await axios.post('/signin', {
                username: usernameInput,
                password: passwordInput
            });

            localStorage.setItem("token", res.data.token);
            await userInformation();
        }
    }
    catch (err) {
        if (err.status >= 400 && err.status < 500) {
            alert('No Such User Found');
        }
        window.alert('Error in sending signup request to backend!!');
        console.log(err);
    }

}

async function userInformation() {
    try {
        const res = await axios.get('/me', {
            headers: {
                token: localStorage.getItem("token")
            }
        });
        console.log(res.data);
        const statusCode = parseInt(res.status);
  const data = res.data;
            document.getElementById("user-information").innerHTML = `UserName: ${data.username} with Password: ${data.password}`;
            windowOnLoad();
    } catch (err) {
        if (statusCode >= 400 && statusCode < 500) {
            alert('No Such User Found');
        }
        console.log(err);
    }
}