// Student Login JavaScript
// Handles form validation and stores student data

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const studentName = document.getElementById('student-name').value.trim();
    const gradeLevel = document.getElementById('grade-level').value.trim();
    const birthday = document.getElementById('birthday').value.trim();
    const section = document.getElementById('section').value.trim();

    // Validation
    if (!studentName || !birthday || !section) {
        alert("Please fill in all required fields (name, birthday, and section).");
        return;
    }

    // Store student information in localStorage
    localStorage.setItem('studentName', studentName);
    localStorage.setItem('studentGrade', gradeLevel);
    localStorage.setItem('studentBirthday', birthday);
    localStorage.setItem('studentSection', section);
    localStorage.setItem('studentLoginTime', new Date().toISOString());

    // Create URL with query parameters (optional - for backward compatibility)
    const params = new URLSearchParams({
        name: studentName,
        grade: gradeLevel,
        birthday: birthday,
        section: section
    });

    // Navigate to student dashboard
    window.location.href = `studassdb.html?${params.toString()}`;
});