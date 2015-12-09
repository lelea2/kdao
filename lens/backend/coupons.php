<?php

define('SOLR_BASEURL', 'http://lens-solr-int-lb/search/');
define('CPR_BASEURL', 'http://varn-int-lb/cpr/');

if(isset($_GET['cid'])) {
    $cid = trim($_GET['cid']);
    $type = isset($_GET['type']) ? trim($_GET['type']) : '';
    getOfferStats($cid, $type);
} else if(isset($_GET['submit']) && $_GET['submit'] == 'search') {
    $query = urlencode(trim($_GET['q']));
    searchOffers($query);
} else {
    $zip = (!empty($_REQUEST['zip'])) ? trim($_REQUEST['zip']) : '';
    getOffers($zip);
}

/**
 * Function to get main page offers info from cpr (gallery view)
 * This returns list of coupons geo+national
 * curl http://insight.coupons.com/cpr/offers/13306/pah,cpc,video
 *
 */
function getOffers($zip) {
    $dataArr = array();
    $offerArr = array();
    $cprUrl = CPR_BASEURL . "offers/13306/pah,video,duet/national";
    // get geo offers for requested zip
    if(!empty($zip)) {
    	$geocprUrl = CPR_BASEURL . "offers/13306/pah,video,duet/geotargeted/$zip";
    	$geoofferData = _curlUtil($geocprUrl);
        $offerArr["zipcode"] = $zip;
    }
    $offerData = _curlUtil($cprUrl);
    //print_r($offerData);
    if(isset($offerData) && isset($offerData['offers'])) {
        $imageUrlPrefix = $offerData['image_url_prefix'];
        foreach ($offerData['offers'] as $offer => $data) {
            $cid = $data['offer']['coupon_id'];
            //Prefix "_" needed to prevent Chrome and IE manipulate JSON response and resorting the order
            $dataArr["_" . $cid] = array("coupon_id" => $data['offer']['coupon_id'],
                                    "type" => _getCouponTypeStr(intval($data['offer']['type'])),
                                    "value" => isset($data['offer']['value']) ? $data['offer']['value'] : 0,
                                    "slot" => isset($data['offer']['slot']) ? $data['offer']['slot'] : 0,
				    "activation_date" => isset($data['offer']['activation_date']) ? strtotime($data['offer']['activation_date']) : 0,
                                    "offer_summary_top" => isset($data['offer']['offer_summary_top']) ? $data['offer']['offer_summary_top'] : "",
                                    "offer_summary_detail" => isset($data['offer']['offer_summary_detail']) ? $data['offer']['offer_summary_detail'] : "",
                                    "brand" => isset($data['offer']['brand']) ? $data['offer']['brand'] : "",
                                    "imgUrl" => $imageUrlPrefix . $data['offer']['image_url_suffix'],
                                    );    
        }
    }
    if(isset($geoofferData) && isset($geoofferData['offers'])) {
        $imageUrlPrefix = $geoofferData['image_url_prefix'];
        foreach ($geoofferData['offers'] as $offer => $data) {
            $cid = $data['offer']['coupon_id'];
            if (empty($dataArr[$cid])) {
                //Prefix "_" needed to prevent Chrome and IE manipulate JSON response and resorting the order
                $dataArr["_" . $cid] = array("coupon_id" => $data['offer']['coupon_id'],
                                    "type" => _getCouponTypeStr(intval($data['offer']['type'])),
                                    "value" => isset($data['offer']['value']) ? $data['offer']['value'] : 0,
                                    "slot" => isset($data['offer']['slot']) ? $data['offer']['slot'] : 0,
				    "activation_date" => isset($data['offer']['activation_date']) ? strtotime($data['offer']['activation_date']) : 0,
                                    "offer_summary_top" => isset($data['offer']['offer_summary_top']) ? $data['offer']['offer_summary_top'] : "",
                                    "offer_summary_detail" => isset($data['offer']['offer_summary_detail']) ? $data['offer']['offer_summary_detail'] : "",
                                    "brand" => isset($data['offer']['brand']) ? $data['offer']['brand'] : "",
                                    "imgUrl" => $imageUrlPrefix . $data['offer']['image_url_suffix'],
                                    );
            }
        }
    }
    $dataArr = _sortOffers($dataArr, 'slot');
    $offerArr["offers"] = $dataArr;
    //$dataArr = _sortOffers($dataArr, 'activation_date');
    _generateResponse($offerArr);
}

