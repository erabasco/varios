/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function crearConexion(){
    var objeto;
    //comprobar el navegador que utiliza el cliente
    if(window.XMLHttpRequest){
        objeto=new XMLHttpRequest();
    }else if(window.ActiveXObject){
        try{
            objeto=new ActiveXObject("MSXML2.XMLHTTP");
        }catch (e){
            objeto=new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return objeto;
}

