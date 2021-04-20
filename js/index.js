const gameEl = document.getElementById("game");
const menuEl = document.getElementById("menu");

function toggleVisibility(showGame) {
    if (showGame) {
        gameEl.style.display = "flex";
        menuEl.style.display = "none";
    } else {
        gameEl.style.display = "none";
        menuEl.style.display = "flex";
    }
}

function now() {
    return window.performance.now();
}
