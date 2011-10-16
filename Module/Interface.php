<?php
/*
 * @category Module
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */
namespace RTA;

interface Module
{
    public function getData($modificationTime);
}