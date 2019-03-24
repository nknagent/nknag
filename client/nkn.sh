# NKN Full Node - Install Script
# Usage:
#   sudo wget -O /home/nkn.sh https://github.com/hashtafak/nknag/raw/alpha/client/nkn.sh
#   sudo bash /home/nkn.sh "your_BeneficiaryAddr"

#! /bin/bash

ulimit -n 4096
ulimit -c unlimited

sudo apt-get update || exit $?
sudo apt-get -y upgrade || exit $?
sudo apt-get install -y make curl git || exit $?

id -u nkn &>/dev/null || adduser --disabled-password --gecos "" nkn || exit $?
#usermod -aG sudo nkn || exit $?

wget https://dl.google.com/go/go1.11.5.linux-amd64.tar.gz || exit $?
sudo tar -C /usr/local -xvf `echo go1.11.5.linux-amd64.tar.gz | cut -d '/' -f5` || exit $?

cat > /home/nkn/.bash_profile << 'EOF' || exit $?
export GOPATH=$HOME/go
export PATH=/usr/local/go/bin:$PATH:$GOPATH/bin
export HOME=/home/nkn
export PATH=$GOPATH/bin:$PATH
export NKN_HOME=$HOME/go/src/github.com/nknorg/nkn
EOF

source /home/nkn/.bash_profile || exit $?
go version || exit $?

mkdir -p /home/nkn/go/src/github.com/nknorg  || exit $?
cd /home/nkn/go/src/github.com/nknorg || exit $?

wget -O build_nkn.sh https://github.com/hashtafak/nknag/raw/alpha/client/build-nkn.sh || exit $?
bash build_nkn.sh || exit $?

rm -rf /home/nkn/go/src/github.com/nknorg/nkn/config.json || exit $?
cat > /home/nkn/go/src/github.com/nknorg/nkn/config.json << EOF || exit $?
{
  "HttpWsPort": 30002,
  "HttpJsonPort": 30003,
  "SeedList": [
    "http://testnet-seed-0001.nkn.org:30003",
    "http://testnet-seed-0002.nkn.org:30003",
    "http://testnet-seed-0003.nkn.org:30003",
    "http://testnet-seed-0004.nkn.org:30003",
    "http://testnet-seed-0005.nkn.org:30003",
    "http://testnet-seed-0006.nkn.org:30003",
    "http://testnet-seed-0007.nkn.org:30003",
    "http://testnet-seed-0008.nkn.org:30003"
  ],
  "GenesisBlockProposer": "022d52b07dff29ae6ee22295da2dc315fef1e2337de7ab6e51539d379aa35b9503",
  "BeneficiaryAddr": "${1}",
  "SyncBatchWindowSize": 128,
  "LogLevel": 2
}
EOF

function initWallet () {
    cd /home/nkn/go/src/github.com/nknorg/nkn || exit $?
    RANDOM_PASSWD=$(head -c 1024 /dev/urandom | shasum -a 512 -b | xxd -r -p | base64 | head -c 32)
    /home/nkn/go/src/github.com/nknorg/nkn/nknc wallet -c <<EOF
${RANDOM_PASSWD}
${RANDOM_PASSWD}
EOF
    echo ${RANDOM_PASSWD} > ~/go/src/github.com/nknorg/nkn/wallet.pswd
    #chmod 0400 ~/go/src/github.com/nknorg/nkn/wallet.dat ~/go/src/github.com/nknorg/nkn/wallet.pswd
    return $?
}

function callsv () {
	cat > /home/nkn/nkn.service << EOF || exit $?
[Unit]
Description=nkn
[Service]
User=nkn
WorkingDirectory=/home/nkn/go/src/github.com/nknorg/nkn
ExecStart=/home/nkn/go/src/github.com/nknorg/nkn/nknd --no-nat -p $(cat /home/nkn/go/src/github.com/nknorg/nkn/wallet.pswd)
Restart=always
RestartSec=3
LimitNOFILE=500000
[Install]
WantedBy=default.target
EOF

	sudo cp /home/nkn/nkn.service /etc/systemd/system/nkn.service || exit $?
	sudo systemctl enable nkn.service || exit $?
	sudo systemctl daemon-reload || exit $?
	sudo systemctl start nkn.service || exit $?
	return $?
}

mkdir -p ./Log
[ -e "wallet.dat" ] || initWallet || ! echo "Init Wallet fail" || exit 1
callsv || exit 2

sudo wget -O /home/nkn_cron.sh https://github.com/hashtafak/nknag/raw/alpha/client/nkn-cron.sh || exit $?
bash /home/nkn_cron.sh || exit $?

systemctl status nkn | grep Active