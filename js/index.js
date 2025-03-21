document.addEventListener("DOMContentLoaded", () => {
  const bookList = document.getElementById("list");
  const showPanel = document.getElementById("show-panel");
  const currentUser = { id: 1, username: "pouros" };

  function fetchBooks() {
      fetch("http://localhost:3000/books")
          .then(res => res.json())
          .then(books => {
              bookList.innerHTML = "";
              books.forEach(renderBook);
          })
          .catch(error => console.error("Error fetching books:", error));
  }

  function renderBook(book) {
      const li = document.createElement("li");
      li.textContent = book.title;
      li.addEventListener("click", () => showBookDetails(book));
      bookList.appendChild(li);
  }

  function showBookDetails(book) {
      const usersListHTML = (book.users || []).map(user => `<li>${user.username}</li>`).join("");

      showPanel.innerHTML = `
          <h2>${book.title}</h2>
          <img src="${book.thumbnail}" alt="${book.title}" />
          <p>${book.description}</p>
          <h4>Liked by:</h4>
          <ul id="users-list">${usersListHTML}</ul>
          <button id="like-btn">${isLiked(book) ? "Unlike" : "Like"}</button>
      `;

      document.getElementById("like-btn").addEventListener("click", () => toggleLike(book));
  }

  function isLiked(book) {
      return (book.users || []).some(user => user.id === currentUser.id);
  }

  function toggleLike(book) {
      let updatedUsers;
      if (isLiked(book)) {
          updatedUsers = (book.users || []).filter(user => user.id !== currentUser.id);
      } else {
          updatedUsers = [...(book.users || []), currentUser];
      }

      fetch(`http://localhost:3000/books/${book.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ users: updatedUsers })
      })
          .then(res => res.json())
          .then(updatedBook => showBookDetails(updatedBook))
          .catch(error => console.error("Error updating book:", error));
  }

  fetchBooks();
});
