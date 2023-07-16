# SETUP SERVER

1. `cd server && cp .env.example .env`
2. Install packages: `yarn install`
3. Run server: `yarn start` or `yarn dev` in development mode.
   The server will run at `http://127.0.0.1:4000`

# SETUP FRONTEND

1. `cd frontend && cp .env.example .env`
2. Install packages: `yarn install`
3. Run front-end: `yarn start`. It will available at `http://127.0.0.1:3000`

# Essays

## How much time did you spend on the challenge?

About 12 hours

## How would you handle a longer time range (such as weeks to months)?

I may have to divide it into about 2000 blocks to crawl events and perform calculations. However, I don't have enough time to do this. If I have more time, I will be able to do it.

## How would you improve the scalability of the backend?

I believe implementing a crawler in the backend to crawl events and store them in a database would be beneficial. By doing so, the API will require less time to retrieve results.

## How would you handle multiple tokens on the frontend?

Token Selection: Implement a select box or dropdown menu that allows the user to choose a token from the available options. This provides a user-friendly interface for selecting the desired token.

Supported Tokens List: Create a list or array that contains the supported tokens. This list can be populated with the available token options, either hardcoded or retrieved dynamically from the backend. It helps provide an overview of the tokens available for selection.

## What would you improve if you had more time to spend on this coding challenge?

As mentioned earlier, I will create a backend crawler to cache the data. Additionally, I will update the frontend to allow users to retrieve swap events from multiple tokens, not just USDC.
