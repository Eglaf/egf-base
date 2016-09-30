<?php

namespace Egf\Sf\ImportBundle\Model\ImportCol;

use Egf\Base\Func as BaseFunc;

/**
 * Class Date
 * @todo It adds 12 hour to the date. Add a setter for it.
 */
class Date extends BaseCol {

    /**
     * @return \DateTime|NULL DateTime if it's valid or NULL if not.
     */
    public function getData() {
        if ($this->sData) {
            $dtData = BaseFunc::toDateTime($this->sData);

            if ($dtData instanceof \DateTime) {
                return $dtData->modify('+12 hours');
            }
            else {
                $this->markAsTroubled("Invalid date format.");
            }
        }

        return NULL;
    }

}