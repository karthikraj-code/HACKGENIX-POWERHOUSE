'use client';
import React, { useState, useEffect } from "react";
import { createClient, saveQuizScore } from '@/lib/database';

export default function QuizzesPage() {
	const [content, setContent] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	// Quiz state
	const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
	const [showResults, setShowResults] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
	const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
	const [scoreSaved, setScoreSaved] = useState(false);

	const handleGenerate = async () => {
		setLoading(true);
		setResult(null);
		setUserAnswers({});
		setShowResults(false);
		setCurrentQuestionIndex(0);
		setAnsweredQuestions([]);
		setQuizStartTime(null);
		setScoreSaved(false);

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
			// Start the quiz timer
			setQuizStartTime(Date.now());
		} catch (err) {
			setResult({ error: "Failed to generate content." });
		}
		setLoading(false);
	};

	// Function to save quiz score to database
	const saveQuizScoreToDatabase = async (questions: any[], correctAnswers: number, score: number, timeTaken: number) => {
		try {
			console.log('🔄 Starting to save quiz score...');
			const supabase = createClient();
			
			// Check if user is authenticated
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			
			if (userError) {
				console.error('❌ User authentication error:', userError);
				return;
			}
			
			if (!user) {
				console.error('❌ No authenticated user found');
				return;
			}
			
			console.log('✅ User authenticated:', user.id);
			
			// Extract quiz topic from content (first 100 characters)
			const quizTopic = content.length > 100 ? content.substring(0, 100) + '...' : content;
			
			const quizData = {
				quizContent: content,
				totalQuestions: questions.length,
				correctAnswers: correctAnswers,
				scorePercentage: score,
				quizTopic: quizTopic,
				timeTakenSeconds: timeTaken,
			};
			
			console.log('📊 Quiz data to save:', quizData);
			
			const saveResult = await saveQuizScore(quizData, user.id);
			
			if (saveResult.success) {
				setScoreSaved(true);
				console.log('✅ Quiz score saved successfully');
			} else {
				console.error('❌ Failed to save quiz score:', saveResult.error);
			}
		} catch (error) {
			console.error('❌ Error saving quiz score:', error);
		}
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
			return (
				<div className="text-center py-12">
					<div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8 max-w-md mx-auto">
						<div className="text-orange-500 text-5xl mb-4">🔍</div>
						<h3 className="text-lg font-semibold text-gray-700 mb-2">No Quiz Found</h3>
						<p className="text-gray-600">Unable to generate quiz questions from the provided content. Please try with different content.</p>
					</div>
				</div>
			);
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

		const handleSubmitAnswer = (e?: React.FormEvent) => {
			if (e) e.preventDefault();
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
			const correctAnswers = questions.filter((q: any, idx: number) => 
				userAnswers[idx] === (q.answer || q.correct)
			).length;
			const score = Math.round((correctAnswers / questions.length) * 100);
			
			// Save score to database if not already saved
			if (!scoreSaved && quizStartTime) {
				const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);
				saveQuizScoreToDatabase(questions, correctAnswers, score, timeTaken);
			}
			
			return (
				<div className="space-y-8 animate-fadeIn">
					{/* Results Header */}
					<div className="text-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white rounded-3xl p-10 shadow-2xl">
						<div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-6">
							<span className="text-5xl">🎉</span>
						</div>
						<h2 className="text-4xl font-bold mb-4">Quiz Complete!</h2>
						<div className="text-2xl opacity-90 mb-6">
							Score: {correctAnswers}/{questions.length} ({score}%)
						</div>
						<div className={`inline-block px-6 py-3 rounded-full text-lg font-bold shadow-lg ${
							score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
							score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-pink-600'
						}`}>
							{score >= 80 ? '🏆 Excellent!' : 
							 score >= 60 ? '👍 Good Job!' : '💪 Keep Practicing!'}
						</div>
					</div>

					{/* Detailed Results */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
						<div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
									<span className="text-white text-sm">📊</span>
								</div>
								<h3 className="text-xl font-bold text-gray-800">Detailed Results</h3>
							</div>
						</div>
						<div className="divide-y divide-gray-100">
							{questions.map((q: any, idx: number) => {
								const isCorrect = userAnswers[idx] === (q.answer || q.correct);
								return (
									<div key={idx} className="p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300">
										<div className="flex items-start gap-6">
											<div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${
												isCorrect ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white' : 'bg-gradient-to-br from-red-400 to-pink-600 text-white'
											}`}>
												{isCorrect ? '✓' : '✗'}
											</div>
											<div className="flex-1">
												<p className="font-bold text-gray-900 mb-4 text-lg">
													Q{idx + 1}: {q.questionText || q.question || q.prompt || q.text}
												</p>
												<div className="space-y-3">
													<div className="flex items-center gap-3">
														<span className="text-sm font-semibold text-gray-600">Your answer:</span>
														<span className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm ${
															isCorrect ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
														}`}>
															{userAnswers[idx]}
														</span>
													</div>
													{!isCorrect && (
														<div className="flex items-center gap-3">
															<span className="text-sm font-semibold text-gray-600">Correct answer:</span>
															<span className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
																{q.answer || q.correct}
															</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="text-center">
						<button
							onClick={() => {
								setCurrentQuestionIndex(0);
								setUserAnswers({});
								setAnsweredQuestions([]);
								setShowResults(false);
							}}
							className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
						>
							<span>🔄</span>
							Restart Quiz
						</button>
					</div>
				</div>
			);
		}

		return (
			<div className="space-y-6 animate-slideUp">
				{/* Question Header */}
				<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6">
					<div className="flex justify-between items-center mb-4">
						<div>
							<h2 className="text-2xl font-bold">Question {currentQuestionIndex + 1}</h2>
							<p className="text-blue-100">of {questions.length}</p>
						</div>
						<div className="text-right">
							<div className="text-sm text-blue-100">Progress</div>
							<div className="text-xl font-semibold">{answeredQuestions.length}/{questions.length}</div>
						</div>
					</div>
					
					{/* Progress bar */}
					<div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
						<div
							className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500 ease-out"
							style={{ width: `${(answeredQuestions.length / questions.length) * 100}%` }}
						></div>
					</div>
				</div>
				
				{/* Question Card */}
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="p-8">
						<div className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
							{currentQuestion.questionText || currentQuestion.question || currentQuestion.prompt || currentQuestion.text}
						</div>
						
						{currentQuestion.options && (
							<div className="space-y-3">
								{currentQuestion.options.map((opt: string, i: number) => {
									const isSelected = userAnswers[currentQuestionIndex] === opt;
									const letters = ['A', 'B', 'C', 'D', 'E'];
									
									return (
										<label key={i} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
											isSelected 
												? 'border-blue-500 bg-blue-50 shadow-md' 
												: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
										} ${showResults ? 'cursor-default' : ''}`}>
											<div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
												isSelected 
													? 'bg-blue-500 text-white' 
													: 'bg-gray-200 text-gray-600'
											}`}>
												{letters[i]}
											</div>
											<input
												type="radio"
												name={`question-${currentQuestionIndex}`}
												value={opt}
												checked={isSelected}
												onChange={() => handleSelect(currentQuestionIndex, opt)}
												disabled={showResults}
												className="sr-only"
											/>
											<span className={`flex-1 text-gray-700 ${isSelected ? 'font-medium' : ''}`}>
												{opt}
											</span>
										</label>
									);
								})}
							</div>
						)}
						
						{showResults && (currentQuestion.answer || currentQuestion.correct) && (
							<div className={`mt-6 p-4 rounded-xl border-l-4 animate-slideDown ${
								userAnswers[currentQuestionIndex] === (currentQuestion.answer || currentQuestion.correct) 
									? 'bg-green-50 border-green-500' 
									: 'bg-red-50 border-red-500'
							}`}>
								<div className="flex items-center gap-2">
									<span className={`text-2xl ${
										userAnswers[currentQuestionIndex] === (currentQuestion.answer || currentQuestion.correct)
											? 'text-green-600'
											: 'text-red-600'
									}`}>
										{userAnswers[currentQuestionIndex] === (currentQuestion.answer || currentQuestion.correct) ? '🎉' : '❌'}
									</span>
									<span className={`font-semibold ${
										userAnswers[currentQuestionIndex] === (currentQuestion.answer || currentQuestion.correct)
											? 'text-green-700'
											: 'text-red-700'
									}`}>
										{userAnswers[currentQuestionIndex] === (currentQuestion.answer || currentQuestion.correct)
											? 'Excellent! That\'s correct!'
											: `Not quite right. The correct answer is: ${currentQuestion.answer || currentQuestion.correct}`
										}
									</span>
								</div>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="bg-gray-50 px-8 py-6 flex gap-4">
						{!showResults ? (
							<>
								<button
									onClick={handleSubmitAnswer}
									className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
										hasAnsweredCurrent
											? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 shadow-lg'
											: 'bg-gray-300 text-gray-500 cursor-not-allowed'
									}`}
									disabled={!hasAnsweredCurrent}
								>
									Submit Answer
								</button>
								<button
									onClick={handleSkip}
									className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-all duration-200"
								>
									Skip
								</button>
							</>
						) : (
							<button
								onClick={handleNext}
								className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
							>
								{isLastQuestion ? '🏁 Show Final Results' : '➡️ Next Question'}
							</button>
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8 md:py-16">
				{/* Header */}
				<header className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
						<span className="text-3xl">🧠</span>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold font-headline bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
						Smart Quiz Generator
					</h1>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
						Transform your content into interactive learning experiences. Paste any educational material and let our AI create engaging quiz questions to test your knowledge.
					</p>
				</header>

				{/* Content Input Section */}
				<div className="max-w-4xl mx-auto">
					<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
						<div className="mb-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
									<span className="text-white text-lg">📝</span>
								</div>
								<label className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
									Your Content
								</label>
							</div>
							<textarea
								className="w-full p-6 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 resize-none text-gray-700 bg-gray-50/50 hover:bg-white/80 focus:bg-white"
								rows={8}
								placeholder="Paste your study material, article, or any educational content here. Our AI will analyze it and create engaging quiz questions for you..."
								value={content}
								onChange={e => setContent(e.target.value)}
							/>
							<div className="flex justify-between items-center mt-3">
								<span className="text-sm text-gray-500 font-medium">
									{content.length} characters
								</span>
								{content.length > 0 && (
									<div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										Ready to generate
									</div>
								)}
							</div>
						</div>
					
						<button
							className={`w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
								loading 
									? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
									: content 
										? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 hover:scale-105 text-white shadow-xl hover:shadow-2xl'
										: 'bg-gray-300 text-gray-500 cursor-not-allowed'
							}`}
							onClick={handleGenerate}
							disabled={loading || !content}
						>
							{loading ? (
								<div className="flex items-center justify-center gap-3 text-white">
									<div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
									<span>Generating Amazing Quizzes...</span>
								</div>
							) : (
								<div className="flex items-center justify-center gap-3 text-white">
									<span className="text-2xl">🚀</span>
									<span>Generate Interactive Quiz</span>
								</div>
							)}
						</button>
					</div>
				</div>

				{/* Quiz Results */}
				{result && (
					<div className="max-w-4xl mx-auto animate-fadeIn">
						{result.error ? (
							<div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-8 text-center shadow-xl">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
									<span className="text-red-500 text-3xl">⚠️</span>
								</div>
								<h3 className="text-2xl font-bold text-red-700 mb-3">Oops! Something went wrong</h3>
								<p className="text-red-600 mb-6 text-lg">{result.error}</p>
								{result.details && (
									<details className="text-sm text-red-500 bg-red-100 p-4 rounded-xl border border-red-200">
										<summary className="cursor-pointer font-semibold">Technical Details</summary>
										<p className="mt-3">{result.details}</p>
									</details>
								)}
							</div>
						) : (
							renderQuizzes(result)
						)}
					</div>
				)}
			</div>

			{/* Custom Styles */}
			<style jsx>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				
				@keyframes slideUp {
					from { 
						opacity: 0;
						transform: translateY(20px);
					}
					to { 
						opacity: 1;
						transform: translateY(0);
					}
				}
				
				@keyframes slideDown {
					from { 
						opacity: 0;
						transform: translateY(-10px);
					}
					to { 
						opacity: 1;
						transform: translateY(0);
					}
				}
				
				.animate-fadeIn {
					animation: fadeIn 0.6s ease-out;
				}
				
				.animate-slideUp {
					animation: slideUp 0.5s ease-out;
				}
				
				.animate-slideDown {
					animation: slideDown 0.3s ease-out;
				}
			`}</style>
		</div>
	);
}