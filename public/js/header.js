const header = document.getElementById('header')

window.addEventListener('load', async (e) => {
    const logged = isLoggedIn()

    title = '––––SHARED CLIPBOARD–––––––––––––––––––––––––––––––––––––'

    if (logged) {
        const notifications = await getNotifications()
        header.innerHTML = `
        <h1>
           ${title}
            <a href="/profile.html">Profile</a>
            ${notifications.length}
        </h1>
        `
    } else {
        header.innerHTML = `
        <h1>
            ${title}
            <a href="/register.html" class="form-element form-button">
                Sign up
            </a>
            <a href="/login.html" class="form-element form-button">
                Login
            </a>
        </h1>
    `
    }
})
