/**
 * Integration Test Script for Workshop Registration Form
 * Run this in browser console to test the form submission
 */

async function testFormSubmission() {
  console.log('🧪 Testing Workshop Registration Form Integration...');
  
  // Test data
  const testData = {
    name: "Test User",
    age: "25",
    sex: "Male",
    district: "Ernakulam",
    zone: "Kochi",
    phone: "9876543210",
    whatsapp: "9876543210",
    previousParticipation: "No",
    dawaDesignation: "No",
    paymentMode: "UPI"
  };

  // Get the submit URL from environment
  const submitUrl = import.meta.env.VITE_SUBMIT_URL || "https://script.google.com/macros/s/AKfycbw29TxNEwm0ATk9DxeXcbj9eyHEY58tHexqZm3r_Sp94gkaWe6sK7G5zjXS8RQ3qGaqCQ/exec";
  
  if (!submitUrl) {
    console.error('❌ VITE_SUBMIT_URL not found in environment variables');
    return;
  }
  
  console.log('✅ Submit URL found:', submitUrl);
  console.log('📤 Sending test data:', testData);

  try {
    const response = await fetch(submitUrl, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📥 Response data:', result);

    if (response.ok && result.success) {
      console.log('✅ Test submission successful!');
      console.log('📊 Row added to Google Sheets:', result.rowNumber);
    } else {
      console.error('❌ Test submission failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Run the test
testFormSubmission();
