const Question = require("../Models/question");

const getQuestions = async () => {
    const response = await Question.find({published: true}).select({ "question": 1, "questionId": 1, "_id": 0});
    return response;
}

const getAllQuestions = async () => {
    const response = await Question.find().select({ "published": 1, "question": 1, "questionId": 1, "_id": 0}).sort('-createdAt');
    return response;
}

const getQuestion = async (questionId) => {
	const response = await Question.findOne({questionId});
    return response;
}

module.exports = {
    getQuestions,
	getQuestion,
    getAllQuestions
}