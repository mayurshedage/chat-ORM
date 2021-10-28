# chat-ORM

### Initial Setup

- Prerequisite (Node - latest version, Mysql - 8.0, Redis)

1. Clone the repository
2. Run command `npm install` in same directory where you clone the repository
3. Create .env file root directory and copy all contents from .env.example (do required changes)
4. To start redis server run `redis-server` - (For windows 10+ use install windows WSL)
5. To start development server run command `npm run dev` and for production run `npm start`

### API Domain Standards

1. *.yourdomain.com
2. eg., api.yourdomain.com, `YOUR_APP_ID`.api.yourdomain.com
3. If you not passed the `YOUR_APP_ID` in request then it must be passed in request header as `appId` key and value `YOUR_APP_ID`

### Initial API

- /apps

1. Run create apps API first to create new APP in your database instance
2. Route /v1.0/apps (add `apiKey` header with `regionSecret` value find in .env)
3. This will create new user account and the database

 ### Rest APIs

 1. /users
 2. /groups
 3. /apikeys
 4. /roles

