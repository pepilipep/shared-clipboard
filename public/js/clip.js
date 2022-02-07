const form = document.getElementById('clip')
const typeSelect = document.getElementById('content-type')

window.addEventListener('load', (e) => {
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
})

typeSelect.addEventListener('change', (event) => {
    const newType = event.target.value

    const content = document.getElementById('content')

    if (newType === 'text') {
        content.type = 'text'
    } else {
        content.type = 'file'
    }
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

    console.log('IM HERE')
    const url = window.location.pathname.replace('/clips/', '')

    // file
    const contentType = typeSelect.value
    const contentElement = document.getElementById('content')
    const expiryTime = document.getElementById('expiry-time').value

    const content =
        contentType === 'text' ? contentElement.value : contentElement.files[0]

    const data = new FormData()
    data.set('url', url)
    data.set('content-type', contentType)
    data.set('content', content)
    data.set('expiry-time', expiryTime)

    fetch('/clip.php', {
        method: 'POST',
        body: data,
    })
        .then((res) => res.json())
        .catch((e) => console.error('Something went wrong:', e))
})
