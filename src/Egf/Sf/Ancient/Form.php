<?php

namespace Egf\Sf\Ancient;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\OptionsResolver\OptionsResolver;
use Doctrine\ORM\EntityRepository;

/**
 * Form class to extend.
 * @author attila kovacs
 * @since 2015.10.09.
 */
abstract class Form extends AbstractType {

    /**
     * @var string Name of FormClass.
     */
    protected static $sFormName = "SomeForm";

    /**
     * @return string Get name of FormClass by static method.
     */
    public static function getFormName() {
        return static::$sFormName;
    }

    /**
     * @return string Get name of FormClass for SF2.
     */
    public function getName() {
        return static::$sFormName;
    }

    /**
     * Add form inputs. Rewrite this in form class.
     * @param FormBuilderInterface $oBuilder
     * @param array $aOptions Form options.
     */
    public function buildForm(FormBuilderInterface $oBuilder, array $aOptions) {
        throw new \Exception("Form class " . __class__ . " needs a buildForm method!");
    }

    /**
     * Configure options. Rewrite this in form class.
     * @param OptionsResolver $oResolver
     */
    public function configureOptions(OptionsResolver $oResolver) {
        $oResolver->setDefaults([]);
    }

}
