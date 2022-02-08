const header = document.getElementById('header')

window.addEventListener('load', (e) => {
    const session = getCookie('PHPSESSID')

    title = '––––SHARED CLIPBOARD–––––––––––––––––––––––––––––––––––––'

    if (session) {
        header.innerHTML = `
        <h1>
           ${title}
            <a href="/profile.html">Profile</a>
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
