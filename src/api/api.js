const BASE_URL = "http://localhost:5000/users";

export async function getData() {
  const res = await fetch(BASE_URL);
  return await res.json();
}

export async function postData(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}
