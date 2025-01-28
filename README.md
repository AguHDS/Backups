# Backups
This app will let you store files, getting level for more space and organizing your profile to make them
private or public. You'll need to be validated as a user to access.

## some of the features that this app will have:

* Strong securiy flow for accounts, using OAuth with token rotation and encrypting. More info in AuthFlow-info.md
* Storage for authenticated user (with mb/gb limit)
* Configs to make your uploads public/private, so other users are able to see them
* Level system that will grant benefits such like more space to store
* Minimum social media interactions between users
* User profiles

many features aren't avialable yet since i'm working on them

### some previews of sections (changes on the frontend will be made)

Dashboard section
![Showcase](DashboardShowcase.png)

Profile section
![Showcase](Profile_Showcase.png)

## main tools used:

* typescript
* node/express
* react
* redux-toolkit
* mysql
* tailwind

## how to run locally

in case you want to see it on your local (idk why you would, since it's far from being finished) you have to install the dependencies first.

* once you have the repo on your local, use npm install in the backend and frontend folder to install all dependencies
* create .env for /backend and /frontend and modify it with your own configs

### backend/.env

```
PORT_FRONTEND=frontend port
PORT_BACKEND=backend port
JWT_SECRET=your secret
JWT_REFRESH_SECRET=your refresh secret
NODE_ENV=dev
DB_HOST=your host
DB_DATABASE=your db name
DB_USER=your user
DB_PASSWORD=your password
```

### frontend/.env

```
VITE_FRONTENDPORT=frontend port
VITE_BACKENDPORT=backend port
```

- you must have installed mysql service on your computer, you can also use MySQLWorkbrench
- in case you want to create your own database, you can read the "backend/db/db_code_info.txt" file, there you have the code to create the tables
- use npm start to run the backend and npm run dev to run the frontend

note: tailwind may break in development sometimes, if that happen and the styles break just rerun the frontend again