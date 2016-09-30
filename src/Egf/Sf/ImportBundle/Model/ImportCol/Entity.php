<?php

namespace Egf\Sf\ImportBundle\Model\ImportCol;

use Egf\Base\Func as BaseFunc;
use Egf\Sf\Func as SfFunc;

/**
 * Class Entity
 * @todo    enableCreate
 * @todo don't create twice!
 */
class Entity extends BaseCol {

    /**
     * @return object Some entity.
     */
    public function getData() {
        // Look for related entity.
        if (is_array($this->aenRelatedOptions) and count($this->aenRelatedOptions) and strlen($this->sRelatedField)) {
            foreach ($this->aenRelatedOptions as $enOption) {
                if (strtolower(BaseFunc::callObjectGetMethod($enOption, $this->sRelatedField)) == strtolower($this->sData)) {
                    return $enOption;
                }
            }
        }

        // It can create a new one if enabled.
        if ($this->bCreateEnabled and strlen($this->sCreatePath)) {
            throw new \Exception("ImportCol\\Entity->enableCreate() was never tested... do it now... \n " . __METHOD__ ); // todo again... add only once... fuuuck...
            $enCreated = $this->getDm()->getRepository(SfFunc::getEntityAlias($this->sCreatePath))->findOneBy([$this->sRelatedField => $this->sData]);

            if (!$enCreated) {
                $enCreated = (new $this->sCreatePath);

                foreach ($this->aCreateProperties as $sProp => $xValue) {
                    BaseFunc::callObjectSetMethod($enCreated, $sProp, [$xValue]);
                }
                BaseFunc::callObjectSetMethod($enCreated, $this->sRelatedField, [$this->sData]);

                $this->getDm()->persist($enCreated);
            }

            return $enCreated;
        }

        // If couldn't be selected, neither created.
        if ($this->sData) {
            $this->markAsTroubled("Related data wasn't found and was forbidden to create. \\n " . $this->sCreatePath . " \\n " . $this->sData);
        }

        return NULL;
    }

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Attributes                                                 **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * @var array $aenRelatedOptions The related options.
     */
    private $aenRelatedOptions = [];

    /**
     * @var string $sRelatedField The field
     */
    private $sRelatedField = "";

    /**
     * @var bool $bCreateEnabled By default creating a new related entity is disabled, but it can be set to enabled.
     * @todo Remove and check path instead.
     */
    private $bCreateEnabled = FALSE;

    /**
     * @var string $sCreatePath The class namespace adn name to create new related entity.
     */
    private $sCreatePath = "";

    /**
     * @var array $aCreateProperties Custom properties to the newly created related entity.
     */
    private $aCreateProperties = [];


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Setters                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Set the options of the column.
     * @param array $aenRelatedOptions
     * @return $this
     */
    public function setRelatedOptions(array $aenRelatedOptions) {
        $this->aenRelatedOptions = $aenRelatedOptions;

        return $this;
    }

    /**
     * Set the field of the related entity.
     * @param string $sRelatedField The field of related entity.
     * @return $this
     */
    public function setRelatedField($sRelatedField) {
        $this->sRelatedField = $sRelatedField;

        return $this;
    }

    /**
     * Creating a new related entity can be set to enabled.
     * @param string $sCreatePath       The class namespace adn name to create new related entity.
     * @param array  $aCreateProperties Some default properties for the new entity.
     * @return $this
     */
    public function enableCreate($sCreatePath, $aCreateProperties = []) {
        $this->bCreateEnabled = TRUE;
        $this->sCreatePath = $sCreatePath;
        $this->aCreateProperties = $aCreateProperties;

        return $this;
    }

}