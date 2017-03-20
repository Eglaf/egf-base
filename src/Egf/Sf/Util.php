<?php

namespace Egf\Sf;

use Egf\Base\Util as BaseUtil;

/**
 * Static class with some common functions for Symfony 2 projects.
 * use Egf\Sf\Util as SfUtil;
 */
class Util {

    /**
     * Transform entities into JSON.
     * $this->getSerializer()->normalize($enObject, 'json');
     * $this->getSerializer()->normalize($aenObjects, 'json');
     * @return \Symfony\Component\Serializer\Serializer
     * @url http://symfony.com/doc/current/components/serializer.html
     * @todo rework... service maybe?
     */
    public static function getSerializer() {
        $oClassMetadataFactory = new \Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory(new \Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader(new \Doctrine\Common\Annotations\AnnotationReader()));
        $oNormalizer = (new \Symfony\Component\Serializer\Normalizer\ObjectNormalizer($oClassMetadataFactory))
            ->setCircularReferenceLimit(0)
            ->setCircularReferenceHandler(function ($enObject) {
                return (method_exists($enObject, 'getId') ? $enObject->getId() : 'object-without-id');
            });

        return new \Symfony\Component\Serializer\Serializer([$oNormalizer], [new \Symfony\Component\Serializer\Encoder\JsonEncoder()]);
    }

    /**
     * Check if the given variable is a valid entity object. Entity requires to have a getId() method.
     * @param mixed $object The variable to check.
     * @return bool True if it's an entity.
     * @url http://stackoverflow.com/questions/20894705/how-to-check-if-a-class-is-a-doctrine-entity todo without given em...
     */
    public static function isEntity($object) {
        return (is_object($object) && method_exists($object, 'getId') && BaseUtil::isNaturalNumber($object->getId()));
    }

    /**
     * Check if the entity is in the ArrayCollection.
     * @param object                             $enEntity          Searched entity.
     * @param \Doctrine\ORM\PersistentCollection $acArrayCollection Search in ArrayCollection
     * @return bool True if entity is in ArrayCollection.
     * @todo $ac->contains($en)
     */
    public static function inArrayCollection($enEntity, \Doctrine\ORM\PersistentCollection $acArrayCollection) {
        return in_array($enEntity, $acArrayCollection->toArray(), TRUE);
    }

    /**
     * It gives back the entity alias name.
     * @param string $sClass Path to the entity. For example: \Egf\SomeBundle\Entity\Stuff\Things
     * @return string The entity alias. For example: EgfSomeBundle:Stuff\Things
     */
    public static function getEntityAlias($sClass) {
        $sResult = '';
        foreach (explode('\\', $sClass) as $sFragment) {
            // Path to the Entity directory within the Bundle.
            if (strpos($sResult, ':') === FALSE) {
                $sResult .= ($sFragment === 'Entity' ? ':' : $sFragment);
            }
            // Subdirectory in Entity or the class name itself.
            else {
                $sResult .= $sFragment . '\\';
            }
        }

        return trim($sResult, '\\');
    }

}