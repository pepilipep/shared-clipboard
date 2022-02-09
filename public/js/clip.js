const form = document.getElementById('clip')
const typeSelect = document.getElementById('content-type')
const contentWrapper = document.getElementById('content-wrapper')

let exists = false

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
            if (res && res.content) {
                exists = true
                content.value = res.content
                typeSelect.value = res.content_type.toLowerCase()
            }
        })
        .catch((e) => console.error('Something went wrong', e))
})

function uploadedFileElement(folder, filename) {
    const input = document.createElement('div')
    input.id = 'content'

    const ael = document.createElement('a')
    ael.href = `/uploads/${folder}/${filename}`
    ael.innerText = filename
    ael.download = filename
    input.appendChild(ael)
    input.readOnly = true
    return input
}

function fileForm() {
    const form = document.createElement('form')

    const choose = document.createElement('input')
    choose.id = 'file-choose'
    choose.type = 'file'
    form.appendChild(choose)

    const saveButton = document.createElement('input')
    saveButton.type = 'submit'
    saveButton.value = 'Save'
    form.appendChild(saveButton)

    form.onsubmit = (e) => {
        e.preventDefault()
        const file = choose.files[0]

        const data = new FormData()
        data.set('file', file)

        fetch('/upload.php', { method: 'POST', body: data })
            .then((res) => res.json())
            .then((res) =>
                contentWrapper.replaceChildren(
                    uploadedFileElement(res['folder'], res['filename'])
                )
            )
            .catch((e) => console.error('Something went wrong:', e))
    }

    return form
}

function createUploadButton() {
    const button = document.createElement('button')
    button.innerText = 'Upload'
    button.onclick = (e) => {
        contentWrapper.replaceChildren(fileForm())
    }
    return button
}

function textContentInput() {
    const input = document.createElement('input')
    input.type = 'text'
    input.id = 'content'
    return input
}

typeSelect.addEventListener('change', (event) => {
    const newType = event.target.value

    const content = document.getElementById('content')

    if (newType === 'text') {
        contentWrapper.replaceChildren(textContentInput())
    } else {
        contentWrapper.replaceChildren(createUploadButton())
    }
})

function subscribe() {
    const url = window.location.pathname.replace('/clips/', '')
    const data = new FormData()
    data.set('url', url)

    fetch('/subscribe.php', { method: 'POST', body: data })
        .then((res) => res.json())
        .catch((e) => console.error('Something went wrong:', e))
}

function createSubscribeElement() {
    let button = document.createElement('button')
    button.onclick = subscribe
    button.innerText = 'Subscribe!'
    return button
}

window.addEventListener('load', (event) => {
    const logged = isLoggedIn()
    if (!logged) {
        return
    }
    const formWrapper = document.getElementById('form-wrapper')
    formWrapper.appendChild(createSubscribeElement())
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

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

    fetch(exists ? '/updateClip.php' : '/clip.php', {
        method: 'POST',
        body: data,
    })
        .then((res) => res.json())
        .catch((e) => console.error('Something went wrong:', e))
})
