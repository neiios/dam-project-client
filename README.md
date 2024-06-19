> [!IMPORTANT]
> This repository hosts the client-side component of the project. For the server-side code, please refer to a separate repository [here](https://github.com/neiios/dam-project-server).

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
EXPO_PUBLIC_API_BASE=192.168.21.111:8080
```

Start project:

```sh
npm run start
```

After starting the project:

- Scan QR code with `Expo Go` app.
- Make sure that your devices are on the same network and that the ports are open in your firewall.
