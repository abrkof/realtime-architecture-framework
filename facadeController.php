<?php
/*
 * @category Controller
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */
namespace RTA;
require "bootstrap.php";

class FacadeController
{
    /**
     *
     * @param string $method
     * @param string $querySerialized
     */
    public static function run($method, $querySerialized)
    {
        $resultQueue = self::_getUpdated($querySerialized);
        if ('worker' == $method) {
            self::_outputPolling($resultQueue);
        }
        self::_freeMemory();
    }
    /**
     *
     * @param string $querySerialized
     * @return array
     */
    private static function _getUpdated($querySerialized)
    {
        $resultQueue = array();
        $queue = json_decode(urldecode($querySerialized));        
        if ($queue) {            
            while (!$resultQueue) {
                sleep(1);
                foreach ($queue as $widget) {
                    $message = \RTA\App::getModuleData($widget->module, $widget->param);
                    if ($fetch = \RTA\App::renderTemplate($widget->module, $message)) {
                        $resultQueue[$widget->sourceName] = $fetch;
                    }
                }
            }
        }
        return $resultQueue;
    }
    /**
     *
     * @param array $resultQueue
     */
    private static function _outputPolling($resultQueue)
    {
        header("HTTP/1.0 200");
        header('Content-type: application/json');
        print json_encode($resultQueue);
    }
    /**
     * Clean up memory and stuff like that.
     */
    private static function _freeMemory()
    {
        flush();
        if (function_exists("gc_collect_cycles")) {
            gc_collect_cycles();
        }
    }   
}

FacadeController::run($_REQUEST['method'], $_REQUEST['queue']);
