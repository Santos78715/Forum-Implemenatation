export const elements = {
  createPostForm: document.getElementById("createPostSection"),
  userDataSection: document.getElementById("postCard"),
  createPostButton: document.getElementById("createPostButton"),
  fetchPostButton: document.getElementById("fetchPostsButton"),
  postEditButton: document.getElementById("editButton"),
  postDeleteButton: document.getElementById("deleteButton"),
  postUpdateButton: document.getElementById("updateButton"),
  loader: document.getElementById("loader"),
  authorId: document.getElementById("authorId"),
  postData: document.getElementById("postCopy"),
};

export class ForumModal {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  async graphqlGenericRequest(graphqlQuery, payload = {}) {
    try {
      const res = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Api-Key": this.key,
        },
        body: JSON.stringify({ query: graphqlQuery, variables: payload }),
      });

      const postData = await res.json();

      if (postData.statusCode === 403) {
        alert(
          "Permission denied! Cannot fetch forum posts. Check credentials."
        );
        return;
      }

      if (postData.errors) {
        throw new Error(postData.errors[0].message);
      }

      return postData.data;
    } catch (error) {
      console.error("GraphQL Request Error:", error.message);
      alert(error.message);
    }
  }

  // Fetch all forum posts
  async getAllForumPosts() {
    try {
      const query = `
        query {
          getForumPosts {
            ID: id
            Author_ID: author_id
            Copy: copy
          }
        }
      `;

      const data = await this.graphqlGenericRequest(query);
      return data?.getForumPosts || [];
    } catch (error) {
      alert("Error while fetching forum posts");
      console.error("Fetching posts failed:", error.message);
    }
  }

  // Create a new forum post
  async createForumPost(postData) {
    try {
      const mutation = `
        mutation ($payload: ForumPostCreateInput!) {
          createForumPost(payload: $payload) {
            Author_ID: author_id
            Copy: copy
            Id: id
          }
        }
      `;

      const payload = { payload: { author_id: 62, copy: postData } };
      const data = await this.graphqlGenericRequest(mutation, payload);
      return data;
    } catch (error) {
      alert("Error while creating forum post");
      console.error("Create post error:", error.message);
    }
  }

  // Update a post by ID
  async updateForumPostById(id, updatedValue) {
    try {
      const mutation = `
        mutation ($id: EduflowproForumPostID!, $payload: ForumPostUpdateInput!) {
          updateForumPost(query: [{ where: { id: $id } }], payload: $payload) {
            id
            copy
          }
        }
      `;

      const payload = {
        id,
        payload: { copy: updatedValue },
      };

      const data = await this.graphqlGenericRequest(mutation, payload);
      return data;
    } catch (error) {
      alert("Error while updating post");
      console.error("Update error:", error.message);
    }
  }

  // Delete a post by ID
  async deletePost(id) {
    try {
      const mutation = `
        mutation ($id: EduflowproForumPostID!) {
          deleteForumPost(query: [{ where: { id: $id } }]) {
            id
          }
        }
      `;

      const data = await this.graphqlGenericRequest(mutation, { id });
      return data;
    } catch (error) {
      alert("Error while deleting post");
      console.error("Delete error:", error.message);
    }
  }
}
