/*
 * jQuery v1.9.1 included
 */

$(document).ready(function() {
/* Custom Script by Byronn Habana - bhabana@zendesk.com */
  
  //remove general form from helpcentre  
  $.each([360000033276], function (index, formValue) {
    $('#request_issue_type_select option[value="' + formValue + '"]').remove();
    $('.nesty-panel').on('DOMNodeInserted', function (e) {
        $(this).children('ul').children().remove('#' + formValue);
    });
	});
  
  // Outage Banner
  checkForOutageArticle();
  function checkForOutageArticle(){
    $.getJSON('/api/v2/help_center/articles/search.json?label_names=outage').done(function(data){
      console.log(data);
      var article;
      if(data.results.length > 0){
        article = data.results[0];
        $('.outage-title').text(article.title);
        // $('.outage-body').text(' ' + article.snippet);
        var strippedBody = article.body.replace(/(<([^>]+)>)/ig,"");
        $('.outage-body').text(' ' + strippedBody);
        // $('.promoted-articles-item').show();
        $('.' + article.id).hide();
        $('.outage-banner').show();
      }else{
        // $('.promoted-articles-item').show();    
      }
    })
  }
  // ZD Form Custom
  if ( $(".zd-form").length) {
    
    // set a mapping
    var objTicketMap = {};
    
    $("#request_issue_type_select option").each(function() {
      
      var urlVal = $(this).data("url");
      var htmlVal = $(this).html();
      var ticketVal = $(this).val();
      
      objTicketMap[ticketVal] = htmlVal;
      
      // make sure we don't display the empty one in the ticket form section
      if (htmlVal != "-"){
        $( ".zd-form" ).append( "<a class='zd-form-link' href='"+urlVal+"'><div class='zd-form-box'><h2>"+htmlVal+"</h2></div></a>");
      }
    });
    
    // hiding the ticket form
    if($("#request_issue_type_select").val() != "-"){
      $(".zd-form-box").hide();
      $(".zd-form h3").text(objTicketMap[$("#request_issue_type_select").val()]);
    }
    $(".request_ticket_form_id").hide();
  }
  // Hide Contact Panel 
  $.ajax('/api/v2/users/me').done(function(obj){
    console.log('user',obj.user);
    var role = obj.user.role;
    var url = window.location.href;
    if(role == 'end-user' && url.indexOf('/requests/new') < 0){
      $('.contact').show();
    }
  })
  // social share popups
  $(".share a").click(function(e) {
    e.preventDefault();
    window.open(this.href, "", "height = 500, width = 500");
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var $commentContainerTextarea = $(".comment-container textarea"),
    $commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

  $commentContainerTextarea.one("focus", function() {
    $commentContainerFormControls.show();
  });

  if ($commentContainerTextarea.val() !== "") {
    $commentContainerFormControls.show();
  }

  // Expand Request comment form when Add to conversation is clicked
  var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
    $requestCommentFields = $(".request-container .comment-container .comment-fields"),
    $requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

  $showRequestCommentContainerTrigger.on("click", function() {
    $showRequestCommentContainerTrigger.hide();
    $requestCommentFields.show();
    $requestCommentSubmit.show();
    $commentContainerTextarea.focus();
  });

  // Mark as solved button
  var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
    $requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
    $requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

  $requestMarkAsSolvedButton.on("click", function () {
    $requestMarkAsSolvedCheckbox.attr("checked", true);
    $requestCommentSubmitButton.prop("disabled", true);
    $(this).attr("data-disabled", true).closest("form").submit();
  });

  // Change Mark as solved text according to whether comment is filled
  var $requestCommentTextarea = $(".request-container .comment-container textarea");

  $requestCommentTextarea.on("input", function() {
    if ($requestCommentTextarea.val() !== "") {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-and-submit-translation"));
      $requestCommentSubmitButton.prop("disabled", false);
    } else {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-translation"));
      $requestCommentSubmitButton.prop("disabled", true);
    }
  });

  // Disable submit button if textarea is empty
  if ($requestCommentTextarea.val() === "") {
    $requestCommentSubmitButton.prop("disabled", true);
  }

  // Submit requests filter form in the request list page
  $("#request-status-select, #request-organization-select")
    .on("change", function() {
      search();
    });

  // Submit requests filter form in the request list page
  $("#quick-search").on("keypress", function(e) {
    if (e.which === 13) {
      search();
    }
  });

  function search() {
    window.location.search = $.param({
      query: $("#quick-search").val(),
      status: $("#request-status-select").val(),
      organization_id: $("#request-organization-select").val()
    });
  }

  function toggleNavigation(toggleElement) {
    var menu = document.getElementById("user-nav");
    var isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
    toggleElement.setAttribute("aria-expanded", !isExpanded);
  }

  $(".header .icon-menu").on("click", function(e) {
    e.stopPropagation();
    toggleNavigation(this);
  });

  $(".header .icon-menu").on("keyup", function(e) {
    if (e.keyCode === 13) { // Enter key
      e.stopPropagation();
      toggleNavigation(this);
    }
  });

  $("#user-nav").on("keyup", function(e) {
    if (e.keyCode === 27) { // Escape key
      e.stopPropagation();
      this.setAttribute("aria-expanded", false);
      $(".header .icon-menu").attr("aria-expanded", false);
    }
  });

  if ($("#user-nav").children().length === 0) {
    $(".header .icon-menu").hide();
  }

  // Submit organization form in the request page
  $("#request-organization select").on("change", function() {
    this.form.submit();
  });

  // Toggles expanded aria to collapsible elements
  $(".collapsible-nav, .collapsible-sidebar").on("click", function(e) {
    e.stopPropagation();
    var isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });
});
