window.addEventListener('load', (event) => {
    const paramsString = window.location.search
    const searchParams = new URLSearchParams(paramsString)
    const clipUrl = searchParams.get('url')

    const clipUrlElement = document.getElementById('clip-url')
    clipUrlElement.innerText = '/' + clipUrl
})

document.getElementById('copy').addEventListener('click', (event) => {
    const url = document.getElementById('clip-url').innerText
    const wholepath = `${window.location.host}/clips${url}`

    navigator.clipboard.writeText(wholepath)
})
