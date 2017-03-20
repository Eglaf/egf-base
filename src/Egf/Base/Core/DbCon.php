<?php

namespace Egf\Base\Core;

/**
 * Class DbCon
 * @todo Config loader class... (log env for example...)
 */
class DbCon {

    /** @var object The instance. */
    protected static $oInstance;

    /** @var \mysqli */
    protected $oConnection = NULL;

    /** @var boolean Show sql. */
    protected $bDebug = FALSE;

    /** @var string Prefix at every table. */
    protected $sDbTablePrefix = '';

    /** @var int Generated ID of the last inserted row. */
    protected $iLastInsertId = 0;

    /** @var int Number of affected rows. */
    protected $iAffectedRows = 0;

    /** @var string Path to the config file. */
    protected $sPathToConfig = '/config/';


    /**
     * Constructor.
     */
    public function __construct() {
        $aConfig = $this->loadConfig();
        $this->oConnection = new \mysqli($aConfig['host'], $aConfig['username'], $aConfig['password'], $aConfig['database']);

        if (mysqli_connect_error()) {
            throw new \Exception('Failed to connect to MySql: ' . mysqli_connect_error());
        }

        if (isset($aConfig['debug']) and ($aConfig['debug'] == 'true' || $aConfig['debug'] == 1)) {
            $this->bDebug = TRUE;
        }

        mysqli_set_charset($this->oConnection, "utf8");
    }

    /**
     * Get instance.
     * @return DbCon
     */
    public static function getInstance() {
        if ( !self::$oInstance) {
            self::$oInstance = new self();
        }

        return self::$oInstance;
    }

    /**
     * Prevent duplications.
     */
    public function __clone() {
    }


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Use connection                                             **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Run query.
     *
     * @param string     $sQuery  The Sql query.
     * @param array|NULL $aParams Associative array of optional parameters. Array['type'] can be one ore more of these: i, s, d, b. Array['value'] is the searched value.
     *
     * @return array|\mysqli_result|bool
     */
    public function query($sQuery, array $aParams = []) {
        $oStmt = $this->getConnection()->prepare($sQuery);
        if ($oStmt) {
            if (is_array($aParams) and count($aParams)) {
                $aValues = [0 => ''];
                foreach ($aParams as $aParam) {
                    if ($aParam instanceof DbWhere\Base) {
                        if (is_array($aParam->getValue())) {
                            foreach ($aParam->getValue() as $xVal) {
                                $aValues[0] .= $aParam->getType();
                                $aValues[] = $xVal;
                            }
                        }
                        else {
                            $aValues[0] .= $aParam->getType();
                            $aValues[] = $aParam->getValue();
                        }
                    }
                    elseif (is_array($aParam) && isset($aParam['type']) && (isset($aParam['value']) || is_null($aParam['value']))) {
                        $aValues[0] .= $aParam['type'];
                        $aValues[] = $aParam['value'];
                    }
                    else {
                        $aValues[0] .= 's';
                        $aValues[] = $aParam;
                    }
                }

                // Bind parameters to statement.
                call_user_func_array([$oStmt, 'bind_param'], $this->referenceValues($aValues));

            }
            $oStmt->execute();
            $xResult = $oStmt->get_result();

            $this->iLastInsertId = $this->getConnection()->insert_id;
            $this->iAffectedRows = $this->getConnection()->affected_rows;

            $oStmt->close();

            return $xResult;
        }
        else {
            Log::error('Invalid Sql query! --- ' . $sQuery . ' --- ' . var_export($aParams, TRUE));
            throw new \Exception('Invalid Sql query!');
        }
    }

    /**
     * Get connection.
     * @return \mysqli
     */
    public function getConnection() {
        return $this->oConnection;
    }

    /**
     * Get table prefix.
     * @return string
     */
    public function getPrefix() {
        return $this->sDbTablePrefix;
    }

    /**
     * Escape a string.
     * @param mixed $xVar Unsecured string.
     * @return string Secured string.
     */
    public function escape($xVar) {
        return $this->getConnection()->real_escape_string($xVar);
    }

    /**
     * It gives back comma separated question marks between brackets.
     * @param array $aParams   Parameters.
     * @param bool  $bBrackets Decide if the brackets should be there too. Default: True.
     * @return string Question marks (Number of parameters).
     */
    public function arrayAsQuestionMarks(array $aParams, $bBrackets = TRUE) {
        $sResult = trim(str_repeat('?, ', count($aParams)), ', ');

        return ($bBrackets ? (' (' . $sResult . ') ') : $sResult);
    }

    /**
     * Gives back the last inserted id.
     * @return int
     */
    public function getLastInsertId() {
        return $this->iLastInsertId;
    }

    /**
     * It gives back the number of affected rows.
     * @return int
     */
    public function getAffectedRows() {
        return $this->iAffectedRows;
    }

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Protected                                                  **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Load db login information from Config file.
     * @return array
     * @throws \Exception
     */
    protected function loadConfig() {
        $aResult = [];

        $sConfigFile = Util::trimSlash($_SERVER['DOCUMENT_ROOT']) . DIRECTORY_SEPARATOR .  Util::trimShash($this->sPathToConfig) . '/database.conf';
        $rFile = fopen($sConfigFile, 'r');
        if (is_resource($rFile)) {
            while ( !feof($rFile)) {
                $sLine = fgets($rFile);
                $aLine = explode(':', $sLine);

                if ($aLine and strlen(trim($aLine[0]))) {
                    $aResult[trim($aLine[0])] = trim($aLine[1]);
                }
            }
            fclose($rFile);
        }
        else {
            throw new \Exception("Invalid db config file!");
        }

        if (isset($aResult['dbTablePrefix'])) {
            $this->sDbTablePrefix = $aResult['dbTablePrefix'];
        }

        if ( !isset($aResult['host']) || !isset($aResult['username']) || !isset($aResult['password']) || !isset($aResult['database'])) {
            throw new \Exception('Invalid database Config!');
        }

        return $aResult;
    }

    /**
     * Transform parameter values into reference.
     * @param array $arr
     * @return array
     */
    protected function referenceValues($arr) {
        // Reference is required for PHP 5.3+
        if (strnatcmp(phpversion(), '5.3') >= 0) {
            $refs = array();
            foreach ($arr as $key => $value) {
                $refs[$key] = &$arr[$key];
            }

            return $refs;
        }

        return $arr;
    }

}
