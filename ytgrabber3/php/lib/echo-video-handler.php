<?php

class echoVideoHandler
{
    public static function onVideo($video)
    {
        echo $video['code'], ' ', $video['title'], PHP_EOL;
    }
}