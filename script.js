const BIN_ID = '67c116dbad19ca34f813d134';
const API_KEY = '$2a$10$k/WrCeOiHPNmJbZM/ZOLJuYFNeUgbkopL94mSetqKQGiowSgPDnwq';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

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
