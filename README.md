Rave Connect
============

Rave Connect is a social media platform designed to connect ravers and promoters, allowing them to share posts, interact with events, and engage with each other through likes, comments, replies, and more. The platform also integrates features for event management, image uploads, and post interactions, creating a seamless community experience for users in the rave and EDM scene.

Features
--------

-   **User Authentication**: Secure user login and registration with JWT authentication.
-   **Posts & Comments**: Users can create posts, comment on posts, and reply to comments in a threaded manner.
-   **Likes & Reactions**: Users can like/unlike posts to show appreciation or interaction.
-   **Event Integration**: Events can be posted along with image and event details.
-   **Image & Video Upload**: Users can upload and display images and videos in their posts.
-   **Profile Management**: Users can update profile pictures and view their personal feed.

Tech Stack
----------

-   **Frontend**: React.js, Tailwind CSS for styling.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB.
-   **Authentication**: JWT (JSON Web Tokens).
-   **Cloud Storage**: Cloudinary for image and video uploads.
-   **APIs**: EDM Train API integration for events.

Installation
------------

### Prerequisites

-   **Node.js** installed on your machine.
-   **MongoDB** instance (local or cloud-based like MongoDB Atlas).
-   **Cloudinary** account for image hosting (optional but recommended for media uploads).

### Setup

1.  Clone the repository:

    ```bash
    git clone https://github.com/austintylerallen/rave-connect.git
    cd rave-connect
    ```

2.  Install dependencies for both frontend and backend:

    ```bash
    npm install
    cd frontend
    npm install
    ```

3.  Set up environment variables: Create a `.env` file in the backend directory and add the following environment variables:

    ```env
    MONGODB_URI=<Your MongoDB URI>
    JWT_SECRET=<Your JWT Secret>
    CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
    CLOUDINARY_API_KEY=<Your Cloudinary API Key>
    CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
    ```

4.  Run the app (from the root directory):

    ```bash
    npm run dev
    ```

    This will concurrently start both the backend and the frontend servers.

### Folder Structure

```bash
/rave-connect
  ├── backend
  │   ├── controllers
  │   ├── models
  │   ├── routes
  │   ├── middleware
  │   └── server.js
  ├── frontend
  │   ├── src
  │   ├── public
  │   └── components
  ├── .env
  ├── package.json
  └── README.md

Usage
-----

-   **Home Feed**: View posts from other users, including events and media.
-   **Post Creation**: Create new posts with text and images.
-   **Comments & Replies**: Interact with other users by commenting on posts and replying to comments.
-   **Like Feature**: Like/unlike posts to show your reaction.
-   **Profile**: Update your profile and view your posts.
-   **Event Management**: Add or manage event details, including images and descriptions.

API Endpoints
-------------

### Authentication

-   `POST /api/auth/register` - Register a new user.
-   `POST /api/auth/login` - Login with credentials to get a JWT.

### Posts

-   `GET /api/posts` - Get all posts.
-   `POST /api/posts` - Create a new post (requires authentication).
-   `PUT /api/posts/:id` - Edit an existing post.
-   `DELETE /api/posts/:id` - Delete a post.
-   `POST /api/posts/:id/like` - Like or unlike a post.

### Comments

-   `GET /api/comments/:postId` - Get comments for a post.
-   `POST /api/comments/:postId` - Add a comment to a post.

Contributing
------------

Feel free to fork the repository, submit a pull request, or report any issues in the [issues section ](https://github.com/austintylerallen/rave-connect/issues).

License
-------

This project is licensed under the MIT License - see the LICENSE file for details.