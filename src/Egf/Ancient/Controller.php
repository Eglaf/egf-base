<?php

namespace Egf\Ancient;

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
     * Check the entity and if it's new then persist it. If the second parameter is true (the default) then it runs the flush too.
     * @param $entity Mixed Entity to save.
     * @param bool $bFlush [Default: TRUE] If true, it flush the entity.
     * @return boolean It gives back true if the entity was newly created.
     * @todo if (id == null and hasMethod createDate) setCreateDate... elseif (natNum(id) and hasMethod(updateDate)) setUpdateDate...
     */
    protected function saveEntity($entity, $bFlush = TRUE) {
        $bWasCreated = false;
        if ($entity->getId() === NULL) {
            $this->getDm()->persist($entity);
            $bWasCreated = true;
        }

        if ($bFlush) {
            $this->getDm()->flush();
        }

        return $bWasCreated;
    }

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
