/**
 * Google Apps Script for Workshop Registration Form
 * Handles form submissions from Netlify-deployed React app
 */

// Replace with your actual Google Sheets ID
const SPREADSHEET_ID = '13XxXUFO1egDtZLeEo7VgjuR7-4uBBWCXPKL3FboQsrU';
const SHEET_NAME = 'workshop';

/**
 * Handle POST requests from the registration form
 * Includes proper CORS headers for Netlify deployment
 */
function doPost(e) {
  try {
    // Set CORS headers for cross-origin requests from Netlify
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }
    };

    // Handle preflight OPTIONS request
    if (e.parameter && e.parameter.method === 'OPTIONS') {
      return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Parse JSON data from request body
    let data;
    try {
      if (e.postData && e.postData.contents) {
        data = JSON.parse(e.postData.contents);
      } else {
        throw new Error('No data received');
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid JSON data',
          details: parseError.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Validate required fields
    const requiredFields = ['name', 'age', 'sex', 'district', 'phone', 'previousParticipation', 'dawaDesignation', 'paymentMode'];
    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
    if (missingFields.length > 0) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields',
          missingFields: missingFields
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Additional validation for Ernakulam zone
    if (data.district === 'Ernakulam' && (!data.zone || data.zone.trim() === '')) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Zone is required for Ernakulam district'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Append data to Google Sheets
    const result = appendToSheet(data);
    
    if (result.success) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: 'Registration submitted successfully',
          rowNumber: result.rowNumber
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Failed to save to spreadsheet',
          details: result.error
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    console.error('doPost Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Workshop Registration API is running',
      timestamp: new Date().toISOString(),
      method: 'GET'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Append registration data to Google Sheets
 */
function appendToSheet(data) {
  try {
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers
      const headers = [
        'Timestamp',
        'Name',
        'Age',
        'Sex',
        'District',
        'Zone',
        'Phone',
        'WhatsApp',
        'Previous Participation',
        'Da\'wa Designation',
        'Payment Mode'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }

    // Prepare row data
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name,
      data.age,
      data.sex,
      data.district,
      data.zone || '',
      data.phone,
      data.whatsapp || '',
      data.previousParticipation,
      data.dawaDesignation,
      data.paymentMode
    ];

    // Append the row
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, rowData.length).setValues([rowData]);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, rowData.length);

    return {
      success: true,
      rowNumber: lastRow + 1
    };

  } catch (error) {
    console.error('appendToSheet Error:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test function to verify the script is working
 */
function testScript() {
  const testData = {
    name: 'Test User',
    age: '25',
    sex: 'Male',
    district: 'Ernakulam',
    zone: 'Kochi',
    phone: '9876543210',
    whatsapp: '9876543210',
    previousParticipation: 'No',
    dawaDesignation: 'No',
    paymentMode: 'UPI'
  };

  const result = appendToSheet(testData);
  console.log('Test result:', result);
  return result;
}