/**
 * Function to get SERP offers from solr offers collection
 *
 */
function searchOffers($query) {

    $active_dataArr = array();
    $inactive_dataArr = array();
    $offerArr = array();
    $activeCouponNum = 0;

    // check if query is for ocrid or ioid, else a regular search
    if( (preg_match("/^O(0-9)*/i", $query)) || (preg_match("/^SF(0-9)*/i", $query)) ) {

	//Search for OCR or IOid in trackinggrid_daily collection, join it with Offers
    	$offerUrl = SOLR_BASEURL . "offers/select/?q=*:*&" .
             "fq={!join+from%3Dcouponid+to%3Dcouponid+fromIndex%3Dtrackinggrid_daily}ocrid_search:$query%20or%20ioid:$query" .
             "&rows=100&df=couponid&indent=true";
    } else {
        //Search in offers collection
        $offerUrl = SOLR_BASEURL . "offers/select?q=$query&rows=1000&wt=json&indent=true";
        //$offerUrl = SOLR_BASEURL . "offers/select?q=$query&fq=transtype:(0+9+13+15+27)&rows=1000&wt=json&indent=true&";
    }
    $offerData = _curlUtil($offerUrl);
    $offerData = $offerData['response']['docs'];

    if(isset($offerData)) {
        foreach ($offerData as $offer => $data) {
            $cid = $data['couponid'];
            $arr = array("coupon_id" => $data['couponid'],
                         "type" => _getCouponTypeStr(intval($data['transtype'])),
                         "value" => $data['couponvalue'],
                         "endDate" => date("M d, Y", strtotime($data["isoshutoffdate"])),
                         "offer_summary_top" => $data['summary'],
                         "offer_summary_detail" => $data['midlevel'],
                         "brand" => $data['brandname'],
                         "imgUrl" => '',
                         "cxbrandid" => $data['brandname'],
                         "cxbrandname" => $data['cxbrandname']
                         );    
            if (strtotime($data["isoshutoffdate"]) >= strtotime('today')) {
                $active_dataArr["_" . $cid] = $arr;
            } else {
                $inactive_dataArr["_" . $cid] = $arr;
            } 
        }
    }
    $offerArr["offers"] = array_merge($active_dataArr, $inactive_dataArr);
    $offerArr["activeCount"] = count($active_dataArr);
    $offerArr["inactiveCount"] = count($inactive_dataArr);
    _generateResponse($offerArr);
}

/**
 * Function to get LENS stats for a cid
 *
 */
function getOfferStats($cid, $type = 'all') {
    switch ($type) {
    	case 'key':
            _generateResponse(_getKeyStats($cid));
            break;
    	case 'trends':
	    _generateResponse(_getTrendStats($cid));
            break;
    	case 'catanly':
            break;
    	default: 
	    _generateResponse(array_merge(_getKeyStats($cid), _getTrendStats($cid)));
    }
}

/**
 * Helper function to get key-stats for an offer
 *
 */
