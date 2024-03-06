
// adding comments 

// Event listener to handle tab closure or page reload
window.addEventListener('beforeunload', function(event) {
    // Clear the interval to stop the timer
    clearInterval(interval);
    // Remove event listener for tab visibility change
    document.removeEventListener('visibilitychange', handleVisibilityChange); // Add this line
    // Cancel the event (prompting the user)
    event.preventDefault();
    // Chrome requires returnValue to be set
    event.returnValue = '';
});

// Function to handle tab visibility change
function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        // Tab is switched or closed, clear the interval
        clearInterval(interval);
    } else {
        // Tab is visible again, restart the timer
        startTimer();
    }
}



window.addEventListener('load', () => {
    
    const form = document.querySelector("#new-task-form");
  
    const input = document.querySelector("#new-task-input");

    const list_el = document.querySelector("#tasks");

    form.addEventListener('submit', (e) => {
        // Prevent page reload upon form submission
        e.preventDefault();

        // Get the value entered in the input field, representing the new task
        const task = input.value;

        // Create a <div> element to represent the task
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        // Create a <div> to contain the content of the task
        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');
        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = task;

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');
        
        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        // Append the edit and delete buttons to the actions <div>
        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        // Append the actions <div> to the task <div>
        task_el.appendChild(task_actions_el);

        // Append the task <div> to the list element where tasks are displayed
        list_el.appendChild(task_el);

        // Reset the input field value after adding the task
        input.value = '';

        // Add event listener to the edit button to toggle between edit and save mode
        task_edit_el.addEventListener('click', (e) => {
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                // Change the edit button text to 'Save'
                task_edit_el.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                task_edit_el.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");
            }
        });

        task_delete_el.addEventListener('click', (e) => {
            // Remove the task <div> from the list
            list_el.removeChild(task_el);
        });
    });
});

const timer = {
    pomodoro: 25,             
    shortBreak: 5,             
    longBreak: 15,              
    longBreakInterval: 4,       
    sessions: 0,                // Counter for Pomodoro sessions completed
};

let interval;                   // Variable to hold the interval ID for the timer


const buttonSound = new Audio('button-sound.mp3');

const mainButton = document.getElementById('js-btn');

mainButton.addEventListener('click', () => {
    buttonSound.play();

    // Retrieve the action from the button's dataset attribute
    const { action } = mainButton.dataset;

    if (action === 'start') {
        startTimer();         
    } else {
        stopTimer();            
    }
});

const modeButtons = document.querySelector('#js-mode-buttons');

modeButtons.addEventListener('click', handleMode);
// to switch betweenmode according to the click

function switchMode(mode) 
{
    // Set the timer mode
    timer.mode = mode;
    // Set the remaining time for the selected mode
    // declaring remaintime under timer object
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };
  
    // Remove the 'active' class from all mode buttons
    document
        .querySelectorAll('button[data-mode]')
        .forEach(e => e.classList.remove('active'));
    // Add the 'active' class to the button corresponding to the selected mode

    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    // Change the background color of the document body based on the selected mode

    document.body.style.backgroundColor = `var(--${mode})`;

    // Set the maximum value of the progress bar based on the remaining time
    document
        .getElementById('js-progress')
        .setAttribute('max', timer.remainingTime.total);
  
    // Update the clock display
    updateClock();
}

function getRemainingTime(endTime) 
{
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds,
    };
}

// Function to start the timer
function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000; //miliseconds

    // Increment sessions count if mode is 'pomodoro'
    if (timer.mode === 'pomodoro') timer.sessions++;

    // Update button text and class
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    // Set up interval to update timer
    interval = setInterval(function() 
    {
        // Calculate remaining time
        timer.remainingTime = getRemainingTime(endTime);
        // Update clock display
        updateClock();

        // Check if timer has reached zero
        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);

            // Determine next mode after timer ends
            switch (timer.mode) {
                case 'pomodoro':
                    if (timer.sessions % timer.longBreakInterval === 0) {
                        switchMode('longBreak'); // long break interval needed 
                    } else {
                        switchMode('shortBreak');
                    }
                    break;
                default:
                    switchMode('pomodoro');
            }

            // Display notification if permission granted
            if (Notification.permission === 'granted') {
                const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
                new Notification(text);
            }

            // Play sound based on timer mode
            document.querySelector(`[data-sound="${timer.mode}"]`).play();

            // Restart the timer
            startTimer();
        }
    }, 1000);
    document.addEventListener('visibilitychange', handleVisibilityChange); // Add this line
}

  
 // Function to stop the timer

function stopTimer() {
    // Clear the interval to stop the timer
    clearInterval(interval);
    // Remove event listener for tab visibility change
    document.removeEventListener('visibilitychange', handleVisibilityChange); // Add this line
    // Update button dataset action to 'start'
    mainButton.dataset.action = 'start';
    // Change button text content to 'start'
    mainButton.textContent = 'start';
    // Remove the 'active' class from the button
    mainButton.classList.remove('active');
}



// Function to update the clock display
function updateClock() {
    const { remainingTime } = timer;
    // Pad the minutes and seconds with leading zeros if necessary
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    // Select the elements displaying minutes and seconds
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    // Update the displayed minutes and seconds
    min.textContent = minutes;
    sec.textContent = seconds;
  
    // Update the document title with the current time and task status
    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    document.title = `${minutes}:${seconds} — ${text}`;
  
    // Update the progress bar value based on the remaining time
    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}



// Function to handle mode button clicks
function handleMode(event) {
    const { mode } = event.target.dataset;
  
    // If no mode is specified, return early
    if (!mode) return;
  
    // Switch to the selected mode and stop the timer
    switchMode(mode);
    stopTimer();
}

// Event listener to execute code when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if browser supports notifications
    if ('Notification' in window) {
        // Request permission for notifications if not granted or denied
        if (
            Notification.permission !== 'granted' &&
            Notification.permission !== 'denied'
        ) {
            Notification.requestPermission().then(function(permission) {
                // Display a notification if permission is granted
                if (permission === 'granted') {
                    new Notification(
                        'Awesome! You will be notified at the start of each session'
                    );
                }
            });
        }
    }
  
    // Initialize the timer with the default mode (pomodoro)
    switchMode('pomodoro');
});
