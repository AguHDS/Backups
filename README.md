# Backups (in progress)
This app will let you store files, getting level for more space and organizing your profile to make them
private or public. You'll need to be validated as a user to access.

## some of the features that this app will have:

* Strong securiy flow for accounts, using token rotation. More info in AuthFlow-info.md
* Storage for authenticated users
* Switch to make your uploads public/private
* Level system that will grant benefits
* Daily quests to gain more exp on your account

many features aren't avialable yet since i'm working on them

### Profile preview (more changes in the UI/UX are expected)

Profile section
![Showcase](Profile_Showcase.png)

## Stack used

* Typescript
* React
* Redux-toolkit
* Tailwind
* Axios
* Tanstack router / Tanstack Query
* Zod
* Node: Express
* Mysql
* Vitest

### First setup
* once you have the repo on your local, use npm install in the backend and frontend folder to install all dependencies
* create .env for /backend and /frontend and modify it with your own configs (see .env.examples to see what values you need)

### Database setup
- you must have installed mysql on your computer and run its service so the database and backend can work(W+R -> services.msc -> run/stop mysql service), you can also use MySQLWorkbrench for a better view of the database (you'll need to connect the schema to the db with the 
credentials)
- in case you want to create your own database, you can read the "backend/db/db_code_info.txt" file, there you have the code to create the tables

### Cloudinary service setup (for file uploads)
- Create an account in https://cloudinary.com, then click the "View API keys" button to see the credentials that you must put in /backend/.env
- The system will create folders in cloudinary that contains all files from each user
- Cloudinary API data (public_id) to render those images in the client (already setted up)

### how to run the project locally
Open visual studio terminal, step on frontend and backend folder and run:
* for dev: __npm run dev__ <- if there are typescript errors, this run will fail and ask you to fix them
* for tests: __npm run test__ <- run tests
* for coverage: __npx vitest run --coverage__ <- create coverage
* for build dist: __npm run build__ <- create dist folder ready for production
* for production: __npm start__ <- run the project production dist files

Notes:<br><br>
. Vite changes its port when it's running on production or development, make sure to change the frontend port in the .env files
and in the package.json of the frontend since it's using "wait-on http://localhost:Your-port"<br><br>
. Ttailwind may break in development sometimes, if that happen and the styles break just rerun the frontend again