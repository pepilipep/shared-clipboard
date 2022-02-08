const clipsTable = document.getElementById('clips')

window.addEventListener('load', (e) => {
    const session = getCookie('PHPSESSID')
    if (!session) {
        window.location.replace('/login.html')
    }
})

function ownedClips() {
    fetch('/ownedClips.php', {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((e) => console.error('Something went wrong:', e))
}
