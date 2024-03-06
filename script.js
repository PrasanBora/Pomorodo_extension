
window.addEventListener('load', () => 
{
    
    const form = document.querySelector("#new-task-form");
  
    const input = document.querySelector("#new-task-input");

    const list_el = document.querySelector("#tasks");

   
    form.addEventListener('submit', (e) => {
        // Prevent  reload
        e.preventDefault();

        // Get the new task
        const task = input.value;

        //  <div> element to represent the task
        const task_el = document.createElement('div');

        task_el.classList.add('task');

        //  <div> to contain the content of the task
        const task_content_el = document.createElement('div');

        task_content_el.classList.add('content');

        task_el.appendChild(task_content_el);

        // Create an <input> element to display and edit 
        const task_input_el = document.createElement('input');

        //  'text' class to the input element
        task_input_el.classList.add('text');

        // the input type to 'text'
        task_input_el.type = 'text';

        // Set the value of the input to the task text
        task_input_el.value = task;

        // Make the input readonly initially
        // task_input_el.setAttribute('readonly', 'readonly');

        task_content_el.appendChild(task_input_el);

        // Create a <div> element to contain action buttons for the task
        const task_actions_el = document.createElement('div');
        // Add the 'actions' class to the actions <div>
        task_actions_el.classList.add('actions');
        
        // Create a button for editing the task
        const task_edit_el = document.createElement('button');
        // Add the 'edit' class to the edit button
        task_edit_el.classList.add('edit');
        // Set the text of the edit button to 'Edit'
        task_edit_el.innerText = 'Edit';

        // Create a button for deleting the task
        const task_delete_el = document.createElement('button');
        // Add the 'delete' class to the delete button
        task_delete_el.classList.add('delete');
        // Set the text of the delete button to 'Delete'
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
            // Check if the edit button text is 'Edit'
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                // Change the edit button text to 'Save'
                task_edit_el.innerText = "Save";
                // Remove the readonly attribute from the input to allow editing
                task_input_el.removeAttribute("readonly");
                // Focus on the input for editing
                task_input_el.focus();
            } else {
                // If the edit button text is 'Save', change it back to 'Edit'
                task_edit_el.innerText = "Edit";
                // Set the input to readonly mode
                task_input_el.setAttribute("readonly", "readonly");
            }
        });

        // Add event listener to the delete button to remove the task
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
    longBreakInterval: 4,       // Number of Pomodoro sessions before a long break
    sessions: 0,                // Counter 
};

let interval;                   // Variable to hold the interval ID for the timer

// Audio for button click sound
const buttonSound = new Audio('button-sound.mp3');

// Button element for controlling timer
const mainButton = document.getElementById('js-btn');

// Event listener for the main button click
mainButton.addEventListener('click', () => {
    // Play button click sound
    buttonSound.play();

    // Retrieve the action from the button's dataset attribute
    const { action } = mainButton.dataset;

    // Check the action and call respective functions
    if (action === 'start') {
        startTimer();           // Start the timer
    } else {
        stopTimer();            // Stop the timer
    }
});

// Selecting the mode buttons container
const modeButtons = document.querySelector('#js-mode-buttons');

// Event listener for mode button clicks
modeButtons.addEventListener('click', handleMode);

// Function to calculate remaining time
function getRemainingTime(endTime) {
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
    const endTime = Date.parse(new Date()) + total * 1000;

    // Increment sessions count if mode is 'pomodoro'
    if (timer.mode === 'pomodoro') timer.sessions++;

    // Update button text and class
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    // Set up interval to update timer
    interval = setInterval(function() {
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
                        switchMode('longBreak');
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
}

  
  function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
  }
  
  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
  
    const text =
      timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    document.title = `${minutes}:${seconds} — ${text}`;
  
    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
  }
  
  function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };
  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
    document
      .getElementById('js-progress')
      .setAttribute('max', timer.remainingTime.total);
  
    updateClock();
  }
  
  function handleMode(event) {
    const { mode } = event.target.dataset;
  
    if (!mode) return;
  
    switchMode(mode);
    stopTimer();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window) {
      if (
        Notification.permission !== 'granted' &&
        Notification.permission !== 'denied'
      ) {
        Notification.requestPermission().then(function(permission) {
          if (permission === 'granted') {
            new Notification(
              'Awesome! You will be notified at the start of each session'
            );
          }
        });
      }
    }
  
    switchMode('pomodoro');
  });