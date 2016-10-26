function enableApplyFunction(){
	$('.applyButton').on('click', function(event){ 
		    var batch_id = $(this).attr("batch-id");
	        $.ajax({
	                url: "/companyBatchApplication/",
	                type: "POST",
	                xhrFields : {
						withCredentials : true
					},
					headers : {
						'X-Requested-With' : 'XMLHttpRequest'
					},
					data: {
						batch_id:batch_id
					},
	                success: function(data) {
	                	alert("Thank you for applying. Due to high number of companies we'll have to select a few and will notify you if you are approved for this batch as soon as possible.");
	                	getBatches();
	                },
	                error: function() {
	                    alert("Error occured. Please notify us at: support@codematch.eu");
	                },
	            });
	            
	    });
 }
function getBatches()
{
	$.ajax({
                url: "/company/getBatches/",
                type: "GET",
                success: function(data) {
                	batches_data = data;
                	renderBatches(batches_data);
                },
                error: function() {
                    alert("Error occured. Please notify us at: support@codematch.eu");
                },
            });
}

function renderBatches(batches_data)
{
	$(".batch").not(".batch-default").remove();
	batchcompanies = batches_data.filter(function(el){ return el.model == "matchseek.batchcompany";});
	var batches = batches_data.filter(function(el){ return el.model == "matchseek.batch";});
	for (var i=0; i < batches.length; i++) {
	    var batch = $(".batch-default").clone();
	    batch.find(".batch-start").html(
	     	"Start: " + getTime(batches[i].fields.start_date)
	    );
	    batch.find(".batch-end").html(
	     	"End: " + getTime(batches[i].fields.end_date)
	    );
	    batch.find(".location").html("Location: "+batches[i].fields.location);
	    var count_until = countDownDate(batches[i].fields.start_date, batches[i].fields.min_days_before_start);
	    batch.find(".timer").countdown(count_until, function(event) {
		    $(this).html(event.strftime('%D days %H:%M:%S'));
		 });
		
		var batch_status = batchStatus(batches[i].fields.start_date,batches[i].fields.end_date, batches[i].fields.min_days_before_start);
		console.log(batch_status);
		if(batch_status == "closedApplications")
		{
			batch.find(".expire-time").hide();
			batch.find(".closedApplications").show();
		}
		if(batch_status == "Ongoing")
		{
			batch.find(".expire-time").hide();
			batch.find(".ongoing").show();
		}
		
		batchcompany = batchcompanies.filter(function(el){ return el.fields.batch_id == batches[i].pk;});
		if(batchcompany.length == 0)
		{
			if(batch_status != "closedApplications" && batch_status != "Ongoing")
			{
				batch.find(".applyButton").attr("batch-id", batches[i].pk);
				batch.find(".applyButton").show();	
			}
		}
		else
		{
			if(batchcompany[0].fields.approved)
				batch.find(".approvedSign").show();
			else
				batch.find(".appliedSign").show();
		} 
		batch.removeClass("batch-default");
		$(".batchesHolder").append(batch);
		batch.show();
	};
	enableApplyFunction();
}

function batchStatus(start, end, min_days)
{
	var now = new Date();
	var d = new Date(start);

	var daysTillStartBatch = d.getTime() - now.getTime();
	var diffHours = Math.ceil(daysTillStartBatch / (1000 * 3600));
	if (0 < diffHours && diffHours < min_days*24)
		return "closedApplications";
	if (diffHours < 0)
		return "Ongoing";
	return "";
}

function countDownDate(startDate, minDaysToApplyBeforeStart)
{
	var d = new Date(startDate);
	var applyDate = new Date();
	applyDate.setDate(d.getDate() - minDaysToApplyBeforeStart);
	applyDate.setMonth(d.getMonth());
	applyDate.setHours(d.getHours() - 3);
	applyDate.setMinutes(d.getMinutes());
	applyDate.setSeconds(d.getSeconds());
	var return_str = applyDate.getFullYear() + "/" + (applyDate.getMonth()+1) + "/" + applyDate.getDate()
					+ " " + applyDate.getHours() + ":" + applyDate.getMinutes() + ":" + applyDate.getSeconds();
	return return_str;
}

function getTime(datestr){
	var date = (new Date(datestr)).toUTCString();
	var date_str = date.substring(0, date.length-4);
	return date_str;
}
