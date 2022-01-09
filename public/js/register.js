const form = document.getElementById('register')

form.addEventListener('submit', (event) => {
    var errorHolder = document.getElementById('form-error')
    var successHolder = document.getElementById('form-success')
    errorHolder.innerText = ''
    successHolder.innerText = ''

    fetch('register.php', {
        method: 'POST',
        body: new FormData(event.target),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res && res.error) {
                errorHolder.innerText = res.error
            } else {
                successHolder.innerText = res.msg
            }
        })
        .catch((e) => console.error('Something went wrong:', e))

    event.preventDefault()
})
