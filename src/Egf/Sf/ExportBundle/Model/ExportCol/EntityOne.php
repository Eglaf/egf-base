<?php

namespace Egf\Sf\ExportBundle\Model\ExportCol;

use Egf\Base\Func as BaseFunc;
use Egf\Sf\Func as SfFunc;

/**
 * Class EntityOne
 * In case of more properties are needed from one related entity, then rewrite the columnHeader with the third parameter of addColumn method, and use the related entity name at every column as first parameter.
 * @todo Add another column, to affect the cell content (date for example)...
 */
class EntityOne extends BaseCol {

    /**
     * @return mixed|null
     */
    public function getData() {
        if (count($this->aRelationPath)) {
            $xData = $this->getNext($this->xData, $this->aRelationPath);
            if ($xData instanceof \DateTime) {
                return $xData->format($this->sFormat);
            }
            else {
                return $xData;
            }
        }
        else {
            throw new \Exception("Invalid relationPath for the ExportCol-EntityOne!");
        }
    }

    /**
     * Recursively look for the data to export.
     * @param object $xData The next data object from the path.
     * @param array $aPath The remaining part of the path to the final result.
     * @return mixed|null
     */
    protected function getNext($xData, $aPath) {
        $xNext = array_shift($aPath);
        if ($xNext) {
            if (is_object($xNext) && SfFunc::isEntity($xNext)) {
                return $this->getNext($xNext, $aPath);
            }
            else {
                if (BaseFunc::hasObjectGetMethod($xData, $xNext)) {
                    return BaseFunc::callObjectGetMethod($xData, $xNext);
                }
            }
        }

        return null;
    }

    /**
     * The relation path.
     * @var array
     */
    protected $aRelationPath = [];

    /**
     * Set the relation path.
     * @param $xRelationPath
     * @return $this
     */
    public function setRelationPath($xRelationPath) {
        if (is_string($xRelationPath)) {
            $this->aRelationPath = [$xRelationPath];
        }
        else if (is_array($xRelationPath)) {
            $this->aRelationPath = $xRelationPath;
        }
        else {
            throw new \Exception("Invalid setRelationPath parameter for the ExportCol-EntityOne!");
        }

        return $this;
    }

    /**
     * @var string $sFormat The date format.
     */
    private $sFormat = "Y-m-d";


    /**
     * Set the date format.
     * @param $sFormat
     * @return $this
     */
    public function setFormat($sFormat) {
        $this->sFormat = $sFormat;

        return $this;
    }

}