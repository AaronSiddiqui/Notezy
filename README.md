# Notezy

## About

Notezy is a note-sharing platform that allows students from third-level Irish colleges to share notes amongst each. The aim was to provide a platform that would allow students to collaborate with each in relation to modules of their course that they were having difficulty in.

This application is based on the MEJN (MongoDB, Express, jQuery, Node.js) technology stack.

<!-- ## Visuals -->


## Prerequisites

For development you will only need **Node.js** and **npm** installed on your environment.

```bash
node --version
v14.5.0

npm --version
6.14.5
```

## Installation

Once the repo has been cloned, use npm to install the necessary modules.

```bash
npm install
```

Customise the environmental variables with a .env file in the root folder

```
PORT=
MONGODB_URI=
```

**Note:** MONGODB_URI is required to persist data to a MongoDB database.

## Starting a Local Server

To start the server locally, run the following command.

```bash
npm start
```

This wlll start the server on http://localhost:PORT. If PORT is not specified in the .env file, it will default to **8689**.

## Authors

This applicaton was undertook by [Aaron Siddiqui](https://github.com/AaronSiddiqui) and [Patrick Duffy](https://github.com/PatrickJDuffy) as a 2nd year project to strengthen our web development skills.

## Project Status

The project is no longer being contributed to as of May 2018, but feel free to make your own contributions to the code or use it for inspiration!
