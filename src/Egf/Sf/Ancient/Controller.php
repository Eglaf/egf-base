<?php

namespace Egf\Sf\Ancient;

use Symfony\Bundle\FrameworkBundle\Controller\Controller as SfController;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManager;

/**
 * Controller class to extend.
 * @author attila kovacs
 * @since 2015.10.09.
 */
abstract class Controller extends SfController {

    /**
     * Get Doctrine entity manager.
     * @return EntityManager
     */
    protected function getDm() {
        return $this->get("doctrine")->getManager();
    }

    /**
     * Get Request.
     * @return Request
     */
    protected function getRq() {
        return $this->get('request_stack')->getCurrentRequest();
    }

}
