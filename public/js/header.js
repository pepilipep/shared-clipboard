const header = document.getElementById('header')

window.addEventListener('load', async (e) => {
    const logged = await isLoggedIn()

    const headerH1 = document.createElement('h1')
    const headerLink = document.createElement('a')
    headerLink.innerText = 'shared clipboard'
    headerLink.href = '/'
    headerH1.appendChild(headerLink)

    header.replaceChildren(headerH1)

    const headerActionsWrapper = document.createElement('div')
    headerActionsWrapper.className = 'header-actions-wrapper'

    header.appendChild(headerActionsWrapper)

    if (logged) {
        const notificationsCount = await getNotifications(true)

        const profile = document.createElement('a')
        profile.href = '/profile.html'
        profile.innerText = 'Profile'
        headerActionsWrapper.appendChild(profile)

        const notEl = document.createElement('a')
        notEl.href = '/profile.html'
        notEl.innerText = notificationsCount
        headerActionsWrapper.appendChild(notEl)

        const lbut = document.createElement('button')
        lbut.onclick = logout
        lbut.innerText = 'Logout'
        headerActionsWrapper.appendChild(lbut)
    } else {
        const signUp = document.createElement('a')
        signUp.href = '/register.html'
        signUp.innerText = 'Sign up'
        headerActionsWrapper.appendChild(signUp)

        const login = document.createElement('a')
        login.href = '/login.html'
        login.innerText = 'Login'
        headerActionsWrapper.appendChild(login)
    }
})
