const clipsTable = document.getElementById('clips')

window.addEventListener('load', async (e) => {
    const logged = await isLoggedIn()
    if (!logged) {
        window.location.replace('/login.html')
    }

    const tabs = document.getElementsByClassName('tabs')
    for (let i = 0; i < tabs.length; i++) {
        for (j = 0; j < tabs[i].children.length; j++) {
            tabs[i].children[j].addEventListener('click', chooseTab)
        }
    }

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('tab')) {
        document.getElementById(urlParams.get('tab')).click()
    }
})

function clipFormat(clip, isNotification = false) {
    const tr = document.createElement('tr')
    const url = document.createElement('a')
    url.href = `/clips/${clip.url}`
    url.innerText = clip.url
    const td1 = document.createElement('td')
    td1.appendChild(url)

    const td2 = document.createElement('td')
    td2.innerText = isNotification
        ? clip.username || 'Anonymous'
        : clip.content_type.toLowerCase()

    const td3 = document.createElement('td')
    td3.innerText = new Date(clip.time + 'Z').toLocaleString()

    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)

    return tr
}

function chooseTab(event) {
    const param = event.target.id

    const headers = document.createElement('tr')
    const clipName = document.createElement('th')
    clipName.innerText = 'Clip'
    const contentType = document.createElement('th')
    contentType.innerText = 'Content Type'
    const time = document.createElement('th')

    let isNotification = false

    let endpoint
    if (param == 'owned') {
        time.innerText = 'Created on'
        endpoint = '/ownedClips.php'
    } else if (param == 'viewed') {
        time.innerText = 'Viewed on'
        endpoint = '/viewedClips.php'
    } else if (param == 'followed') {
        time.innerText = 'Followed on'
        endpoint = '/followedClips.php'
    } else if (param == 'notifications') {
        time.innerText = 'On'
        contentType.innerText = 'By user'
        endpoint = '/notifications.php'
        isNotification = true
    } else {
        return
    }
    headers.appendChild(clipName)
    headers.appendChild(contentType)
    headers.appendChild(time)

    const tabs = document.getElementsByClassName('tabs')[0]
    for (let i = 0; i < tabs.children.length; i++) {
        tabs.children[i].className = tabs.children[i].className.replace(
            ' active',
            ''
        )
    }

    event.target.className += ' active'

    fetch(endpoint, {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((res) => {
            clipsTable.replaceChildren(headers)
            res.forEach((clip) =>
                clipsTable.appendChild(clipFormat(clip, isNotification))
            )
        })
        .catch((e) => console.error('Something went wrong:', e))
}
