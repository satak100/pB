// script.js

// Function to handle login by calling the backend API
async function login() {
    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorPopup = document.getElementById("errorPopup");

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("username", data.username || username);
            window.location.href = "home.html";
        } else {
            errorPopup.classList.remove("hidden");
            setTimeout(() => errorPopup.classList.add("hidden"), 3000);
        }
    } catch (error) {
        console.error('Login error:', error);
        errorPopup.classList.remove("hidden");
        setTimeout(() => errorPopup.classList.add("hidden"), 3000);
    }
}

// async function login() {
//     const role     = document.getElementById("role").value;
//     const username = document.getElementById("username").value || 'Player';

//     // Bypass auth: accept any credentials
//     localStorage.setItem("token", "dummy-token");
//     localStorage.setItem("userRole", role);
//     localStorage.setItem("username", username);

//     // Redirect to home
//     window.location.href = "home.html";
// }


// Function to handle logout by clearing localStorage
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    window.location.href = "index.html";
}

// Function to check if the user is logged in
function checkAccess() {
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!userRole || !token) {
        window.location.href = "login.html";
        return;
    }
}

// Function to redirect to the login page
function redirectToLogin() {
    window.location.href = "login.html";
}

// Function to show the architect prompt on the welcome page
function showArchitectPrompt() {
    const architectPrompt = document.getElementById("architectPrompt");
    architectPrompt.classList.remove("hidden");
}

// Function to show a message on the welcome page
function showMessage() {
    const architectPrompt = document.getElementById("architectPrompt");
    const messageBox = document.getElementById("messageBox");

    if (architectPrompt) {
        architectPrompt.classList.add("hidden");
    }

    messageBox.classList.remove("hidden");
    setTimeout(() => {
        messageBox.classList.add("hidden");
        window.location.href = "home.html";
    }, 3000);
}

// Function to show the create account popup
function showCreateAccountPopup() {
    document.getElementById("createAccountPopup").classList.remove("hidden");
}

// Function to show the forgot password popup
function showForgotPasswordPopup() {
    document.getElementById("forgotPasswordPopup").classList.remove("hidden");
}

// Function to handle account creation by calling the backend API
async function createAccount() {
    const role = document.getElementById("newRole").value;
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const createAccountPopup = document.getElementById("createAccountPopup");
    const successPopup = document.getElementById("successPopup");

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (username && password) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register/player', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                createAccountPopup.classList.add("hidden");
                successPopup.classList.remove("hidden");
                setTimeout(() => successPopup.classList.add("hidden"), 3000);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert("Error creating account.");
        }
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to handle password reset by calling the backend API
async function resetPassword() {
    const username = document.getElementById("forgotUsername").value;
    const forgotPasswordPopup = document.getElementById("forgotPasswordPopup");
    const resetSuccessPopup = document.getElementById("resetSuccessPopup");

    if (username) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();

            if (response.ok) {
                forgotPasswordPopup.classList.add("hidden");
                resetSuccessPopup.classList.remove("hidden");
                setTimeout(() => resetSuccessPopup.classList.add("hidden"), 3000);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Password reset error:', error);
            alert("Error processing request.");
        }
    } else {
        alert("Please enter your username.");
    }
}

// Function to handle Google Sign-In callback
async function handleGoogleSignIn(response) {
    const googleToken = response.credential;
    try {
        const apiResponse = await fetch('http://localhost:5000/api/auth/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: googleToken }),
        });
        const data = await apiResponse.json();

        if (apiResponse.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("username", data.username || "Player");
            window.location.href = "home.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Google login error:', error);
        alert("Error with Google login. Please try again.");
    }
}

// Function to show the "Become a Player" popup
function showPopup() {
    document.getElementById("popup").classList.remove("hidden");
}

// Function to show the submission type selection popup
function showSubmission() {
    document.getElementById("popup").classList.add("hidden");
    document.getElementById("submissionPopup").classList.remove("hidden");
}

// Function to show the file upload popup for submissions
function uploadFile(type) {
    document.getElementById("submissionPopup").classList.add("hidden");
    document.getElementById("uploadPopup").classList.remove("hidden");
    console.log(`Uploading for: ${type}`);
}

// Function to handle file submission
function submitFile() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length > 0 && fileInput.files[0].type === "application/json") {
        document.getElementById("uploadPopup").classList.add("hidden");
        const thanksPopup = document.getElementById("thanksPopup");
        thanksPopup.classList.remove("hidden");
        setTimeout(() => {
            thanksPopup.classList.add("hidden");
            setTimeout(() => {
                window.location.href = "home.html";
            }, 2000);
        }, 3000);
    } else {
        alert("Please upload a valid JSON file.");
    }
}

