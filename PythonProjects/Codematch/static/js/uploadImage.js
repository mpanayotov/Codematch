function uploadCarImage() {
			var photo = $("#car_image")[0];
			var file = photo.files[0];
			//var data = new FormData(file);
			var formdata = new FormData();s
			if (photo.files && photo.files[0]) {
	            var reader = new FileReader();
	            reader.onload = imageIsLoaded;
	            reader.readAsDataURL(photo.files[0]);
        	}
			//$("#imgg").attr("src", photo.value.split("/")[2]);
		}
function imageIsLoaded(e) {
    $('#imgg').attr('src', e.target.result);
};