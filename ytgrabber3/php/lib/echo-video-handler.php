<?php

class echoVideoHandler
{
    public static $num = 0;

    public static function onVideo($video)
    {
        echo self::$num, ' ', $video['code'], ' ', $video['title'], PHP_EOL;
        self::$num++;
    }
}