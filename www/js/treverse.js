function process(d){
	var newz[];
	var mediaz[];
	var imagez[];
	var videoz[];
	if(d.hasOwnProperty('message') && d.message.length > 30){
		newz.push({
			'content':d.message,
			'created':d.created_time,
			'media': processMedia(d)
		});
	}
}

function processMedia(d){
	var arr[];
	if(d.hasOwnProperty('attachments') && d.attachments.length > 0){
		if(d.attachments[0].data.subattachments.hasOwnProperty('data') && d.attachments[0].data.subattachments.data.length > 0){
			$.each(d.attachments[0].data.subattachments.data,function(i,att){
				if(att.type=='video'){
					arr['videoz'].push = {
						'vthumb':att.media.image.src,
						'url':att.url,
						'type':2
					}
				}else if(att.type == 'photo'){
					arr['imagez'].push = {
						'url':att.media.image.src,
						'url':att.url,
						'type':1
					}
				}
			});
		}
	}
	return arr;
}


function treverse(data){
	var arr = [];
	var newz=[];
	var mediaz=[];
	var imagez=[];
	var videoz=[];
	
	if(data.type=='photo'){
		if(data.attachments.data[0].hasOwnProperty('subattachments')){
			mediaz = treversePhotoAlbum(data.attachments.data[0].subattachments.data);
		}else{
			mediaz.push(data.attachments.data[0].media.image.src);
		}
		if(data.hasOwnProperty('message')){
			newz.push({
				'content':data.message,
				'created':data.created_time,
				'media': mediaz
			});
		}else{
			imagez.push(data.attachments.data[0].media.image.src);
		}
	}else{
		
	}
	return newz;
}

function treversePhotoAlbum(album){
	var imagez = [];
	$.each(album,function(i,alb){
		imagez.push({
			'title'	: (alb.hasOwnProperty('description')?alb.description:''),
			'type'	: (alb.type=='photo'?1:2),
			'url' 	: alb.media.image.src
		});
	});
	return imagez;
}