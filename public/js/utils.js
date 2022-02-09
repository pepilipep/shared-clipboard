function isLoggedIn() {
    return !!window.sessionStorage.getItem('email')
}

window.addEventListener('load', (event) => {
    const logged = isLoggedIn()
    if (logged) {
        return
    }

    fetch('/auth.php', { method: 'GET' })
        .then((res) => res.json())
        .then((res) => {
            if (res && res.logged_in) {
                window.sessionStorage.setItem('email', res.email)
                window.sessionStorage.setItem('username', res.username)
            }
        })
        .catch((e) => console.error('Something went wrong:', e))
})
