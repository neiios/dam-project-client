## Set up project

First make sure you have at least Node.js 20 and npm installed.

Clone the project

```sh
git clone https://github.com/neiios/dam-project-client.git
```

Install dependencies

```sh
npm install
```

Create .env file in root directory and add the IP address and port your backend is running on:

```sh
EXPO_PUBLIC_API_BASE=69.69.69.69:8080
```

Make sure the backend is running correctly and the database is populated with some test data.

Start project:

```sh
npm run start
```

Then scan QR code with Expo GO app.
Make sure that your devices are on the same network.
Also make sure the ports are open in your firewall.

## TODO

1. [ ] Endpoint for user questions (on articles page) should return just pending questions. This way, under pending will be just user's questions and under "Questions" all of the answered ones, from all users
1. [ ] Fallback img for conferences
1. [ ] Add dark theme
1. [ ] Fix admim page styling
1. [ ] Test the application
1. [ ] ???
1. [ ] PROFIT
