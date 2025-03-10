const apiUrl = "https://crud-backend-ei8i.onrender.com";
const token = localStorage.getItem("token");

// ✅ Redirect to login if not authenticated
if (!token) {
  window.location.href = "login.html";
}

// ✅ Fetch and display user's teas
document.addEventListener("DOMContentLoaded", () => {
  fetchTeas();
});

// Fetch Teas for the Logged-in User
async function fetchTeas() {
  try {
    const response = await fetch(`${apiUrl}/teas`, {
      headers: { Authorization: token },
    });

    const teas = await response.json();
    const teaList = document.getElementById("teaList");
    teaList.innerHTML = "";

    teas.forEach(displayTea);
  } catch (error) {
    console.error("Error fetching teas:", error);
  }
}

// ✅ Add new tea
document.getElementById("teaForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!name || !price) {
    alert("Please enter both name and price.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/teas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ name, price }),
    });

    const newTea = await response.json();
    displayTea(newTea);
    document.getElementById("teaForm").reset();
  } catch (error) {
    console.error("Error adding tea:", error);
  }
});

// ✅ Display tea in the table
function displayTea(tea) {
  const teaList = document.getElementById("teaList");
  const row = document.createElement("tr");
  row.id = `tea-${tea._id}`;
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

// ✅ Delete tea
async function deleteTea(_id) {
  if (!confirm("Are you sure you want to delete this tea?")) return;

  try {
    const response = await fetch(`${apiUrl}/teas/${_id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    if (response.ok) {
      document.getElementById(`tea-${_id}`).remove();
    } else {
      console.error("Failed to delete tea");
    }
  } catch (error) {
    console.error("Error deleting tea:", error);
  }
}

// ✅ Logout Function
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

window.deleteTea = deleteTea;
