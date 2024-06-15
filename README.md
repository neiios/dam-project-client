## Set up project

Clone the project

```
git clone https://github.com/neiios/dam-project-client.git
```

Install dependencies

```
npm install
```

Create .env file in root directory and add the IP address and port your dev API is running on

```
EXPO_PUBLIC_API_BASE=192.168.2.233:8080
```

Start project

```
npm run start
```

Then scan QR code with Expo app. Make sure that your devices are on the same network.
Also make sure that the ports are open in your firewall.

## TO-DO

### Conferences

1. [ ] Show response on question in a modal window
2. [ ] Q&A for articles

### Profile

1. [ ] See user info on profile page

### Auth

1. [ ] Auto-logout (JWT expiration)
2. [ ] State of the app for guest users
3. [ ] State of the app for admin users

### Backoffice

1. [ ] Add datepicker
2. [ ] Add map for location selection

### Secondary stuff

1. [ ] Add dark theme everywhere
2. [ ] Infinite scroll for conferences
3. [ ] Animation on touch of nav items (filling background color)
4. [ ] Find an adequate way of nesting routes, with something like [id].tsx
   - https://github.com/huanghanzhilian/c-shopping-rn/tree/main/app
   - https://docs.expo.dev/develop/dynamic-routes/
5. [ ] Fallback img for conferences
6. [ ] Add share button to header of a conference page (probably need context for state)
