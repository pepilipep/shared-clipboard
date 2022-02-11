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
                typeSelect.value = res.content_type.toLowerCase()
                if (typeSelect.value === 'text') {
                    content.value = res.content
                } else {
                    const [folder, filename] = res.content.split('/')
                    console.log(folder, filename)
                    contentWrapper.replaceChildren(
                        uploadedFileElement(folder, filename)
                    )
                }
            }
        })
        .catch((e) => console.error('Something went wrong', e))
})

function uploadedFileElement(folder, filename) {
    const ael = document.createElement('a')
    ael.value = `${folder}/${filename}`
    ael.id = 'content'
    ael.href = `/uploads/${ael.value}`
    ael.innerText = filename
    ael.download = filename
    return ael
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
    const input = document.createElement('textarea')
    input.id = 'content'
    return input
}

typeSelect.addEventListener('change', (event) => {
    const newType = event.target.value

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
    button.innerText = 'Subscribe'
    return button
}

window.addEventListener('load', async (event) => {
    const logged = await isLoggedIn()
    if (!logged) {
        return
    }
    const formWrapper = document.getElementsByClassName('panel-container')[0]
    formWrapper.appendChild(createSubscribeElement())
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const url = window.location.pathname.replace('/clips/', '')

    const contentType = typeSelect.value
    const contentElement = document.getElementById('content')
    const expiryTime = document.getElementById('expiry-time').value

    const data = new FormData()
    data.set('url', url)
    data.set('content-type', contentType)
    data.set('content', contentElement.value)
    data.set('expiry-time', expiryTime)

    fetch(exists ? '/updateClip.php' : '/clip.php', {
        method: 'POST',
        body: data,
    })
        .then((res) => res.json())
        .catch((e) => console.error('Something went wrong:', e))
})
