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
mkdir ./config
```

In the config directory that has been created, create three files :

- one js file named auth.config.js and insert your secret key configurations. Here is an example of the format:
```yaml
module.exports = {
    secret: "secret-key"
};
```

- one js file named database.config.js and insert your database configurations. Here is an example of the format:
```yaml
module.exports = {
    db_config: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'TrackMyAssets'
    }
};
```

- one optional js file named mail.config.js and insert your gmail configurations (it will be the sending account). Also add the mail you wish to receive the messages on. Here is an example of the format:
```yaml
module.exports = {
    mail_config: {
        user: "adevmailsender@gmail.com",
        pass: "@DevMa1lSender"
    },
    receiver_mail: "hugomichard@yahoo.com"
};
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
