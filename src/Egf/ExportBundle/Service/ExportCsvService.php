<?php

namespace Egf\ExportBundle\Service;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\Session\Session,
    Symfony\Component\HttpFoundation\File\UploadedFile;
use Egf\Ancient;
use Egf\ExportBundle\Model\ExportCol;

/**
 * Export csv service
 */
class ExportCsvService extends Ancient\Service
{

    /**
     * @var array $aData The data what will be exported. It can be array of arrays or array of entities.
     */
    private $aData = [];

    /**
     * @var array $aoColumns The columns of the exported csv file.
     */
    private $aoColumns = [];

    /**
     * @var string $sFileName The name of file.
     */
    private $sFileName = "dataexport";


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
    public function setData(array $aData)
    {
        $this->aData = $aData;

        return $this;
    }

    /**
     * Add one row to data.
     * @param $xRow
     * @return $this
     */
    public function addData($xRow)
    {
        $this->aData[] = $xRow;

        return $this;
    }

    /**
     * Set the file name, if the default isn't acceptable.
     * @param $sFileName
     * @return $this
     */
    public function setFileName($sFileName)
    {
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
    public function addColumn($sKey, ExportCol\BaseCol $oColumn = null, $sColumnHeader = null)
    {
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


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Get data                                                   **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * @return Response The downloadable csv file.
     */
    public function getResponse()
    {
        $oResponse = $this->get("templating")->renderResponse("EgfExportBundle:Export:data.csv.twig", [
            "aHeaders" => $this->getHeaders(),
            "aaData"   => $this->getTransformedData(),
        ]);
        $oResponse->headers->set("Content-Type", "text/csv");
        $oResponse->headers->set("Content-Disposition", "attachment; filename='" . $this->sFileName . ".csv'");

        return $oResponse;
    }

    /**
     * It gives back the headers in an array. These will be the first row.
     * @return array Header strings.
     */
    private function getHeaders()
    {
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
    private function getTransformedData()
    {
        $aaResult = [];

        /** @var object|array $xRow */
        foreach ($this->aData as $xRow) {
            $aRow = [];

            /** @var ExportCol\BaseCol $oColumn */
            foreach ($this->aoColumns as $oColumn) {
                if (Ancient\Func::isEntity($xRow)) {
                    if (Ancient\Func::hasEntityGetField($xRow, $oColumn->getKey())) {
                        $oColumn->setData(Ancient\Func::entityGetField($xRow, $oColumn->getkey()));
                    } else {
                        throw new \Exception("Entity doesn't have get method! \n Entity: " . get_class($xRow) . "\n Method: get" . ucfirst($oColumn->getKey()) . " \n\n ");
                    }
                } else if (is_array($xRow)) {
                    if (array_key_exists($oColumn->getHeader(), $xRow)) {
                        $oColumn->setData($xRow[$oColumn->getHeader()]);
                    }
                } else {
                    throw new \Exception("DataRow to export has to be entity or array!");
                }
                $aRow[] = $oColumn->getData();
            }
            $aaResult[] = $aRow;
        }

        return $aaResult;
    }

}