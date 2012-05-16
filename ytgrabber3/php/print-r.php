<?php

require_once './lib/parser.php';
require_once './lib/print-r-videos.php';

$parser = new YTSaxVideoParser('./');
$parser->addHandler('PrintRVideos');
$parser->parse();