const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
let scoreDisplay = document.getElementById('score');
let timeDisplay = document.getElementById('time-left');
let startButton = document.getElementById('start-btn');

let score = 0;
let timeLeft = 30;
let lastHole;
let isTimeUp = false;
let moleTimeout;
let gameCountdown;

// Listen for clicks on every mole element
moles.forEach(mole => mole.addEventListener('click', whackMole));

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    // Pick a random grid hole from our node list
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    
    // Prevent picking the exact same hole twice in a row
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function popUp() {
    if (isTimeUp) return;

    // Pick random hole index and speed time window
    const time = randomTime(600, 1200); // 0.6 to 1.2 seconds
    const hole = randomHole(holes);
    const mole = hole.querySelector('.mole');

    mole.classList.add('up'); // Show mole on screen

    // Clear and remove mole after its display duration ends
    moleTimeout = setTimeout(() => {
        mole.classList.remove('up');
        popUp(); // Call next random mole loop iteration
    }, time);
}

function startGame() {
    // Reset core variables
    score = 0;
    timeLeft = 30;
    isTimeUp = false;
    scoreDisplay.innerText = score;
    timeDisplay.innerText = timeLeft;
    startButton.disabled = true; // Block button spamming during active round
    startButton.style.backgroundColor = '#9ca3af';

    popUp();

    // Game Timer Countdown Loop
    gameCountdown = setInterval(() => {
        timeLeft--;
        timeDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(gameCountdown);
            clearTimeout(moleTimeout);
            isTimeUp = true;
            moles.forEach(mole => mole.classList.remove('up')); // Hide remaining moles
            alert(`🎮 Game Over! You whacked ${score} moles!`);
            
            // Re-enable start button
            startButton.disabled = false;
            startButton.style.backgroundColor = '#10b981';
        }
    }, 1000);
}

function whackMole(event) {
    // Security check: ensure click comes from a genuine user click, not an automated script tool
    if (!event.isTrusted) return; 

    // Increase score points only if mole is active on screen
    if (this.classList.contains('up')) {
        score++;
        this.classList.remove('up'); // Instantly hide whacked mole
        scoreDisplay.innerText = score;
    }
}
