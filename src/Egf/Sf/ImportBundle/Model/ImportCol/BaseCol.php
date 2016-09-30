<?php

namespace Egf\Sf\ImportBundle\Model\ImportCol;

use Doctrine\ORM\EntityManager;


/**
 * Class BaseCol
 * @abstract
 */
abstract class BaseCol {

    /**
     * The method that'll transform the imported data into it's final form, that can be saved into entity;
     * @abstract
     * @return mixed
     */
    abstract public function getData();


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Attributes                                                 **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * @var EntityManager static::$oDm
     */
    private static $oDm;

    /**
     * @var string $sData The content of cell in csv. It!ll be transformed by ImportColumns.
     */
    protected $sData;

    /**
     * @var string[] The whole row of csv. It can be used in ImportColumns if needed.
     */
    protected $aRow;

    /**
     * @var string $sEntity The entity property.
     */
    protected $sEntityProperty;

    /**
     * @var string $sColumnHeader The column header in imported file. Most of the times it'll be the same as the entity property. The only exception is when the customer doesn't like that property name.
     */
    protected $sColumnHeader = NULL;

    /**
     * @var boolean $bUnique Force the value to be unique. It can update the old entity or mark the row as troubled.
     */
    protected $bUnique = false;

    /**
     * @var boolean $bMarkedAsTroubled Decide if the row was marked as troubled. In this case it won't save the entity, but give back in an csv file.
     */
    protected $bMarkedAsTroubled = false;

    /**
     * @var string $sTroubledMessage Some message to tell the user, why the row marked as troubled.
     */
    protected $sTroubledMessage = "";


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Setters                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Set the Doctrine EntityManager.
     * @param EntityManager $oDm
     */
    public static function setDm(EntityManager $oDm) {
        static::$oDm = $oDm;
    }

    /**
     * Set the content of cell to the class.
     * @param string $sData The data.
     * @return $this
     */
    public function setData($sData) {
        $this->sData = $sData;

        return $this;
    }

    /**
     * Set the row to the class.
     * @param array $aRow
     * @return $this
     */
    public function setRow(array $aRow) {
        $this->aRow = $aRow;

        return $this;
    }

    /**
     * Set the entity property.
     * @param string $sEntityProperty The entity property.
     * @return $this
     */
    public function setEntityProperty($sEntityProperty) {
        $this->sEntityProperty = $sEntityProperty;

        return $this;
    }

    /**
     * Set the column header.
     * @param string $sColumnHeader The column header.
     * @return $this
     */
    public function setColumnHeader($sColumnHeader) {
        $this->sColumnHeader = $sColumnHeader;
    }

    /**
     * Force the column to be unique.
     * @return $this
     * @todo ...AND...OR...
     */
    public function hasToBeUnique() {
        $this->bUnique = true;

        return $this;
    }

    /**
     * @return $this
     */
    public function resetTroubles() {
        $this->bMarkedAsTroubled = false;
        $this->sTroubledMessage = '';

        return $this;
    }

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Getters                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * The column header. If it was not set to custom with the third parameter of addColumn method, then it's the same as the entityProperty.
     * @return string The column header.
     */
    public function getColumnHeader() {
        return $this->sColumnHeader ? $this->sColumnHeader : $this->sEntityProperty;
    }

    /**
     * @return string The property of entity.
     */
    public function getEntityProperty() {
        return $this->sEntityProperty;
    }

    /**
     * @return string The original data.
     */
    public function getOriginalData() {
        return $this->sData;
    }

    /**
     * It gives back true if the data should not be duplicate.
     * @return bool True if data has to be unique.
     */
    public function shallCheckDuplicate() {
        return $this->bUnique;
    }

    /**
     * Doctrine EntityManager
     * @return EntityManager
     */
    protected function getDm() {
        return self::$oDm;
    }

    /**
     * Mark the row troubled.
     * @param string $sMsg Some message to user about the reason of trouble.
     */
    public function markAsTroubled($sMsg = null) {
        $this->bMarkedAsTroubled = true;
        if ($sMsg) {
            $this->sTroubledMessage .= $sMsg;
        }
    }

    /**
     * @return boolean Give back true if the row was marked as troubled.
     */
    public function isMarkedAsTroubled() {
        return $this->bMarkedAsTroubled;
    }

    /**
     * It gives back the error message.
     * @return string
     */
    public function getMessageOfTrouble() {
        return $this->sTroubledMessage;
    }

}