// Function to evaluate a task submission (architect-only)
function evaluateTask() {
    const userRole = localStorage.getItem('userRole');
    const accessDeniedPopup = document.getElementById('accessDeniedPopup');
    if (userRole !== 'architect') {
        accessDeniedPopup.classList.remove('hidden');
        setTimeout(() => accessDeniedPopup.classList.add('hidden'), 3000);
        return;
    }

    const evalPopup = document.getElementById("evalPopup");
    const jsonProgress = document.getElementById("jsonProgress");
    const guidelinesProgress = document.getElementById("guidelinesProgress");
    const successPopup = document.getElementById("successPopup");

    evalPopup.classList.remove("hidden");

    setTimeout(() => {
        jsonProgress.style.width = "100%";
    }, 500);

    setTimeout(() => {
        guidelinesProgress.style.width = "100%";
    }, 1000);

    setTimeout(() => {
        evalPopup.classList.add("hidden");
        successPopup.classList.remove("hidden");
        setTimeout(() => {
            successPopup.classList.add("hidden");
        }, 5000);
    }, 3000);
}

// Function to show the task creation popup
function showCreateTaskPopup() {
    const userRole = localStorage.getItem('userRole');
    const accessDeniedPopup = document.getElementById('accessDeniedPopup');
    if (userRole !== 'architect') {
        accessDeniedPopup.classList.remove('hidden');
        setTimeout(() => accessDeniedPopup.classList.add('hidden'), 3000);
        return;
    }
    document.getElementById("createTaskPopup").classList.remove("hidden");
}

// Function to close the task creation popup
function closeCreateTaskPopup() {
    document.getElementById("createTaskPopup").classList.add("hidden");
    document.getElementById('taskIdInput').value = '';
    document.getElementById('taskNameInput').value = '';
    document.getElementById('taskDescriptionInput').value = '';
}

// Function to submit a new task (architect-only)
async function submitTask() {
    const taskId = document.getElementById('taskIdInput')?.value;
    const taskName = document.getElementById('taskNameInput')?.value;
    const description = document.getElementById('taskDescriptionInput')?.value;
    const evalPopup = document.getElementById('evalPopup');
    const successPopup = document.getElementById('successPopup');
    const errorPopup = document.getElementById('errorPopup');
    const accessDeniedPopup = document.getElementById('accessDeniedPopup');

    if (!taskId || !taskName || !description) {
        alert('Please fill in all fields: Task ID, Task Name, and Description.');
        return;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'architect') {
        accessDeniedPopup.classList.remove('hidden');
        setTimeout(() => accessDeniedPopup.classList.add('hidden'), 3000);
        return;
    }

    evalPopup.classList.remove("hidden");

    try {
        const response = await fetch('http://localhost:5000/api/tasks/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ task_id: taskId, task_name: taskName, description })
        });

        evalPopup.classList.add("hidden");

        if (response.ok) {
            successPopup.classList.remove("hidden");
            setTimeout(() => {
                successPopup.classList.add("hidden");
                closeCreateTaskPopup();
                if (document.querySelector('.task-list')) {
                    fetchTasks();
                }
            }, 3000);
        } else {
            const data = await response.json();
            errorPopup.innerHTML = `<p>${data.message || 'Error submitting task. Please try again.'}</p>`;
            errorPopup.classList.remove("hidden");
            setTimeout(() => errorPopup.classList.add("hidden"), 3000);
        }
    } catch (error) {
        console.error('Task submission error:', error);
        evalPopup.classList.add("hidden");
        errorPopup.classList.remove("hidden");
        setTimeout(() => errorPopup.classList.add("hidden"), 3000);
    }
}

// Function to update player section across all pages
function updatePlayerSection() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const playerSection = document.getElementById('player-section');

    if (token && userRole) {
        const username = localStorage.getItem('username') || 'Player';
        let dropdownMenu = `
            <div class="dropdown relative">
                <a href="#" class="nav-item flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Welcome, ${username} <span class="ml-2">▼</span>
                </a>
                <div class="dropdown-menu">
                    <a href="#" onclick="showPopup()">Prediction Tasks</a>
        `;
        if (userRole === 'architect') {
            dropdownMenu += `<a href="#" onclick="showCreateTaskPopup()">Create Tasks</a>`;
        }
        dropdownMenu += `
                    <a href="stats.html">Stats</a>
                    <button onclick="logout()">Logout</button>
                </div>
            </div>
        `;
        playerSection.innerHTML = dropdownMenu;

        const taskCreationSection = document.getElementById('taskCreationSection');
        if (taskCreationSection && userRole === 'architect') {
            taskCreationSection.classList.remove('hidden');
        }
    } else {
        playerSection.innerHTML = `
            <a href="login.html" class="nav-item">Become a Player</a>
        `;
    }
}

// Function to fetch tasks from the backend and render them as cards
async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:5000/api/tasks/tasks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const tasks = await response.json();
            const taskList = document.querySelector('.task-list');
            if (taskList) {
                taskList.innerHTML = '';
                if (tasks.length === 0) {
                    taskList.innerHTML = '<p>No tasks available.</p>';
                    return;
                }
                tasks.forEach(task => {
                    const taskCard = document.createElement('div');
                    taskCard.classList.add('task-card');
                    taskCard.setAttribute('data-task-id', task.task_id);
                    taskCard.innerHTML = `
                        <h3>${task.task_name}</h3>
                        <p>Click to view leaderboard</p>
                    `;
                    taskCard.addEventListener('click', () => loadLeaderboard(task.task_id));
                    taskList.appendChild(taskCard);
                });
            }
        } else {
            console.error('Error fetching tasks:', await response.json());
            const taskList = document.querySelector('.task-list');
            if (taskList) {
                taskList.innerHTML = '<p>Error loading tasks.</p>';
            }
        }
    } catch (error) {
        console.error('Fetch tasks error:', error);
        const taskList = document.querySelector('.task-list');
        if (taskList) {
            taskList.innerHTML = '<p>Error loading tasks.</p>';
        }
    }
}

