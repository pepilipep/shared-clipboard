const header = document.getElementById('header')

function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
}

window.addEventListener('load', (e) => {
    const session = getCookie('PHPSESSID')

    if (session) {
        header.innerHTML = `
        <h1>
            ––––SHARED CLIPBOARD–––––––––––––––––––––––––––––––––––––
            <a href="/profile.html">Profile</a>
        </h1>
        `
    } else {
        header.innerHTML = `
        <h1>
            ––––SHARED CLIPBOARD–––––––––––––––––––––––––––––––––––––
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
