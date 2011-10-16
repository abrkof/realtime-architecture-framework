<?php
/*
 * @category Lib
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */
namespace RTA;

class ModuleSession
{
    private static function _normalize()
    {       
        $_SESSION['moduleTimestamps'] = isset($_SESSION['moduleTimestamps'])
        ? $_SESSION['moduleTimestamps'] : array();
    }
    public static function update($moduleName)
    {
        self::_normalize();
        $_SESSION['moduleTimestamps'][$moduleName] = time();
    }
    public static function get($moduleName)
    {
        self::_normalize();
        return isset ($_SESSION['moduleTimestamps'][$moduleName])
            ? $_SESSION['moduleTimestamps'][$moduleName] : 0;
    }
    public static function clearAll()
    {
        self::_normalize();
        $_SESSION['moduleTimestamps'] = array();
    }
}