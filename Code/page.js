function getDownloadUrl(id, time, sig, quality){	
	return  'http://player.vimeo.com/play_redirect?'
			+ 'clip_id=' + id 
			+ '&sig=' + sig
			+ '&time=' + time
			+ '&quality=' + quality
			+ '&codecs=H264,VP8,VP6&type=moogaloop_local&embed_location='
}

function addLinks(box)
{
	var id = window.location.href.match(/[0-9]+/)
	var time = document.body.innerHTML.match(/\"timestamp\":[0-9]+/)[0].split(':')[1]
	var sig = document.body.innerHTML.match(/\"signature\":\"[a-z0-9]+/)[0].split(':')[1].replace("\"", "")
	var qualities = document.body.innerHTML.match(/h264\":\[[\"a-z,]+/)[0].split('[')[1].split(',');
	
	for(var i in qualities)
	{
		quality = qualities[i].replace(/\"/g, '');
		
		var result = document.createElement('div');
		var link = document.createElement('a');
		
		link.innerText = "Download (" + quality + ")";
		link.href = getDownloadUrl(id, time, sig, quality);
		link.title = "Right click, Save Link As...";
			
		result.appendChild(link);
		result.style.padding = "5px";
		result.style.fontWeight = "bold";
		
		box.appendChild(result);
	}
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
		var box = document.createElement('ul');
		box.id = "downloadLinks";
		box.style.display = "inline-block";
		addLinks(box);
		
		var old = document.getElementsByClassName("file_details")[0];
		if(typeof(old) === 'undefined')
		{
			box.style.position = "fixed";
			box.style.left = "20px";
			box.style.top = "20px";
			box.style.backgroundColor="#BBBBBB";
			box.style.zIndex=1000000;
			
			document.body.appendChild(box);
		} else {
			old.parentElement.insertBefore(box, old.nextSibling);
			
			var toRemove = old.getElementsByClassName("download")[0];
			if(typeof(toRemove) !== 'undefined')
			{
				old.removeChild(toRemove);
			}
			
		}
  });

 