// Function to fetch and display leaderboard for a task
async function loadLeaderboard(taskId) {
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    const taskDescription = document.getElementById('taskDescription');
    const taskDescriptionText = document.getElementById('taskDescriptionText');

    // Highlight the selected task card
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        card.classList.remove('selected');
        if (card.getAttribute('data-task-id') === taskId) {
            card.classList.add('selected');
        }
    });

    try {
        // Fetch task details to get description
        const taskResponse = await fetch(`http://localhost:5000/api/tasks/tasks`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (taskResponse.ok) {
            const tasks = await taskResponse.json();
            const task = tasks.find(t => t.task_id === taskId);
            if (task) {
                taskDescriptionText.textContent = task.description || 'No description available.';
                taskDescription.classList.remove('hidden');
            } else {
                taskDescriptionText.textContent = 'Task not found.';
                taskDescription.classList.remove('hidden');
            }
        } else {
            taskDescriptionText.textContent = 'Error loading task description.';
            taskDescription.classList.remove('hidden');
        }

        // Fetch leaderboard data
        const response = await fetch(`http://localhost:5000/api/tasks/leaderboard/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const submissions = await response.json();
            if (submissions.length === 0) {
                // Display dummy leaderboard
                let tableHTML = `
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Task ID</th>
                                <th>Model Name</th>
                                <th>Username</th>
                                <th>Type</th>
                                <th>Timestamp</th>
                                <th>RMSE</th>
                                <th>MAE</th>
                                <th>Cosine Similarity</th>
                                <th>KL Divergence</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${taskId}</td>
                                <td>Dummy Model</td>
                                <td>Sample User</td>
                                <td>Human</td>
                                <td>${new Date().toLocaleString()}</td>
                                <td>0.000</td>
                                <td>0.000</td>
                                <td>0.000</td>
                                <td>0.000</td>
                            </tr>
                        </tbody>
                    </table>
                `;
                leaderboardContainer.innerHTML = tableHTML;
            } else {
                // Render actual leaderboard
                let tableHTML = `
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Task ID</th>
                                <th>Model Name</th>
                                <th>Username</th>
                                <th>Type</th>
                                <th>Timestamp</th>
                                <th>RMSE</th>
                                <th>MAE</th>
                                <th>Cosine Similarity</th>
                                <th>KL Divergence</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                submissions.forEach(sub => {
                    tableHTML += `
                        <tr>
                            <td>${sub.task_id}</td>
                            <td>${sub.model_name}</td>
                            <td>${sub.username}</td>
                            <td>${sub.type}</td>
                            <td>${new Date(sub.timestamp).toLocaleString()}</td>
                            <td>${sub.rmse.toFixed(3)}</td>
                            <td>${sub.mae.toFixed(3)}</td>
                            <td>${sub.cosine_similarity.toFixed(3)}</td>
                            <td>${sub.kl_divergence.toFixed(3)}</td>
                        </tr>
                    `;
                });
                tableHTML += '</tbody></table>';
                leaderboardContainer.innerHTML = tableHTML;
            }
        } else {
            leaderboardContainer.innerHTML = '<p>Error loading leaderboard.</p>';
            console.error('Error fetching leaderboard:', await response.json());
        }
    } catch (error) {
        leaderboardContainer.innerHTML = '<p>Error loading leaderboard.</p>';
        taskDescriptionText.textContent = 'Error loading task description.';
        taskDescription.classList.remove('hidden');
        console.error('Load leaderboard error:', error);
    }
}

// Initialize page
document.addEventListener("DOMContentLoaded", function() {
    updatePlayerSection();
    if (document.querySelector('.task-list')) {
        checkAccess();
        fetchTasks();
    }

    // DS Compete Upload Logic
    const agentPlanInput = document.getElementById("agentPlanInput");
    if (agentPlanInput) {
        agentPlanInput.addEventListener("change", function() {
            if (this.files.length > 0 && this.files[0].type === "application/json") {
                const evalResultPopup = document.getElementById("evalResultPopup");
                evalResultPopup.classList.remove("hidden");
            } else {
                alert("Please upload a valid JSON file.");
            }
        });
    }

    const challengePlanInput = document.getElementById("challengePlanInput");
    if (challengePlanInput) {
        challengePlanInput.addEventListener("change", function() {
            if (this.files.length > 0 && this.files[0].type === "application/json") {
                const challengeResultPopup = document.getElementById("challengeResultPopup");
                challengeResultPopup.classList.remove("hidden");
                setTimeout(() => {
                    challengeResultPopup.classList.add("hidden");
                }, 3000);
            } else {
                alert("Please upload a valid JSON file.");
            }
        });
    }
});