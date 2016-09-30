<?php

namespace Egf\Sf\ImportBundle\Service;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\Session\Session,
    Symfony\Component\HttpFoundation\File\UploadedFile;
use Egf\Base\Func as BaseFunc;
use Egf\Sf\Func as SfFunc,
    Egf\Sf\Ancient;
use Egf\Sf\ImportBundle\Model\ImportCol;

/**
 * Import csv.
 * ServiceName: import.csv
 */
class ImportCsvService extends Ancient\Service
{

    /** @var Request The request object, created at file copy. */
    protected $oRequest = null;

    /** @var string $sFileInputName The input name in form for file upload. */
    protected $sFileInputName = null;

    /** $var string $sFilePath The path to file. */
    protected $sFilePath = null;

    /** @var string $sCustomFileName A custom file name, if the automatically generated isn't acceptable. */
    protected $sCustomFileName = "";

    /** @var string[] $asAvailableExtensions Available extensions of file. */
    protected $asAvailableExtensions = ["csv"];

    /** @var string Cell separator in CSV. */
    protected $sCellSeparator = ';';

    /** @var string $sEntityClass The namespace and className of the entity that'll be imported. */
    protected $sEntityClass = null;

    /** @var array $aoColumns The columns from csv to entity. */
    protected $aoColumns = [];

    /** @var array $asHeaders The header cells in an array. */
    protected $asHeaders = [];

    /** @var string[] $asErrors Error messages. */
    protected $asErrors = [];

    /** @var string $sFinalFile The final path and file name after the upload. If the upload wasn't success, then it's set to FALSE. */
    protected $sFinalFile = null;

    /** @var array $aDefaultProperties Some fix properties for the newly created entities. */
    protected $aDefaultProperties = [];

    /** @var bool $bUpdateEnabled Decide if the update old entities is enabled or not, in case of duplications. */
    protected $bUpdateEnabled = false;

    /** @var boolean $bExportTroubledRows If it's not disabled, it'll generate a csv with rows which had any trouble. */
    protected $bExportTroubledRows = true;

    /** @var int $iRowsSuccess Counter of rows which were created successfully as an entity. */
    protected $iCountRowsSuccess = 0;

    /** @var int $iRowsError Counter of rows which had problems. */
    protected $iCountRowsTroubled = 0;

    /** @var int First id created. */
    protected $iFirstIdCreated = 0;

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Setters                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Set file input name.
     * @param string $sFileInputName Set the input name.
     * @return $this
     */
    public function setFileInputName($sFileInputName)
    {
        $this->sFileInputName = $sFileInputName;

        return $this;
    }

    /**
     * Set file path.
     * @param $sFilePath
     * @return $this
     */
    public function setFilePath($sFilePath) {
        $this->sFilePath = $sFilePath;

        return $this;
    }

    /**
     * Instead of loading the file from request, set it. In this case, request method do not has to be post.
     * @param $rFile
     * @todo
     */
    public function setFile($rFile) {
        // todo
    }

    /**
     * Set entity class.
     * @param string $sEntityClass The namespace and className of the entity that'Ll be imported.
     * @return $this
     */
    public function setEntityClass($sEntityClass)
    {
        $this->sEntityClass = $sEntityClass;

        return $this;
    }

    /**
     * Set uploaded file name. Optional.
     * @param string $sCustomFileName A custom file name if the automatically generated isn't acceptable.
     * @return $this
     */
    public function setCustomFileName($sCustomFileName)
    {
        $this->sCustomFileName = $sCustomFileName;

        return $this;
    }

    /**
     * Rewrite the default available extensions array. Optional.
     * @param string $asExtensions Array of extensions.
     * @return $this
     */
    public function setAvailableExtensions($asExtensions)
    {
        $this->asAvailableExtensions = $asExtensions;

        return $this;
    }

    /**
     * Set some default properties for the newly created entities.
     * @param array $aDefaultProperties The array where the key is the property and the value is the... value.
     * @return $this
     */
    public function setDefaultEntityProperties(array $aDefaultProperties)
    {
        $this->aDefaultProperties = $aDefaultProperties;

        return $this;
    }

