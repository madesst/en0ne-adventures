<?php
/**
 * Created by JetBrains PhpStorm.
 * User: en0ne
 * Date: 19.05.12
 * Time: 16:11
 * To change this template use File | Settings | File Templates.
 */

$files = glob('../data/*.xml');

foreach($files as $file){
    $content = file_get_contents($file);
//    $content = str_replace('& ', '&amp;', $content);
//    $content = str_replace('></caption>', '</caption>', $content);
    $content = str_replace('</i</caption>', '</caption>', $content);
//    $content = str_replace(array('<i>', '</i>'), array('',''), $content);
//    $content = str_replace(array('<i>', '</i>'), array('',''), $content);
    file_put_contents($file, $content);

    echo $file, PHP_EOL;
}