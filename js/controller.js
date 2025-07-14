import { elements } from "./modal.js";

export class ForumController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.bindCreatePostButton();
    this.bindFetchPostsButton();
    this.bindFormSubmit();
  }

  bindCreatePostButton() {
    elements.createPostButton.addEventListener("click", () => {
      this.view.toggleCreateFormSection();
    });
  }

  bindFetchPostsButton() {
    elements.fetchPostButton.addEventListener("click", async () => {
      await this.fetchAndRenderPosts();
    });
  }

  bindFormSubmit() {
    elements.createPostForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleCreatePost();
    });
  }

  async fetchAndRenderPosts() {
    this.view.showLoader();
    try {
      const posts = await this.model.getAllForumPosts();
      this.view.renderPosts(posts);
      this.bindPostEvents();
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      this.view.hideLoader();
    }
  }

  bindPostEvents() {
    document.querySelectorAll(".update-button").forEach((button) => {
      const postId = button.dataset.id;
      this.view.bindEditButton(button, () => this.handleUpdatePost(postId));
    });

    document.querySelectorAll(".delete-button").forEach((button) => {
      const postId = button.dataset.id;
      this.view.bindDeleteButton(button, () => this.handleDeletePost(postId));
    });
  }

  async handleUpdatePost(postId) {
    this.view.showUpdateFields(postId);
    const newCopy = this.view.getUpdateInputValue(postId);

    if (newCopy) {
      this.view.showLoader();
      try {
        const updateResponse = await this.model.updateForumPostById(
          postId,
          newCopy
        );

        if (updateResponse?.updateForumPost) {
          alert("Post Updated");
          await this.fetchAndRenderPosts();
        } else {
          alert("Post not found");
        }
      } catch (error) {
        console.error("Error updating post:", error);
      } finally {
        this.view.hideLoader();
      }
    }
  }

  async handleDeletePost(postId) {
    this.view.showLoader();
    try {
      const data = await this.model.deletePost(postId.toString());

      if (data?.deleteForumPost.id != null) {
        alert("Post Deleted");
        await this.fetchAndRenderPosts();
      } else {
        alert("Post not found");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      this.view.hideLoader();
    }
  }

  async handleCreatePost() {
    const postData = elements.postData.value;

    if (!postData) {
      alert("Please enter post data");
      return;
    }

    this.view.showLoader();
    try {
      const data = await this.model.createForumPost(postData);

      if (data?.createForumPost) {
        alert(`Post Created with id: ${data.createForumPost.Id}`);
        this.view.clearPostInput();
        await this.fetchAndRenderPosts();
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      this.view.hideLoader();
    }
  }
}