function _getKeyStats($cid) {

    $dataArr = array();

    // get offer info/attributes data from offers feed
    $offerInfoUrl = SOLR_BASEURL . "offers/select?q=*:*&fq=couponid:$cid&rows=1&wt=json&indent=true&" . 
                    "fl=transtype,cxbrandid,printlimit,brandname,catdescl1_exact,catdescl2_exact,catdescl3_exact,couponid,isoactivedate,isoshutoffdate,isoexpirydate";
    $offerData = _curlUtil($offerInfoUrl);
    $offerData = $offerData['response']['docs'][0];
    $today = strtotime("today");
    $shutoffdate = strtotime($offerData['isoshutoffdate']);
    //print_r($offerData);
    $dataArr["offerInfo"] = array("cid" => $offerData['couponid'],
                                  "type" => _getCouponTypeStr(intval($offerData['transtype'])),
                                  "startDate" => date("M d, Y", strtotime($offerData['isoactivedate'])),
                                  "endDate" => date("M d, Y", $shutoffdate),
                                  "expDate" => date("M d, Y", strtotime($offerData['isoexpirydate'])),
                                  "totalDays" => floor((abs($shutoffdate - strtotime($offerData['isoactivedate']))) / (60*60*24)) + 1,
                                  "remainDays" => ($shutoffdate > $today) ? floor((abs($today - $shutoffdate)) / (60*60*24)) : 0,
                                  "catdescl1" => $offerData['catdescl1_exact'],
                                  "catdescl2" => $offerData['catdescl2_exact'],
                                  "catdescl3" => $offerData['catdescl3_exact'],
                                  "activationLimit" => $offerData['printlimit'],
                                  "actLimitPct" => 0,
                                  "brand" => $offerData['brandname']);

    $printLimit = $offerData['printlimit'];

    // get offer tracking grid details like ocrid, ioid and latest velocity value
   // $tgInfoUrl = SOLR_BASEURL . "trackinggrid_daily/select?q=*:*&fq=couponid:$cid&rows=1&wt=json&indent=true&fl=ioid,ocrid,ocrid_search,campaignid&stats=true&stats.field=velocity";
    $tgInfoUrl = SOLR_BASEURL . "trackinggrid_daily/select?q=*:*&fq=couponid:$cid&rows=1&wt=json&indent=true&fl=ioid,ocrid,ocrid_search,campaignid,velocity&sort=adddate+desc";

    $tgResp = _curlUtil($tgInfoUrl);
    $tgData = $tgResp['response']['docs'][0];
    $dataArr["offerInfo"]["ioId"] = $tgData['ioid'];
    $dataArr["offerInfo"]["ocrId"] = $tgData['ocrid'];
    $dataArr["offerInfo"]["campaignId"] = $tgData['campaignid'];
   
    $dataArr["perfInfo"]["velocity"] = $tgData['velocity'];

    // get Activations values from aggrofferperf feed
    $activUrl = SOLR_BASEURL . "aggrofferperf/select?q=*:*&fq=couponid:$cid&rows=1&fl=activations&wt=json&indent=true";

    $aggrData = _curlUtil($activUrl);
    $aggrData = $aggrData['response']['docs'][0];
    $dataArr["perfInfo"]['aggrActivations'] = round($aggrData["activations"], 1);
    $dataArr["offerInfo"]["actLimitPct"] = round(100 - (($dataArr["perfInfo"]['aggrActivations'] / $printLimit) *100), 1);

    // get aggrAvgPage and CTR values from offerperf feed
    $avgPageUrl = SOLR_BASEURL . "offerperf/select?q=*:*&fq=couponid:$cid&rows=1&fl=aggravgpage,ctr,totalviews,totalclips&wt=json&indent=true";

    $avgPageData = _curlUtil($avgPageUrl);
    $avgPageData = $avgPageData['response']['docs'][0];
    $dataArr["perfInfo"]['aggrAvgPage'] = round($avgPageData["aggravgpage"], 1);
    $dataArr["perfInfo"]["ctr"] = round($avgPageData["ctr"] * 100, 1);
   
    // get solr last modified timestamp  
    $dataArr["lastModified"] = _getLastModifiedTs('offers');

    return array('keyStats' => $dataArr);
}

/**
 * Helper function to get trend analyses stats for an offer
 *
 */
