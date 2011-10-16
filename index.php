<?php
/*
 * @category Application
 * @package Real-Time Application
 * @copyright 2011, 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license GNU
 */
require "bootstrap.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Real-Time Application Demo</title>
<meta name="author" content="Addy Osmani">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<!--script type="text/javascript" src="http://code.google.com/p/jquery-jsa/source/browse/trunk/js/jquery.jsa.js"></script-->
<script type="text/javascript" src="./js/jquery.jsa.js"></script>
<script type="text/javascript" src="./js/jquery.rta.js"></script>
<script type="text/javascript" src="./js/demo.js"></script>
<!--[if lt IE 9]>
  <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<link href="./assets/screen.css" rel="stylesheet">
</head>
<body>
    <div class="desktop">
        <div class="silo">
        <header>
            <a href="http://dsheiko.com" title="Let's go to my home page"><!-- --></a>
            <h1>Real-Time Application Demo</h1>
        </header>
        <div class="body">
            <aside>
                <?= RTA\App::renderModule("NotificationModule"); ?>
                <?= RTA\App::renderModule("MonitorModule"); ?>
            </aside>
            <article>
                <p>
                    This little application is meant to demonstrate <a href="http://dsheiko.com/weblog/real-time-web-application-architecture">real-time architecture framework</a>. Sidebar contains two widgets which emulate different sorts of modules. One represents notification feed, which updates as new messages arrive. Second updates the diagram as soon as the related module has update. The console below shows server-sent events.
                </p>
               <h2>Console</h2>
               <div class="console">
                    <ul></ul>
               </div>
            </article>
        </div>        
        </div>
        <footer>
            Produced by <a href="http://dsheiko.com">Dmitry Sheiko</a>
        </footer>
    </div>
</body>
</html>