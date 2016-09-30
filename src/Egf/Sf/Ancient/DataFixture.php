<?php

namespace Egf\Sf\Ancient;

use  Doctrine\Common\DataFixtures\AbstractFixture,
     Doctrine\Common\DataFixtures\OrderedFixtureInterface,
     Doctrine\Common\Persistence\ObjectManager;
use  Symfony\Component\DependencyInjection\ContainerAwareInterface,
     Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * DataFixture class to extend.
 * @author attila kovacs
 * @since 2015.10.09.
 */
abstract class DataFixture extends AbstractFixture implements ContainerAwareInterface, OrderedFixtureInterface {

    /**
     * Give back the order of DataFixtures
     * @return  int     Order
     */
    public function getOrder() {
        return 0;
    }

    /**
     * @var \Doctrine\Common\Persistence\ObjectManager  Doctrine ObjectManager
     */
    protected $oDm;

    /**
     * @return ObjectManager
     */
    protected function getDm() {
        return $this->oDm;
    }

    /**
     * @var ContainerInterface
     */
    protected $oContainer;

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
