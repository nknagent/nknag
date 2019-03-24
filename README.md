# NKN Agent
Easy to control/update NKN's Node

## Project status
* Current release status: v0.1.2-alpha (pre-release)
* Shell Script rewrite/Vue frontend collaborators needed
* NKNAG Client tested with Ubuntu 18.04LTS

## Simple Node Manager focus on NKN Node Management

<img src="https://image.prntscr.com/image/q9kYjJylRIOS0msmEq-FFA.png" width="650" height="350" />

## Installation NKNAG Server
```
npm i
```

## Usage NKNAG Server

1. Rename `config.test.json` to `config.json`
2. Change the value of default username & password
3. Run the app `npm start`

Then go to `http://localhost:3000`

* Manual add your server: `http://localhost:3000/server/add`
* Your online app will listen at `http://your_public_ip_address:3000`

## Installation NKNAG Client
### NKNAG Client only
```
sudo wget -O /home/nknag-c-i.sh https://github.com/hashtafak/nknag/raw/alpha/client/nknag-client-install.sh
sudo bash /home/nknag-c-i.sh "your_nknag-server_host_ip:port" "your_authkey"
```
### Install New NKN Node + NKNAG Client
```
sudo wget -O /home/nkn.sh https://github.com/hashtafak/nknag/raw/alpha/client/nkn.sh
sudo wget -O /home/nknag-c-i.sh https://github.com/hashtafak/nknag/raw/alpha/client/nknag-client-install.sh
sudo bash /home/nkn.sh "your_BeneficiaryAddr"
sudo bash /home/nknag-c-i.sh "your_nknag-server_host_ip:port" "your_authkey"
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
