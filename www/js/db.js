var db = localStorage;
var dt = new Date();
var _s;
$(function(){
	if(!isset('settings') || 1==1){
		var settings = {
				server 		: 'http://party.codingsips.com',
				//server 		: 'http://localhost/party',
				party_id 	: 1,
				party_sm 	: 'PTI',
				party_lg 	: 'Pakistan Tehreek e Insaf',
			};
		dbSave('settings',settings);
	}
	_s = dbGet('settings');
	
	 
	
	 
	if(!isset('videos')){
		var videos = [{"vframe":"<iframe src=\"https://www.youtube.com/embed/FE7jQPjLYfk?autoplay=0\" frameborder=\"0\" allowfullscreen></iframe>","title":" \nMy First prank subscribe it","vthumb":"https://external.xx.fbcdn.net/safe_image.php?d=AQCW-fqAte23q9uO&w=720&h=720&url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FFE7jQPjLYfk%2Fmaxresdefault.jpg&cfs=1&_nc_eui2=v1%3AAeF0-IZbOP4mvaNx0odl9ikLEENGfDTBDTk_Mt92gTSn30b0lGhCFty--C4z-aaWGgwo0ov2glWao0jcY30JprCh&_nc_hash=AQCE2DKwW4M926Ak","date":"2017-08-21"}];
		dbSave('videos',videos);
	}
	
	 
	if(!isset('about')){
		var about = 'Coming soon, Connect to internet and restart Application, it will be updated...';
		dbSave('about',about);
	}
});//end ready()

function update_s(key,val){
	_s[key] = val;
	dbSave('settings',_s);
	_s = dbGet('settings');
}

function dbSave(v,data){	
	db.setItem(v,JSON.stringify(data));
}

function dbGet(v){
	var d=db.getItem(v);
	return JSON.parse(d);
}

function isset(v){
	return (db.getItem(v) === null?false:true);
}

function msg(m,c){
	c = c || 'success';
	str = '<div class="alert-wrapper" style="position:fixed;top:55px;width:80%;left:10%;"><div style="display:none;" class="text-center alert alert-';
	str+= c+' alert-dismissable">';
	str+= '<span class="close" data-dismiss="alert" aria-label="close">&times;</span>'+m+'</div></div>';
	$('.alert-wrapper').remove();
	$('body').after(str);
	$('.alert-wrapper .alert').slideDown();
}

function inet(){
	$.ajax({
		url:_s.server+'/api/checknet',
		success:function(r){return true;},
		error:function(a,b){return false;}
	});
}
