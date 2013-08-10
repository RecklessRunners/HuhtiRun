echo Updating submodules...
git submodule update --init --recursive
echo 1
cd inc/PetjaUI
echo 2
git checkout master
echo 3
git pull origin
echo 4
cd ..
echo 5
echo Done.
echo 6
