<?php
/*
 * @category Application
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */

define("BASE_PATH", dirname(__FILE__));
ini_set('display_errors', 'On');
ini_set('display_startup_errors', 'On');
session_start('rta');
require BASE_PATH . "/Lib/App.php";