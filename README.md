# chat-ORM

### Initial Setup

- Prerequisite (Node - latest version, Mysql - 8.0)

1. Clone the repository
2. Run command `npm install` in same directory where you clone the repository
3. Create .env file in project root directory and copy contains from .env.example (do required changes)
4. To run development server run command `npm run dev`

### API Domain Standards

1. *.yourdomain.com
2. eg., api.yourdomain.com, {appId}.api.yourdomain.com
3. If you not passed the {appId} in request then it must be needed in header as `appId` value {appId}

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
 
