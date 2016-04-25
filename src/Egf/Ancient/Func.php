<?php

namespace Egf\Ancient;

/**
 * Static class with some common functions.
 * @author attila kovacs
 * @since  2015.10.09.
 */
class Func {

    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Numeric                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Inspect variable. If it's a natural number then return true... false otherwise.
     * @param mixed $xVar       The variable to check.
     * @param bool  $bTypeCheck Decide to do type check or not. Default: FALSE.
     * @return bool True if it's a natural number.
     */
    public static function isNaturalNumber($xVar, $bTypeCheck = FALSE) {
        if ($bTypeCheck) {
            return (is_numeric($xVar) && !is_float($xVar) && (intval($xVar) > 0) && (intval($xVar) === $xVar));
        }
        else {
            return (is_integer(intval($xVar)) && $xVar == intval($xVar) && (intval($xVar) > 0));
        }
    }

    /**
     * Generate a random Float number.
     * @param float $min      The minimum value.
     * @param float $max      The maximum value.
     * @param int   $decimals The length of result.
     * @return float Random float number.
     */
    public static function getRandomFloat($min, $max, $decimals = 0) {
        $scale = pow(10, $decimals);

        return mt_rand($min * $scale, $max * $scale) / $scale;
    }


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * String                                                     **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Check if the date is a valid or not. It checks only if the DateTime object can be created from this string. For example it doesn't throw error on 30th of February.
     * @param string $sDateString String which is a date possibly.
     * @return bool True if the string is valid.
     */
    public static function isDateTimeStringValid($sDateString) {
        return (strlen($sDateString) >= 6 ? (bool)strtotime($sDateString) : FALSE);
    }

