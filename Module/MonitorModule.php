<?php
/*
 * @category Module
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */
namespace RTA;
require_once dirname(__FILE__) . '/Interface.php';

class MonitorModule implements Module
{
    private $_testData = array(
        array ('Yl', 'Used+40%25|Free+60%25'),
        array ('Sr', 'Used+30%25|Free+70%25'),
        array ('Pu', 'Used+25%25|Free+75%25'),
        array ('G3', 'Used+10%25|Free+90%25'),
        array ('H2', 'Used+12%25|Free+88%25'),
        array ('J0', 'Used+14%25|Free+86%25'),
        array ('Ly', 'Used+18%25|Free+82%25'),
    );

    /**
     *
     * @return string
     */
    private function _generateRandomDataString()
    {
        $data = $this->_testData[rand(1, count($this->_testData)) - 1];
        return sprintf('&chd=s:%s&chdl=%s', $data[0], $data[1]);
    }

    /**
     * @return string
     */
    private function _getInitialState()
    {
        return $this->_generateRandomDataString();
    }
    /**
     * Emulates upcomming notifications. Intended to act like notifications come as time passes
     *
     * @return false|string
     */
    private function _getActualState()
    {
        // New data kind of comming with not every request, but sometimes
        return (rand(1, 3) != 2) ? false : $this->_generateRandomDataString();
    }

    public function getData($modificationTime)
    {
        return (!$modificationTime)
            ? $this->_getInitialState() : $this->_getActualState();
    }
}