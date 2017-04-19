'use strict';
class Test {
	constructor(question, answers, correct) {
		this.question = question;
		this.answers = answers;
		this.correct = correct;
	}
}

class TestCheckbox extends Test {
	constructor(question, answers, correct) {
		super(question, answers, correct);
	}
	typeOfCheck(checkboxAnswer) {
		checkboxAnswer.setAttribute('type', 'checkbox');
	}
}

class TestRadio extends Test {
	constructor(question, answers, correct) {
		super(question, answers, correct);
	}
	typeOfCheck(checkboxAnswer) {
		checkboxAnswer.setAttribute('type', 'radio');
	}
}

class Modal {
	constructor(wrapper, modalDiv, modalOverlay, modalMessage, modalButton, form) {
		this.wrapper = wrapper;
		this.modalDiv = modalDiv ;
		this.modalOverlay = modalOverlay;
		this.modalMessage = modalMessage;
		this.modalButton = modalButton;
		this.form = form;
	}
	createModal(text) {
		modalDiv.className = 'modal';
		modalOverlay.className = 'modal__overlay';
		modalMessage.className = 'modal__message';
		modalButton.className = 'modal__button';
		modalButton.innerHTML = 'Add more question';
		modalMessage.innerHTML = text || 'Thank You for adding new answer';

		wrapper.appendChild(modalOverlay);
		wrapper.appendChild(modalDiv);
		modalDiv.appendChild(modalMessage);
		modalDiv.appendChild(modalButton);

		modalButton.addEventListener('click', this.hideModal);
	}
	hideModal() {
		modalDiv.remove();
		modalOverlay.remove();
	}
	clearForm(form, section) {
		form.reset();
		section.innerHTML = '';
	}
}
class TestConstructor extends Modal {
	constructor() {
		super();
	}
	addNewAnswer(e) {
		e.preventDefault();
		let testBlock = document.createElement('div'),
				testSection = document.getElementById('test__section'),
				checkboxAnswer = document.createElement('input'),
				inputAnswer = document.createElement('input');

		testBlock.className = 'test__block';

		checkboxAnswer.className = 'test__right-answer';
		checkboxAnswer.setAttribute('type', 'checkbox');

		inputAnswer.className = 'test__answer';
		inputAnswer.setAttribute('type', 'text');

		testSection.appendChild(testBlock);
		testBlock.appendChild(checkboxAnswer);
		testBlock.appendChild(inputAnswer);
	}
	removeLastAnswer(e) {
		e.preventDefault();
		let testSection = document.getElementById('test__section');

		if (testSection.childNodes.length !== 0) {
			let last = testSection.lastChild;
			testSection.removeChild(last);
		}
		return false;
	}
	checkingCheckboxes(checkboxArr) {
		let checkedArr = Array.from(checkboxArr, function (item) {
			return item.checked;
		});
		return checkedArr;
	}
	recordingAllAnswers(answersArr) {
		let allValuesArr = [];
		for (let i = 0; i < answersArr.length; i++) {
			let answer = answersArr[i];
			allValuesArr.push(answer.value);
		}
		return allValuesArr;
	}
	recordingRightAnswers(checkedAnswersArr, allAnswersArr) {
		let rightValuesArr = [];
		for (let i = 0; i < allAnswersArr.length; i++ ) {
			if (checkedAnswersArr[i]) {
				rightValuesArr.push(allAnswersArr[i]);
			}
		}
		return rightValuesArr;
	}
	checkingAnswers() {
		let section = document.getElementById('test__section'),
				questionInput = document.querySelector('.test__question'),
				answersInput = document.querySelectorAll('.test__answer'),
				checkboxes = document.querySelectorAll('.test__right-answer'),
				questionValue = questionInput.value,
				allAnswersArr = this.recordingAllAnswers(answersInput),
				checkedCheckboxes = this.checkingCheckboxes(checkboxes),
				rightAnswersArr = this.recordingRightAnswers(checkedCheckboxes, allAnswersArr);
		if (rightAnswersArr.length === allAnswersArr.length) {
			this.createModal('You should have to check-off at least 1 incorrect answer');
		}	else if (rightAnswersArr.length === 1) {
			let newObj = new TestRadio(questionValue, allAnswersArr, rightAnswersArr);
			toLocalStorage.push(newObj);
			this.createModal();
			this.clearForm(form, section);
		} else if (rightAnswersArr.length >= 2) {
			let newObj = new TestCheckbox(questionValue, allAnswersArr, rightAnswersArr);
			toLocalStorage.push(newObj);
			this.createModal();
			this.clearForm(form, section);
		} else {
			this.createModal('Please fill the form');
		}
		localStorage.setItem('test', JSON.stringify(toLocalStorage));
	}
	consoleLog() {
		let stringTest = JSON.parse(localStorage.getItem('test'));
		for (let i = 0; i < stringTest.length; i++) {
			console.log(i + "--" + "Question");
			console.log("Question: ", stringTest[i].question);
			console.log("Answers: ", stringTest[i].answers);
			console.log("Right answers: ", stringTest[i].correct);
			console.log('********************************');
		}
	}

}

let	buttonAnswer = document.querySelector('.test__button_answer'),
		buttonRemove = document.querySelector('.test__button_remove'),
		buttonQuestion = document.querySelector('.test__button_question'),
		buttonCreate = document.querySelector('.test__button_create'),
		form = document.getElementsByTagName('form')[0],
		wrapper = document.querySelector('.test'),
		modalDiv = document.createElement('div'),
		modalOverlay = document.createElement('div'),
		modalMessage = document.createElement('p'),
		modalButton = document.createElement('button'),
		toLocalStorage = [];

let test = new TestConstructor(wrapper, modalDiv, modalOverlay, modalMessage, modalButton, form);

buttonAnswer.addEventListener('click', test.addNewAnswer);
buttonRemove.addEventListener('click', test.removeLastAnswer);
buttonQuestion.addEventListener('click',  () => test.checkingAnswers());
buttonCreate.addEventListener('click', () => test.consoleLog());