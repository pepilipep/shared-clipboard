function isLoggedIn() {
    const logged = !!window.sessionStorage.getItem('email')
    if (logged) {
        return true
    }

    return fetch('/auth.php', { method: 'GET' })
        .then((res) => res.json())
        .then((res) => {
            if (res && res.logged_in) {
                window.sessionStorage.setItem('email', res.email)
                window.sessionStorage.setItem('username', res.username)
                return true
            }
            return false
        })
        .catch((e) => {
            console.error('Something went wrong:', e)
            return false
        })
}

async function getNotifications(countOnly = false) {
    return fetch(`/notifications.php?count_only=${countOnly}`, {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((res) => {
            if (res && res.error) {
                window.sessionStorage.clear()
            }
            return res
        })
        .catch((e) => console.error('Something went wrong:', e))
}

function logout() {
    fetch('/logout.php', { method: 'POST' })
        .then((res) => res.json())
        .then((_) => window.sessionStorage.clear())
        .then((_) => window.location.replace('/'))
        .catch((e) => console.error('Something went wrong:', e))
}
