<?php

//function startTag($parser, $nodeName, $attr){
//	echo "[start]:", $nodeName, PHP_EOL;
//}
//
//function endTag($parser, $nodeName){
//	echo "[end]:", $nodeName, PHP_EOL;
//}
//
//$parser = xml_parser_create();
//
//var_dump(xml_set_element_handler($parser, 'startTag', 'endTag'));
//
////xml_parse($parser, '<root><param id="aa"></param>');
////xml_parse($parser, '<en0ne></en0ne>');
////xml_parse($parser, '<param id="aa"></param>');
////xml_parse($parser, '<en0ne></en0ne>');
////xml_parse($parser, '<param id="aa"></param>');
////xml_parse($parser, '<en0ne></en0ne></root>');
//
//// make me come
//
//xml_parse($parser, '<root>');
//
//$fp = fopen('./data-13.xml', 'r');
//while(!feof($fp)){
//
//	$str = fgets($fp, 4096);
//
//	if ($str)
//		xml_parse($parser, $str);
//}
//fclose($fp);


//$xml = new XMLReader();
//$xml->open('data-13.xml');
//
//while($xml->read()){
//	if($xml->nodeType == XMLReader::ELEMENT){
//		echo $xml->name, PHP_EOL;
//	}
//}


class YTXmlParser
{
	private $parser;
	private $path;
	private $onVideoCallback;
	private $currVideo;
	private $currTag;
	private $inside_data;

	public function __construct($xmlFilesPath, $onVideoCallback)
	{
		$this->parser = xml_parser_create();
		$this->path = $xmlFilesPath;

		if (!is_callable($onVideoCallback))
			throw new Exception('You need to pass callback function');

		$this->onVideoCallback = $onVideoCallback;

		xml_set_object($this->parser, $this);
		xml_set_element_handler($this->parser, 'onStartTag', 'onEndTag');
		xml_set_character_data_handler($this->parser, 'onData');
	}

	protected function onData($parser, $data)
	{
		if ($this->currTag == 'ID')
			if ($this->inside_data)
				$this->currVideo['id'] .= $data;
			else
				$this->currVideo['id'] = $data;

		if ($this->currTag == 'TITLE')
			if ($this->inside_data)
				$this->currVideo['title'] .= $data;
			else
				$this->currVideo['title'] = $data;

		$this->inside_data = true;
	}

	protected function onStartTag($parser, $name, $attr)
	{
		$this->currTag = $name;
		$this->inside_data = false;
	}

	protected function onEndTag($parser, $name)
	{
		$this->currTag = '';
		$this->inside_data = false;

		if ($name == 'VIDEO'){
			call_user_func_array($this->onVideoCallback, array($this->currVideo));
		}
	}

	public function go()
	{
		xml_parse($this->parser, '<root>');

		$fp = fopen('./data-13.xml', 'r');
		while(!feof($fp)){

			if (($str = fgets($fp, 1024)) != false)
				xml_parse($this->parser, $str);
		}
		fclose($fp);

		xml_parse($this->parser, '</root>');

		echo 'current line: ', xml_get_current_line_number($this->parser), PHP_EOL;
		echo 'error: ', xml_error_string(xml_get_error_code($this->parser));
	}
}

$ytParser = new YTXmlParser('./data', 'onVideo');
$ytParser->go();

function onVideo($video){
	print_r($video);
}