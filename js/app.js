//window.localStorage.setItem("contacts","1;Maria;@galymaster;+573103000000;Anywhere;maria@mail.com");
//window.localStorage.removeItem("contacts");
//window.localStorage.setItem("favorites","1");
//window.localStorage.removeItem("favorites");
$(document).ready(function(){
    adrbook.listContacts();
    adrbook.listFavorites();
});
var adrbook = (function() {
    var dmodal = $(".bgmodal");
    var datousr = {id:0,nombre:"",twitter:"",email:"",telefono:"",direccion:"",funcion:"createContact()",modify:false,startype:"textlgray"};
    var scontact = function(id) {
        var cnt = {id:0,nombre:"",twitter:"",email:"",telefono:"",direccion:"",funcion:"createContact()",modify:false,startype:"textlgray"};
        var listcontacts = window.localStorage.getItem("contacts");
        if(listcontacts){
            var lst = listcontacts.split("|");
            for(i=0;i<lst.length;i++){
                var elem = lst[i].split(";");
                if(id==elem[0]){
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
        var source = $("#wmodal-template").html();
        var template = Handlebars.compile(source);
        var contx = (typeof datos === "undefined")?datousr:datos;
        $(".wmodal").html(template(contx));
        dmodal.show();
    };
    var cmodal = function() {
        dmodal.hide();
    };
    var afav = function(id){
        var favs = window.localStorage.getItem("favorites");
        favs += "|"+id;
        window.localStorage.removeItem("favorites");
        window.localStorage.setItem("favorites",favs);
    };
    var isfv = function(id) {
        var isfavorite = false;
        var favs = window.localStorage.getItem("favorites");
        var lst = favs.split("|");
        for(i=0;i<lst.length;i++){
            if(id==lst[i]) isfavorite = true;
        }
        return isfavorite;
    }
    var ccontact = function() {
        var nxtid = cantcontacts() + 1;
    };
    var cantcontacts = function() {
        var cant = 0;
        var listcontacts = window.localStorage.getItem("contacts");
        if(listcontacts){
            var lst = listcontacts.split("|");
            cant = lst.length;
        }
        return cant;
    }
    var lcontacts = function() {
        var divcnt = $(".maincontent__contacts .contact-list");
        var ctmpl = $("#contact-template");
        divcnt.html("");
        var cnt = {id:0,nombre:"",twitter:"",email:"",telefono:"",direccion:"",funcion:"createContact()",modify:false,startype:"textlgray"};
        var listcontacts = window.localStorage.getItem("contacts");
        if(listcontacts){
            var lst = listcontacts.split("|");
            for(i=0;i<lst.length;i++){
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
                var source = ctmpl.html();
                var template = Handlebars.compile(source);
                divcnt.append(template(cnt));
			}
        }
        else {
            var source = $("#nocontacts-template").html();
            var template = Handlebars.compile(source);
            divcnt.html(template());
        }
    };
    var lfavs = function() {
        var divcnt = $(".maincontent__favorites .contact-list");
        var listcontacts = window.localStorage.getItem("favorites");
        var ctmpl = $("#contact-template");
        divcnt.html("");
        if (listcontacts) {
            var lst = listcontacts.split("|");
            for(i=0;i<lst.length;i++){
                var cnt = scontact(lst[i]);
                var source = ctmpl.html();
                var template = Handlebars.compile(source);
                divcnt.append(template(cnt));
			}
        }
        else {
            var source = $("#nocontacts-template").html();
            var template = Handlebars.compile(source);
            divcnt.html(template());
        }
    };
    return{
        fav: afav,
        editContact: smodal,
        openModal: omodal,
        closeModal: cmodal,
        createContact: ccontact,
        listContacts: lcontacts,
        listFavorites: lfavs
    };
})();
