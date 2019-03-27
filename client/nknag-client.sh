# NKN Agent - Client Install
# Usage: 
#   sudo wget -O /home/nknag-c-i.sh https://github.com/hashtafak/nknag/raw/alpha/client/nknag-client.sh
#   sudo bash /home/nknag-c-i.sh "your_nknag-server_host_ip:port" "your_authkey"

#! /bin/bash

echo $1 > /home/nknag_host  || exit $?
echo $2 > /home/nknag_authkey  || exit $?

cat > /home/nknag-client << 'EOF' || exit $?
#!/bin/bash

curl "http://$(cat /home/nknag_host)/server/add/$(curl -sB icanhazip.com 2>&1)" \
-H "Content-Type: application/json" \
-H "Authorization: Basic $(cat /home/nknag_authkey)" \
--data-binary "{\"NKN.Service\":\"$(systemctl status supervisor nkn 2>&1 | grep Active | sed "s/[\r\n]+//g")\", \"BeneficiaryAddr\": \"$(cat /home/nkn/go/src/github.com/nknorg/nkn/config.json | grep BeneficiaryAddr | sed "s/\"/'/g")\", \"NodeWalletDAT\": \"$(cat /home/nkn/go/src/github.com/nknorg/nkn/wallet.dat | sed "s/\"/'/g")\"}"
EOF

chmod +x /home/nknag-client || exit $?

cronjob2="* * * * * /home/nknag-client >/dev/null 2>&1" || exit $?

(crontab -u nkn -l; echo "$cronjob2" ) | crontab -u nkn - || exit $?

crontab -u nkn -l

/home/nknag-client || exit $?
