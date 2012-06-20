<?php

class echoVideoHandler
{
    public static $num = 0;
	public static $captions = 0;
	public static $maxStart = 0;
	public static $categories = array();
	public static $count = 0;

    public static function onVideo($video)
    {
	
		/*
				!!! Проверять что caption['start'] < 3600 * 3 !!!
		*/
	
        //echo self::$num, ' ', $video['code'], ' ', $video['title'], ' captions ', count($video['captions']), ' captions sum ', self::$captions, ' maxStartTime ', self::$maxStart, PHP_EOL;
		
		//echo $video['categoryTerm'], ' ', $video['categoryLabel'], PHP_EOL;
        
		/*self::$num++;
		self::$captions += count($video['captions']);*/
		
		//print_r($video['captions']);
		
		//4294967
				
		/*if (count($video['captions']) > 0)
			foreach($video['captions'] as $caption)
				if ($caption['start'] < 3 * 3600 && self::$maxStart < $caption['start']){
					self::$maxStart = $caption['start'];
				}*/
				
		/* посчитать сколько сцен */
		
		if (count($video['captions']) > 0)
			foreach($video['captions'] as $caption)
				if ($caption['start'] < 3 * 3600){
					self::$count++;
				}
				
		echo self::$count, PHP_EOL;
		
    }
}