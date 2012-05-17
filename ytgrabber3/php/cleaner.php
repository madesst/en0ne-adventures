<?php
/**
 * Created by JetBrains PhpStorm.
 * User: en0ne
 * Date: 17.05.12
 * Time: 3:18
 * To change this template use File | Settings | File Templates.
 */

$files = glob('./../data/*.xml');

foreach($files as $file){

    echo 'cleaning', $file, PHP_EOL;

    $body = file_get_contents($file);
    $body = preg_replace('/[^\x{0009}\x{000a}\x{000d}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', '', $body);
    file_put_contents($file, $body);
}

echo 'done';