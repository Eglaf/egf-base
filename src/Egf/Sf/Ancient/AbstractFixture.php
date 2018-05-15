<?php

namespace Egf\Sf\Ancient;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

use Egf\Util;

/**
 * Class AbstractFixtures
 *
 * todo Symfony\Component\DependencyInjection\ContainerAwareInterface, Symfony\Component\DependencyInjection\ContainerInterface
 * todo Doctrine\Common\DataFixtures\OrderedFixtureInterface
 */
abstract class AbstractFixture extends Fixture {
	
	/**
	 * Method to load data.
	 * Almost same as the original load method, but doesn't need om parameter and flush in the end.
	 * @abstract
	 */
	abstract public function loadData();
	
	/** @var ObjectManager */
	protected $om;
	
	/**
	 * The original load method, sets the om object variable, calls loadData method, then flushes.
	 * @param ObjectManager $om
	 */
	public function load(ObjectManager $om) {
		$this->om = $om;
		
		$this->loadData();
		
		$this->om->flush();
	}
	
	/**
	 * Create a new entity with given data.
	 * @param string $className ClassName. For example: App\\Entity\\Stuff::class
	 * @param array  $data      Some basic data array of entity. Something like: $entity->setKey(value);
	 * @return object The entity itself.
	 *
	 * todo 3rd param, reference
	 */
	protected function newEntity($className, array $data) {
		$entity = new $className;
		foreach ($data as $property => $value) {
			if ( ! Util::hasObjectSetMethod($entity, $property)) {
				throw new \Exception("The entity ({$className}) doesn't have a setter for the given property ({$property})!");
			}
			
			Util::callObjectSetMethod($entity, $property, $value);
		}
		
		$this->om->persist($entity);
		
		return $entity;
	}
	
}
