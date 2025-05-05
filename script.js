// script.js – Full MongoDB integration with sessionStorage

//const API_BASE = "http://localhost:3000";
const API_BASE = "http://192.168.18.6:3000"; // Replace with your server's LAN IP
let currentUser = null;

// Try loading session user on page load
window.addEventListener("DOMContentLoaded", () => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showPanelByRole(currentUser.role);
    }
});

async function showCreateAccount() {
    document.getElementById("loginSection")?.classList?.add("hidden");
    document.getElementById("createAccountSection")?.classList?.remove("hidden");
}

async function createAccount(e) {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("registerRole").value;
    const address = role === "homeowner" ? document.getElementById("registerAddress").value : "";

    if (!username || !email || !password || (role === "homeowner" && !address)) {
        alert("Please fill in all required fields.");
        return;
    }

    const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, email, address })
    });

    if (res.ok) {
        alert("Account created! You can now log in.");
        document.getElementById("createAccountSection")?.classList?.add("hidden");
        document.getElementById("loginSection")?.classList?.remove("hidden");
    } else {
        const msg = await res.json();
        alert(msg.message);
    }
}

function toggleAddressField() {
    const role = document.getElementById("registerRole").value;
    document.getElementById("addressField").classList.toggle("hidden", role !== "homeowner");
}

async function login() {
    const role = document.getElementById("userRole").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
    });

    if (res.ok) {
        currentUser = await res.json();
        sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

        if (currentUser.role === "userAdmin") {
            window.location.href = "UserAdmin.html";
        } else if (currentUser.role === "cleaner") {
            window.location.href = "Cleaner.html";
        } else if (currentUser.role === "homeowner") {
            window.location.href = "HomeOwner.html";
        } else if (currentUser.role === "platformManager") {
            window.location.href = "PlatformManager.html";
        } else {
            alert("Unknown role");
        }
    } else {
        const msg = await res.json();
        alert(msg.message || "Invalid credentials or role");
    }
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

async function showProfilePage() {
    const res = await fetch(`${API_BASE}/users/${currentUser._id}`);
    if (!res.ok) {
        alert("Failed to load profile.");
        return;
    }
    const user = await res.json();

    document.body.innerHTML = `
        <div class="section" style="max-width: 600px; margin: 40px auto;">
            <h2>Edit My Profile</h2>
            <form onsubmit="updateProfile(event)">
                <input type="hidden" id="profileUserId" value="${user._id}" />
                <label>Email: <input type="email" id="profileEmail" value="${user.email}" required></label><br>
                <label>Name: <input type="text" id="profileName" value="${user.name || ''}"></label><br>
                ${user.role === 'homeowner' ? `<label>Address: <input type="text" id="profileAddress" value="${user.address || ''}"></label><br>` : ''}
                <button type="submit">Save Changes</button>
                <button type="button" onclick="location.reload()">Cancel</button>
            </form>
        </div>
    `;
}

async function showUserEditPage(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (!res.ok) {
        alert("Failed to load user profile.");
        return;
    }
    const user = await res.json();
    document.body.innerHTML = `
        <div class="section" style="max-width: 600px; margin: 40px auto;">
            <h2>Edit User Profile (${user.username})</h2>
            <form onsubmit="updateUserProfile(event)">
                <input type="hidden" id="editUserId" value="${user._id}" />
                <label>Email: <input type="email" id="editEmail" value="${user.email}" required></label><br>
                <label>Name: <input type="text" id="editName" value="${user.name || ''}"></label><br>
                ${user.role === 'homeowner' ? `<label>Address: <input type="text" id="editAddress" value="${user.address || ''}"></label><br>` : ''}
                <button type="submit">Save Changes</button>
                <button type="button" onclick="location.reload()">Cancel</button>
            </form>
        </div>
    `;
}

async function showUserViewPage(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (!res.ok) {
        alert("Failed to load user profile.");
        return;
    }
    const user = await res.json();
    document.body.innerHTML = `
        <div class="section" style="max-width: 600px; margin: 40px auto;">
            <h2>View User Profile (${user.username})</h2>
            <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
            <p><strong>Name:</strong> ${user.name || 'N/A'}</p>
            ${user.role === 'homeowner' ? `<p><strong>Address:</strong> ${user.address || 'N/A'}</p>` : ''}
            <button type="button" onclick="location.reload()">Back</button>
        </div>
    `;
}

async function updateUserProfile(e) {
    e.preventDefault();
    const id = document.getElementById("editUserId").value;
    const data = {
        email: document.getElementById("editEmail").value,
        name: document.getElementById("editName").value,
        address: document.getElementById("editAddress")?.value
    };

    const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("User profile updated!");
        location.reload();
    } else {
        alert("Failed to update user profile.");
    }
}

async function updateProfile(e) {
    e.preventDefault();

    const id = document.getElementById("profileUserId").value;
    const data = {
        email: document.getElementById("profileEmail").value,
        name: document.getElementById("profileName").value,
        address: document.getElementById("profileAddress")?.value
    };

    const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Profile updated!");
        sessionStorage.setItem("currentUser", JSON.stringify(await res.json()));
        location.reload();
    } else {
        alert("Failed to update profile.");
    }
}