    /**
     * Add a column that'll transform a csv data to a entity property.
     * @param string            $sEntityProperty The entity property.
     * @param ImportCol\BaseCol $oColumn         The ImportColumn object.
     * @param string            $sColumnHeader   It's a custom column header name. If it's set, then it'll look for this header. Default: NULL.
     * @return $this
     */
    public function addColumn($sEntityProperty, ImportCol\BaseCol $oColumn = null, $sColumnHeader = null)
    {
        if ( !$oColumn) {
            $oColumn = new ImportCol\Text();
        }
        $oColumn
            ->setEntityProperty($sEntityProperty)
            ->setColumnHeader($sColumnHeader);
        $this->aoColumns[$sColumnHeader ? $sColumnHeader : $sEntityProperty] = $oColumn;

        return $this;
    }

    /**
     * Make updating old entities enabled.
     * @return $this
     */
    public function enableUpdate()
    {
        $this->bUpdateEnabled = true;

        return $this;
    }

    /**
     * Make the troubled rows export disable.
     * @return $this
     */
    public function disableExportTroubledRows()
    {
        $this->bExportTroubledRows = false;

        return $this;
    }

    /**
     * Set the cell separator in csv.
     * @param string $sSeparator Default: ";".
     * @return $this
     */
    public function setCellSeparator($sSeparator) {
        $this->sCellSeparator = $sSeparator;

        return $this;
    }

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Upload and import                                          **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Check if the form and the sent file is valid.
     * Also set errors if was not all the required setters called.
     */
    public function isValid()
    {
        // Is input name set?
        if (strlen($this->sFileInputName) > 0 || strlen($this->sFilePath)) {
            // Is entity class set?
            if (strlen($this->sEntityClass) > 0) {
                // Is post method?
                if ($this->oRequest) {
                    if ($this->oRequest->getMethod() === "POST") {
                        // Is copy success? Only if it was called.
                        if ($this->sFinalFile !== false) {
                            return true;
                        } else {
                            $this->addError("Copy was called but it wasn't to able to move the file to its final place.");
                        }
                    } else {
                        $this->addError("Don't try to import a file, while the request method isn't post!");
                    }
                } else {
                    $this->addError("CopyFile wasn't called!");
                }
            } else {
                $this->addError("The entityClass wasn't set!");
            }
        } else {
            $this->addError("Neither input name of file nor file path nor file itself is set.");
        }

        return false;
    }

    /**
     * Copy the file to it's final place.
     * @param string $sPath The path to file.
     * @return $this
     */
    public function copyFileTo($sPath)
    {
        $this->oRequest = Request::createFromGlobals();
        $aRequestData = $this->oRequest->files->all();

        if (isset($aRequestData[$this->sFileInputName])) {

            /** @var UploadedFile $oFile */
            $oFile = $aRequestData[$this->sFileInputName];

            if ($oFile) {
                // Rename file.
                if (strlen($this->sCustomFileName) > 0) {
                    $sFileNameWithoutExt = preg_replace('/\\.[^.\\s]{3,4}$/', '', $this->sCustomFileName);
                } else {
                    $sFileNameWithoutExt = date("YmdHis") . "_" . preg_replace('/\\.[^.\\s]{3,4}$/', '', $oFile->getClientOriginalName());
                }
                $sFileName = $sFileNameWithoutExt . "." . $oFile->getClientOriginalExtension();

                // Create directory if doesn't exist.
                $sFinalPath = __DIR__ . '/../../../../web/' . trim($sPath, "/");
                if ( !file_exists($sFinalPath)) { // !is_dir ?
                    mkdir($sFinalPath, 0777, true);
                }

                // Copy.
                $this->sFinalFile = ($oFile->move($sFinalPath, $sFileName) ? $sFinalPath . DIRECTORY_SEPARATOR . $sFileName : false);

            } else {
                $this->addError("File not found.");
            }
        } else {
            $this->addError("Data from input not found.");
        }

        return $this;
    }

