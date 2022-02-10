const header = document.getElementById('header')

window.addEventListener('load', async (e) => {
    const logged = isLoggedIn()

    const headerText = document.createElement('h1')
    headerText.innerText =
        '––––SHARED CLIPBOARD–––––––––––––––––––––––––––––––––––––'
    header.replaceChildren(headerText)

    if (logged) {
        const notifications = await getNotifications()

        const profile = document.createElement('a')
        profile.href = '/profile.html'
        profile.innerText = 'Profile'
        header.appendChild(profile)

        const notEl = document.createElement('h3')
        notEl.innerText = notifications.length
        header.appendChild(notEl)
    } else {
        const signUp = document.createElement('a')
        signUp.href = '/register.html'
        signUp.innerText = 'Sign up'
        header.appendChild(signUp)

        const login = document.createElement('a')
        login.href = '/login.html'
        login.innerText = 'Login'
        header.appendChild(login)
    }
})
