# GameBet
This is a Bet system API where participants and games can be registered.
After that, participants may bet on games results and if they guess the correct outcome they could earn more credits to thei persona balance.
Correct bets earning are calculated with the following equation:

    Winnin bet earnings = (Bet amount / (sum of every winning bet for the game)) * (sum of every bet for the game) * (0.7)

There is a 30% cut on total amount that goes to the house, the remaining 70% is divided proportionally between every winning bet based on it's onw amount.

# Deploy Link:

To test, and use the live server running this API you can use the following link:

https://gamebet-api.onrender.com

# Routes:

## POST "/participants":
Description: register a new participant
Expected Body: 
{
	name: string;     // Any user name is accepted 
	balance: number; // Represented in cents ($ 10,00 -> 1000)
}
Response Body:
{
	id: number;
	createdAt: string;
	updatedAt: string;
	name: string;
	balance: number; // Represented in cents ($ 10,00 -> 1000)
}

## POST "/games":
Description: register a new game
Expected Body: 
{
	homeTeamName: string; // Team names must not be a number or numeric string
	awayTeamName: string;
}
Response Body:
{
	id: number;
	createdAt: string;
	updatedAt: string;
	homeTeamName: string;
	awayTeamName: string;
	homeTeamScore: number;    // By default starts with 0
	awayTeamScore: number;   // By default starts with 0
	isFinished: boolean;    // By default starts with false
}

## POST "/bets":
Description: register a new bet, subtracting credits from participant balance
Expected Body: 
{ 
	homeTeamScore: number; // Any number greater or equal to 0
	awayTeamScore: number; // Any number greater or equal to 0
	amountBet: number; // Represented in cents ($ 10,00 -> 1000), must be greater than 0
	gameId: number;  // Game must not be over
	participantId: number;
}
Response Body:
{
	id: number;
	createdAt: string;
	updatedAt: string;
	homeTeamScore: number;
	awayTeamScore: number;
	amountBet: number; // Represented in cents ($ 10,00 -> 1000)
	gameId: number; 
	participantId: number;
	status: string; // By default starts with PENDING
	amountWon: number || null; // null while PENDING; number if WON oor LOST, also represented in cents ($ 10,00 -> 1000)
}

## POST "/games/:id/finish":
Description: Finish a game with the provided ":id" and teams scores,updating related bets and participants balances in case of a correct guess.
Game must not be over. 
Expected Body: 
{ 
	homeTeamScore: number; // Any number greater or equal to 0
	awayTeamScore: number; // Any number greater or equal to 0
}
Response Body:
{
	id: number;
	createdAt: string;
	updatedAt: string;
	homeTeamName: string;
	awayTeamName: string;
	homeTeamScore: number;  // Provided result
	awayTeamScore: number;  // Provided result
	isFinished: boolean;    // True
}

## GET "/participants":
Description: Returns an array with all registered participants infos.
Game must not be over. 
Response Body:
[
	{
		id: number;
		createdAt: string;
		updatedAt: string;
		name: string;
		balance: number; // Represented in cents ($ 10,00 -> 1000)
	}, 
	{...}
]

## GET "/games":
Description: Returns an array with all registered games infos.
Game could be over or not. 
Response Body:
[
	{
		id: number;
		createdAt: string;
		updatedAt: string;
		homeTeamName: string;
		awayTeamName: string;
		homeTeamScore: number;
		awayTeamScore: number;
		isFinished: boolean;
	},
	{...}
]

## GET "/games/:id":
Description: Returns infos of the game related to the provided ":id" along with a all related bets infos in an array.
Game could be over or not. 
Response Body:
{
	id: number;
	createdAt: string;
	updatedAt: string;
	homeTeamName: string;
	awayTeamName: string;
	homeTeamScore: number;
	awayTeamScore: number;
	isFinished: boolean;
	bets: {
		id: number;
		createdAt: string;
		updatedAt: string;
		homeTeamScore: number;
		awayTeamScore: number;
		amountBet: number; // Represented in cents ($ 10,00 -> 1000)
		gameId: number; 
		participantId: number;
		status: string; // PENDING, WON or LOST
		amountWon: number || null; // null when PENDING; number if WON or LOST, with the amount won also being represented in cents
	}[]
}

# How to run for development

1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Create a PostgreSQL database with whatever name you want
4. Configure the `.env.development` file using the `.env.example
5. Run all migrations

```bash
npm run dev:migration:run
```

6. Run the back-end in a development environment:

```bash
npm run dev
```

# How to run tests

1. Follow the steps in the last section
2. Configure the `.env.test` file using the `.env.example`
3. Run all migrations:

```bash
npm run test:migration:run
```

4. Run test:

```bash
npm run test
```

# Building and starting for production

1. Configure the `.env` file using the `.env.example`
2. Run commands:
```bash
npm run build
npm run start
```