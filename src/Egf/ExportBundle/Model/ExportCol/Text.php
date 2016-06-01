<?php

namespace Egf\ExportBundle\Model\ExportCol;

/**
 * Class Text
 */
class Text extends BaseCol {

    /**
     * @return string The data.
     */
    public function getData() {
        return $this->xData;
    }

}