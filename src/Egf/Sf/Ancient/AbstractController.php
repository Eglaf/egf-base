<?php

namespace Egf\Sf\Ancient;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManager;

/**
 * Class AbstractController
 */
abstract class AbstractController extends Controller {
	
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