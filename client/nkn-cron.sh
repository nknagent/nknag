#! /bin/bash
cat > /home/nkn/nkn-updater << 'EOF' || exit $?
HOME=/home/nkn
GOPATH=$HOME/go
PATH=/usr/local/go/bin:$PATH:$GOPATH/bin
cd $HOME/go/src/github.com/nknorg/nkn
git fetch &>/dev/null
LOCAL=$(git rev-parse HEAD)
UPSTREAM=$(git rev-parse @{u})
if [ $LOCAL != $UPSTREAM ]
then
        systemctl stop nkn.service;
        git merge;
        make deepclean;
        make glide;
        make vendor;
        make;
        chown -R nkn:nkn $HOME/go;
        systemctl restart nkn.service;
fi
EOF

chmod +x /home/nkn/nkn-updater || exit $?

cronjob="00 12 * * * /home/nkn/nkn-updater >/dev/null 2>&1" || exit $?
(crontab -u nkn -l; echo "$cronjob" ) | crontab -u nkn - || exit $?

crontab -u nkn -l