export const authenticate = async (user, pass) => {
    console.log("Trying to authenticate", user, pass);
    const response = await fetch(`/auth/login/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: user,
            password: pass
        })
    }).catch(err => console.log(err));

    const data = await response.json();

    console.log("authenticate response", data);
}