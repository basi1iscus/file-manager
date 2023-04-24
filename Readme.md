# File Manager

## Quick start

### 1. Clone this repo using:
  ```shell
  git clone git@github.com:basi1iscus/file-manager.git
  ```

### 2. There aren\`t external dependencies you don\`t need to use npm install

### 3. Use the following commands to run File Manager

npm run start -- --username=\<your username\>

### 4. List of operations and their syntax
#### Navigation & working directory (nwd)
up

cd path_to_directory

ls

#### Basic operations with files
cat path_to_file

add new_file_name

rn path_to_file new_filename

cp path_to_file path_to_new_directory

mv path_to_file path_to_new_directory

rm path_to_file

#### Operating system info (prints following information in console)

os --EOL

os --cpus

os --homedir

os --username

os --architecture

#### Hash calculation

hash path_to_file

#### Compress and decompress operations

compress path_to_file path_to_destination

decompress path_to_file path_to_destination
