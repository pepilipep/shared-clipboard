function goToClip() {
    const clipUrl = document.getElementById('clip-url')
    window.location.replace(`/clips/${clipUrl.value}`)
}
