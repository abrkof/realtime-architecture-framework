<?php
/*
 * @category Module
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */
namespace RTA;
require_once dirname(__FILE__) . '/Interface.php';

class NotificationModule implements Module
{
    private $_testNames = array(
        "Amory Lorch",
        "Areo Hotah",
        "Arys Oakheart",
        "Barristan Selmy",
        "Beric DondarrionBrienne of Tarth",
        "Bronn",
        "Davos Seaworth",
        "Grand Maester Pycelle",
        "Gregor Clegane",
        "HodorIllyrio Mopatis",
        "Ilyn Payne",
        "Jaqen H'ghar",
        "Jeor Mormont",
        "Jeyne Westerling",
        "Jojen ReedJon Connington",
        "Jorah Mormont",
        "Khal Drogo",
        "Mance Rayder",
        "Meera Reed",
        "Melisandre",
        "Petyr BaelishPodrick Payne",
        "Qyburn",
        "Ramsay Snow",
        "Roose Bolton",
        "Samwell Tarly",
        "Sandor Clegane",
        "Strong BelwasSyrio Forel",
        "Thoros of Myr",
        "Varys",
        "Walder Frey",
        "Ygritte",
        "References");

    /**
     * 
     * @return string
     */
    private function _generateRandomNotification()
    {
        return $this->_testNames[rand(1, count($this->_testNames)) - 1]. " liked your post";
    }
    /**
     * Retrieves random notifications array of given max size
     *
     * @param int $maxNumber
     * @return array
     */
    private function _generateRandomNotificationSet($maxNumber = 5)
    {
        $number = rand(1, $maxNumber);
        $res = array();
        for ($i = 1; $i <= $number; $i++) {
            $res[] = $this->_generateRandomNotification();
        }
        return $res;
    }
    /**
     * @return array set of random generated notifications
     */
    private function _getInitialState()
    {        
        return $this->_generateRandomNotificationSet(5);
    }
    /**
     * Emulates upcomming notifications. Intended to act like notifications come as time passes
     * 
     * @return false|array
     */
    private function _getUpcommingNotificatons()
    {
        // New notification kind of comming with not every request, but sometimes
        return (rand(1, 7) != 2) ? false : $this->_generateRandomNotificationSet(2);
    }
    /**
     *
     * @param int $modificationTime
     * @return mixed
     */
    public function getData($modificationTime)
    {
        return (!$modificationTime) 
            ? $this->_getInitialState() : $this->_getUpcommingNotificatons();
    }
}