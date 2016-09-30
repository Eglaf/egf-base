<?php

namespace Egf\Sf\ExportBundle\Service;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\Session\Session,
    Symfony\Component\HttpFoundation\File\UploadedFile;
use Egf\Base\Func as BaseFunc;
use Egf\Sf\Func as SfFunc,
    Egf\Sf\Ancient;
use Egf\Sf\ExportBundle\Model\ExportCol;

/**
 * Export to csv.
 * ServiceName: export.csv
 */
class ExportCsvService extends Ancient\Service {

    /** @var array $aData The data what will be exported. It can be array of arrays or array of entities. */
    private $aData = [];

    /** @var array $aoColumns The columns of the exported csv file. */
    private $aoColumns = [];

    /** @var string $sFileName The name of file. */
    private $sFileName = "dataexport";

    /** @var bool Set the exported content encode to Ansi. This way MsExcel can show accent characters correctly. */
    private $bToAnsi = FALSE;


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Setters                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Set data.
     * @param array $aData
     * @return $this
     * @todo accept ArrayCollection
     */
    public function setData(array $aData) {
        $this->aData = $aData;

        return $this;
    }

    /**
     * Add one row to data.
     * @param $xRow
     * @return $this
     */
    public function addData($xRow) {
        $this->aData[] = $xRow;

        return $this;
    }

    /**
     * Set the file name, if the default isn't acceptable.
     * @param $sFileName
     * @return $this
     */
    public function setFileName($sFileName) {
        $this->sFileName = $sFileName;

        return $this;
    }

    /**
     * Add column.
     * @param string            $sKey          The property of entity.
     * @param ExportCol\BaseCol $oColumn       The column object. It's new ExportCol\Text() if isn't set.
     * @param string            $sColumnHeader A custom header if the property isn"t good enough.
     * @return $this
     */
    public function addColumn($sKey, ExportCol\BaseCol $oColumn = NULL, $sColumnHeader = NULL) {
        if ( !$oColumn) {
            $oColumn = new ExportCol\Text();
        }
        $oColumn
            ->setContainer($this->oContainer)
            ->setKey($sKey)
            ->setColumnHeader($sColumnHeader);
        $this->aoColumns[$sColumnHeader ? $sColumnHeader : $sKey] = $oColumn;

        return $this;
    }

    /**
     * Set the exported content to ansi encode. This way the sheety MsExcel can show some accent characters correctly. Of course ő and ű is still sucks.
     * @return $this
     */
    public function toAnsi() {
        $this->bToAnsi = TRUE;

        return $this;
    }

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Get data                                                   **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * @return Response The downloadable csv file.
     */
    public function getResponse() {
        $oResponse = new Response();
        $oResponse->setContent($this->getContent());
        if ($this->bToAnsi) {
            $oResponse->headers->set("Content-Type", "text/csv; charset=WINDOWS-1252");
        }
        else {
            $oResponse->headers->set("Content-Type", "text/csv; charset=UTF-8");
        }

        $oResponse->headers->set("Content-Disposition", "attachment; filename='" . $this->sFileName . ".csv'");

        return $oResponse;
    }

    /**
     * It gives back the string content of csv.
     * @return string Csv content.
     */
    public function getContent() {
        $sContent = $this->get("templating")->render("LnExportBundle:Export:data.csv.twig", [
            "aHeaders" => $this->getHeaders(),
            "aaData" => $this->getTransformedData(),
        ]);

        if ($this->bToAnsi) {
            $sContent = htmlentities($sContent, ENT_QUOTES, 'utf-8');
            $sContent = html_entity_decode($sContent, ENT_QUOTES, 'Windows-1252');
        }

        return $sContent;
    }


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Protected                                                  **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * It gives back the headers in an array. These will be the first row.
     * @return array Header strings.
     */
    protected function getHeaders() {
        $aResult = [];
        /** @var ExportCol\BaseCol $oColumn */
        foreach ($this->aoColumns as $oColumn) {
            $aResult[] = $oColumn->getHeader();
        }

        return $aResult;
    }

    /**
     * Get the multidimensional array with the exportable data.
     * @return array Exportable data.
     */
    protected function getTransformedData() {
        $aaResult = [];

        /** @var object|array $xRow */
        foreach ($this->aData as $xRow) {
            $aRow = [];

            /** @var ExportCol\BaseCol $oColumn */
            foreach ($this->aoColumns as $oColumn) {
                if (SfFunc::isEntity($xRow)) {
                    if (BaseFunc::hasObjectGetMethod($xRow, $oColumn->getKey())) {
                        $oColumn->setData(BaseFunc::callObjectGetMethod($xRow, $oColumn->getkey()));
                    }
                    else {
                        throw new \Exception("Entity doesn't have get method! \n Entity: " . get_class($xRow) . "\n Method: get" . ucfirst($oColumn->getKey()) . " \n\n ");
                    }
                }
                else if (is_array($xRow)) {
                    if (array_key_exists($oColumn->getHeader(), $xRow)) {
                        $oColumn->setData($xRow[$oColumn->getHeader()]);
                    }
                }
                else {
                    throw new \Exception("DataRow to export has to be entity or array!");
                }
                $aRow[] = $oColumn->getData();
            }
            $aaResult[] = $aRow;
        }

        return $aaResult;
    }

}