function showPanelByRole(role) {
    const profileBtn = document.createElement("button");
    profileBtn.id = "profileButton";
    profileBtn.textContent = "My Profile";
    profileBtn.onclick = showProfilePage;
    document.body.appendChild(profileBtn);

    document.getElementById("dashboard")?.classList?.remove("hidden");
    if (role === "userAdmin") {
        document.getElementById("adminSection")?.classList?.remove("hidden");
        renderUserTable();
    } else if (role === "cleaner") {
        document.getElementById("cleanerSection")?.classList?.remove("hidden");
        renderServiceList();
    } else if (role === "homeowner") {
        document.getElementById("homeOwnerSection")?.classList?.remove("hidden");
        renderAvailableServices();
        renderShortlist();
    } else if (role === "platformManager") {
        document.getElementById("platformSection")?.classList?.remove("hidden");
        generateReports();
    }
}

// USERS
async function saveUser(e) {
    e.preventDefault();
    const usernameInput = document.getElementById("registerUsername");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const roleInput = document.getElementById("registerRole");
    const addressInput = document.getElementById("registerAddress");

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const role = roleInput.value;
    const address = role === "homeowner" ? addressInput?.value : "";

    const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, role, address })
    });

    if (res.ok) {
        alert("User created.");
        renderUserTable();

        // ✅ Clear form fields
        usernameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        roleInput.selectedIndex = 0;
        if (addressInput) addressInput.value = "";
    } else {
        alert((await res.json()).message);
    }
}


async function renderUserTable() {
    const res = await fetch(`${API_BASE}/users`);
    const users = await res.json();
    const search = document.getElementById("searchUser")?.value?.toLowerCase() || "";
    const tbody = document.querySelector("#userTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    users.filter(u => u.username.toLowerCase().includes(search) || u.role.toLowerCase().includes(search)).forEach(u => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><a href="#" onclick="showUserViewPage('${u._id}')">${u.username}</a></td>
            <td>${u.role}</td>
            <td>
                <select onchange="updateStatus('${u._id}', this.value)">
                    <option value="active" ${u.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="inactive" ${u.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                    <option value="suspended" ${u.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                </select>
            </td>
            <td>
                <button class="danger-btn" onclick="deleteUser('${u._id}')">Delete</button>
            </td>`;
        tbody.appendChild(row);
    });
}

async function updateStatus(userId, newStatus) {
    await fetch(`${API_BASE}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    });
    renderUserTable();
}

async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        await fetch(`${API_BASE}/users/${userId}`, { method: "DELETE" });
        renderUserTable();
    }
}

// SERVICES
async function addService(e) {
    e.preventDefault();
    const title = document.getElementById("serviceTitle").value;
    const description = document.getElementById("serviceDescription").value;
    const category = document.getElementById("serviceCategory").value;
    const schedule = document.getElementById("serviceSchedule").value;

    const res = await fetch(`${API_BASE}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username, title, description, category, schedule })
    });

    if (res.ok) {
        renderServiceList();
    } else {
        alert("Failed to add service.");
    }
}

async function renderServiceList() {
    const res = await fetch(`${API_BASE}/services?username=${currentUser.username}`);
    const services = await res.json();
    const list = document.getElementById("serviceList");
    if (!list) return;
    list.innerHTML = "";
    services.forEach(s => {
        const item = document.createElement("li");
        item.innerHTML = `${s.title} (${s.category}) - ${s.description} | Available: ${s.schedule}` +
            ` <button onclick="deleteService('${s._id}')">Delete</button>`;
        list.appendChild(item);
    });
}

async function deleteService(serviceId) {
    await fetch(`${API_BASE}/services/${serviceId}`, { method: "DELETE" });
    renderServiceList();
}

async function renderAvailableServices() {
    const res = await fetch(`${API_BASE}/services`);
    const services = await res.json();
    const list = document.getElementById("availableServices");
    if (!list) return;
    list.innerHTML = "";
    services.forEach(s => {
        const item = document.createElement("li");
        item.innerHTML = `${s.username} - ${s.title}: ${s.description}` +
            ` <button class='fav-btn' onclick='addToFavorites("${s._id}")'>Shortlist</button>`;
        list.appendChild(item);
    });
}

async function addToFavorites(serviceId) {
    const res = await fetch(`${API_BASE}/services/${serviceId}`);
    const service = await res.json();

    await fetch(`${API_BASE}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user: currentUser.username,
            cleaner: service.username,
            title: service.title,
            description: service.description
        })
    });

    renderShortlist();
}

async function renderShortlist() {
    const res = await fetch(`${API_BASE}/favorites?user=${currentUser.username}`);
    const favorites = await res.json();
    const list = document.getElementById("shortlist");
    if (!list) return;
    list.innerHTML = "";
    favorites.forEach(f => {
        const item = document.createElement("li");
        item.textContent = `${f.cleaner} - ${f.title}: ${f.description}`;
        list.appendChild(item);
    });
}

function generateReports() {
    document.getElementById("reportOutput").textContent = "(Reports will be dynamically generated using MongoDB data)";
}
