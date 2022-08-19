// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
$(function () {
    $(".close").on('click', function () {
        if ($('#msgBox').length > 0)
            $('#msgBox').text('');

        /*if (location.href.indexOf('/Claims.aspx') != -1 || location.href.indexOf('/ClaimsMTO.aspx') != -1) {
    
            ArraysDestroy();
            //$('.popup').css('z-index', '12999999');
            //$('#overlay').css('z-index', '1299999');
    
            HideAllButtons();
        }
        else {*/
        $('.popupComment').hide();
        $('.popupFix').hide();
        $('.popupBig').hide();
        $('.popupGraph').hide();
        $('.popupVerySmall').hide();
        /*};*/

        $('#overlay').remove();
        $('.popup').hide();
    });
});

function getClientWidth() {
    return document.compatMode == 'CSS1Compat' && !window.opera ? window.innerWidth : window.innerWidth; //document.body.clientWidth;
}

function getClientHeight() {
    return document.compatMode == 'CSS1Compat' && !window.opera ? window.innerHeight : window.innerHeight; //document.body.clientHeight;
}
function SetKeyValue(key, value) {
    if (document.getElementById(key) != null) {
        document.getElementById(key).value = value;
    }
}

function GetKeyValue(key) {
    value = '';
    if (document.getElementById(key) != null) {
        value = document.getElementById(key).value;
    }
    return value;
}

function closePopupProfilesAdm() {
/*
    if (xGridProfilesHistory.GetVisible()) {
        xGridProfilesHistory.SetVisible(false);
        xGridProfiles.SetVisible(true);
        xGridReq.SetVisible(true);
        xGridProfilesPhoto.SetVisible(true);
        setUnactiveButton('contentBody_BonusAdm');
    }

    if (!$('#tProfiles').hasClass('b-table')) {
        $('#tProfiles').addClass('b-table');
        //$('#tProfiles').show().css({ 'top': offset.top, 'margin-top': '-4px' });
        $('#tProfiles').css({ 'margin-top': '15px' });
    }

    if (!$('#tProfilesPhoto').hasClass('b-table'))
        $('#tProfilesPhoto').addClass('b-table');

    document.getElementById('tButtons').style.display = 'block';

    document.getElementById('contentBody_btnSave').style.visibility = "visible";
    document.getElementById('contentBody_btnSaveReq').style.visibility = "visible";
    xGrid.PerformCallback();
*/
    SetKeyValue('ParticipantID', '');
    SetKeyValue('PeriodID', '');

    $("#onlinedemo.button").trigger("dxclick");
}

function makeFancybox() {
    $('.fancybox-thumbs').fancybox({

        prevEffect: 'elastic',
        nextEffect: 'elastic',
        autosize: false,
        type: "image",

        closeBtn: true,
        arrows: true,
        nextClick: true,
        //fitToView: false, // avoids scaling the image to fit in the viewport

        helpers: {
            thumbs: {
                width: 50,
                height: 50
            },
            title: {
                type: 'float'
            }
        },

        beforeShow: function () {
            // set size to (fancybox) img
            $(".fancybox-image").css({
                "width": "auto",
                "height": "auto"
            });

            // set size for parent container
            //        this.width = "100%";
            //        this.height = "100%";
        }
        //       ,
        //        afterLoad: function () {
        //            this.title = (this.title ? '' + this.title + '<br />' : '') + 'Image ' + (this.index + 1) + ' of ' + this.group.length;
        //        } // afterLoad
    });
}

function FancyGroup(group) {
    $('.fancybox-thumbs').each(function () {
        if ($(this).attr('data-fancybox-group').toString() == group.toString()) {
            //elem = null;
            elem = $(this);
            return false;
        }
    });
    $('.fancybox-thumbs-pdf').each(function () {
        if ($(this).attr('data-fancybox-group').toString() == group.toString()) {
            //elem = null;
            elem = $(this);
            return false;
        }
    });
    elem.eq(0).trigger('click');
}

function addValueInObject(object, key, value) {
    var res = {};
    var textObject = JSON.stringify(object);
    if (textObject === '{}') {
        res = JSON.parse('{"' + key + '":' + value + '}');
    } else {
        res = JSON.parse('{' + textObject.substring(1, textObject.length - 1) + ',"' + key + '":' + value + '}');
    }
    return res;
}
