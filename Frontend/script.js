const apiUrl = "https://crud-backend-ei8i.onrender.com/teas";
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

// Check authentication status
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");

  if (token) {
    logoutBtn.classList.remove("hidden");
    loginBtn.classList.add("hidden");
  } else {
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }

  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
  });

  fetchTeas();
});

// Fetch and display all teas
async function fetchTeas() {
  try {
    const response = await fetch(apiUrl);
    const teas = await response.json();
    const teaList = document.getElementById("teaList");
    teaList.innerHTML = ""; // Clear existing table

    teas.forEach(displayTea); // Add each tea to the table
  } catch (error) {
    console.error("Error fetching teas:", error);
  }
}

// Add new tea
document.getElementById("teaForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!name || !price) {
    alert("Please enter both name and price.");
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });

    const newTea = await response.json();
    displayTea(newTea); // Add tea to table without refreshing
    document.getElementById("teaForm").reset(); // Clear form
  } catch (error) {
    console.error("Error adding tea:", error);
  }
});

// Function to display a tea in the table
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

// Delete tea
async function deleteTea(_id) {
  if (!confirm("Are you sure you want to delete this tea?")) return;

  try {
    const response = await fetch(`${apiUrl}/${_id}`, { method: "DELETE" });

    if (response.ok) {
      document.getElementById(`tea-${_id}`).remove();
    } else {
      console.error("Failed to delete tea");
    }
  } catch (error) {
    console.error("Error deleting tea:", error);
  }
}

window.deleteTea = deleteTea; // Make function accessible in HTML
