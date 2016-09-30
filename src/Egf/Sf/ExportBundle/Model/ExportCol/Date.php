<?php

namespace Egf\Sf\ExportBundle\Model\ExportCol;

/**
 * Class Date
 */
class Date extends BaseCol {

    /**
     * @var string $sFormat The date format.
     */
    private $sFormat = "Y-m-d";

    /**
     * @return string Formatted date.
     */
    public function getData() {
        if ($this->xData instanceof \DateTime) {
            return $this->xData->format($this->sFormat);
        }
        return null;
    }

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