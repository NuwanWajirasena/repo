
module('coordEval.js');

test('isEvaluationNameLengthValid(name)', function(){
	equal(isEvaluationNameLengthValid('Evaluation 1'), true, "Less than 22 characters");
	equal(isEvaluationNameLengthValid(generateRandomString(EVAL_NAME_MAX_LENGTH)), true, "Maximum number of characters");
	equal(isEvaluationNameLengthValid(generateRandomString(EVAL_NAME_MAX_LENGTH + 1)), false, "Exceed maximum number of characters");
});


test('isEvaluationNameValid(name)', function(){
	equal(isEvaluationNameValid("Eval  Test  "), true, "Eval  Test  ");
	equal(isEvaluationNameValid("EvalTest"), true, "EvalTest");
	equal(isEvaluationNameValid("12345"), true, "12345");
	
	equal(isEvaluationNameValid("Eval'Test"), false, "Eval'Test");
	equal(isEvaluationNameValid("Eval/Test"), false, "Eval/Test");
	equal(isEvaluationNameValid("Eval-Test"), false, "Eval-Test");
	equal(isEvaluationNameValid("Eval_Test"), false, "Eval_Test");
	equal(isEvaluationNameValid("Eval$Test"), false, "Eval$Test");
	equal(isEvaluationNameValid("Eval%Test"), false, "Eval%Test");
});


test('convertDateFromDDMMYYYYToMMDDYYYY(dateString)', function(){
	equal(convertDateFromDDMMYYYYToMMDDYYYY("21/07/2012"), "07/21/2012", "Conversion of date");
});


test('isAddEvaluationScheduleValid(start, startTime, deadline, deadlineTime)', function(){
	var now = new Date();
	var correctstart = "31/12/" + (now.getFullYear());
	var correctend = "31/12/" + (now.getFullYear() + 1);
	var wrongstart = "31/12/" + (now.getFullYear() - 2);
	var wrongend = "31/12/" + (now.getFullYear() - 3);
	var starttime = "24";
	var endtime = "22";
	
	
	equal(isAddEvaluationScheduleValid(correctstart, starttime, correctend, endtime), true, "Normal start and end" + correctstart + " " + correctend);
	equal(isAddEvaluationScheduleValid(wrongstart, starttime, correctend, endtime), false, "Start time before current date");
	equal(isAddEvaluationScheduleValid(correctstart, starttime, wrongend, endtime), false, "End time before start time");
	equal(isAddEvaluationScheduleValid(wrongstart, starttime, wrongend, endtime), false, "Start time before current date");
	equal(isAddEvaluationScheduleValid(correctstart, starttime, correctstart, starttime), false, "start and end at same time");
});


test('isEditEvaluationScheduleValid(start, startTime, deadline, deadlineTime, timeZone, activated, status)', function(){
	var now = new Date();
	var correctstart = "31/12/" + (now.getFullYear());
	var correctend = "31/12/" + (now.getFullYear() + 1);
	var wrongstart = "31/12/" + (now.getFullYear() - 2);
	var wrongend = "31/12/" + (now.getFullYear() - 3);
	var starttime = "24";
	var endtime = "22";
	
	equal(isEditEvaluationScheduleValid(correctstart, starttime, correctend, endtime, "", "", ""), true, "Normal start and end");
	equal(isEditEvaluationScheduleValid(correctstart, starttime, correctend, endtime, "", "", "AWAITING"), true, "Normal start and end + awaiting");
	equal(isEditEvaluationScheduleValid(wrongstart, starttime, correctend, endtime, "", "", ""), true, "Start time before current date");
	equal(isEditEvaluationScheduleValid(wrongstart, starttime, correctend, endtime, "", "", "AWAITING"), false, "Start time before current date + awaiting");
	equal(isEditEvaluationScheduleValid(correctstart, starttime, correctstart, starttime, "", "", ""), true, "start and end at same time");
	equal(isEditEvaluationScheduleValid(correctstart, starttime, correctstart, starttime, "", "", "AWAITING"), true, "start and end at same time + awaiting");
	equal(isEditEvaluationScheduleValid(correctstart, starttime, wrongend, endtime, "", "", ""), false, "End time before start time");
	equal(isEditEvaluationScheduleValid(correctstart, starttime, wrongend, endtime, "", "", "AWAITING"), false, "End time before start time + awaiting");
	
});


