<?php

namespace Egf\ExportBundle\Model\ExportCol;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\EntityManager;
use Egf\Ancient;

/**
 * Created by PhpStorm.
 */
abstract class BaseCol {

    /**
     * The method that'll give back the string from data.
     * @abstract
     * @return string
     */
    abstract public function getData();

    /**
     * @var ContainerInterface It's what it looks like.
     */
    protected $oContainer;

    /**
     * @var string $sKey The entityProperty of the array key. Depends on the stuff that needs to be exported.
     */
    private $sKey = "";

    /**
     * @var string $sColumnHeader The custom column header if the property or key isn't acceptable.
     */
    private $sColumnHeader = "";

    /**
     * @var mixed $xData The data that needs to be exported.
     */
    protected $xData = null;


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Setters                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Set container.
     * @param ContainerInterface $oContainer
     * @return $this
     */
    public function setContainer($oContainer) {
        $this->oContainer = $oContainer;

        return $this;
    }

    /**
     * Set key.
     * @param string $sKey The entity property or the array key.
     * @return $this
     */
    public function setKey($sKey) {
        $this->sKey = $sKey;

        return $this;
    }

    /**
     * Set the custom column header.
     * @param string $sColumnHeader Entity property or array key.
     * @return $this
     */
    public function setColumnHeader($sColumnHeader = null) {
        $this->sColumnHeader = $sColumnHeader;

        return $this;
    }

    /**
     * Set data.
     * @param string $xData Data to transform.
     * @return $this
     */
    public function setData($xData) {
        $this->xData = $xData;
        return $this;
    }

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Getters                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Get service.
     * @param $sServiceName
     * @return object Service class.
     */
    protected function get($sServiceName) {
        return $this->oContainer->get($sServiceName);
    }

    /**
     * @return string The entity property or the array key.
     */
    public function getKey() {
        return $this->sKey;
    }

    /**
     * It gives back the column header.
     * @return string Column header.
     */
    public function getHeader() {
        return (strlen($this->sColumnHeader) ? $this->sColumnHeader : $this->sKey);
    }

}