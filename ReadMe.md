# MovieStream1

MovieStream1 is a React application that allows users to browse and search for movies using the TMDB (The Movie Database) API.

## Table of Contents
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/MovieStream1.git
    cd MovieStream1
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

## Setup

1. **Get TMDB API Key:**
    - Go to [TMDB](https://www.themoviedb.org/) and sign up for an account.
    - Navigate to your account settings and find the API section.
    - Generate a new API key.

2. **Create a `.env` file in the root directory:**
    ```bash
    touch .env
    ```

3. **Add your TMDB API key to the `.env` file:**
    ```env
    REACT_APP_TMDB_API_KEY=your_api_key_here
    ```

4. **Configure additional environment variables if needed:**
    ```env
    REACT_APP_API_BASE_URL=https://api.themoviedb.org/3
    ```

## Usage

1. **Start the development server:**
    ```bash
    npm start
    ```

2. **Open your browser and navigate to:**
    ```
    http://localhost:3000
    ```

3. **Browse and search for movies using the TMDB API.**

## Features

- **Search Movies:** Search for movies by title.
- **Movie Details:** View detailed information about each movie.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Favorites:** Save your favorite movies (coming soon).

## Contributing

1. **Fork the repository.**

2. **Create a new branch:**
    ```bash
    git checkout -b feature-branch
    ```

3. **Make your changes and commit them:**
    ```bash
    git commit -m 'Add some feature'
    ```

4. **Push to the branch:**
    ```bash
    git push origin feature-branch
    ```

5. **Create a new Pull Request.**

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or issues, please contact [yourname@example.com](mailto:yourname@example.com).