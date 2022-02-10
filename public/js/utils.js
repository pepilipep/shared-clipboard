function isLoggedIn() {
    return !!window.sessionStorage.getItem('email')
}

async function getNotifications(countOnly = false) {
    return fetch(`/notifications.php?count_only=${countOnly}`, {
        method: 'GET',
    })
        .then((res) => res.json())
        .catch((e) => console.error('Something went wrong:', e))
}

function logout() {
    fetch('/logout.php', { method: 'POST' })
        .then((res) => res.json())
        .then((_) => window.sessionStorage.clear())
        .then((_) => window.location.replace('/'))
        .catch((e) => console.error('Something went wrong:', e))
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
