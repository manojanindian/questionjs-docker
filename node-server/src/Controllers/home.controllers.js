const questionService = require("../Services/question.services");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {isEqual} = require('../utils');



const homePage= (req, res, next) => {
	res.render('home', { title:'QuestionJS :: Improve your javascript'});
}

const questionsPage= async (req, res, next) => {
	const questions = await questionService.getQuestions();
	res.render('questions', { hideSelectQuestionLink: true, questions, title:'QuestionJS :: Select a question and try to solve it through javascript'});
}

const editorPage= async (req, res, next) => {
	const questionId = req.params.questionId;
	const question = await questionService.getQuestion(questionId);
	res.render('editor', { title:`QuestionJS :: ${question.question}`, question, questionId});
}

const unitTest = async (req, res, next) => {
	req.setTimeout(0);
	const questionId = req.params.questionId;
	let jsCode = req.body.jsCode;
	var fileName = uuidv4();
	var filePath = `upload-files/${fileName}.js`;

	const question = await questionService.getQuestion(questionId);
	try {
		jsCode += '\n module.exports = {';
		question.unitTests.forEach(unitTest=> {
			jsCode += `\n "${unitTest.input}": ${unitTest.input},`;
		});
		jsCode += '\n }';
		
		fs.writeFileSync(filePath, jsCode);
		
		
		const result = require(`/node-server/${filePath}`);
		
		const unitTestResult = testCode(result, question);
		fs.unlinkSync(filePath);
		res.send(unitTestResult);
	} catch(err) {
		const unitTestResult = testCode({}, question);
		res.send(unitTestResult);
	}
}

const testCode = (testResult, question) => {
	const results = [];
	try {
	  question.unitTests.forEach(data=> {
		const { desc, output } = data;
		const dataResponse = {
			desc, output
		};

		const result = testResult[data.input];

		if (Array.isArray(data.output)) {
		  if(isEqual(result, data.output)) {
			  results.push({
			  isPassed: true,
			  data:dataResponse,
			  result
			})
		  } else {
			  results.push({
			  isPassed: false,
			  data:dataResponse,
			  result
			})
		  }
		}
		else {
		  if(result === data.output) {
			  results.push({
			  isPassed: true,
			  data:dataResponse,
			  result
			})
		  } else {
			  results.push({
			  isPassed: false,
			  data:dataResponse,
			  result
			})
		  }
		}
	  })
	  return results;
	  
	} catch(err) {
		return err.stack;
	}
  }

module.exports = {
	homePage,
	questionsPage,
	editorPage,
	unitTest
};
