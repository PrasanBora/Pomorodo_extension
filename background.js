let timer = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    sessions: 0,
    mode: 'pomodoro',
    remainingTime: 25 * 60,
    isRunning: false,
};

let interval;

function startTimer() {
    interval = setInterval(() => {
        if (timer.remainingTime > 0) {
            timer.remainingTime--;
            chrome.storage.local.set({ timer });
        } else {
            clearInterval(interval);
            timer.isRunning = false;
            chrome.storage.local.set({ timer });
            // Switch modes and start the next timer here
        }
    }, 1000);
    timer.isRunning = true;
    chrome.storage.local.set({ timer });
}

function stopTimer() {
    clearInterval(interval);
    timer.isRunning = false;
    chrome.storage.local.set({ timer });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start') {
        startTimer();
    } else if (request.action === 'stop') {
        stopTimer();
    } else if (request.action === 'getTimer') {
        sendResponse(timer);
    }
});

chrome.storage.local.set({ timer });
