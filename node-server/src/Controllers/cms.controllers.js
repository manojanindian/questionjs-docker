const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/admin");
const questionService = require("../Services/question.services");

const layout = 'layouts/cms';
const dashboardPage= async (req, res, next) => {
	const questions = await questionService.getAllQuestions();
	res.render('cms/dashboard', {layout, questions});
}

const loginPage= (req, res, next) => {
	res.render('cms/login', {layout });
}

module.exports = {
	loginPage,
	dashboardPage
};
