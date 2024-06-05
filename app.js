document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const taskForm = document.getElementById("task-form");
    const taskSection = document.getElementById("task-section");
    const loginSection = document.getElementById("login-section");
    const signupSection = document.getElementById("signup-section");
    const adminSection = document.getElementById("admin-section");
    const userNameSpan = document.getElementById("user-name");
    const taskList = document.getElementById("task-list");
    const taskAssignSelect = document.getElementById("task-assign");
    const userList = document.getElementById("user-list");
    const showSignupButton = document.getElementById("show-signup");
    const showLoginButton = document.getElementById("show-login");
    const logoutButton = document.getElementById("logout");
    const adminTaskList = document.getElementById("admin-task-list");
    const adminUserList = document.getElementById("admin-user-list");
    const adminLogoutButton = document.getElementById("admin-logout");

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = null;

    const renderTasks = () => {
        taskList.innerHTML = '';
        if (currentUser.tasks.length === 0) {
            const noTasksMessage = document.createElement("li");
            noTasksMessage.textContent = "No tasks assigned.";
            taskList.appendChild(noTasksMessage);
        } else {
            currentUser.tasks.forEach((task, index) => {
                const li = document.createElement("li");
                li.textContent = `${task.title} (Assigned to: ${task.assignedTo}): ${task.description}`;
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-btn");
                deleteButton.addEventListener("click", () => {
                    currentUser.tasks.splice(index, 1);
                    localStorage.setItem("users", JSON.stringify(users));
                    renderTasks();
                });
                li.appendChild(deleteButton);
                taskList.appendChild(li);
            });
        }
    };

    const renderUserList = () => {
        userList.innerHTML = '';
        const otherUsers = users.filter(user => user.username !== currentUser.username);
        if (otherUsers.length === 0) {
            const noUsersMessage = document.createElement("li");
            noUsersMessage.textContent = "There is no users available.";
            userList.appendChild(noUsersMessage);
        } else {
            otherUsers.forEach(user => {
                const li = document.createElement("li");
                li.textContent = user.username;
                userList.appendChild(li);
            });
        }
    };

    const updateUserSelect = () => {
        taskAssignSelect.innerHTML = '';
        const otherUsers = users.filter(user => user.username !== currentUser.username);
        otherUsers.forEach(user => {
            const option = document.createElement("option");
            option.value = user.username;
            option.textContent = user.username;
            taskAssignSelect.appendChild(option);
        });
    };

    const renderAdminTasks = () => {
        adminTaskList.innerHTML = '';
        let taskCount = 0;
        users.forEach(user => {
            user.tasks.forEach((task, taskIndex) => {
                taskCount++;
                const li = document.createElement("li");
                li.textContent = `${task.title} (Assigned to: ${task.assignedTo}): ${task.description}`;
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-btn");
                deleteButton.addEventListener("click", () => {
                    user.tasks.splice(taskIndex, 1);
                    localStorage.setItem("users", JSON.stringify(users));
                    renderAdminTasks();
                });
                li.appendChild(deleteButton);
                adminTaskList.appendChild(li);
            });
        });
        if (taskCount === 0) {
            const noTasksMessage = document.createElement("li");
            noTasksMessage.textContent = "No tasks available.";
            adminTaskList.appendChild(noTasksMessage);
        }
    };

    const renderAdminUsers = () => {
        adminUserList.innerHTML = '';
        if (users.length === 0) {
            const noUsersMessage = document.createElement("li");
            noUsersMessage.textContent = "No users available.";
            adminUserList.appendChild(noUsersMessage);
        } else {
            users.forEach((user, userIndex) => {
                const li = document.createElement("li");
                li.textContent = user.username;
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-btn");
                deleteButton.addEventListener("click", () => {
                    users.splice(userIndex, 1);
                    localStorage.setItem("users", JSON.stringify(users));
                    renderAdminUsers();
                    renderAdminTasks();
                });
                li.appendChild(deleteButton);
                adminUserList.appendChild(li);
            });
        }
    };

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            userNameSpan.textContent = user.username;
            loginSection.classList.add("hidden");
            signupSection.classList.add("hidden");

            if (username === 'admin') {
                adminSection.classList.remove("hidden");
                renderAdminTasks();
                renderAdminUsers();
            } else {
                taskSection.classList.remove("hidden");
                renderTasks();
                updateUserSelect();
                renderUserList();
            }
        } else {
            alert("Invalid username or password");
        }
    });

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;

        if (users.find(u => u.username === username)) {
            alert("Username already exists");
        } else {
            const newUser = { username, password, tasks: [] };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            alert("User registered successfully. You can now login.");
        }
    });

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const assignedTo = document.getElementById("task-assign").value;

        const assignedUser = users.find(u => u.username === assignedTo);
        if (assignedUser) {
            assignedUser.tasks.push({ title, description, assignedTo });
            localStorage.setItem("users", JSON.stringify(users));
            renderTasks();
            taskForm.reset();
        } else {
            alert("Selected user does not exist");
        }
    });

    showSignupButton.addEventListener("click", () => {
        loginSection.classList.add("hidden");
        signupSection.classList.remove("hidden");
    });

    showLoginButton.addEventListener("click", () => {
        signupSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    });

    logoutButton.addEventListener("click", () => {
        currentUser = null;
        taskSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    });

    adminLogoutButton.addEventListener("click", () => {
        currentUser = null;
        adminSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    });
});
