#!/bin/bash

sudo chown -R nkn:nkn /home/nkn || exit $?
sudo -u nkn mkdir -p /home/nkn/go/src/github.com/nknorg/ || exit $?

cd /home/nkn/go/src/github.com/nknorg/ || exit $?
rm -rf nkn || exit $?
sudo -u nkn git clone https://github.com/nknorg/nkn.git || exit $?

cd nkn || exit $?
sudo -u nkn git fetch || exit $?
LATEST_TAG=$(git tag --sort=-creatordate | head -1) || exit $?
sudo -u nkn git checkout ${LATEST_TAG} || exit $?
sudo -u nkn bash -c "source /home/nkn/.bash_profile && make glide && make vendor && make" || exit $?
sudo -u nkn bash -c "cp config.testnet.json config.json" || exit $?

[ $? -eq 0 ] || exit $?