const header = document.getElementById('header')

window.addEventListener('load', async (e) => {
    const logged = await isLoggedIn()

    const headerLink = document.createElement('a')
    const headerH1 = document.createElement('h1')
    headerH1.innerText = 'shared clipboard'
    headerLink.href = '/'
    headerLink.appendChild(headerH1)

    header.replaceChildren(headerLink)

    const headerActionsWrapper = document.createElement('div')
    headerActionsWrapper.className = 'header-actions-wrapper'

    header.appendChild(headerActionsWrapper)

    if (logged) {
        const notificationsCount = await getNotifications(true)

        const profile = document.createElement('a')
        profile.href = '/profile.html'
        profile.innerText = `Profile [ ${window.sessionStorage.getItem(
            'username'
        )} ]`
        headerActionsWrapper.appendChild(profile)

        const notEl = document.createElement('a')
        notEl.href = '/profile.html?tab=notifications'
        notEl.className = 'notifications-box'

        const notifText = document.createElement('h4')
        notifText.innerText = notificationsCount
        if (notificationsCount > 0) {
            notEl.className += ' has-notifications'
        }

        const notifIcon = document.createElement('img')
        notifIcon.src = '/img/notifications.svg'

        notEl.appendChild(notifIcon)
        notEl.appendChild(notifText)
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
