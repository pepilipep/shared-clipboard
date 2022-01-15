const form = document.getElementById('clip')

window.onload = function (e) {
    const url = window.location.pathname.replace('/clips/', '')
    const content = document.getElementById('content')

    const data = new FormData()
    data.set('url', url)

    fetch('/fetchClip.php', {
        method: 'POST',
        body: data,
    })
        .then((res) => res.json())
        .then((res) => {
            if (res && res.content) content.value = res.content
        })
        .catch((e) => console.error('Something went wrong', e))
}

form.addEventListener('submit', (event) => {
    const url = window.location.pathname.replace('/clips/', '')

    const data = new FormData(event.target)
    data.set('url', url)

    console.log('WHAT DID I DO')
    fetch('/clip.php', {
        method: 'POST',
        body: data,
    })
        .then((res) => res.json())
        .catch((e) => console.error('Something went wrong:', e))

    event.preventDefault()
})
