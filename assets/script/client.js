
$(document).ready(function(){
	//btn for showing instruction
	$("#flip").click(function(){
        $("#instruction").slideToggle("slow");
    });

	//btn for changing text color
	$("#btn_seven").click(function(){
        $('section').css("color",$('select').val());
        $('#ul_tags').css("color",$('select').val());
        $('header h1').css("color",$('select').val());
        $('section').css("font-family",$('#tf').val());
        $('section').css("font-family",$('#tf').val());
        $('#ul_tags').css("font-family",$('#tf').val());
        $('header h1').css("font-family",$('#tf').val());
    });

	//btn for sending get articles request
	$('#btn_one').click(function(){
		$.ajax({
				url:'articles',
				method:"GET",
				dataType:"json"
		})
		//handle retrived jsondata
		.done(function(jsondata){
			var num_results = jsondata.length;
			//toggle the table for displaying info
			$('#tb_articles').toggle();
			//hide other info
			$('#tb_articles').siblings().hide();
			var $trs;
			//use a for loop to create headers of a table
			for(var i = 0;i <= num_results;i++){
				if(i == 0){
					$trs = '<tr>';
					$trs += '<th>published_date</th>';
					$trs += '<th>title</th>';
					$trs += '<th>abstract</th>';
					$trs += '<th>short_url</th>';
					$trs += '</tr>';
				}else{
					$trs += '<tr></tr>';
				}
			}
			//add headers to table element in html
			$('#tb_articles').html($trs);
			//add each row into table
			for(var i = 1;i <= num_results;i++){
				var text = '<td>' + jsondata[i - 1].published_date +'</td>';
				text += '<td>' + jsondata[i - 1].title +'</td>';
				text += '<td>' + jsondata[i - 1].abstract+'</td>';
				text += '<td>' + jsondata[i - 1].short_url +'</td>';
				$('#tb_articles tr').eq(i).html(text);
			}
		})
		.fail(function(jqXHR,textStatus){
			//if fails, print out the result in console
			console.log("Request failed: " + textStatus);
		});
	});
	//btn for sending get authors request
	$('#btn_two').click(function(){
		$.ajax({
			url:'authors',
			method:'GET',
			dataType:'json'
		})
		//handle retrived jsondata
		.done(function(jsondata){
			//toggle the table for displaying info
			$('#ul_authors').toggle();
			//hide other info
			$('#ul_authors').siblings().hide();
			//get the number of results
			var num_results = jsondata[jsondata.length - 1];
			//create authors list
			var $lis = '<span>Authors list:</span>';
			for(var i = 0;i < num_results;i++){
				$lis += '<li>' + jsondata[i] + '</li>';
			}
			//add result to ul element in html
			$('#ul_authors').html($lis);
		})
		.fail(function(jqXHR,textStatus){
			//if fails, print out the result in console
			console.log("Request failed: " + textStatus);
		});
	});
	//btn for sending get urls request
	$('#btn_three').click(function(){
		$.ajax({
			url:'urls',
			method:'GET',
			dataType:'json'
		})
		//handle retrieved jsondata
		.done(function(jsondata){
			$('#urls').toggle();
			$('#urls').siblings().hide();
			var num_results = jsondata.length;
			//array for storing published_date
			var dateArr = [];
			dateArr.push(jsondata[0].published_date);
			jsondata[0].numarr = 0;
			//naive algorithm for storing unique date string
			for(var i = 1;i < num_results;i++){
				var j = 0;
				while(j < dateArr.length){
					if(jsondata[i].published_date == dateArr[j]){
						//add tag for each entry
						jsondata[i].numarr = j;
						break;
					}
					else j++;
				}
				//if not found
				if(j == dateArr.length) {
					dateArr.push(jsondata[i].published_date);
					jsondata[i].numarr = j;
				}
			}
			var len = dateArr.length;
			//create #len ul element
			var uls = '';
			for(var i = 0;i < len;i++){
				uls += '<ul>' + dateArr[i] + '</ul>';
			}
			$('#urls').html(uls);
			//create hyperlink in each ul
			var text = [];
			for(var i = 0;i < len;i++){
				text[i] = '';
			}
			for(var i = 0;i < len;i++){
				text[i] += dateArr[i];
			}
			for(var i = 0;i < num_results;i++){
				text[jsondata[i].numarr] += '<li>' + 
				'<a href=' + jsondata[i].short_url + '>' + jsondata[i].short_url + '</li>';
			}
			for(var i = 0;i < len;i++){
				$('#urls ul').eq(i).html(text[i]);
			}
		})
		.fail(function(jqXHR,textStatus){
			//if fails, print out the result in console
			console.log("Request failed: " + textStatus);
		});
	});
	//btn for sending get tag request
	$('#btn_four').click(function(){
		$.ajax({
			url:'tag',
			method:'GET',
			dataType:'json'
		})
		//handle retrieved jsondata
		.done(function(jsondata){
			$('#ul_tags').toggle();
			$('#ul_tags').siblings().hide();
			//console.log(jsondata);
			var $lis = '';
			var i = 0;
			//create tag cloud using inline element span
			for(var key in jsondata){
				$lis += '<span ' + 'style="font-size:' + jsondata[key]*12 + 'px">' + key + '</span>';
				i++;
				if(i%4 == 0) $lis += '<br>';
			}
			//add span list to div
			$('#ul_tags').html($lis);
		})
		.fail(function(jqXHR,textStatus){
			console.log("Request failed: " + textStatus);
		});
	});
	//btn for sending post request
	$('#btn_five').click(function(){
		//get number from input element
		var number = $('#article_num').val();
		//if input is a number and non empty
		if(isNaN(number) == false && number != ""){
			$.ajax({
				url:'oneArticle',
				method:'post',
				data: number,
				dataType:'json'
			})
			.done(function(jsondata){
				//console.log(jsondata);
				var text = '';
				//if requested index exceed the total # of results
				if(Number.isInteger(jsondata)){
					alert("Please Enter number from 0 to " + (jsondata-1));
				}else{
					//if not exceed
					$('#tb_one_article').show();
					$('#tb_one_article').siblings().hide();
					//create a table for storing result
					text += '<tr>';
					for(var key in jsondata){
						text += '<th>' + key + '</th>';
					}
					text += '</tr>';
					text += '<tr>';
					for(var key in jsondata){
						text += '<td>' + jsondata[key] + '</td>';
						//console.log(jsondata.key);
					}
					text += '</tr>';
					//change element in html
					$('#tb_one_article').html(text);
				}
			})
			.fail(function(jqXHR,textStatus){
				//if fails, print out the status in console
				console.log("Request failed: " + textStatus);
			});
		}else{
			alert("Please Enter a number");
		}
	});
	//btn for sending get imgs request
	$('#btn_six').click(function(){
		$.ajax({
			url:'imgs',
			method:'GET',
			dataType:'json'
		})
		.done(function(jsondata){
			$('#imgs').toggle();
			$('#imgs').siblings().hide();
			//get number of retrieved entries
			var num = jsondata.length;
			//console.log(jsondata);
			var text = '';
			//create a imgs list
			for(var i=0;i < num;i++){
				//if the entry has multimedia key
				if('multimedia' in jsondata[i]){
					text += '<a href="' + jsondata[i].url + '">' +
							'<img ' + 'src="' + jsondata[i].multimedia + '" alt="'
							+ jsondata[i].caption + '">' + '</a>'
				}else{
					//if not just show the title into the placeholder
					text += '<a href="' + jsondata[i].url + '">' +
							'<img ' + 'src=""' +  'title="'
							+ jsondata[i].title + '"' + 'alt="' + jsondata[i].title + '">' + '</a>'
				}
			}
			//change element in html
			$('#imgs').html(text);
		})
		.fail(function(jqXHR,textStatus){
			console.log("Request failed: " + textStatus);
		});
	});
});

