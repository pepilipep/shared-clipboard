const form = document.getElementById('login')

form.addEventListener('submit', (event) => {
    var errorHolder = document.getElementById('form-error')
    var successHolder = document.getElementById('form-success')
    errorHolder.innerText = ''
    successHolder.innerText = ''

    fetch('login.php', {
        method: 'POST',
        body: new FormData(event.target),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res && res.error) {
                errorHolder.innerText = res.error
            } else {
                successHolder.innerText = res.msg
                window.location.replace('/')
            }
        })
        .catch((e) => console.error('Something went wrong:', e))

    event.preventDefault()
})
