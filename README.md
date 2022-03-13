## Track My Asset

This project allows users to track their assets accross different platforms and evaluate their investments and returns. Assets tracked can be of different type : stock market, cryptocurrencies, fixed value assets and staked cryptocurrencies in decentralized exchange pools / farms.

### Installation

Prerequisites :
- Have npm installed
- Create a MySQL database
- Create a gmail account with "less secure app access" activated (Optional) 

Install the project by running the following commands in your terminal :
```
git clone https://github.com/HugoMichard/TrackMyAssets.git TrackMyAssets
cd TrackMyAssets/client
npm install
cd ../api
npm install
touch .env
```

In the `api/.env` file that has been created, add your local environment configurations. It should look like this :
```bash
PORT=5000
HASH_SECRET='secret-key'

DB_HOST='localhost'
DB_USER='root'
DB_PASSWORD='root'
DB_DATABASE='TrackMyAssets'

MAIL_USER='sender@mail.com'
MAIL_PASSWORD='sender_password'
MAIL_TARGET='target@mail.com'
```

Initialize the mysql database by running the sql scripts in the api/bin/alter folder.

### Run the app

Open two terminals in the inarix-assignement folder. 
In the first one, run :
```
cd client
npm start
```

In the second one, run :
```
cd api
npm start
```

### Architecture

Client folder contains the client side and api folder contains the backend side of the application.
The client uses Creative Tim's Paper Dashboard React template : https://demos.creative-tim.com/paper-dashboard-react