    /**
     * Generate a random string.
     * @param   int    $iLength Length of string. Default: 8.
     * @param   string $sType   Type of character pool. Default: alnum. Options: alnum, alpha, hexdec, numeric, nozero, distinct.
     * @return  string Random string.
     */
    public static function getRandomString($iLength = 8, $sType = 'alnum') {
        if ($sType == 'alnum') {
            $sPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        else if ($sType == 'alpha') {
            $sPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        else if ($sType == 'hexdec') {
            $sPool = '0123456789abcdef';
        }
        else if ($sType == 'numeric') {
            $sPool = '0123456789';
        }
        else if ($sType == 'nozero') {
            $sPool = '123456789';
        }
        else if ($sType == 'distinct') {
            $sPool = '2345679ACDEFHJKLMNPRSTUVWXYZ';
        }
        else {
            throw new \Exception("Invalid type for getRandomString function.");
        }

        // Split the pool into an array of characters //
        $arPool = str_split($sPool, 1);
        $sResult = '';

        // Select a random character from the pool and add it to the string //
        for ($i = 0; $i < $iLength; $i++) {
            $sResult .= $arPool[mt_rand(0, count($arPool) - 1)];
        }

        // Make sure alnum strings contain at least one letter and one digit //
        if ($sType === 'alnum' AND $iLength > 1) {
            // Add a random digit //
            if (ctype_alpha($sResult)) {
                $sResult[mt_rand(0, $iLength - 1)] = chr(mt_rand(48, 57));
            }
            // Add a random letter //
            else if (ctype_digit($sResult)) {
                $sResult[mt_rand(0, $iLength - 1)] = chr(mt_rand(65, 90));
            }
        }

        return $sResult;
    }

    /**
     * From the given string, it gives back placeholders. String between {{ and }}) in an array.
     * @param string $sInput         The input string.
     * @param bool   $bCutDelimiters If it's true, it cut down the {{ and }} characters from the results. Default: FALSE.
     * @return array Array of strings between {{ and }} characters.
     */
    public static function getPlaceholdersFromString($sInput, $bCutDelimiters = FALSE) {
        if (is_string($sInput)) {
            $iCnt = preg_match_all("/\{\{(.*?)\}\}/", $sInput, $aResults);
            if (is_numeric($iCnt) and is_array($aResults)) {
                if ($bCutDelimiters) {
                    $aCutResult = [];
                    foreach ($aResults[1] as $sSlug) {
                        $aCutResult[] = trim($sSlug);
                    }

                    return $aCutResult;
                }
                else {
                    return $aResults[0];
                }
            }
        }

        return [];
    }

    /**
     * It replace the dynamic parameters by the value that should be there.. Dynamic parameters are for example: "{{ id }}", "{{ status->id }}".
     * @param string $sToReplace The string to extend with values. It has to be translated by the SF2 service first if it's needed.
     * @param object $enObject The (possibly) entity object to get the data from.
     * @return string The same string but the dynamic parameters were replaced by the data from the entity object.
     */
    public static function extendStringWithDynamicParameters($sToReplace, $enObject) {
        $aPlaceholders = static::getPlaceholdersFromString($sToReplace);
        $aValues = [];
        // Iterate the dynamic parameters.
        foreach($aPlaceholders as $sKey) {
            // Trim the string.
            $sTrimmedKey = trim($sKey, "{ }");
            // If the entity has a method like this or it's a property chain , then load the data.
            if (static::hasEntityGetField($enObject, $sTrimmedKey) or strpos($sTrimmedKey, "->") !== FALSE) {
                $aValues[$sKey] = static::entityGetField($enObject, $sTrimmedKey);
            }
            // Method wasn't found and it's not a chain of properties.
            else {
                throw new \Exception("Entity doesn't have the asked method! \n Class: " . get_class($enObject) . " \n Method: get" . ucfirst($sTrimmedKey) . "() \n\n");
            }
        }
        // Update the string with the data from the parameter array.
        foreach ($aValues as $sKey => $sVal) {
            $sToReplace = str_replace($sKey, $sVal, $sToReplace);
        }

        return $sToReplace;
    }


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Array                                                      **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Check for in_array but don't throw an error if it's not an array.
     * @param array $aHaystack  The array that can have the searched element.
     * @param mixed $xNeedle    The searched element of haystack array.
     * @param bool  $bTypeCheck Decide to do type check. Default: FALSE.
     * @return bool True if the element was found in array.
     */
    public static function inArray($aHaystack, $xNeedle, $bTypeCheck = FALSE) {
        if (is_array($aHaystack)) {
            foreach ($aHaystack as $xItem) {
                if (($bTypeCheck && $xItem === $xNeedle) || (!$bTypeCheck && $xItem == $xNeedle)) {
                    return TRUE;
                }
            }
        }

        return FALSE;
    }

    /**
     * Check a multi dimensional array for a value. If it's founded, then return true, else return false.
     * @param array  $aHaystack Inspected array.
     * @param string $xNeedle   Searched value.
     * @return boolean True if it's found.
     */
    public static function inArrayMulti($aHaystack, $xNeedle) {
        if (is_array($aHaystack)) {
            foreach ($aHaystack as $xItem) {
                if (is_array($xItem)) {
                    if (static::inArrayMulti($xNeedle, $xItem)) {
                        return TRUE;
                    }
                }
                else if ($xItem == $xNeedle) {
                    return TRUE;
                }
            }
        }

        return FALSE;
    }

    /**
     * Sort a multi dimensional array by an index.
     * @param array   $array         Array what need a sort.
     * @param string  $index         Sort by index.
     * @param string  $order         Direction of sorting. Default: ASC. Options: ASC, DESC.
     * @param boolean $natSort       Is natural sorting. Default: FALSE.
     * @param boolean $caseSensitive Is case sensitive. Default: FALSE.
     * @return array Sorted array.
     */
    public static function sortArrayMulti($array, $index, $order = 'ASC', $natSort = FALSE, $caseSensitive = FALSE) {
        $order = strtoupper($order);
        $sorted = array();

        if (is_array($array) && count($array) > 0) {
            foreach (array_keys($array) as $key) {
                $temp[$key] = $array[$key][$index];
            }

            if ( !$natSort) {
                if (strtoupper($order) == 'ASC') {
                    asort($temp);
                }
                else {
                    arsort($temp);
                }
            }
            else {
                if ($caseSensitive === TRUE) {
                    natsort($temp);
                }
                else {
                    natcasesort($temp);
                }
                if (strtoupper($order) != 'ASC') {
                    $temp = array_reverse($temp, TRUE);
                }
            }

            foreach (array_keys($temp) as $key) {
                if (is_numeric($key)) {
                    $sorted[] = $array[$key];
                }
                else {
                    $sorted[$key] = $array[$key];
                }
            }

            return $sorted;
        }
        else {
            return array();
        }
    }

    /**
     * Removes element from array by its key.
     * @param $array {array} The array.
     * @param $key   {mixed} The key of the element.
     * @return array The array without element with key.
     */
    public static function removeFromArrayByKey($array, $key) {
        unset($array[$key]);

        return $array;
    }

    /**
     * Removes element from array by uts value.
     * @param $array   {array} The array.
     * @param $element {mixed} The value of the element.
     * @return array The array without element with value.
     */
    public static function removeFromArrayByValue($array, $element) {
        return array_diff($array, array($element));
    }


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Object                                                     **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Transform entities into JSON.
     * $this->_getSerializer()->normalize($enObject, 'json');
     * $this->_getSerializer()->normalize($aenObjects, 'json');
     * @return Serializer
     * @url http://symfony.com/doc/current/components/serializer.html
     */
    public static function getSerializer() {
        $oClassMetadataFactory = new \Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory(new \Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader(new \Doctrine\Common\Annotations\AnnotationReader()));
        $oNormalizer = (new \Symfony\Component\Serializer\Normalizer\ObjectNormalizer($oClassMetadataFactory))
            ->setCircularReferenceLimit(0)
            ->setCircularReferenceHandler(function ($enObject) {
                return (method_exists($enObject, "getId") ? $enObject->getId() : "object-without-id");
            });

        return new \Symfony\Component\Serializer\Serializer([$oNormalizer], [new \Symfony\Component\Serializer\Encoder\JsonEncoder()]);
    }

    /**
     * Call a method of an object by string of the method.
     * @param object $oObject     Object.
     * @param string $sMethod     Method of object.
     * @param array  $aParameters [Default: null] Parameters of method.
     * @return mixed Result of the method.
     */
    public static function callClassMethod($oObject, $sMethod, $aParameters = array()) {
        if (method_exists($oObject, $sMethod)) {
            return call_user_func_array(array($oObject, $sMethod), (is_array($aParameters) ? $aParameters : array($aParameters)));
        }
        else {
            throw new \Exception("Not existing method on object! \n Class: " . get_class($oObject) . " \n Method: " . $sMethod . " \n\n ");
        }
    }

    /**
     * Decide if the entity has a get method for the property.
     * @param object $enObject  The entity object to check.
     * @param string $sProperty The property that should exist.
     * @return bool True if the entity has get field for property.
     */
    public static function hasEntitySetField($enObject, $sProperty) {
        return method_exists($enObject, "set" . ucfirst($sProperty));
    }

    /**
     * Call a set method of entity by string of dataMember.
     * @param   object $entity     Entity object.
     * @param   string $method     DataMember of entity.
     * @param   array  $parameters [Default: null] Parameters of set method.
     * @return  mixed                              Result of set method.
     */
    public static function entitySetField($entity, $method, $parameters = NULL) {
        $entitySetMethod = "set" . ucfirst($method);

        return static::callClassMethod($entity, $entitySetMethod, $parameters);
    }

    /**
     * Decide if the entity has a get method for the property.
     * @param object $enObject  The entity object to check.
     * @param string $sProperty The property that should exist.
     * @return bool True if the entity has get field for property.
     */
    public static function hasEntityGetField($enObject, $sProperty) {
        return method_exists($enObject, "get" . ucfirst($sProperty));
    }

    /**
     * Call a get method of entity by string of dataMember.
     * @param object $oEntity     Entity object.
     * @param string $sMethod    DataMember of entity. If some words are separated by "->", then it call the properties recursivly.
     * @param array  $parameters [Default: null] Parameters of get method.
     * @return mixed Result of the get method.
     */
    public static function entityGetField($oEntity, $sMethod, $parameters = NULL) {
        // Simple getter.
        if (static::hasEntityGetField($oEntity, $sMethod)) {
            $entityGetMethod = "get" . ucfirst($sMethod);
            if ($parameters) {
                return static::callClassMethod($oEntity, $entityGetMethod, $parameters);
            }
            else {
                return static::callClassMethod($oEntity, $entityGetMethod);
            }
        }
        // If the getter method is a chain (relatedObject->secondRelatedObject->finalAttribute), then it load the data recursively.
        else if (strpos($sMethod, "->") !== FALSE) {
            return static::getPropertyRecursively($oEntity, explode("->", $sMethod));
        }
        else {
            throw new \Exception("Object doesn't have getter! \n Class: " . get_class($oEntity) . " \n Method: get" . ucfirst($sMethod) . " \n\n ");
        }
    }

    /**
     * Check if the given variable is a valid entity object.
     * @param mixed $object The variable to check.
     * @return bool True if it's an entity.
     */
    public static function isEntity($object) {
        return (is_object($object) && method_exists($object, "getId") && static::isNaturalNumber($object->getId()));
    }

    /**
     * Check if the entity is in the ArrayCollection.
     * @param object                             $enEntity          Searched entity.
     * @param \Doctrine\ORM\PersistentCollection $acArrayCollection Search in ArrayCollection
     * @return bool True if entity is in ArrayCollection.
     */
    public static function inArrayCollection($enEntity, \Doctrine\ORM\PersistentCollection $acArrayCollection) {
        if (in_array($enEntity, $acArrayCollection->toArray(), TRUE)) {
            return TRUE;
        }

        return FALSE;
    }

    /**
     * It gives back the entity alias name.
     * @param string $sClass Path to the entity. For example: \Egf\SomeBundle\Entity\Stuff\Things
     * @return string The entity alias. For example: EgfSomeBundle:Stuff\Things
     */
    public static function getEntityAlias($sClass) {
        $sResult = "";
        foreach (explode("\\", $sClass) as $sFragment) {
            // Path to the Entity directory within the Bundle.
            if (strpos($sResult, ":") === FALSE) {
                $sResult .= ($sFragment === "Entity" ? ":" : $sFragment);
            }
            // Subdirectory in Entity or the class name itself.
            else {
                $sResult .= $sFragment . "\\";
            }
        }

        return trim($sResult, "\\");
    }

    /**
     * Recursively iterate on related entities until it get the final data.
     * It's used in static::entityGetField() method.
     * @param object $enObject   The object that will have the next property.
     * @param array  $aFragments The chain of properties listed in an array.
     * @return string The result of property chain.
     */
    private static function getPropertyRecursively($enObject, array $aFragments) {
        // First item in chain.
        $sProperty = array_shift($aFragments);
        // Check if the object has the getter.
        if (static::hasEntityGetField($enObject, $sProperty)) {
            // Load data.
            $xRelated = static::entityGetField($enObject, $sProperty);
            // If it's an object and the chain isn't over, then it loads that data.
            if (is_object($xRelated) and count($aFragments)) {
                return static::getPropertyRecursively($xRelated, $aFragments);
            }
            // Give back the final result.
            else {
                return $xRelated;
            }
        }
        else {
            throw new \Exception("Object doesn't have getter! \n Object: " . get_class($enObject) . " \n Method: get" . ucfirst($sProperty) . " \n\n ");
        }
    }

}
