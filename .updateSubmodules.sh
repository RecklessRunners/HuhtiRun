echo Updating submodules...
git submodule update --init --recursive
cd inc/PetjaUI
git checkout master
git pull origin
cd ..
echo OK. Exiting...
