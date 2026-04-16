async function uploadImage() {
  const input = document.getElementById("imageInput");
  const file = input.files[0];
  if (!file) {
    alert("Please select an image first!");
    return;
  }

  // Show preview
  const preview = document.getElementById("preview");
  preview.innerHTML = `<img src="${URL.createObjectURL(file)}" width="300" />`;

  // Send to backend
  const formData = new FormData();
  formData.append("file", file);

  document.getElementById("result").innerHTML = "⏳ Assessing...";

  try {
    const response = await fetch("/assess-damage/", {  // ✅ your correct endpoint
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    document.getElementById("result").innerHTML = `
      <h2>Result:</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
  } catch (err) {
    document.getElementById("result").innerHTML = "❌ Error: " + err.message;
  }
}