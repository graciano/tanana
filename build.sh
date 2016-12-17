#!/bin/bash
# this file is just a copy and paste of the electron build instructions at 
# https://github.com/electron/electron/blob/master/docs/development/build-instructions-linux.md
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo "grab your coffe, this will take a loooong time."
yarn
if [[ ! -d electron ]]; then
    echo -e "${YELLOW}electron folder not found, cloning current repo${NC}"
    git clone https://github.com/electron/electron.git
fi
cd electron
npm run clean

echo -e "\n\n${YELLOW}running the bootstrap${NC}\n\n"
./script/bootstrap.py -v

echo -e "\n\n${YELLOW}now the actual build scripts${NC}"
echo -e "this will take several minutes"
echo -e "${YELLOW}AND will NOT give you any feedback for a loong while${NC}\n\n"
./script/build.py
echo -e "${YELLOW}Creating dist${NC}\n\n"
./script/create-dist.py
echo "YOU GOT HERE. YOU ARE A HERO"