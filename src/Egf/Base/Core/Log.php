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
     * @param string  $sRow
     * @param boolean $bDebugInfo
     */
    public static function info($sRow, $bDebugInfo = FALSE) {
        static::add('info', $sRow, $bDebugInfo);
    }

    /**
     * Add warning.
     * @param string  $sRow
     * @param boolean $bDebugInfo
     */
    public static function warning($sRow, $bDebugInfo = FALSE) {
        static::add('warning', $sRow, $bDebugInfo);
    }

    /**
     * Same as addWarning().
     * @param string  $sRow
     * @param boolean $bDebugInfo
     */
    public static function warn($sRow, $bDebugInfo = FALSE) {
        static::warning($sRow, $bDebugInfo);
    }

    /**
     * Add error.
     * @param string  $sRow
     * @param boolean $bDebugInfo
     */
    public static function error($sRow, $bDebugInfo = FALSE) {
        static::add('error', $sRow, $bDebugInfo);
    }

    /**
     * New line in log.
     * @param int $iPadding
     * @return string
     */
    public static function nl($iPadding = 0) {
        return PHP_EOL . str_repeat(' ', (36 + $iPadding));
    }


    /**
     * Add to log.
     * @param string  $sType
     * @param string  $sRow
     * @param boolean $bDebugInfo
     */
    protected static function add($sType, $sRow, $bDebugInfo = FALSE) {
        static::init();

        $sLine = date('Y-m-d H:i:s', time() + (static::$iHourModifier * 3600)) . ' --- ' . static::getType($sType) . ' --- ' . $sRow . PHP_EOL;
        if ($bDebugInfo) {
            $aDebug = debug_backtrace(NULL);
            $sLine .= static::nl() . 'The line ' . $aDebug[2]['line'] . ' in ' . $aDebug[2]['file'];
        }
        $sLine .= PHP_EOL;

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