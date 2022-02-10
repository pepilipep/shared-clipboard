const header = document.getElementById('header')

window.addEventListener('load', async (e) => {
    const logged = await isLoggedIn()

    const headerText = document.createElement('h1')
    headerText.innerText = 'shared clipboard'
    header.replaceChildren(headerText)

    const headerActionsWrapper = document.createElement('div')
    headerActionsWrapper.className = 'header-actions-wrapper'

    header.appendChild(headerActionsWrapper)

    if (logged) {
        const notificationsCount = await getNotifications(true)

        const profile = document.createElement('a')
        profile.className = 'btn'
        profile.href = '/profile.html'
        profile.innerText = 'Profile'
        headerActionsWrapper.appendChild(profile)

        const notEl = document.createElement('a')
        notEl.className = 'btn'
        notEl.href = '/profile.html'
        notEl.innerText = notificationsCount
        headerActionsWrapper.appendChild(notEl)

        const lbut = document.createElement('button')
        lbut.className = 'btn'
        lbut.onclick = logout
        lbut.innerText = 'Logout'
        headerActionsWrapper.appendChild(lbut)
    } else {
        const signUp = document.createElement('a')
        signUp.className = 'btn'
        signUp.href = '/register.html'
        signUp.innerText = 'Sign up'
        headerActionsWrapper.appendChild(signUp)

        const login = document.createElement('a')
        login.className = 'btn'
        login.href = '/login.html'
        login.innerText = 'Login'
        headerActionsWrapper.appendChild(login)
    }
})
