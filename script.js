const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function performSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    alert("Please enter something to search.");
    return;
  }

  alert(
    `Aquivora search is being prepared for "${query}".`
  );
}

searchButton.addEventListener("click", performSearch);

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    performSearch();
  }
});
