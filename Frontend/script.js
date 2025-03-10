const apiUrl = "https://crud-backend-ei8i.onrender.com/teas";
const token = localStorage.getItem("token");

// ✅ Redirect to login if not authenticated
if (!token) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  fetchTeas(); // Load teas on page load
});

// Fetch and display all teas
async function fetchTeas() {
  try {
    const response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }, // Send token for authentication
    });

    if (!response.ok) {
      throw new Error("Failed to fetch teas. Please log in again.");
    }

    const teas = await response.json();
    const teaList = document.getElementById("teaList");
    teaList.innerHTML = ""; // Clear existing table

    teas.forEach(displayTea); // Add each tea to the table
  } catch (error) {
    console.error("Error fetching teas:", error);
    alert(error.message);
    window.location.href = "login.html"; // Redirect if unauthorized
  }
}

// Add new tea
document.getElementById("teaForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();

  if (!name || !price) {
    alert("⚠ Please enter both name and price.");
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token
      },
      body: JSON.stringify({ name, price }),
    });

    if (!response.ok) {
      throw new Error("Failed to add tea. Try again.");
    }

    const newTea = await response.json();
    displayTea(newTea); // Add tea to table without refreshing
    document.getElementById("teaForm").reset(); // Clear form
  } catch (error) {
    console.error("Error adding tea:", error);
    alert(error.message);
  }
});

// Function to display a tea in the table
function displayTea(tea) {
  const teaList = document.getElementById("teaList");
  const row = document.createElement("tr");
  row.id = `tea-${tea._id}`; // Use _id instead of id
  row.innerHTML = `
    <td>${tea._id}</td>
    <td>${tea.name}</td>
    <td>₹${tea.price}</td>
    <td>
        <button onclick="deleteTea('${tea._id}')" 
            class="btn btn-danger btn-sm">🗑️ Delete</button>
    </td>
  `;

  teaList.appendChild(row);
}

// Delete tea from frontend and backend
async function deleteTea(_id) {
  if (!confirm("Are you sure you want to delete this tea?")) return;

  try {
    const response = await fetch(`${apiUrl}/${_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }, // Send token
    });

    if (!response.ok) {
      throw new Error("Failed to delete tea.");
    }

    // Remove the tea from the UI without reloading
    document.getElementById(`tea-${_id}`).remove();
  } catch (error) {
    console.error("Error deleting tea:", error);
    alert(error.message);
  }
}

window.deleteTea = deleteTea; // Make the function accessible in HTML
