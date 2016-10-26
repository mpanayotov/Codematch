function uploadCarImage() {
			var photo = $("#car_image")[0];
			var file = photo.files[0];
			//var data = new FormData(file);
			var formdata = new FormData();
   			formdata.append('car_image', file);
			$.ajax({
				url : "/uploadCarImage/",
				type : 'POST', 
				xhrFields : {
					withCredentials : true
				},
				headers : {
					'X-Requested-With' : 'XMLHttpRequest'
				},
				data:formdata,
				contentType: false,
            	processData: false,
				success : function(data) {
					if(data=="Image_uploaded")
						alert("Успешно качихте снимка на автомобила си.");
				},
				error : function(error) {
					console.log("ERROR:", error);
				},
			});
		}