test('checkAddEvaluation(form)', function(){
	var now = new Date();
	var correctstart = "31/12/" + (now.getFullYear());
	var correctend = "31/12/" + (now.getFullYear() + 1);
	var wrongstart = "31/12/" + (now.getFullYear() - 2);
	var wrongend = "31/12/" + (now.getFullYear() - 3);
	
	var form = new Object();
	form.courseid = new Object();
	form.courseid.value = "CS2103";
	form.evaluationname = new Object();
	form.evaluationname.value = "Evaluation Name";
	form.commentsstatus = new Object();
	form.commentsstatus.value = "Comments";
	form.start = new Object();
	form.start.value = correctstart;
	form.starttime = new Object();
	form.starttime.value = 24;
	form.deadline = new Object();
	form.deadline.value = correctend;
	form.deadlinetime = new Object();
	form.deadlinetime.value = 22;
	form.timezone = new Object();
	form.timezone.value = "+8";
	form.graceperiod = new Object();
	form.graceperiod.value = 10;
	form.instr = new Object();
	form.instr.value = "instruct";
	
	equal(checkAddEvaluation(form), true, "All fields are correct");
	
	form.courseid.value = "";
	form.starttime.value = "";
	equal(checkAddEvaluation(form), false, "Empty fields");
	
	form.courseid.value = "CS2103";
	form.starttime.value = 0;
	form.evaluationname.value = generateRandomString(EVAL_NAME_MAX_LENGTH + 1);
	equal(checkAddEvaluation(form), false, "Evaluation name exceeds max characters");
	
	form.evaluationname.value = "!@#$%^& name";
	equal(checkAddEvaluation(form), false, "Evaluation name not valid");
	
	form.evaluationname.value = "Evaluation name";
	form.start.value = wrongstart;
	form.deadline.value = correctend;
	equal(checkAddEvaluation(form), false, "Schedule not valid");
	
	form.start.value = correctstart;
	form.deadline.value = wrongend;
	equal(checkAddEvaluation(form), false, "Schedule not valid");
});


test('checkEditEvaluation(form)', function(){
	var now = new Date();
	var correctstart = "31/12/" + (now.getFullYear());
	var correctend = "31/12/" + (now.getFullYear() + 1);
	var wrongstart = "31/12/" + (now.getFullYear() - 2);
	var wrongend = "31/12/" + (now.getFullYear() - 3);
	
	var form = new Object();
	form.courseid = new Object();
	form.courseid.value = "CS2103";
	form.evaluationname = new Object();
	form.evaluationname.value = "Evaluation Name";
	form.commentsstatus = new Object();
	form.commentsstatus.value = "Comments";
	form.start = new Object();
	form.start.value = correctstart;
	form.starttime = new Object();
	form.starttime.value = 24;
	form.deadline = new Object();
	form.deadline.value = correctend;
	form.deadlinetime = new Object();
	form.deadlinetime.value = 22;
	form.timezone = new Object();
	form.timezone.value = "+8";
	form.graceperiod = new Object();
	form.graceperiod.value = 10;
	form.instr = new Object();
	form.instr.value = "instruct";
	
	equal(checkEditEvaluation(form), true, "All fields are correct");
	
	form.courseid.value = "";
	form.starttime.value = "";
	equal(checkEditEvaluation(form), false, "Empty fields");
	
	form.courseid.value = "CS2103";
	form.starttime.value = 0;
	form.evaluationname.value = generateRandomString(EVAL_NAME_MAX_LENGTH + 1);
	equal(checkEditEvaluation(form), false, "Evaluation name exceeds max characters");
	
	form.evaluationname.value = "!@#$%^& name";
	equal(checkEditEvaluation(form), false, "Evaluation name not valid");
	
	form.evaluationname.value = "Evaluation name";
	form.start.value = wrongstart;
	form.deadline.value = correctend;
	equal(checkEditEvaluation(form), false, "Schedule not valid");
	
	form.start.value = correctstart;
	form.deadline.value = wrongend;
	equal(checkEditEvaluation(form), false, "Schedule not valid");
});


test('selectDefaultTimeOptions()', function(){
	//N/A, uses the current date and elements in the page
	expect(0);
});


test('formatDigit(num)', function(){
	// Tested in convertDateToDDMMYYYY(date)
	expect(0);
});


test('convertDateToDDMMYYYY(date)', function(){
	var testdate1 = new Date(2012, 6, 21, 14, 18, 0);	
	equal(convertDateToDDMMYYYY(testdate1), "21/07/2012", "Date converted correctly");
});


test('convertDateToHHMM(date)', function(){
	var testdate1 = new Date(2012, 6, 21, 14, 18, 0);	
	equal(convertDateToHHMM(testdate1), "1418", "Date converted correctly");
});


function generateRandomString(len){
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var data = '';

	for (var i=0; i<len; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		data += chars.substring(rnum,rnum+1);
	}

	return data;
}