    /**
     * Do the import.
     */
    public function importContent()
    {
        if ($this->isValid()) {
            ImportCol\BaseCol::setDm($this->getDm());
            $this->getDm()->getConnection()->getConfiguration()->setSQLLogger(null); // To do things faster.

            if ($this->bExportTroubledRows) {
                $this->get("export.csv")->setFileName("import-problems");
            }

            /** @var resource $rFile The uploaded file. */
            if (($rFile = fopen($this->sFinalFile, "r")) !== false) {
                $bFirstRow = true;
                /** @var array $aRow The content of row. */
                while (($aRow = fgetcsv($rFile, null, $this->sCellSeparator)) !== false) {
                    if ($bFirstRow) {
                        $this->loadHeaders($aRow);
                        $bFirstRow = false;
                    } else {
                        $this->importRow($aRow);
                    }
                }
                fclose($rFile);
            }
        }
    }

    /**
     * Instead of importing the first row, it loads the cells as headers. It'll identify cells by these.
     * @param array $aRow First row of the imported file.
     */
    protected function loadHeaders(array $aRow)
    {
        for ($c = 0; $c < count($aRow); $c++) {
            $this->asHeaders[$c] = $aRow[$c];

            if ($this->bExportTroubledRows) {
                $this->get("export.csv")
                    ->addColumn($aRow[$c]);
            }
        }

        if ($this->bExportTroubledRows) {
            $this->get("export.csv")
                ->addColumn("_trouble_description_");
        }
    }


    /**
     * Import row.
     * @param array $aRow A row of uploaded file.
     */
    protected function importRow(array $aRow)
    {
        $aData = $this->aDefaultProperties;
        $bMarkedAsTroubled = false;
        $sTroubleMessage = "";
        $aCheckForDuplicates = [];

        // Iterate columns on the imported row.
        for ($c = 0; $c < count($aRow); $c++) {
            if ( !$this->isError()) {
                /** @var ImportCol\BaseCol $oColumn */
                if (array_key_exists($c, $this->asHeaders)) {
                    if (array_key_exists($this->asHeaders[$c], $this->aoColumns)) {
                        $sData = $aRow[$c];
                        if (mb_detect_encoding($sData, mb_detect_order(), true) !== 'UTF-8') {
                            $sData = utf8_encode($sData);
                        }

                        $oColumn = $this->aoColumns[$this->asHeaders[$c]];
                        $oColumn
                            ->resetTroubles()
                            ->setData($sData)
                            ->setRow($aRow);
                        $aData[$oColumn->getEntityProperty()] = $oColumn->getData();

                        if ($oColumn->isMarkedAsTroubled()) {
                            $bMarkedAsTroubled = true;
                            $sTroubleMessage .= $oColumn->getMessageOfTrouble() . " ";
                        } else if ($oColumn->shallCheckDuplicate()) {
                            $aCheckForDuplicates[$oColumn->getEntityProperty()] = $oColumn->getData();
                        }
                    }
                }
            }
        }

        if ( !$this->isError()) {
            // Get the entity. New if there aren't duplicates.
            $enObject = $this->getEntity($aCheckForDuplicates, $sGetEntityTroubledMsg);

            // If there was some trouble with row.
            if ($bMarkedAsTroubled || $sGetEntityTroubledMsg) {
                $this->iCountRowsTroubled++;

                $i = 0;
                $aTroubledRow = [];
                /** @var ImportCol\BaseCol $oColumn */
                foreach ($this->aoColumns as $oColumn) {
                    $iTempKey = array_search($this->asHeaders[$i], $this->asHeaders);
                    if (isset($aRow[$i])) {
                        $aTroubledRow[$this->asHeaders[$i]] = $aRow[$iTempKey];
                        $i++;
                    } else {
                        $this->addError("The column " . $oColumn->getColumnHeader() . " is not defined!");
                    }
                }

                $sMessageOfTrouble = $sTroubleMessage . ($sGetEntityTroubledMsg ? $sGetEntityTroubledMsg : "");
                $aTroubledRow["_trouble_description_"] = $sMessageOfTrouble;

                $this->get("export.csv")->addData($aTroubledRow);
            } // If there wasn't any trouble with row.
            else {
                // Create entity.
                if ($enObject) {
                    $this->entitySetData($enObject, $aData);

                    // Save.
                    try {
                        $this->getDm()->persist($enObject);
                        $this->getDm()->flush();
                    } catch (\Exception $e) {
                        throw $e;
                    }

                    if (!$this->iFirstIdCreated) {
                        $this->iFirstIdCreated = $enObject->getId();
                    }

                    $this->getDm()->clear(SfFunc::getEntityAlias($this->sEntityClass));

                    $this->iCountRowsSuccess++;
                } else {
                    $this->addError("Entity object couldn't be created neither updated!"); //throw new \Exception("Entity object couldn't be created neither updated!");
                }
            }
        } else {
            $this->iCountRowsTroubled++;
            //var_dump($this->getErrors());
        }
    }

