// Student Login/Signup JavaScript
// Handles both student login and registration with Firestore integration

// Firebase Configuration (same as other files)
const firebaseConfig = {
    apiKey: "AIzaSyBLUXbAALnqjtLyQNCktQO8eS1TKvE6-Dc",
    authDomain: "edumetrics-62601.firebaseapp.com",
    projectId: "edumetrics-62601",
    storageBucket: "edumetrics-62601.firebasestorage.app",
    messagingSenderId: "1008049617356",
    appId: "1:1008049617356:web:ce2aa07a1ebc3533444569",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Detect if we're on signup or login page
const isSignupPage = document.querySelector('h2').textContent.includes('Sign Up');

// Form submission handler
document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const studentName = document.getElementById('student-name').value.trim();
    const birthday = document.getElementById('birthday').value.trim();
    
    // Common validation for both signup and login
    if (!studentName || !birthday) {
        showCustomAlert('Validation Error', 'Please fill in all required fields (name and birthday).');
        return;
    }

    if (isSignupPage) {
        // Handle Signup Logic
        await handleSignup(studentName, birthday);
    } else {
        // Handle Login Logic
        await handleLogin(studentName, birthday);
    }
});

// Signup function - Save to Firestore + LocalStorage + Redirect
async function handleSignup(studentName, birthday) {
    try {
        // Get additional fields for signup
        const gradeLevel = document.getElementById('grade-level')?.value.trim() || 'Grade 6';
        const section = document.getElementById('section')?.value.trim() || '';

        if (!section) {
            showCustomAlert('Validation Error', 'Please select your section.');
            return;
        }

        // Check if student already exists
        const existingStudent = await db.collection('students')
            .where('name', '==', studentName)
            .where('birthday', '==', birthday)
            .limit(1)
            .get();

        if (!existingStudent.empty) {
            showCustomAlert('Registration Error', 'A student with this name and birthday already exists. Please use the login page instead.');
            return;
        }

        // Save to Firestore
        await db.collection('students').add({
            name: studentName,
            birthday: birthday,
            grade: gradeLevel,
            section: section,
            registrationDate: new Date().toISOString(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Store student information in localStorage
        localStorage.setItem('studentName', studentName);
        localStorage.setItem('studentGrade', gradeLevel);
        localStorage.setItem('studentBirthday', birthday);
        localStorage.setItem('studentSection', section);
        localStorage.setItem('studentLoginTime', new Date().toISOString());
        localStorage.setItem('isNewStudent', 'true');

        // Create URL with query parameters
        const params = new URLSearchParams({
            name: studentName,
            grade: gradeLevel,
            birthday: birthday,
            section: section
        });

        showCustomAlert('Registration Successful', 'Welcome! Your account has been created successfully.');

        // Navigate to student dashboard
        setTimeout(() => {
            window.location.href = `studassdb.html?${params.toString()}`;
        }, 1500);

    } catch (error) {
        console.error('Signup error:', error);
        showCustomAlert('Registration Error', 'There was an error creating your account. Please try again.');
    }
}

// Login function - Check Firestore + LocalStorage + Redirect or Error
async function handleLogin(studentName, birthday) {
    try {
        // Check Firestore for matching student
        const querySnapshot = await db.collection('students')
            .where('name', '==', studentName)
            .where('birthday', '==', birthday)
            .limit(1)
            .get();

        if (querySnapshot.empty) {
            showCustomAlert('Login Failed', 'No student found with this name and birthday combination. Please check your information or register as a new student.');
            return;
        }

        // Student found, get their data
        const studentDoc = querySnapshot.docs[0];
        const studentData = studentDoc.data();

        // Store student information in localStorage
        localStorage.setItem('studentName', studentData.name);
        localStorage.setItem('studentGrade', studentData.grade || 'Grade 6');
        localStorage.setItem('studentBirthday', studentData.birthday);
        localStorage.setItem('studentSection', studentData.section);
        localStorage.setItem('studentLoginTime', new Date().toISOString());
        localStorage.setItem('isNewStudent', 'false');
        localStorage.setItem('studentId', studentDoc.id);

        // Create URL with query parameters
        const params = new URLSearchParams({
            name: studentData.name,
            grade: studentData.grade || 'Grade 6',
            birthday: studentData.birthday,
            section: studentData.section
        });

        showCustomAlert('Login Successful', `Welcome back, ${studentData.name}!`);

        // Navigate to student dashboard
        setTimeout(() => {
            window.location.href = `studassdb.html?${params.toString()}`;
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        showCustomAlert('Login Error', 'There was an error during login. Please try again.');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log(`Student ${isSignupPage ? 'Signup' : 'Login'} page loaded`);
    
    // Add any page-specific initialization here
    if (isSignupPage) {
        console.log('Student registration page');
    } else {
        console.log('Student login page');
    }
});