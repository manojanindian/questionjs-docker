const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const Question = require("../Models/question");
const questionService = require("../Services/question.services");

/**
 * Get all Project list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getQuestions= async (req, res, next) => {
	const response = await questionService.getQuestions();
	res.json(response);
}

/**
 * Get Question by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 const getQuestion= async (req, res, next) => {
	const questionId = req.params.questionId;

	try {
		const response = await questionService.getQuestion(questionId);
		if (!response) {
			res.send(400, {message: 'no result found'});
			return;
		}
		res.json(response);
	} catch(err) {
		res.send(err)
	}
}


/**
 * Add one question
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const addQuestion= async (req, res, next) => {
	const question = req.body.question;
	const functionName = req.body.functionName;
	const unitTests = req.body.unitTests;
	const questionId = uuidv4()

	// Validations
	if (!question || !functionName || !unitTests || !unitTests.length) {
		res.send(400, {message: 'Invalid payload in request'})
		return;
	}

	try {
		const response = await Question.create({questionId, question, functionName, unitTests, published: false });
		res.json(response);
	} catch(err) {
		res.send(err);
	}
}


/**
 * Update existing question
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const updateQuestion= async (req, res, next) => {
	const questionId = req.params.questionId;
	const question = req.body.question;
	const functionName = req.body.functionName;
	const unitTests = req.body.unitTests;

	// Validations
	if (!question || !functionName || !unitTests || !unitTests.length) {
		res.send(400, {message: 'Invalid payload in request'})
		return;
	}

	try {
		const response = await Question.findOneAndUpdate(
			{questionId},
			{question, functionName, unitTests, updatedAt: Date.now() }
		);
		if (!response) {
			res.send(400, {message: 'Invalid payload in request'})
			return;
		}
		res.json(response);
	} catch(err) {
		res.send(err);
	}
}


/**
 * Delete question by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const deleteQuestion = async (req, res, next) => {
	const questionId = req.params.questionId;

	try {
		const response = await Question.deleteOne({questionId});
		res.json(response);
	} catch(err) {
		res.send(err);
	}
}

/**
 * Delete question by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 const publishQuestion = async (req, res, next) => {
	const questionId = req.params.questionId;
	const published = (req.body.published === true) ? true : false;

	try {
		const response = await Question.findOneAndUpdate({questionId}, {published});
		res.json(response);
	} catch(err) {
		res.send(err);
	}
}

module.exports = {
	getQuestions,
	getQuestion,
	addQuestion,
	deleteQuestion,
	updateQuestion,
	publishQuestion
};
