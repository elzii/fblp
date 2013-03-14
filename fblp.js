function fblp(fbPageName,debug) {

    var data            = null,
        pic             = null,
        pageID          = getIdFromName(fbPageName),
        dataReceived    = false,
        $fbFeed         = jQuery('.fb-feed')

    //Let's not do a seperate a css file...
    jQuery('html').append('<style> \
        .fb-feed{position:relative;margin-top:0;padding-top:7px;font-size:13px;} \
        .fb-feed p{font-size:13px; !important;} \
        .fb-feed a{font-size:13px; !important;font-weight:bold} \
        .fb-feed .fb-page-icon{display:none;position:absolute;top:5px;left:0;width:50px;height:50px;} \
        .fb-feed .fb-page-link,.fb-feed .fb-message,.fb-feed .fb-date-created,.fb-feed .fb-pic-wrap{padding-left:0px} \
        .fb-feed .fb-pic-wrap{width:60%;height:auto;margin:0;} \
        .fb-feed .fb-pic-wrap img.fb-picture{width:auto;height:auto;max-height:200px;max-width:100%;max-height:100%} \
        .fb-feed .fb-date-created{color:#aeaeae;font-style:italic;font-size:11px !important;padding-top:4px; \
                                    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MTczOUU3OTY0RTgxMUUyQjE5Njg5QjMwQjlFRDUyNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5MTczOUU3QTY0RTgxMUUyQjE5Njg5QjMwQjlFRDUyNyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjkxNzM5RTc3NjRFODExRTJCMTk2ODlCMzBCOUVENTI3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjkxNzM5RTc4NjRFODExRTJCMTk2ODlCMzBCOUVENTI3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+NH4DKwAAAPhJREFUeNqkU9ENgkAMBeMC5wgwgoyAA/CBI7CCjnCuwAjwwQAygowAK9wI+GpeCV5AEyB5aa59fb22RziOY7D1OwQ7vqPvaJrmDFMAKV0O6IBHlmXDamUkWpgXkwcmBTz3iN8WkxkQtMAJuAIlqiWwCf12LhDKwOCIRFkIIF8olgsZ53hW4AkjbcXwO62c097/zEjihm1M1xY1B7XOI5v5gXFH/s9VfYi4as8WVvcsRMM1aZWB/dZAhVjBuNEtaHJNa311CEifKmJ57XJK5vKFlMpEAbPQe8WHI4/FTavyHonusWWVSAckBZD4+Nrz1ucZ7vmr3gIMAJZ5cQCdi0KJAAAAAElFTkSuQmCC"); \
                                    background-size:13px 13px;background-position:0px 7px;background-repeat:no-repeat; \
                                    width:auto;height:16px;padding-left:16px !important;} \
        .fb-feed .fb-loading{position:absolute;top:30px;left:50%;margin:0 0 0 -110px;} \
    </style>');

    // If (while) we don't have the data, append a loading gif
    if (dataReceived == false) {
        if (debug == 1) console.log('Fetching Data for '+fbPageName+'...');
        $fbFeed.append('<img class="fb-loading" src="http://i.imgur.com/ALmtlYg.gif"/>')
    }

    // FB Dev Reference: http://developers.facebook.com/docs/reference/fql/stream/
    jQuery.ajax({
        cache:true,
        type:"GET",
        dataType: "json",
        timeout: 5000,
        url: "https://graph.facebook.com/fql?q=SELECT+post_id,message,description,attachment,created_time+FROM+stream+WHERE+source_id="+pageID+"+LIMIT+10&access_token=165738540236107|qTVdBfnUH3O1X9CLMBt6qKpZc6Q",
        success: function(json) {

        data =  [
                  json.data[0].post_id,                   // [0] Post ID
                  json.data[0].message,                   // [1] The post message
                  json.data[0].attachment.icon,           // [2] Post type icon
                  json.data[0].description,               // [3] Post description (ISO format)    
                  json.data[0].created_time               // [4] Post creation time (ISO format)
                ];

        /* MEDIA CHECK
        ================================================== */
        function hasMedia() {
            if(jQuery.isEmptyObject(json.data[0].attachment.media)){
                if (debug == 1) console.log('Post does NOT have media');
                return false;
            }
            else {
                if (debug == 1) console.log('Post has media.');
                return true;
            }
        }
        /* MESSAGE CHECK
        ================================================== */
        function hasMessage() {
            if(jQuery.isEmptyObject(json.data[0].message)){
                if (debug == 1) console.log('Has no message, let\'s check for a description...');
                return false;
            }
            else {
                if (debug == 1) console.log('No message. Getting description instead...');
                return true;
            }
        }        

        dataReceived = true;        //We have the data now (turn off loading gif)

        /* CONVERSIONS
        =================================================== */
        
        var dateCreated         = new Date(data[4]*1000),
            hours               = parseInt(dateCreated.getHours()),
            timeNowHours        = parseInt(new Date().getHours()),
            timeAgo             = timeNowHours - hours;

        //Remove loading gif / log the data results
        if (dataReceived) {
          if (debug == 1) {
            console.log(data);
        }
          $fbFeed.children('.fb-loading').remove();
        }
    



        //Append the data to parent element
        $fbFeed.append('\
            <div class="fb-page-icon-wrap"> \
                <img class="fb-page-icon" src="https://graph.facebook.com/'+pageID+'/picture"> \
            </div> \
            <div class="fb-post-wrap"> \
                <a class="fb-page-link" href="http://facebook.com/'+fbPageName+'">'+getNameFromId(pageID)+'</a> \
            </div> \
        ');
        //$fbFeed.children('.fb-post-wrap').append('<p class="fb-message">'+data[1]+'</p>');

        //If post doesn't have message, append description
        if (hasMessage()) {        
            $fbFeed.children('.fb-post-wrap').append('<p class="fb-message">'+data[1]+'</p>');
        } else {
            $fbFeed.children('.fb-post-wrap').append('<p class="fb-message">'+data[3]+'</p>');
        }

        //If post has media (picture), parse it and append it.
        if (hasMedia()) {
            pic               = [json.data[0].attachment.media[0].src]
            var pictureN      = pic[0].replace('_s', '_n');  //Convert picture from small (_s) to normal (_n)          
            $fbFeed.children('.fb-post-wrap').append('<div class="fb-pic-wrap"><img class="fb-picture" src="'+pictureN+'"></div>');
            if (debug == 1) console.log(pic);
        }
        $fbFeed.children('.fb-post-wrap').append('\
                <p class="fb-date-created"> about '+timeAgo+' hours ago</p> \
        ');
        //clear floats;
        $fbFeed.append('<div style="clear:both"></div>');
    },
    error: function(x, t, m) {
        if(t==="timeout") {
            console.log("got timeout");
        } else {
            console.log(t);
        }
    }
});





    function getNameFromId(objectId) {
        var graphLink = "https://graph.facebook.com/" + objectId;
        var objectName;
        jQuery.ajax({type: "GET",url: graphLink,async: false,
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8")
                }
            },
            dataType: "json",
            success: function (response) {objectName = response.name}
        });
        return objectName
    }
    function getIdFromName(pageName) {
        var graphLink = "https://graph.facebook.com/" + pageName;
        var objectId;
        jQuery.ajax({type: "GET",url: graphLink,async: false,
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8")
                }
            },
            dataType: "json",
            success: function (response) {
                objectId = response.id;
                if (debug == 1) console.log("Get ID from page name: "+objectId);
            }

        });
        return objectId
    }
}


