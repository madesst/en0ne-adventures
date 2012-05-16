<?php

require_once './lib/parser.php';
require_once './lib/echo-video-handler.php';

$parser = new YTSaxVideoParser('./');
$parser->addHandler('echoVideoHandler');
$parser->parse();