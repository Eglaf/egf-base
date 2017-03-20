<?php

namespace Egf\Sf\Ancient;

use Symfony\Component\DependencyInjection\ContainerAwareInterface,
    Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\Common\DataFixtures\AbstractFixture,
    Doctrine\Common\DataFixtures\OrderedFixtureInterface,
    Doctrine\Common\Persistence\ObjectManager;
use Egf\Base\Util;

/**
 * DataFixture class to extend.
 * @author attila kovacs
 * @since  2015.10.09.
 */
abstract class DataFixture extends AbstractFixture implements ContainerAwareInterface, OrderedFixtureInterface {

    /**
     * Do data loading.
     * @abstract
     * @return mixed
     */
    abstract public function doLoading();

    /**
     * @var \Doctrine\Common\Persistence\ObjectManager  Doctrine ObjectManager
     */
    protected $oDm;

    /**
     * @var ContainerInterface
     */
    protected $oContainer;

    /**
     * Decide if test data needs to be load.
     * @return boolean
     */
    protected function isTest() {
        if ($this->oContainer->hasParameter('load_test_data')) {
            return $this->oContainer->getParameter('load_test_data');
        }

        return FALSE;
    }

    /**
     * It creates an entity. The fixtures has to be in the same bundle. Add to reference only if it has label,
     * @param string $sEntityClass The class name of entity.
     * @param array  $aProperties  Properties with values.
     * @param string $sReference   The reference identifier. Always be lowercase!
     * @return $this
     * @todo If object is given, work with that?
     */
    protected function newEntity($sEntityClass, array $aProperties, $sReference = NULL) {
        $aDataFixturesClassFragments = explode('\\DataFixtures\\ORM\\', get_class($this));
        $sEntity = '\\' . $aDataFixturesClassFragments[0] . '\\Entity\\' . ucfirst($sEntityClass);
        $enObj = new $sEntity;
        foreach ($aProperties as $sProperty => $xValue) {
            \Egf\Base\Util::callObjectSetMethod($enObj, $sProperty, $xValue);
        }
        $this->getDm()->persist($enObj);

        if ( !$sReference) {
            if (isset($aProperties['label']) && strlen($aProperties['label'])) {
                $sReference = $sEntityClass . '-' . $aProperties['label'];
            }
            elseif (isset($aProperties['title']) && strlen($aProperties['title'])) {
                $sReference = $sEntityClass . '-' . $aProperties['title'];
            }
            elseif (isset($aProperties['name']) && strlen($aProperties['name'])) {
                $sReference = $sEntityClass . '-' . $aProperties['name'];
            }
        }

        $this->setReference(Util::stringToUrl($sReference), $enObj);

        return $this;
    }

    /**
     * @return ObjectManager
     */
    protected function getDm() {
        return $this->oDm;
    }

    /**
     * Give back the order of DataFixtures
     * @return  int     Order
     */
    public function getOrder() {
        return 0;
    }

    /**
     * Set ContainerInterface.
     * @param ContainerInterface $oContainer
     */
    public function setContainer(ContainerInterface $oContainer = NULL) {
        $this->oContainer = $oContainer;
    }

    /**
     * Get service.
     * @param $sServiceName
     * @return Service class.
     */
    protected function get($sServiceName) {
        return $this->oContainer->get($sServiceName);
    }

}
