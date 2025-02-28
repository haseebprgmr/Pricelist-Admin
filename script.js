const BIN_ID = '67c116dbad19ca34f813d134'; // Replace with your Bin ID
const API_KEY = '$2a$10$PBdovtf4GVCRv1mFrs4EReP7QAkgpDl4CE69Cn7I5CdN3Z44ZaXX.'; // Replace with your API Key
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Fetch items from JSONBin
async function fetchItems() {
  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Master-Key': API_KEY }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched items:', data.record);
    displayItems(data.record);
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

// Display items in the admin panel
function displayItems(items) {
  const itemList = document.getElementById('admin-item-list');
  if (!itemList) {
    console.error('Element with ID "admin-item-list" not found.');
    return;
  }

  itemList.innerHTML = items.map((item, index) => `
    <div class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-xl font-bold">${item.name}</h2>
      <p>Price per Kg: ${item.priceKg}</p>
      <p>Price per Qty: ${item.priceQty}</p>
      <button onclick="deleteItem(${index})" class="bg-red-500 text-white p-2 mt-2">Delete</button>
    </div>
  `).join('');
}

// Add a new item
document.getElementById('item-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const item = {
    name: document.getElementById('item-name').value,
    priceKg: parseFloat(document.getElementById('item-price-kg').value),
    priceQty: parseFloat(document.getElementById('item-price-qty').value)
  };

  // Validate input
  if (!item.name || isNaN(item.priceKg) || isNaN(item.priceQty)) {
    alert('Please fill out all fields correctly.');
    return;
  }

  // Add the item
  await addItem(item);

  // Clear the form
  document.getElementById('item-form').reset();
});

async function addItem(item) {
  try {
    // Fetch current items
    const currentItems = await getItems();

    // Add the new item to the list
    const updatedItems = [...currentItems, item];

    // Send the updated list to JSONBin
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedItems)
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Item added successfully:', data);

    // Refresh the item list in the admin panel
    fetchItems();
  } catch (error) {
    console.error('Error adding item:', error);
  }
}

// Fetch current items
async function getItems() {
  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Master-Key': API_KEY }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.record; // Return the array of items
  } catch (error) {
    console.error('Error fetching items:', error);
    return []; // Return an empty array if there's an error
  }
}

// Delete an item
async function deleteItem(index) {
  try {
    const items = await getItems();
    items.splice(index, 1); // Remove the item at the specified index

    // Update the bin
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(items)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Item deleted successfully:', data);

    // Refresh the item list
    fetchItems();
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

// Initial fetch
fetchItems();
