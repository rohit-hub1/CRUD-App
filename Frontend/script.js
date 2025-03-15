const apiUrl = "https://crud-backend-ei8i.onrender.com/teas";

// ✅ Fetch User ID and Display Below Logout Button
async function fetchUserId() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch user info");

    const userData = await response.json();
    const userIdElement = document.getElementById("user-id");
    if (userData.userId) {
      userIdElement.textContent = `User ID: ${userData.userId}`;
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }
}

// ✅ Load User ID when page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchTeas();
  fetchUserId();

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
});

// ✅ Reusable API Call Function
async function makeApiCall(url, method, body = null) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
        return;
      }
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call error:", error);
    alert("Something went wrong. Please try again.");
    throw error;
  }
}

// ✅ Fetch and Display Teas
async function fetchTeas() {
  try {
    const teas = await makeApiCall(apiUrl, "GET");
    const teaList = document.getElementById("teaList");
    teaList.innerHTML = "";

    teas.forEach(displayTea);
  } catch (error) {
    console.error("Error fetching teas:", error);
  }
}

// ✅ Add New Tea
document.getElementById("teaForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!name || !price) {
    alert("Please enter both name and price.");
    return;
  }

  try {
    const newTea = await makeApiCall(apiUrl, "POST", { name, price });
    displayTea(newTea);
    document.getElementById("teaForm").reset();
  } catch (error) {
    console.error("Error adding tea:", error);
  }
});

// ✅ Display a Tea in the Table
function displayTea(tea) {
  const teaList = document.getElementById("teaList");
  const row = document.createElement("tr");
  row.id = `tea-${tea._id}`;
  row.innerHTML = `
    <td>${tea._id}</td>
    <td>${tea.name}</td>
    <td>₹${tea.price}</td>
    <td>
      <button onclick="deleteTea('${tea._id}')" class="btn btn-danger btn-sm">🗑️ Delete</button>
    </td>
  `;

  teaList.appendChild(row);
}

// ✅ Delete Tea
async function deleteTea(_id) {
  if (!confirm("Are you sure you want to delete this tea?")) return;

  try {
    await makeApiCall(`${apiUrl}/${_id}`, "DELETE");
    document.getElementById(`tea-${_id}`).remove();
  } catch (error) {
    console.error("Error deleting tea:", error);
  }
}

// Ensure functions are accessible in HTML
window.fetchTeas = fetchTeas;
window.deleteTea = deleteTea;
