const clipsTable = document.getElementById('clips')

window.addEventListener('load', (e) => {
    const logged = isLoggedIn()
    if (!logged) {
        window.location.replace('/login.html')
    }
})

function clipFormat(clip) {
    return `
    <tr>
        <td><a href="/clips/${clip.url}">${clip.url}</a></td>
        <td>${clip.content_type}</td>
        <td>${new Date(clip.time + 'Z')}</td>
    </tr>
    `
}

function ownedClips() {
    let tableContent = `
    <tr>
        <th>Clip</th>
        <th>Content Type</th>
        <th>Created on</th>
    </tr>
    `

    fetch('/ownedClips.php', {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((res) => {
            res.forEach((clip) => (tableContent += clipFormat(clip)))
            clipsTable.innerHTML = tableContent
        })
        .catch((e) => console.error('Something went wrong:', e))
}

function viewedClips() {
    let tableContent = `
    <tr>
        <th>Clip</th>
        <th>Content Type</th>
        <th>Viewed on</th>
    </tr>
    `

    fetch('/viewedClips.php', {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((res) => {
            res.forEach((clip) => (tableContent += clipFormat(clip)))
            clipsTable.innerHTML = tableContent
        })
        .catch((e) => console.error('Something went wrong:', e))
}

function followedClips() {
    let tableContent = `
    <tr>
        <th>Clip</th>
        <th>Content Type</th>
        <th>Followed on</th>
    </tr>
    `

    fetch('/followedClips.php', {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((res) => {
            res.forEach((clip) => (tableContent += clipFormat(clip)))
            clipsTable.innerHTML = tableContent
        })
        .catch((e) => console.error('Something went wrong:', e))
}
