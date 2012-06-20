<?php

class YTSaxVideoParser
{
    private $handlers = array();
    private $parser = null;
    private $currTag = '';
    private $inData = false;
    private $currCaption = '';
	private $currCaptionStart = '';
    private $parts = array();

    public function __construct($pathToXmlFiles)
    {
        if (!$pathToXmlFiles)
            throw new Exception("No path to XML parts");

        $this->parts = glob($pathToXmlFiles . '*.xml');

        if (count($this->parts) < 1)
            throw new Exception("No files in [$pathToXmlFiles]");

    }

    public function parse()
    {
        foreach ($this->parts as $file) {

            $this->parser = xml_parser_create();

            xml_set_object($this->parser, $this);
            xml_set_element_handler($this->parser, 'openTag', 'closeTag');
            xml_set_character_data_handler($this->parser, 'data');

            xml_parse($this->parser, '<root>');

            $fp = fopen($file, 'r');

//            $body = file_get_contents($file);
//            $body = preg_replace('/[^\x{0009}\x{000a}\x{000d}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', '', $body);
//            xml_parse($this->parser, $body);

            while (!feof($fp)) {
                if (($chunk = fgets($fp, 1024)) != false){
                    try{
                        xml_parse($this->parser, $chunk);
                    } catch (Exception $e) {
                        echo $e->getMessage();
                    }
                }
            }

            fclose($fp);

            xml_parse($this->parser, '</root>');

            $errCode = xml_get_error_code($this->parser);

            if ($errCode){
                echo 'current line: ', xml_get_current_line_number($this->parser), PHP_EOL;
                throw new Exception('Error parsing in ' . $file . ' [' . xml_error_string($errCode) . ']');
            }

            xml_parser_free($this->parser);
        }
    }

    public function addHandler($handler)
    {
        $this->handlers[] = $handler;
    }

    protected function openTag($parser, $node, $attr)
    {
        $this->currTag = $node;
        $this->inData = false;
		
		if ($node == 'CAPTION'){
			$this->currCaptionStart = $attr['START'];
		}
    }

    protected function closeTag($parser, $node)
    {
        $this->currTag = '';
        $this->inData = false;

        if ($node == 'CAPTION'){

            if (!isset($this->video['captions']))
                $this->video['captions'] = array();

            $this->video['captions'][count($this->video['captions'])] = array(
				'start' => $this->currCaptionStart,
				'caption' => $this->currCaption
			);
        }

        if ($node == 'VIDEO'){

            foreach($this->handlers as $handler)
                call_user_func_array(array($handler, 'onVideo'), array($this->video));

            $this->video = array();
        }
    }

    protected function data($parser, $value)
    {
        if ($this->currTag == 'ID'){
            if ($this->inData)
                $this->video['code'] .= $value;
            else
                $this->video['code'] = $value;
        }

        if ($this->currTag == 'TITLE'){
            if ($this->inData)
                $this->video['title'] .= $value;
            else
                $this->video['title'] = $value;
        }

        if ($this->currTag == 'VIEWCOUNT'){
            if ($this->inData)
                $this->video['viewCount'] .= $value;
            else
                $this->video['viewCount'] = $value;
        }

        if ($this->currTag == 'CAPTION'){
            if ($this->inData)
                $this->currCaption .= $value;
            else
                $this->currCaption = $value;
        }
		
		if ($this->currTag == 'CATEGORYTERM'){
            if ($this->inData)
                $this->video['categoryTerm'] .= $value;
            else
                $this->video['categoryTerm'] = $value;
        }
		
		if ($this->currTag == 'CATEGORYLABEL'){
            if ($this->inData)
                $this->video['categoryLabel'] .= $value;
            else
                $this->video['categoryLabel'] = $value;
        }

        $this->inData = true;
    }
}