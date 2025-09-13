// Test script to verify summarizer content flow
const testContent = `
Artificial Intelligence (AI) is revolutionizing the way we learn and interact with technology. 

In the education sector, AI-powered tools are providing personalized learning experiences that adapt to individual student needs. These systems analyze learning patterns, identify knowledge gaps, and create customized curricula that help students achieve better outcomes.

Machine learning algorithms can process vast amounts of educational data to predict student performance, recommend resources, and even detect early signs of learning difficulties. This proactive approach allows educators to intervene early and provide targeted support.

Natural language processing enables AI tutors to engage in meaningful conversations with students, answering questions and providing explanations in real-time. These virtual assistants are available 24/7, offering consistent support regardless of time zones or geographical locations.

The integration of AI in education is not about replacing teachers, but rather augmenting their capabilities. By automating routine tasks like grading and providing detailed analytics, AI frees up educators to focus on what they do best: inspiring and mentoring students.

As we move forward, the collaboration between human educators and AI systems will likely create more effective, accessible, and engaging learning environments for students worldwide.
`;

console.log('=== Summarizer Content Test ===');
console.log('Content length:', testContent.length, 'characters');
console.log('First 200 chars:', testContent.substring(0, 200));
console.log('Last 200 chars:', testContent.substring(testContent.length - 200));

// Test with actual summarizer
async function testSummarizer() {
  try {
    console.log('\n=== Testing with actual summarizer ===');
    
    // Import the actual summarizer
    const { getResourceSummary } = await import('./src/app/actions.js');
    
    console.log('Calling getResourceSummary...');
    const result = await getResourceSummary({ resourceContent: testContent });
    
    if (result.error) {
      console.error('Summarizer error:', result.error);
    } else {
      console.log('✅ Summarizer successful');
      console.log('Summary length:', result.data?.summary?.length || 0, 'characters');
      console.log('Summary:', result.data?.summary);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testSummarizer();