function _getTrendStats($cid) {
    $dataArr = array();

    // get daily offerperf stats
    $dailyStatsUrl = SOLR_BASEURL . "offerperf_daily/select?q=*:*&fq=couponid:$cid&wt=json&indent=true&fl=adddate,activations,aggravgpage,ctr&sort=adddate+asc";
    $dailyData = _curlUtil($dailyStatsUrl);
    $dailyData = $dailyData['response']['docs'];
    foreach($dailyData as $k=>$d) {
	// truncate date from solr to 'yyyy-mm-dd' to convert it correctly in php
	$dt = date('m/d/y', strtotime(substr($d['adddate'], 0, 10)));
	$startDt = !isset($startDt)? $startDt = $dt : $startDt;
	$endDt = $dt;
	$dataArr['activations'][$dt] = $d['activations'];
	$dataArr['aggravgpage'][$dt] = round($d['aggravgpage'], 1);
	$dataArr['ctr'][$dt] = round($d['ctr']*100, 1);
    }
    // get dates from start to end dates so correct data points are shown on trend charts
    $allDates = _getDatesFromRange($startDt, $endDt);
    $xAxisLabels = _getXAxisLabels($allDates);
    // set data to 0 where no daily data is available for that date
    foreach($allDates as $d) {
	$dt = str_replace('/', '.', $d);
	if(array_key_exists($d, $dataArr['activations'])) {
	    $fullDataArr['activations'][$dt] = array('val' => $dataArr['activations'][$d]);
	    $fullDataArr['aggravgpage'][$dt] = array('val' => $dataArr['aggravgpage'][$d]);
	    $fullDataArr['ctr'][$dt] = array('val' => $dataArr['ctr'][$d]);
	} else {
	    $fullDataArr['activations'][$dt] = $fullDataArr['aggravgpage'][$dt] = $fullDataArr['ctr'][$dt] = array('val' => null);
	}
        if(in_array($d, $xAxisLabels)) {
	    $fullDataArr['activations'][$dt]['showLabel'] = $fullDataArr['aggravgpage'][$dt]['showLabel'] = $fullDataArr['ctr'][$dt]['showLabel'] = 1;
        }
    }
    unset($startDt);
    unset($endDt);
    $dataArr = $fullDataArr;

    // get daily velocity for an offer from trackinggrid_daily feed 
    $tgInfoUrl = SOLR_BASEURL . "trackinggrid_daily/select?q=*:*&fq=couponid:$cid&wt=json&indent=true&fl=adddate,velocity&sort=adddate+asc";
    $tgData = _curlUtil($tgInfoUrl);
    $tgData = $tgData['response']['docs'];
    foreach($tgData as $k=>$d) {
	// truncate date from solr to 'yyyy-mm-dd' to convert it correctly in php
        $dt = date('m/d/y', strtotime(substr($d['adddate'], 0, 10)));
	$startDt = !isset($startDt)? $startDt = $dt : $startDt;
        $endDt = $dt;
        $dataArr['velocity'][$dt] = array('val' => round($d['velocity'], 1));
    }
    // get dates from start to end dates so correct data points are shown on trend charts
    $allDates = _getDatesFromRange($startDt, $endDt);
    $xAxisLabels = _getXAxisLabels($allDates);
    // set data to 0 where no daily data is available for that date
    foreach($allDates as $d) {
	$dt = str_replace('/', '.', $d);
	$fullDataArr['velocity'][$dt] = (array_key_exists($d, $dataArr['velocity'])) ? $dataArr['velocity'][$d] : array('val' => null, 'showLable' => 0);
	if(in_array($d, $xAxisLabels)) {
	    $fullDataArr['velocity'][$dt]['showLabel'] = 1;
	}
    }
    $dataArr = $fullDataArr;

    // get solr last modified timestamp for trends data 
    $dataArr["lastModified"] = _getLastModifiedTs('offerperf_daily');

    return array('trendStats' => $dataArr);
}

/**
 * Helper function to generate json response
 *
 */
function _generateResponse($data) {
    header('Content-type: text/json');
    header('Content-type: application/json'); 
    $json = (json_encode($data));
    //covert to jsonp
    echo "define(" . $json . ");";
    exit(0);
}

/**
 * Helper function to sort coupons on a key
 *
 */
function _sortOffers($data, $key) {
    // Create a hash map of the form array ($couponId => [$value, $index])
    $valueHashMap = array();
    $ind = 0;
    foreach ($data as $couponId => $coupon) {
       $valueHashMap[$couponId] = array($coupon[$key],$ind++);
    }
    //Sort hash map by values in reverse (descending) order
    uasort($valueHashMap, 'cmpAsc');
    //Create sorted coupon entity array
    $sortedKeys = array_keys($valueHashMap);
    $sortedCoupons = array();
    foreach ($sortedKeys as $couponId) {
       $sortedCoupons[$couponId] = $data[$couponId];
    }
    return $sortedCoupons;
}

/**
 * Compare array elements in custom sort. Each element is an array with 2 values.
 * If a[0] > b[0], then b should precede a in sorted array
 * If a[0] == b[0], then whichever of a[1] and b[1] is smaller, goes first.
 * @param array $a
 * @param array $b
 * @return int {1 | 0 | -1}
 */
function cmpAsc($a,$b) {
   if ($a == $b){
       return 0;
   } elseif ($a[0] > $b[0]) {
       return 1;
   } elseif ($a[0] < $b[0]) {
       return -1;
   } else {
       return ($a[1] < $b[1]) ? 1 : -1;
   }
}

/**
 * Helper function for curl
 *
 */
