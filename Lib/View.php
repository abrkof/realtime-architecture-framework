<?php
/*
 * @category Lib
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */
namespace RTA;

class View
{
    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }
}