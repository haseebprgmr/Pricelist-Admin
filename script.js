const BIN_ID = '67c116dbad19ca34f813d134'; // Replace with your JSONBin.io bin ID
const API_KEY = '$2a$10$k/WrCeOiHPNmJbZM/ZOLJuYFNeUgbkopL94mSetqKQGiowSgPDnwq'; // Replace with your JSONBin.io API key
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Fetch items from JSONBin
fetch("https://api.jsonbin.io/v3/b/YOUR_BIN_ID", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "X-Master-Key": "YOUR_SECRET_KEY"
  },
  body: JSON.stringify({
    items: [
      { "name": "Product A", "price": 12.99, "price_per_kg": 25.98, "price_per_unit": 1.30 },
      { "name": "Product B", "price": 6.49, "price_per_kg": 13.98, "price_per_unit": 0.65 }
    ]
  })
  .then(response => response.json())
  .then(data => console.log("Updated:", data))
  .catch(error => console.error("Error:", error));
  }
}

// Display items in the admin panel
function displayItems(items) {
  const itemList = document.getElementById('admin-item-list');
  itemList.innerHTML = items.map((item, index) => `
    <div class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-xl font-bold">${item.name}</h2>
      <p>Price per Kg: $${item.priceKg}</p>
      <p>Price per Qty: $${item.priceQty}</p>
      <button onclick="deleteItem(${index})" class="bg-red-500 text-white p-2 mt-2">Delete</button>
    </div>
  `).join('');
}

// Add a new item
document.getElementById('item-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const item = {
    name: document.getElementById('item-name').value,
    priceKg: document.getElementById('item-price-kg').value,
    priceQty: document.getElementById('item-price-qty').value
  };
  await addItem(item);
});

async function addItem(item) {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'X-Master-Key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify([...await getItems(), item])
    });
    const data = await response.json();
    console.log('Item added:', data);
    fetchItems();
  } catch (error) {
    console.error('Error adding item:', error);
  }
}

// Delete an item
async function deleteItem(index) {
  try {
    const items = await getItems();
    items.splice(index, 1);
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'X-Master-Key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    const data = await response.json();
    console.log('Item deleted:', data);
    fetchItems();
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

// Fetch current items
async function getItems() {
  const response = await fetch(API_URL, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const data = await response.json();
  return data.record;
}

// Initial fetch
fetchItems();
