const form = document.getElementById('clip')
const typeSelect = document.getElementById('content-type')
const contentWrapper = document.getElementById('content-wrapper')

let exists = false

window.addEventListener('load', async (e) => {
    const logged = await isLoggedIn()
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
            if (res && res.rbac) {
                alert(res.rbac)
                window.location.replace('/')
            } else if (res && res.content_type) {
                exists = true
                typeSelect.value = res.content_type.toLowerCase()
                if (typeSelect.value === 'text') {
                    content.value = res.content
                } else {
                    const [folder, filename] = res.content.split('/')
                    contentWrapper.replaceChildren(
                        uploadedFileElement(folder, filename)
                    )
                }

                document.getElementById('action-url').value = res.action_url

                if (logged) {
                    document
                        .getElementsByClassName('panel-container')[0]
                        .appendChild(createVisibilityElemenent(res.access_type))
                }
            }
        })
        .catch((e) => console.error('Something went wrong', e))

    if (logged && exists) {
        fetch('/isSubscribed.php', {
            method: 'POST',
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                document
                    .getElementsByClassName('panel-container')[0]
                    .appendChild(createSubscribeElement(res))
            })
            .catch((e) => console.error('Something went wrong', e))
    }
})

async function changeVisibility(event) {
    const url = window.location.pathname.replace('/clips/', '')
    const data = new FormData()
    data.set('url', url)
    data.set('access_type', event.target.value)

    fetch('/changeVisibility.php', {
        method: 'POST',
        body: data,
    })
        .then((res) => res.json())
        .then(async (res) => {
            if (res && res.rbac) {
                alert(res.rbac)
            } else if (res && res.error) {
                alert(res.error)
            } else if (event.target.value === 'PROTECTED') {
                document
                    .getElementsByClassName('panel-container')[0]
                    .appendChild(await editorsForm())
            }
        })
        .catch((e) => console.error('Something went wrong', e))
}

function addEditor(event) {
    event.preventDefault()

    const url = window.location.pathname.replace('/clips/', '')
    const data = new FormData()
    data.set('url', url)

    const editor = document.getElementById('editor-name').value
    data.set('editor', editor)

    fetch('/addEditor.php', { method: 'POST', body: data })
        .then((res) => res.json())
        .then((res) => {
            if (res && res.rbac) {
                alert(res.rbac)
            } else {
                document.getElementById('editor-form').remove()
            }
        })
        .catch((e) => console.error('Something went wrong:', e))
}

async function editorsForm() {
    const url = window.location.pathname.replace('/clips/', '')
    const data = new FormData()
    data.set('url', url)
    const editors = await fetch('/editors.php', { method: 'POST', body: data })
        .then((res) => res.json())
        .catch((e) => console.error('Something went wrong:', e))

    const form = document.createElement('form')
    form.id = 'editor-form'

    const editor = document.createElement('input')
    editor.type = 'text'
    editor.id = 'editor-name'
    editor.placeholder = 'Editor'

    const submitButton = document.createElement('button')
    submitButton.type = 'submit'
    submitButton.form = 'editor-form'
    submitButton.innerText = 'Add editor'

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.innerText = 'Close'
    closeButton.onclick = () => form.remove()

    editors.forEach((editor) => {
        const edEl = document.createElement('p')
        edEl.innerText = `${editor.username} (${editor.email})`
        form.appendChild(edEl)
    })

    form.appendChild(editor)
    form.appendChild(submitButton)
    form.appendChild(closeButton)
    form.onsubmit = addEditor

    return form
}

function createVisibilityElemenent(current) {
    const vis = document.createElement('select')
    vis.id = 'visibility-select'

    const public = document.createElement('option')
    public.value = 'PUBLIC'
    public.innerText = 'Public'

    const protected = document.createElement('option')
    protected.value = 'PROTECTED'
    protected.innerText = 'Protected'

    const private = document.createElement('option')
    private.value = 'PRIVATE'
    private.innerText = 'Private'

    vis.replaceChildren(public, protected, private)

    vis.value = current
    vis.onchange = changeVisibility

    return vis
}

function uploadedFileElement(folder, filename) {
    const ael = document.createElement('a')

    ael.value = `${folder}/${filename}`
    ael.id = 'content'
    ael.href = `/uploads/${ael.value}`
    ael.download = filename

    const text = document.createElement('p')
    text.innerText = filename

    const image = document.createElement('img')
    image.src = '/img/file.png'

    ael.appendChild(image)
    ael.appendChild(text)

    return ael
}

function fileForm() {
    const form = document.createElement('form')
    form.id = 'upload-form'

    const choose = document.createElement('input')
    choose.id = 'file-choose'
    choose.type = 'file'
    form.appendChild(choose)

    const saveButton = document.createElement('button')
    saveButton.type = 'submit'
    saveButton.innerText = 'Save'
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
    button.id = 'upload-button'
    button.onclick = (e) => {
        contentWrapper.replaceChildren(fileForm())
    }
    return button
}

function textContentInput() {
    const input = document.createElement('textarea')
    input.id = 'content'
    input.className = 'content-textarea'
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
        .then(() => {
            const button = document.getElementById('subscribe-button')
            button.replaceWith(createSubscribeElement(true))
        })
        .catch((e) => console.error('Something went wrong:', e))
}

function unsubscribe() {
    const url = window.location.pathname.replace('/clips/', '')
    const data = new FormData()
    data.set('url', url)

    fetch('/unsubscribe.php', { method: 'POST', body: data })
        .then((res) => res.json())
        .then(() => {
            const button = document.getElementById('subscribe-button')
            button.replaceWith(createSubscribeElement(false))
        })
        .catch((e) => console.error('Something went wrong:', e))
}

function createSubscribeElement(isSubscribed) {
    let button = document.createElement('button')
    button.id = 'subscribe-button'
    button.type = 'button'
    if (!isSubscribed) {
        button.onclick = subscribe
        button.innerText = 'Subscribe'
    } else {
        button.onclick = unsubscribe
        button.innerText = 'Unsubscribe'
    }
    return button
}

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
    data.set('action-url', document.getElementById('action-url').value)

    fetch(exists ? '/updateClip.php' : '/clip.php', {
        method: 'POST',
        body: data,
    })
        .then((res) => res.json())
        .then((res) => {
            if (res && res.rbac) {
                alert(res.rbac)
            } else {
                window.location.replace(`/created.html?url=${url}`)
            }
        })
        .catch((e) => console.error('Something went wrong:', e))
})
