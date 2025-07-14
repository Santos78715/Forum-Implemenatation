import { elements } from "./modal.js";

export class ForumView {
  constructor() {
    this.postsSection = elements.userDataSection;
  }

  clearPosts() {
    this.postsSection.innerHTML = "";
  }

  renderPosts(posts) {
    this.clearPosts();

    posts.forEach((post) => {
      const card = this.createPostCard(post);
      this.postsSection.appendChild(card);
    });

    this.hideLoader();
    this.showPostsSection();
  }

  createPostCard(post) {
    const card = document.createElement("div");
    card.className = "post_card";
    card.innerHTML = this.getPostCardHTML(post);
    return card;
  }

  getPostCardHTML(post) {
    return `
      <p><strong>ID:</strong> ${post.ID}</p>
      <p><strong>Author ID:</strong> ${post.Author_ID}</p>
      <p><strong>Copy:</strong> ${post.Copy}</p>
      <label for="newCopy-${post.ID}" style="display:none" id="updateLabel-${post.ID}">
        <strong>New Copy</strong>
      </label>
      <input type="text" style="display:none" id="newCopy-${post.ID}"/>

      <div>
        <button class="update-button" data-id="${post.ID}">Edit</button>
        <button class="delete-button" data-id="${post.ID}">Delete</button>
      </div>
    `;
  }

  showUpdateFields(postId) {
    const input = document.getElementById(`newCopy-${postId}`);
    const label = document.getElementById(`updateLabel-${postId}`);

    if (input && label) {
      input.style.display = "block";
      label.style.display = "block";
    }
  }

  getUpdateInputValue(postId) {
    const input = document.getElementById(`newCopy-${postId}`);
    return input?.value || "";
  }

  showLoader() {
    elements.loader.style.display = "block";
  }

  hideLoader() {
    elements.loader.style.display = "none";
  }

  showPostsSection() {
    this.postsSection.style.display = "block";
  }

  toggleCreateFormSection() {
    const form = elements.createPostForm;
    form.style.display = form.style.display === "block" ? "none" : "block";
  }

  clearPostInput() {
    elements.postData.value = "";
  }

  bindEditButton(button, callback) {
    button.addEventListener("click", callback);
  }

  bindDeleteButton(button, callback) {
    button.addEventListener("click", callback);
  }
}
