#!/bin/bash
rpi_dir=/home/ogolan/projects/led\ projects/nodejs\ led\ matrix\ project/rpi_matrix
pattern_dir=/home/ogolan/projects/led\ projects/nodejs\ led\ matrix\ project/node_api/assets

cp "$pattern_dir"/patterns.txt "$rpi_dir"
make -C "$rpi_dir" 
"$rpi_dir"/./matrix_patterns "$rpi_dir"/patterns.txt
