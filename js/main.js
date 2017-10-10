/*
* ADR Reporting
* Copyright (C) 2017 Divay Prakash
* GNU Affero General Public License 3.0 (https://github.com/divayprakash/adr/blob/master/LICENSE)
*/
$(document).ready(function(){
  $('.button-collapse').sideNav();
  var helpOpen = false;
  $('#help-fab').click(function(e) {
    if (helpOpen) {
      $('#help-tap-target').tapTarget('close');
      helpOpen = false;
    }
    else {
      $('#help-tap-target').tapTarget('open');
      helpOpen = true;
    }
  });
  $('.chips').material_chip();
  $('.datepicker').pickadate({
    format: 'dd/mm/yyyy',
    selectMonths: true
  });
  $('.datepicker-year').pickadate({
    format: 'dd/mm/yyyy',
    selectMonths: true,
    selectYears: 7
  });
  $('#medication-add').modal();
  enableSpecFieldOnRadio('stop','#stop-reduced');
  //enableSpecFieldOnRadio('reintro','#reintro-reduced');
  setupTabs();
});

function setupTabs() {
  var tabUl = document.getElementById('tabs-list');
  var tabs = tabUl.getElementsByTagName('li');
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].classList.contains('disabled')) {
      tabs[i].classList.remove('lighten-4');
      tabs[i].classList.add('lighten-5');
    }
    else {
      tabs[i].classList.remove('lighten-5');
      tabs[i].classList.add('lighten-4');
    }
  }
}

function formSubmit(id) {
  switch(id) {
    case 'patient-submit':
      if (processPatientData()) gotoNextTab('patient-tab', 'reaction-tab', 'reaction');
      break;
    case 'reaction-submit':
      if (processReactionData()) gotoNextTab('reaction-tab', 'medication-tab', 'medication');
      break;
    case 'medication-submit':
      gotoNextTab('medication-tab', 'outcome-tab', 'outcome');
      break;
    case 'outcome-submit':
      gotoNextTab('outcome-tab', 'reporter-tab', 'reporter');
      break;
    case 'reporter-submit':
      alert('TODO!!!');
      break;
  }
}

function processPatientData() {
  var flag = true;
  var initials = document.getElementById('initials').value;
  var age = document.getElementById('age').value;
  var genderFields = document.getElementsByName('gender');
  var gender;
  for (var i = 0; i < genderFields.length; i++) {
      if (genderFields[i].checked){
          gender = genderFields[i].id;
      }
  }
  var weight = document.getElementById('weight').value;
  if (initials == "") {
    makeToast('Initials is a required field!');
    flag = false;
  }
  if (age == "") {
    makeToast('Age is a required field!');
    flag = false;
  }
  if (gender == null) {
    makeToast('Gender is a required field!');
    flag = false;
  }
  if (weight <= 0) {
    makeToast('Weight is a required field!');
    flag = false;
  }
  return flag;
}

function processReactionData() {
  var flag = true;
  var chips = $('#reaction-description').material_chip('data');
  var startDate = $('#date-start').pickadate().pickadate('picker').get();
  var endDate = $('#date-end').pickadate().pickadate('picker').get();
  if (chips.length <= 0) {
    makeToast('Description is a required field!');
    flag = false;
  }
  if (startDate == "") {
    makeToast('Start date is a required field!');
    flag = false;
  }
  if (endDate == "") {
    makeToast('End date is a required field!');
    flag = false;
  }
  startDateCorrected = new Date(changeDateFormat(startDate)).getTime();
  endDateCorrected = new Date(changeDateFormat(endDate)).getTime();
  todaysDate = new Date(getTodaysDate()).getTime();
  if (startDateCorrected > todaysDate) {
    makeToast('Start date must be before or on the date today!');
    flag = false;
  }
  if (endDateCorrected > todaysDate) {
    makeToast('End date must be before or on the date today!');
    flag = false;
  }
  if (startDateCorrected > endDateCorrected) {
    makeToast('Start date must be before end date!');
    flag = false;
  }
  return flag;
}

function changeDateFormat(date) {
  s = date.split('/');
  if (s.length == 3) newDate = s[2] + "/" + s[1] + "/" + s[0];
  else newDate = "1970/01/01";
  return newDate;
}

function getTodaysDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  today = yyyy + '/' + mm + '/' + dd;
  return today;
}

function makeToast(msg) {
  Materialize.toast(msg, 4000, 'rounded');
}

function gotoNextTab(present, next, sel) {
  var presentTab = document.getElementById(present);
  var nextTab = document.getElementById(next);
  presentTab.classList.add('disabled');
  nextTab.classList.remove('disabled');
  setupTabs();
  $('ul.tabs').tabs('select_tab', sel);
}

function enableSpecFieldOnRadio(radioId, fieldSelector) {
  $('input[type=radio][name=' + radioId + ']').on('change', function() {
    switch($(this).val()) {
      case 'yes':
        $(fieldSelector).prop('disabled', false);
        break;
      case 'no':
      case 'unknown':
      case 'na':
        $(fieldSelector).val("");
        $(fieldSelector).removeClass('valid');
        $(fieldSelector).removeClass('invalid');
        $(fieldSelector).prop('disabled', true);
        break;
    }
  });
}

var medicationCount = 0;
function medicationAdd() {
  var flag = true;
  var name = $('#medication-name').val();
  if (name == "") {
    makeToast('Medication name is a required field!');
    flag = false;
  }
  var manufacturer = $('#manufacturer').val();
  if (manufacturer == "") {
    makeToast('Manufacturer is a required field!');
    flag = false;
  }
  var batch = $('#batch').val();
  if (batch == "") {
    makeToast('Batch/lot number is a required field!');
    flag = false;
  }
  var expiry = $('#expiry').pickadate().pickadate('picker').get();
  var dose = $('#dose').val();
  if (dose == "") {
    makeToast('Dose is a required field!');
    flag = false;
  }
  var route = $("input[type='radio'][name='route']:checked").val();
  var frequency = $('#freq').val();
  var therapyStart = $('#therapy-start').pickadate().pickadate('picker').get();
  var therapyEnd = $('#therapy-end').pickadate().pickadate('picker').get();
  var duration = $('#duration').val();
  var reason = $('#reason').val();
  var stop = $("input[type='radio'][name='stop']:checked").val();
  var stopReduced = 0;
  if (stop == "yes") stopReduced = $('#stop-reduced').val();
  //var reintro = $("input[type='radio'][name='reintro']:checked").val();
  //var reintroReduced = 0;
  //if (reintro == "yes")  reintroReduced = $('reintro-reduced').val();
  formReset();
  $('#medication-add').modal('close');
  Materialize.toast('Medication added!', 4000, 'rounded');
  var divToAdd = "<div class='card blue lighten-4'><div class='card-content'><span class='card-title'>"+ name +"</span><p>"+ manufacturer + "<br>" + expiry + "</p></div><div class='card-action'><button class='waves-effect waves-light btn'><i class='material-icons right'>mode_edit</i>Edit</button><button class='waves-effect waves-light btn'><i class='material-icons right'>delete</i>Delete</button></div></div>";
  $('#insert').before(divToAdd);
}

function formReset(){
  $('#medication-form').each(function(){
      this.reset();
  });
  $('#medication-add').scrollTop(0);
}
