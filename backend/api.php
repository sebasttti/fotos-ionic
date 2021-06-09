<?php

function textHeaders(){
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type');
    header("Access-Control-Allow-Origin: *");    
}

function printJSON($array){
    header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type');
    header("Access-Control-Allow-Origin: *");    
    header('Content-type:application/json; charset=utf-8');
    echo json_encode($array, JSON_UNESCAPED_UNICODE);
}

if (!isset($_REQUEST['accion'])) {
    echo "Api de la app de fotos de los Ud Ready !!!";
    die;
}

if ($_REQUEST['accion']=="traerImagenes") {

    $dir = 'storage/';
    $storage_path = 'https://stageapi.hmsistemas.net/storage/';
    $files = array();
                        
    $fileList = glob($dir."*");
    
    if (count($fileList) > 0) {
        
        foreach ($fileList as $key => $file) {
            $file= explode("/",$file)[1];
            $file = $storage_path . $file;
            array_push($files, $file);
        }
       
    }

    printJSON($files);

            
}

if ($_REQUEST['accion']=="enviarImagenes") {
           
           $dir = 'storage/';
           $result = array();  
           //ahora agrego los anexos
   
           if (isset($_REQUEST['anexos'])) {
   
               $countfiles = count($_REQUEST['anexos']);
               
               $fileList = glob($dir."*");
                 
               for ($i=0; $i < $countfiles; $i++) {
                   
                   $j = count($fileList) + 1 + $i; 

                   // create an image file
                   $fp = fopen($dir."imagen".$j.".png", "w+");
   
                   // write the data in image file
                   fwrite($fp, base64_decode($_REQUEST['anexos'][$i]));
   
                   // close an open file pointer
                   fclose($fp);
   
               }
   
               $result = array('status' => 'success', 'message'=>'Archivos subidos con exito');
   
           }else{
               $result = array('status' => 'failure', 'message'=>'No existen archivos por agregar');
           }
           
           printJSON($result);
}




?>