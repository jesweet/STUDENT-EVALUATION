// Student Login/Signup JavaScript
// Handles both student login and registration with Firestore integration

// Firebase is already initialized in the HTML files
// const db = firebase.firestore(); // Already declared in HTML

// Detect if we're on signup or login page by checking URL and form ID
const isSignupPage = window.location.pathname.includes('studsignup.html') ||
                     document.querySelector('form')?.id === 'signupForm' ||
                     document.querySelector('h2')?.textContent.includes('Sign Up');

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    console.log(`Student ${isSignupPage ? 'Signup' : 'Login'} page loaded`);
    
    // Add any page-specific initialization here
    if (isSignupPage) {
        console.log('Student registration page');
    } else {
        console.log('Student login page');
    }

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function(event) {
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
    } else {
        console.error('Form not found on page');
    }
});

// Signup function - Save to Firestore + LocalStorage + Redirect
async function handleSignup(studentName, birthday) {
    try {
        // Get additional fields for signup - check for Name, Birthday, Section
        const section = document.getElementById('section')?.value.trim() || '';
        const gradeLevel = document.getElementById('grade-level')?.value.trim() || 'Grade 6';

        // Check if all fields are filled (Name, Birthday, Section)
        if (!section) {
            showCustomAlert('Validation Error', 'Please fill in all required fields (Name, Birthday, and Section).');
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

        // Save to Firestore students collection
        await db.collection('students').add({
            name: studentName,
            birthday: birthday,
            grade: gradeLevel,
            section: section,
            registrationDate: new Date().toISOString(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Save to localStorage
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

        // Redirect to studassdb.html (dashboard) first
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
        // Query the students collection in Firestore matching studentName AND birthday
        const querySnapshot = await db.collection('students')
            .where('name', '==', studentName)
            .where('birthday', '==', birthday)
            .limit(1)
            .get();

        // If NOT found: Show modal/alert and do NOT redirect
        if (querySnapshot.empty) {
            showCustomAlert('Student Not Found', 'Student not found. Please sign up first.');
            return;
        }

        // If found: Get the section from the database result
        const studentDoc = querySnapshot.docs[0];
        const studentData = studentDoc.data();
        const studentSection = studentData.section;

        // Save studentName, studentBirthday, AND studentSection to localStorage
        localStorage.setItem('studentName', studentData.name);
        localStorage.setItem('studentBirthday', studentData.birthday);
        localStorage.setItem('studentSection', studentSection);
        localStorage.setItem('studentGrade', studentData.grade || 'Grade 6');
        localStorage.setItem('studentLoginTime', new Date().toISOString());
        localStorage.setItem('isNewStudent', 'false');
        localStorage.setItem('studentId', studentDoc.id);

        // Create URL with query parameters
        const params = new URLSearchParams({
            name: studentData.name,
            grade: studentData.grade || 'Grade 6',
            birthday: studentData.birthday,
            section: studentSection
        });

        showCustomAlert('Login Successful', `Welcome back, ${studentData.name}!`);

        // Redirect to studassdb.html (dashboard) first
        setTimeout(() => {
            window.location.href = `studassdb.html?${params.toString()}`;
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        showCustomAlert('Login Error', 'There was an error during login. Please try again.');
    }
}