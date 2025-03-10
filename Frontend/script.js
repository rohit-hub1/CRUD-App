const apiUrl = "https://crud-backend-ei8i.onrender.com/teas";

// Fetch and display teas for the logged-in user
async function fetchTeas() {
  const token = localStorage.getItem("token"); // Get token from localStorage
  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in request
      },
    });

    if (!response.ok) throw new Error("Failed to fetch teas");

    const teas = await response.json();
    const teaList = document.getElementById("teaList");
    teaList.innerHTML = "";

    teas.forEach(displayTea);
  } catch (error) {
    console.error("Error fetching teas:", error);
  }
}

// Add new tea (user-specific)
document.getElementById("teaForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const token = localStorage.getItem("token");

  if (!name || !price) {
    alert("Please enter both name and price.");
    return;
  }

  if (!token) {
    alert("Unauthorized! Please log in.");
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price }),
    });

    if (!response.ok) throw new Error("Failed to add tea");

    const newTea = await response.json();
    displayTea(newTea);
    document.getElementById("teaForm").reset();
  } catch (error) {
    console.error("Error adding tea:", error);
  }
});

// Function to display a tea
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

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${apiUrl}/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete tea");

    document.getElementById(`tea-${_id}`).remove();
  } catch (error) {
    console.error("Error deleting tea:", error);
  }
}

// Ensure functions are accessible in HTML
window.fetchTeas = fetchTeas;
window.deleteTea = deleteTea;

// Load teas when the page loads
document.addEventListener("DOMContentLoaded", fetchTeas);