    /**
     * It gives back the entity object. Most of the time it's a newly created one, but it can be an old one too, to avoid duplicates.
     * @param array $aCheckForDuplicates The data that needs to be checked for duplicates.
     * @return object The entity object.
     */
    protected function getEntity($aCheckForDuplicates, &$sTroubledMsg = null)
    {
        /** @var object $enObject */
        $enObject = null;

        // Check for duplicates.
        if (count($aCheckForDuplicates)) {
            $enOldObject = $this->getDm()->getRepository(SfFunc::getEntityAlias($this->sEntityClass))->findOneBy($aCheckForDuplicates);
            // If there was a duplication.
            if ($enOldObject) {
                if ($this->bUpdateEnabled) {
                    $enObject = $enOldObject;
                } else {
                    $sTroubledMsg = "Duplication but update is disabled.";

                    return null;
                }
            }
        }

        // If there wasn't any duplication, then create a new.
        if ( !$enObject) {
            $enObject = new $this->sEntityClass;
        }

        return $enObject;
    }

    /**
     * Set the data to the entity.
     * @param object $enObject Entity object.
     * @param array  $aData    The data from import.
     */
    protected function entitySetData($enObject, $aData)
    {
        foreach ($aData as $sProperty => $xValue) {
            // Update entity. If the entity is updated then don't rewrite old values with some default data.
            if (BaseFunc::isNaturalNumber($enObject->getId())) {
                // If the value can be set by default properties, then do another check.
                if (isset($this->aDefaultProperties[$sProperty])) {
                    // If the default value doesn't want to overwrite the old value of entity.
                    if ($this->aDefaultProperties[$sProperty] !== $xValue) {
                        BaseFunc::callObjectSetMethod($enObject, $sProperty, $xValue);
                    }
                } else {
                    BaseFunc::callObjectSetMethod($enObject, $sProperty, $xValue);
                }
            }
            // Create new.
            else if ( !BaseFunc::isNaturalNumber($enObject->getId())) {
                BaseFunc::callObjectSetMethod($enObject, $sProperty, $xValue);
            }
        }
    }

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Marked as troubled                                         **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Gives back the number of troubled rows.
     * @return int The count of troubled rows.
     */
    public function countRowsMarkedAsTroubled()
    {
        return $this->iCountRowsTroubled;
    }

    /**
     * It gives back the export response of troubled rows.
     * @return Response CSV file download.
     */
    public function getTroubledExportResponse()
    {
        return $this->get("export.csv")->getResponse();
    }

    /**
     * @param $sFileName
     * @throws \Exception
     */
    public function saveTroubledExportIntoFile($sFileName) {
        if (substr($sFileName, -4) === '.csv') {
            $fs = new \Symfony\Component\Filesystem\Filesystem();
            $fs->dumpFile($sFileName, $this->get("export.csv")->getContent());
        }
        else {
            throw new \Exception('To save troubled rows into a csv file, the file name has to have a csv extension!');
        }
    }

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Errors                                                     **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * @return int The number of errors.
     */
    public function isError()
    {
        return count($this->asErrors);
    }

    /**
     * @return string[] The error messages in an array.
     */
    public function getErrors()
    {
        return $this->asErrors;
    }

    /**
     * @param string $sError Add an error message.
     */
    protected function addError($sError)
    {
        $this->asErrors[] = $sError;
    }

    public function getNumberOfSuccessfullyImportedRows() {
        return $this->iCountRowsSuccess;
    }

    public function getFirstIdCreated() {
        return $this->iFirstIdCreated;
    }

}
