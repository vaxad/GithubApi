7
# GitHub Scraper

Welcome to the GitHub Scraper! This project is designed to scrape information about GitHub repositories from a user's profile and provide a categorized view of their projects. It includes an Express server for handling requests and a set of routes for various functionalities.

## Getting Started

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/vaxad/GitScraper.git
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Set up your MongoDB connection by creating a `.env` file in the project root with the following format:

    ```plaintext
    MONGODB_URI=your_mongodb_uri
    USERNAME=your_username
    ```

4. Run the server:

    ```bash
    npm run server
    ```

The server will be live at `http://localhost:4000`.

## Endpoints

### 1. `GET /`

- **Description:** Check if the server is live.
- **Example:** `http://localhost:4000/`

### 2. `GET /github`

- **Description:** Scrape GitHub repositories from a user's profile and categorize them into web, server, and app projects.
- **Example:** `http://localhost:4000/github`

### 3. `GET /github/repo/:name`

- **Description:** Get detailed information about a specific GitHub repository.
- **Parameters:**
  - `name`: The name of the GitHub repository.
- **Example:** `http://localhost:4000/github/repo/:name`

### 4. `GET /github/all`

- **Description:** Retrieve all stared GitHub repositories' information stored in the database.
- **Example:** `http://localhost:4000/github/all`

## Usage
- Star the repositories you want to fetch in a list.
- For example, make a list named _Frontend_ and add all ypur frontend projects to that list, similarly make lists for _Backend_, _Blockchain_, as per your need.
- The `/github/all` endpoint will return all the lists and the repositories
- ***Note***: You may need to change the code in order for it to work for you.
## Deployed Instance

This GitHub Scraper is deployed and accessible on [Live server](https://vaxad.vercel.app/api/github).

## Frontend Integration

To see this GitHub Scraper in action, visit [My Portfolio](https://vaxad.vercel.app). This frontend application fetches data from the deployed server instance.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Axios
- Cheerio
- Pretty

Feel free to explore the code and customize it according to your needs. If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request. Happy coding!
