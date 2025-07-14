import { ForumModal } from "./modal.js";
import { ForumView } from "./view.js";
import { ForumController } from "./controller.js";

const API_URL = "https://eduflowpro.vitalstats.app/api/v1/graphql";
const API_KEY = "VEO3JQKtYtxEYBf6ashYN";

const modal = new ForumModal(API_URL, API_KEY);
const view = new ForumView(modal);
new ForumController(modal, view);

// window.onload = getAllForumPosts;