function _curlUtil($url) {
    // create curl resource
    $ch = curl_init();

    //echo $url;
    // set url
    curl_setopt($ch, CURLOPT_URL, $url);
    //return the transfer as a string
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    // $output contains the output string
    $output = curl_exec($ch);

    // Check if any error occurred
    if(!curl_errno($ch)) {
        $info = curl_getinfo($ch);
        //echo 'Took ' . $info['total_time'] . ' seconds to send a request to ' . $info['url'];
    }

    // close curl resource to free up system resources
    curl_close($ch);

    return json_decode($output, true);
}

/**
 * Helper function to get lastModified timestamp from Solr
 * @param string $solrColl
 * @return string formatted datetime for last modified solr timestamp
 */
function _getLastModifiedTs($solrColl) {
    $lukeUrl = SOLR_BASEURL . "$solrColl/admin/luke?&wt=json&fl=index";

    $adminData = _curlUtil($lukeUrl);
    $lastMfTs = $adminData['index']['lastModified'];

    return date("M d, Y H:i", strtotime($lastMfTs));
}


/**
 * Helper function to convert int coupon type to string type
 * @param int $type
 * @return string coupontype string. 
 */
function _getCouponTypeStr($type) {
    $transTypeNames = array(
	-1 => 'Brick',
	0  => 'PAH', 
	8  => 'Duet Prelude', 
	9  => 'Duet Offer',
	13 => 'Video Offer',
	14 => 'CPA Pod',
	16 => 'Mobile',
	15 => 'CPC Pod',
	17 => 'Single on-request',
	18 => 'Duet on-request',
	19 => 'Video on-request',
	20 => 'CPC on-request',
	21 => 'CPA on-request',
	22 => 'Mail Order',
	23 => 'Local',
	26 => 'Save-to-Card',
	27 => 'Save-to-Card Printable',
	30 => 'Restaurant.com',
	31 => 'Universal',
	32 => 'CLOE',
	33 => 'Digital conversion'
    );
    return ($transTypeNames[$type]) ? : ''; 
}

/**
 * Helper function to return all dates between a start-end date range
 * @param string first start date in a valid date format
 * @param string last end date in a valid date format
 * @param string step 
 * @param string format date format
 * @return array array of valid dates from start date to end date
 */
function _getDatesFromRange($first, $last, $step = '+1 day', $format = 'm/d/y' ) { 
//    $first = str_replace('.', '/', $first);
  //  $last = str_replace('.', '/', $last);
    $dates = array();
    $current = strtotime($first);
    $last = strtotime($last);

    while( $current <= $last ) { 

        $dates[] = date($format, $current);
        $current = strtotime($step, $current);
    }
    return $dates;
}

/**
 * Helper function to return a flag for each date in passed in array to decide if it needs to be shown as label on x axis or no.
 * Rules: 
 *  1) Always show no more than 7 date points
 *  2) If # of points to display on the x-axis is > 2 months but <= 7months, then show only beginning of months. This might result in smaller number of dates on x-axis.
 *  3) If # of points to display on x-axis is >=8 months then evenly space out 7 date stamps. Doesn’t matter if it shows the beginning of the month or not.
 *  4) If # of points to display on x-axis is <=2 months then show only Tuesdays on the x-axis.
 * @param array $data input array with keys with dates 
 * @return array $data updated with flag added to be displayed as label on x axis
 */
function _getXAxisLabels($data) {
    $num = count($data);
    if($num <= 7) { 
	return $data;
    } else {
        for($i=0; $i<$num; $i=$i+($num/7)) {
            $retDates[] = $data[$i];
        }
        return $retDates;
    }
    
/*    $numWks = $num/7;
    $numMths = $numWks/4;
    if($numMths >= 8 ) {
	$key = 'mod7';
    } elseif ($numMths > 2 && $numMths <= 7) {
	$key = 'monthbegin';
    } elseif ($numMths <= 2) {
	$key = 'tues';
    } else {
	return $data;
    }
    $retDates = array(); 
    switch($key) {
	case 'mod7':
	    for($i=0; $i<$num; $i=$i+($num/7)) {
		$retDates[] = $data[$i]; 
	    }
	    return $retDates;
	    break; 
	case 'monthbegin': 
            foreach($data as $k=>$v) {
		if(date('d', strtotime($v)) == '01') {  $retDates[] = $v; }
            }
            return $retDates;
            break;
	case 'tues': 
            foreach($data as $k=>$v) {
		if(date('D', strtotime($v)) == 'Tue') { $retDates[] = $v; }
            }
            return $retDates;
            break;
	default : return $data;
    }
*/
}
?>
