<?php
/*
 * @category Lib
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */
namespace RTA;
require_once dirname(__FILE__) . '/ModuleSession.php';
require_once dirname(__FILE__) . '/View.php';

class App
{
    const SYNCHRONOUS = 0;
    const ASYNCHRONOUS = 1;
    
    public static function getModule($moduleName, $param)
    {
        $path = BASE_PATH . '/Module/' . str_replace('_', "/", $moduleName) . '.php';
        if (!is_readable($path)) {
            throw new \Exception(sprintf('Requested module (%s) not found', $moduleName));
        }
        require_once $path;
        $className = __NAMESPACE__ . "\\" . $moduleName;
        return new $className($param);
    }
    public static function getModuleData($moduleName, $param = null)
    {
        $modified = ModuleSession::get($moduleName);
        if ($data = self::getModule($moduleName, $param)->getData($modified)) {
            ModuleSession::update($moduleName);
        }
        return $data;
    }
    private static function _renderTemplate($templateName, $view)
    {
        ob_start();
        $path = BASE_PATH . '/Template/' . str_replace('_', "/", $templateName) . '.phtml';
        if (!is_readable($path)) {
            throw new \Exception(sprintf('Requested module (%s) not found', $templateName));
        }
        require $path;
        $out = ob_get_contents();
        ob_end_clean();
        return $out;
    }
    public static function renderTemplate($moduleName, $data)
    {
        $view = new View($data);
        $view->requestType = \RTA\App::ASYNCHRONOUS;
        return self::_renderTemplate($moduleName, $view);
    }
    public static function renderModule($moduleName, $param = null)
    {
        ModuleSession::clearAll();
        $view = new View(self::getModuleData($moduleName, $param));
        $view->requestType = \RTA\App::SYNCHRONOUS;
        return self::_renderTemplate($moduleName, $view);
    }
}