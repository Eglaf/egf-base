<?php

namespace Egf\Base\Core;

use Egf\Base\Util;

/**
 * Static class Log
 * @todo Don't log info in prod environment...
 */
class Log {

    /** @var string Directory. */
    static $sDir = 'log/';

    /** @var string File. */
    static $sFile = '';

    /** @var resource Opened file. */
    static $rLog = NULL;

    /** @var int Add to hour or cut from it. */
    static $iHourModifier = 1;

    /** @var bool Decide if it was initialized. */
    static $bInitialized = FALSE;


    /**
     * Add info.
     * @param string $sRow
     */
    public static function info($sRow) {
        static::add('info', $sRow);
    }

    /**
     * Add warning.
     * @param string $sRow
     */
    public static function warning($sRow) {
        static::add('warning', $sRow);
    }

    /**
     * Add error.
     * @param string $sRow
     */
    public static function error($sRow) {
        static::add('error', $sRow);
    }


    /**
     * Add to log.
     * @param string $sType
     * @param string $sRow
     */
    protected static function add($sType, $sRow) {
        static::init();

        $sLine = date('Y-m-d H:i:s', time() + (static::$iHourModifier * 3600)) . ' --- ' . static::getType($sType) . ' --- ' . $sRow . PHP_EOL;
        fwrite(static::$rLog, $sLine);
    }

    /**
     * Init log if was not before.
     */
    protected function init() {
        if ( !static::$bInitialized) {
            if ( !is_dir(static::$sDir)) {
                mkdir(static::$sDir, 0777);
            }

            static::$sFile = Util::trimSlash(static::$sDir) . DIRECTORY_SEPARATOR . date('Y-m-d') . '.log';
            static::$rLog = fopen(static::$sFile, 'a');
        }
    }

    /**
     * Get the type.
     * @param string $sType
     * @return string
     */
    protected function getType($sType) {
        for ($i = strlen($sType); $i < 7; $i++) {
            $sType .= ' ';
        }

        return strtoupper($sType);
    }

}