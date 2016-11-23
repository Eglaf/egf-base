<?php

namespace Egf\Base\Core\DbWhere;


class Boolean extends Base {

    /** @var string Type. */
    protected $sType = 'i';

	/**
	 * A basic condition equation string.
	 * @return string
	 */
	public function getConditionEquation() {
		return ' = ';
	}

}