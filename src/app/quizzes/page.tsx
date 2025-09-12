'use client';
import React, { useState } from "react";
// Remove direct AI imports; use API route instead

export default function QuizzesPage() {
	const [content, setContent] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	// Quiz state
	const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
	const [showResults, setShowResults] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

	const handleGenerate = async () => {
		setLoading(true);
		setResult(null);
		setUserAnswers({});
		setShowResults(false);
		setCurrentQuestionIndex(0);
		setAnsweredQuestions([]);

		try {
			console.log('🚀 Generating quizzes');
			const response = await fetch('/api/generate-content', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, feature: "quizzes" })
			});

			const data = await response.json();
			console.log('📡 Raw API Response:', data);

			// If response is a stringified JSON, parse it
			let parsed = data;
			if (typeof data.text === 'string') {
				try {
					// Remove any json or  markers that might be in the response
					const cleanJson = data.text.replace(/json\n?|\n?/g, '').trim();
					console.log('🧹 Cleaned JSON string:', cleanJson);
					parsed = JSON.parse(cleanJson);
					console.log('🎯 Successfully parsed JSON:', parsed);
				} catch (error) {
					console.error('❌ JSON Parse Error:', error);
					console.log('Failed to parse text:', data.text);
					setResult({
						error: "Failed to parse quiz data. Please try again.",
						details: error instanceof Error ? error.message : 'Unknown error',
						rawResponse: data.text
					});
					return;
				}
			}

			// For quizzes, use the parsed data as is
			setResult(parsed);
		} catch (err) {
			setResult({ error: "Failed to generate content." });
		}
		setLoading(false);
	};

	// Helper to render quizzes
