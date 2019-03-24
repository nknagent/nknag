# NKN Agent - Client Install
# Usage: 
#   sudo wget -O /home/nknag-c-i.sh https://github.com/hashtafak/nknag/raw/alpha/client/nknag-client-install.sh
#   sudo bash /home/nknag-c-i.sh "your_nknag-server_host_ip:port" "your_authkey"

#! /bin/bash

source /home/nkn/.bash_profile || exit $?

command -v go || wget https://dl.google.com/go/go1.11.5.linux-amd64.tar.gz || exit $? && sudo tar -C /usr/local -xvf `echo go1.11.5.linux-amd64.tar.gz | cut -d '/' -f5` || exit $?

ls /home/nknag 2>&1 >/dev/null|| git clone https://github.com/hashtafak/nknag -b alpha /home/nknag || exit $?
cd /home/nknag  || exit $?

systemctl stop nkn supervisor >/dev/null 2>&1
go build -o /home/nknag/client/nknag-client /home/nknag/client/nknag-client.go || exit $?
systemctl restart nkn supervisor >/dev/null 2>&1

echo $1 > /home/nknag/client/host  || exit $?
echo $2 > /home/nknag/client/authkey  || exit $?

cat > /home/nknag/client/nknag-client-updater << 'EOF' || exit $?
#!/bin/bash
source /home/nkn/.bash_profile
cd /home/nknag
git fetch &>/dev/null
LOCAL=$(git rev-parse HEAD)
UPSTREAM=$(git rev-parse @{u})
if [ $LOCAL != $UPSTREAM ]
then
        git merge;
        systemctl stop nkn supervisor 2>&1
        go build /home/nknag/client/nknag-client.go
        systemctl restart nkn supervisor 2>&1
fi
EOF

chmod +x /home/nknag/client/nknag-client-updater || exit $?
chmod +x /home/nknag/client/nknag-client || exit $?

cronjob1="00 12 * * * /home/nknag/client/nknag-client-updater >/dev/null 2>&1" || exit $?
cronjob2="* * * * * /home/nknag/client/nknag-client "$(cat /home/nknag/client/host)" "$(cat /home/nknag/client/authkey)" >/dev/null 2>&1" || exit $?

(crontab -u nkn -l; echo "$cronjob1" ) | crontab -u nkn - || exit $?
(crontab -u nkn -l; echo "$cronjob2" ) | crontab -u nkn - || exit $?

crontab -u nkn -l

/home/nknag/client/nknag-client "$(cat /home/nknag/client/host)" "$(cat /home/nknag/client/authkey)" || exit $?
