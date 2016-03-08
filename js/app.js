//localStorage.setItem("contacts","1;Maria;@mariagal;maria@mail.com;+573103000000;Anywhere;0");
//localStorage.setItem("favs","1");
//console.log(localStorage.getItem("favs"));
//localStorage.removeItem("contacts");
//localStorage.removeItem("favs");
$(document).ready(function(){
    adrbook.listContacts();
    adrbook.listFavorites();
});
var adrbook = (function() {
    var dmodal = $(".bgmodal");
    var listcontacts = "";
    var listfavs = localStorage.getItem("favs");
    var scontact = function(id) {
        var cnt = {
            id:0,nombre:"",twitter:"",email:"",telefono:"",
            direccion:"",funcion:"createContact()",modify:false,startype:"textlgray"
        };
        if(listcontacts){
            var lst = listcontacts.split("|");
            for(i=0;i<lst.length;i++){
                var elem = lst[i].split(";");
                if(id==elem[0]){
                    var isfavo = false;
                    cnt.id = elem[0];
                    cnt.nombre = elem[1];
                    cnt.twitter = elem[2];
                    cnt.email = elem[3];
                    cnt.telefono = elem[4];
                    cnt.direccion = elem[5];
					cnt.funcion = "updateContact("+elem[0]+")";
                    cnt.modify = true;
                    cnt.startype = isfavo?"textyellow":"textlgray";
				}
			}
        }
        return cnt;
    }
    var smodal = function(id) {
        var usr = scontact(id);
        omodal(usr);
    };
    var omodal = function(datos) {
        console.log(datos);
        $(".wmodal").html("");
        var source = "";
        var contx = "";
        if(typeof datos === "undefined"){
            source = $("#wmodal-template-create").html();
            contx = {
                id:0,nombre:"",twitter:"",email:"",telefono:"",
                direccion:"",funcion:"createContact()",modify:false,startype:"textlgray"
            };
        }
        else{
            source = $("#wmodal-template").html();
            contx = datos;
        }
        var template = Handlebars.compile(source);
        $(".wmodal").html(template(contx));
        dmodal.show();
    };
    var cmodal = function() {
        dmodal.hide();
    };
    var afav = function(id,elem){
        var flist = "";
        var nuevo = false;
        var element = $(elem);
        if(element.hasClass("textyellow")){
            element.removeClass("textyellow");
            element.addClass("textlgray");
            var afavs = favs.split("|");
			$.each(afavs,function(i2,v){
				if(id!=v){
					if(i2>0) flist += "|";
					flist += v;
				}
			});
            if(flist=="") localStorage.removeItem("favs");
            else localStorage.setItem("favs",flist);
        }
        else{
            if(!listfavs){
                listfavs = id;
                nuevo = true;
            }
            else listfavs += "|"+id;
            localStorage.setItem("favs",listfavs);
            element.addClass("textyellow");
            var divcnt = $(".maincontent__favorites .contact-list");
            var ctmpl = $("#contact-template");
            if(nuevo) divcnt.html("");
            var source = ctmpl.html();
            var template = Handlebars.compile(source);
            var cnt = scontact(id);
            divcnt.append(template(cnt));
            alert("Contacto agregado a favoritos!");
        }
    };
    var isfv = function(id){
        var isf = false;
        var listfvs = listfavs;
        if(listfvs){
            var lst = (listfvs+"").split("|");
            for(var i=0;i<lst.length;i++){
                if(id==lst[i]) isf = true;
            }
        }
        return isf;
    };
    var ccontact = function() {
        var nxtid = cantcontacts() + 1;
        var lc = "";
        var nombre = $.trim($("#nombre").val());
        var twitter = $.trim($("#twitter").val());
        var email = $.trim($("#email").val());
        var telefono = $.trim($("#telefono").val());
        var direccion = $.trim($("#direccion").val());
        if(listcontacts!="" && listcontacts!=null){
            lc = listcontacts;
            lc += "|";
        }
        lc += nxtid+";"+nombre+";"+twitter+";"+email+";"+telefono+";"+direccion;
        listcontacts = lc;
        localStorage.setItem("contacts",lc);
        alert("Contacto agregado!");
        cmodal();
        var cnt = {
            id:nxtid,nombre:nombre,twitter:twitter,
            email:email,telefono:telefono,direccion:direccion,
            funcion:"editContact("+nxtid+")",modify:true,startype:"textlgray"
        };
        var divcnt = $(".maincontent__contacts .contact-list");
        var ctmpl = $("#contact-template");
        if(cnt.id==1) divcnt.html("");
        var source = ctmpl.html();
        var template = Handlebars.compile(source);
        divcnt.append(template(cnt));
    };
    var econtact = function(id) {
        var nombre = $.trim($("#nombre").val());
        var twitter = $.trim($("#twitter").val());
        var email = $.trim($("#email").val());
        var telefono = $.trim($("#telefono").val());
        var direccion = $.trim($("#direccion").val());
        var alcont = listcontacts.split("|");
        var flist = "";
        $.each(alcont,function(i2,v){
            var vx = v.split(";");
            if(i2>0) flist += "|";
            if(id!=vx[0]) flist += v;
            else flist += id+";"+nombre+";"+twitter+";"+email+";"+telefono+";"+direccion;
        });
        if(flist=="") localStorage.removeItem("contacts");
        else {
            listcontacts = flist;
            localStorage.setItem("contacts",flist);
        }
        alert("Datos actualizados");
        cmodal();
    };
    var cantcontacts = function(){
        var cant = 0;
        if(listcontacts){
            var lst = listcontacts.split("|");
            cant = lst.length;
        }
        return cant;
    };
    var lcontacts = function() {
        var divcnt = $(".maincontent__contacts .contact-list");
        var ctmpl = $("#contact-template");
        divcnt.html("");
        var cnt = {id:0,nombre:"",twitter:"",email:"",telefono:"",direccion:"",funcion:"createContact()",modify:false,startype:"textlgray"};
        listcontacts = localStorage.getItem("contacts");
        if(listcontacts){
            var lst = listcontacts.split("|");
            var source = ctmpl.html();
            var template = Handlebars.compile(source);
            for(var i=0;i<lst.length;i++){
                var elem = lst[i].split(";");
                var isfavo = isfv(elem[0]);
                cnt.id = elem[0];
                cnt.nombre = elem[1];
                cnt.twitter = elem[2];
                cnt.email = elem[3];
                cnt.telefono = elem[4];
                cnt.direccion = elem[5];
                cnt.funcion = "editContact("+elem[0]+")";
                cnt.modify = true;
                cnt.startype = isfavo?"textyellow":"textlgray";
                divcnt.append(template(cnt));
			}
        }
        else {
            var source = $("#nocontacts-template").html();
            var template = Handlebars.compile(source);
            divcnt.html(template());
        }
    };
    var listfavorites = function() {
        var divcnt = $(".maincontent__favorites .contact-list");
        var ctmpl = $("#contact-template");
        divcnt.html("");
        if(listfavs) {
            var lst = listfavs.split("|");
            var source = ctmpl.html();
            var template = Handlebars.compile(source);
            for(var i=0;i<lst.length;i++){
                var cnt = scontact(lst[i]);
                divcnt.append(template(cnt));
			}
        }
        else{
            var source = $("#nocontacts-template").html();
            var template = Handlebars.compile(source);
            divcnt.html(template());
        }
    };
    return{
        addFavorite: afav,
        editContact: smodal,
        openModal: omodal,
        closeModal: cmodal,
        createContact: ccontact,
        updateContact: econtact,
        listContacts: lcontacts,
        listFavorites: listfavorites
    };
})();
