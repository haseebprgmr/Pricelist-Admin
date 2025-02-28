const BIN_ID = '67c116dbad19ca34f813d134';
const API_KEY = '67c116dbad19ca34f813d134';
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
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'X-Master-Key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  const data = await response.json();
  console.log(data);
}