const renderQuizzes = (quizJson: any) => {
  console.log('🔍 Received quiz JSON:', quizJson);
  let questions = [];
  
  // Handle nested result structure
  const data = quizJson?.result || quizJson;
  
  if (data?.quiz && Array.isArray(data.quiz)) {
    console.log('📋 Using quiz array from data.quiz');
    questions = data.quiz;
  } else if (data?.questions && Array.isArray(data.questions)) {
    console.log('📋 Using quiz array from data.questions');
    questions = data.questions;
  } else if (Array.isArray(data)) {
    console.log('📋 Using data directly as questions array');
    questions = data;
  }

  // Additional debug logging
  console.log('  Data structure:', {
    hasResult: !!quizJson?.result,
    hasQuiz: !!data?.quiz,
    hasQuestions: !!data?.questions,
    isArray: Array.isArray(data),
    questionsLength: questions.length
  });

  if (!questions.length) {
    console.warn('⚠ No questions found in quiz data');
    return <div>No quiz data found.</div>;
  }

			const handleSelect = (qIdx: number, option: string) => {
				console.log(`✏ Question ${qIdx + 1} selected answer:`, option);
				setUserAnswers((prev: { [key: number]: string }) => {
					const newAnswers = { ...prev, [qIdx]: option };
					console.log('📝 Updated user answers:', newAnswers);
					return newAnswers;
				});
			};

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			console.log('✅ Quiz submitted. User answers:', userAnswers);
			setShowResults(true);
			console.log('🎯 Show results enabled');
		};

		const handleNext = () => {
			if (currentQuestionIndex < questions.length - 1) {
				setCurrentQuestionIndex(prev => prev + 1);
				setShowResults(false);
			} else if (!answeredQuestions.includes(currentQuestionIndex)) {
				setAnsweredQuestions(prev => [...prev, currentQuestionIndex]);
				setShowResults(true);
			}
		};

		const handleSkip = () => {
			if (currentQuestionIndex < questions.length - 1) {
				setCurrentQuestionIndex(prev => prev + 1);
				setShowResults(false);
			}
		};

		const handleSubmitAnswer = (e: React.FormEvent) => {
			e.preventDefault();
			if (!answeredQuestions.includes(currentQuestionIndex)) {
				setAnsweredQuestions(prev => [...prev, currentQuestionIndex]);
			}
			setShowResults(true);
		};

		const currentQuestion = questions[currentQuestionIndex];
		const isLastQuestion = currentQuestionIndex === questions.length - 1;
		const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== undefined;
		const allQuestionsAnswered = answeredQuestions.length === questions.length;

		if (allQuestionsAnswered && showResults) {
			// Show final results
			return (
				<div className="space-y-4">
					<h2 className="text-xl font-bold mb-4">Quiz Complete!</h2>
					<div className="bg-white p-4 rounded shadow">
						{questions.map((q: any, idx: number) => (
							<div key={idx} className="mb-4 p-3 border-b">
								<p className="font-semibold">Q{idx + 1}: {q.questionText || q.question || q.prompt || q.text}</p>
								<p className="mt-2">Your answer: {userAnswers[idx]}</p>
								<p className={`mt-1 ${userAnswers[idx] === (q.answer || q.correct) ? 'text-green-600' : 'text-red-600'}`}>
									Correct answer: {q.answer || q.correct}
								</p>
							</div>
						))}
						<button
							onClick={() => {
								setCurrentQuestionIndex(0);
								setUserAnswers({});
								setAnsweredQuestions([]);
								setShowResults(false);
							}}
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Restart Quiz
						</button>
					</div>
				</div>
			);
		}

		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</h2>
					<div className="text-sm text-gray-600">
						Answered: {answeredQuestions.length}/{questions.length}
					</div>
				</div>
				
				<form className="bg-white p-6 rounded shadow" onSubmit={handleSubmitAnswer}>
					<div className="font-semibold mb-4">
						{currentQuestion.questionText || currentQuestion.question || currentQuestion.prompt || currentQuestion.text}
					</div>
					{currentQuestion.options && (
						<div className="flex flex-col gap-3 ml-4">
							{currentQuestion.options.map((opt: string, i: number) => (
								<label key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
									<input
										type="radio"
										name={`question-${currentQuestionIndex}`}
										value={opt}
										checked={userAnswers[currentQuestionIndex] === opt}
										onChange={() => handleSelect(currentQuestionIndex, opt)}
										disabled={showResults}
										className="text-blue-500"
									/>
									{opt}
								</label>
							))}
						</div>
					)}
					
					{showResults && (currentQuestion.answer || currentQuestion.correct) && (
						<div className={`mt-4 p-3 rounded ${userAnswers[currentQuestionIndex] === (currentQuestion.answer || currentQuestion.correct) ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
							{userAnswers[currentQuestionIndex] === (currentQuestion.answer || currentQuestion.correct)
								? '✅ Correct!'
								: `❌ Incorrect. The correct answer is: ${currentQuestion.answer || currentQuestion.correct}`
							}
						</div>
					)}

					<div className="flex gap-3 mt-6">
						{!showResults ? (
							<>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
									disabled={!hasAnsweredCurrent}
								>
									Submit Answer
								</button>
								<button
									type="button"
									onClick={handleSkip}
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
								>
									Skip
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={handleNext}
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
							>
								{isLastQuestion ? 'Show Results' : 'Next Question'}
							</button>
						)}
					</div>
				</form>

				{/* Progress bar */}
				<div className="w-full bg-gray-200 rounded-full h-2.5">
					<div
						className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
						style={{ width: `${(answeredQuestions.length / questions.length) * 100}%` }}
					></div>
				</div>
			</div>
		);
	};

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Quizzes</h1>
			<textarea
				className="w-full p-2 border rounded mb-4"
				rows={5}
				placeholder="Paste your content here..."
				value={content}
				onChange={e => setContent(e.target.value)}
			/>
			<button
				className="px-4 py-2 bg-green-500 text-white rounded"
				onClick={handleGenerate}
				disabled={loading || !content}
			>
				{loading ? "Generating..." : "Generate Quizzes"}
			</button>
			<div className="mt-6">
				{result && renderQuizzes(result)}
			</div>
		</div>
	);
}
