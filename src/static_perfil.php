<?php
// 1. get the content Id (here: an Integer) and sanitize it properly
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_SPECIAL_CHARS);
$default_img = filter_input(INPUT_GET, 'default_img', FILTER_SANITIZE_NUMBER_INT);

// 2. get the content from a flat file (or API, or Database, or ...)
$data = json_decode(file_get_contents('https://api.febelink.com/api/auth/obtener-perfil/'.$id));

// 3. return the page
return makePage($data,$default_img); 

function makePage($data,$default_img) {
    $image = $data->user->logo;
    $name  = $data->user->name;
    $description = $data->user->descripcion;
    if(!isset($data->user->logo)){
	$image = "https://api.febelink.com/storage/users/default.png";  
    }elseif(isset($default_img) && $default_img == 1){
	$ch = curl_init($data->user->logo);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, TRUE);
        curl_setopt($ch, CURLOPT_NOBODY, TRUE);
        $data = curl_exec($ch);
        $size = curl_getinfo($ch, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
        curl_close($ch);

 	if(((int) $size) > 300000){
            $image = "https://api.febelink.com/storage/users/default.png";
	}   
    }

    // 0. Add Twitter Conversion Tracking
    $twitter = "
        <!-- Twitter universal website tag code -->
        <script>
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            // Insert Twitter Pixel ID and Standard Event data below
            twq( 'init', 'o6r52' );
            twq( 'track','PageView');
        </script>
        <!-- End Twitter universal website tag code -->";
   
    // 1. get the page
	// 2. generate the HTML with open graph tags
    $html  = '<!doctype html>'.PHP_EOL;
    $html .= '<html>'.PHP_EOL;
    $html .= '<head>'.PHP_EOL;
    $html .= '<meta name="author" content="Javier"/>'.PHP_EOL;
    $html .= '<meta property="og:title" content="'.$name.'"/>'.PHP_EOL;
    $html .= '<meta property="og:description" content="'.$description.'"/>'.PHP_EOL;
    $html .= '<meta property="og:image" content="'.$image.'"/>'.PHP_EOL;
   // $html .= '<meta http-equiv="refresh" content="0;url=https://www.febelink.com/demanda/'.$data->id.'">'.PHP_EOL;
    // $html .= '<meta property="og:url" content="https://www.febelink.com/demanda/'.$data->id.'"/>'.PHP_EOL;
    $html .= '<meta property="og:type" content="article"/>'.PHP_EOL;
    $html .= '<meta property="fb:app_id" content="895023747604792" />'.PHP_EOL;
    $html .= '</head>'.PHP_EOL;
    $html .= '<body>'.$size.' - picture to display '.$image.' Name '.$name.' Description '.$description. $twitter. '</body>'.PHP_EOL;
    $html .= '</html>';
    // 3. return the page
    echo $html;
}
