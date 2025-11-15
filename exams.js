    // DOM Elements
        const authSection = document.getElementById('auth-section');
        const examSection = document.getElementById('exam-section');
        const adminSection = document.getElementById('admin-section');
        const expiredCard = document.getElementById('expired-card');
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const authTabs = document.querySelectorAll('.auth-tab');
        const roleButtons = document.querySelectorAll('.role-btn');
        const userInfo = document.getElementById('user-info');
        const usernameSpan = document.getElementById('username');
        const roleBadge = document.getElementById('role-badge');
        const switchRoleBtn = document.getElementById('switch-role-btn');
        const timerElement = document.getElementById('timer');
        const profileTimerElement = document.getElementById('profile-timer');
        const pdfViewer = document.getElementById('pdf-viewer');
        const pdfUpload = document.getElementById('pdf-upload');
        const browseBtn = document.getElementById('browse-btn');
        const uploadArea = document.getElementById('upload-area');
        const uploadStatus = document.getElementById('upload-status');
        const screenshotNotification = document.getElementById('screenshot-notification');
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        const resultsBody = document.getElementById('results-body');
        const adminResultsBody = document.getElementById('admin-results-body');
        const addResultBtn = document.getElementById('add-result-btn');
        const saveSettingsBtn = document.getElementById('save-settings');
        const answerUpload = document.getElementById('answer-upload');
        const browseAnswersBtn = document.getElementById('browse-answers-btn');
        const answerUploadArea = document.getElementById('answer-upload-area');
        const uploadedAnswers = document.getElementById('uploaded-answers');
        const submitAnswersBtn = document.getElementById('submit-answers-btn');
        const clearAnswersBtn = document.getElementById('clear-answers-btn');
        const submissionStatus = document.getElementById('submission-status');
        const submissionsBody = document.getElementById('submissions-body');
        const studentSwitchBtn = document.getElementById('student-switch-btn');
        const studentLogoutBtn = document.getElementById('student-logout-btn');
        const adminSwitchBtn = document.getElementById('admin-switch-btn');
        const adminLogoutBtn = document.getElementById('admin-logout-btn');
        const certificateSection = document.getElementById('certificate-section');
        const downloadCertificateBtn = document.getElementById('download-certificate');
        const certificatesBody = document.getElementById('certificates-body');
        const assessmentList = document.getElementById('assessment-list');
        
        // Student form elements
        const studentFullname = document.getElementById('student-fullname');
        const studentEmail = document.getElementById('student-email');
        const studentId = document.getElementById('student-id');
        const studentCourse = document.getElementById('student-course');
        const studentJob = document.getElementById('student-job');
        const studentPhoto = document.getElementById('student-photo');
        const studentNotes = document.getElementById('student-notes');
        
        // Certificate elements
        const certificateName = document.getElementById('certificate-name');
        const certificateExam = document.getElementById('certificate-exam');
        const certificateScore = document.getElementById('certificate-score');
        const certificateGrade = document.getElementById('certificate-grade');
        const certificateDate = document.getElementById('certificate-date');
        const certificatePhoto = document.getElementById('certificate-photo');
        
        // Application State
        let examDuration = 120; // minutes
        let passingScore = 60; // percentage
        let timerInterval;
        let endTime;
        let currentRole = 'student'; // 'student' or 'admin'
        let uploadedFiles = [];
        let studentSubmissions = [];
        let currentUser = null;
        
        // Sample student accounts (in a real app, this would be a database)
        let studentAccounts = [
            { id: 'ST001', email: 'student1@kps.edu', password: 'password123', name: 'John Doe', course: 'Computer Science', photo: null },
            { id: 'ST002', email: 'student2@kps.edu', password: 'password123', name: 'Jane Smith', course: 'Business Administration', photo: null }
        ];
        
        // Admin account
        const adminAccount = { email: 'admin@kps.edu', password: 'KPS@admin2023', name: 'Administrator' };
        
        // Sample student results data
        let studentResults = [
            { id: 'ST001', name: 'John Doe', score: 85, grade: 'A', remarks: 'Excellent', status: 'Completed', certificate: true },
            { id: 'ST002', name: 'Jane Smith', score: 72, grade: 'B', remarks: 'Good', status: 'Completed', certificate: true },
            { id: 'ST003', name: 'Robert Johnson', score: 58, grade: 'F', remarks: 'Failed', status: 'Completed', certificate: false }
        ];
        
        // Initialize the application
        function init() {
            // Check if user was already logged in
            const savedUser = localStorage.getItem('currentUser');
            const savedRole = localStorage.getItem('currentRole');
            
            if (savedUser && savedRole) {
                currentUser = JSON.parse(savedUser);
                currentRole = savedRole;
                
                // Update UI
                usernameSpan.textContent = currentUser.name;
                roleBadge.textContent = currentRole === 'admin' ? 'Admin' : 'Student';
                userInfo.style.display = 'flex';
                
                if (currentRole === 'admin') {
                    showAdminDashboard();
                } else {
                    // Check if exam session is still valid
                    const loginTime = localStorage.getItem('loginTime');
                    if (loginTime) {
                        const currentTime = new Date().getTime();
                        const timeElapsed = (currentTime - parseInt(loginTime)) / (1000 * 60);
                        
                        if (timeElapsed < examDuration) {
                            startExamSession(parseInt(loginTime));
                        } else {
                            showExpiredCard();
                        }
                    } else {
                        startExamSession(new Date().getTime());
                    }
                }
            } else {
                showAuthSection();
            }
            
            // Set up event listeners
            setupEventListeners();
            
            // Initialize tab functionality
            initTabs();
            
            // Initialize results tables
            updateResultsTable();
            updateAdminResultsTable();
            updateSubmissionsTable();
            updateCertificatesTable();
            updateAssessmentList();
        }
        
        // Set up event listeners
        function setupEventListeners() {
            // Auth tabs
            authTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.getAttribute('data-tab');
                    
                    // Remove active class from all tabs and contents
                    authTabs.forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.auth-content').forEach(c => c.style.display = 'none');
                    
                    // Add active class to clicked tab and show corresponding content
                    tab.classList.add('active');
                    document.getElementById(`${tabId}-tab`).style.display = 'block';
                });
            });
            
            loginBtn.addEventListener('click', handleLogin);
            registerBtn.addEventListener('click', handleRegister);
            roleButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    roleButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentRole = btn.getAttribute('data-role');
                });
            });
            switchRoleBtn.addEventListener('click', switchRole);
            studentSwitchBtn.addEventListener('click', switchRole);
            adminSwitchBtn.addEventListener('click', switchRole);
            studentLogoutBtn.addEventListener('click', logout);
            adminLogoutBtn.addEventListener('click', logout);
            browseBtn.addEventListener('click', () => pdfUpload.click());
            pdfUpload.addEventListener('change', handlePdfUpload);
            addResultBtn.addEventListener('click', handleAddResult);
            saveSettingsBtn.addEventListener('click', handleSaveSettings);
            browseAnswersBtn.addEventListener('click', () => answerUpload.click());
            answerUpload.addEventListener('change', handleAnswerUpload);
            submitAnswersBtn.addEventListener('click', handleSubmitAnswers);
            clearAnswersBtn.addEventListener('click', clearUploadedAnswers);
            downloadCertificateBtn.addEventListener('click', downloadCertificate);
            studentPhoto.addEventListener('change', handlePhotoUpload);
            
            // Prevent right-click (context menu) to discourage screenshot attempts
            document.addEventListener('contextmenu', (e) => {
                if (examSection.style.display === 'block') {
                    e.preventDefault();
                    showScreenshotNotification();
                }
            });
            
            // Detect print screen key
            document.addEventListener('keydown', (e) => {
                if (examSection.style.display === 'block' && 
                    (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p'))) {
                    e.preventDefault();
                    showScreenshotNotification();
                }
            });
            
            // Drag and drop for PDF upload
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length) {
                    pdfUpload.files = e.dataTransfer.files;
                    handlePdfUpload();
                }
            });
            
            // Drag and drop for answer upload
            answerUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                answerUploadArea.classList.add('drag-over');
            });
            
            answerUploadArea.addEventListener('dragleave', () => {
                answerUploadArea.classList.remove('drag-over');
            });
            
            answerUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                answerUploadArea.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length) {
                    answerUpload.files = e.dataTransfer.files;
                    handleAnswerUpload();
                }
            });
        }
        
        // Initialize tab functionality
        function initTabs() {
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.getAttribute('data-tab');
                    
                    // Remove active class from all tabs and contents
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    tab.classList.add('active');
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                    
                    // If certificate tab is clicked, check if certificate is available
                    if (tabId === 'certificate') {
                        checkCertificateAvailability();
                    }
                });
            });
        }
        
        // Handle login
        function handleLogin() {
            const email = loginEmail.value;
            const password = loginPassword.value;
            let isValid = false;
            let user = null;
            
            if (currentRole === 'student') {
                // Check student accounts
                user = studentAccounts.find(acc => acc.email === email && acc.password === password);
                if (user) {
                    isValid = true;
                    currentUser = user;
                }
            } else {
                // Check admin account
                if (email === adminAccount.email && password === adminAccount.password) {
                    isValid = true;
                    currentUser = adminAccount;
                }
            }
            
            if (isValid) {
                // Store user and role
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('currentRole', currentRole);
                
                // Update UI
                usernameSpan.textContent = currentUser.name;
                roleBadge.textContent = currentRole === 'admin' ? 'Admin' : 'Student';
                userInfo.style.display = 'flex';
                
                if (currentRole === 'admin') {
                    showAdminDashboard();
                } else {
                    // Start exam session
                    const loginTime = new Date().getTime();
                    localStorage.setItem('loginTime', loginTime.toString());
                    startExamSession(loginTime);
                }
            } else {
                alert('Invalid email or password. Please try again.');
            }
        }
        
        // Handle registration
        function handleRegister() {
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const studentId = document.getElementById('register-student-id').value;
            const course = document.getElementById('register-course').value;
            
            // Validate form
            if (!name || !email || !password || !confirmPassword || !studentId || !course) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            
            // Check if email already exists
            if (studentAccounts.some(acc => acc.email === email)) {
                alert('An account with this email already exists.');
                return;
            }
            
            // Check if student ID already exists
            if (studentAccounts.some(acc => acc.id === studentId)) {
                alert('An account with this student ID already exists.');
                return;
            }
            
            // Create new account
            const newAccount = {
                id: studentId,
                email: email,
                password: password,
                name: name,
                course: course,
                photo: null
            };
            
            studentAccounts.push(newAccount);
            
            alert('Account created successfully! You can now login.');
            
            // Switch to login tab
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-content').forEach(c => c.style.display = 'none');
            document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
            document.getElementById('login-tab').style.display = 'block';
            
            // Pre-fill login form
            loginEmail.value = email;
        }
        
        // Switch between student and admin roles
        function switchRole() {
            const newRole = currentRole === 'student' ? 'admin' : 'student';
            
            // Prompt for password
            const password = prompt(`Enter ${newRole} password:`);
            let isValid = false;
            
            if (newRole === 'student') {
                // For demo purposes, any password works to switch to student
                isValid = true;
                // In a real app, you would verify against student credentials
            } else if (newRole === 'admin' && password === 'KPS@admin2023') {
                isValid = true;
            }
            
            if (isValid) {
                currentRole = newRole;
                localStorage.setItem('currentRole', currentRole);
                
                // Update UI
                usernameSpan.textContent = currentRole === 'admin' ? 'Administrator' : currentUser.name;
                roleBadge.textContent = currentRole === 'admin' ? 'Admin' : 'Student';
                
                if (currentRole === 'admin') {
                    showAdminDashboard();
                } else {
                    // Check if exam session is still valid
                    const loginTime = localStorage.getItem('loginTime');
                    if (loginTime) {
                        const currentTime = new Date().getTime();
                        const timeElapsed = (currentTime - parseInt(loginTime)) / (1000 * 60);
                        
                        if (timeElapsed < examDuration) {
                            startExamSession(parseInt(loginTime));
                        } else {
                            showExpiredCard();
                        }
                    } else {
                        startExamSession(new Date().getTime());
                    }
                }
            } else {
                alert('Incorrect password. Cannot switch role.');
            }
        }
        
        // Logout user
        function logout() {
            // Clear stored data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentRole');
            localStorage.removeItem('loginTime');
            
            // Reset state
            currentUser = null;
            currentRole = 'student';
            
            // Show auth section
            showAuthSection();
        }
        
        // Show auth section
        function showAuthSection() {
            authSection.style.display = 'block';
            examSection.style.display = 'none';
            adminSection.style.display = 'none';
            expiredCard.style.display = 'none';
            userInfo.style.display = 'none';
            
            // Clear any existing timer
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            
            // Reset form
            loginEmail.value = '';
            loginPassword.value = '';
            currentRole = 'student';
            roleButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-role') === 'student') {
                    btn.classList.add('active');
                }
            });
        }
        
        // Start exam session
        function startExamSession(loginTime) {
            // Calculate end time
            endTime = loginTime + (examDuration * 60 * 1000);
            
            // Update UI
            authSection.style.display = 'none';
            examSection.style.display = 'block';
            adminSection.style.display = 'none';
            expiredCard.style.display = 'none';
            
            // Update student info
            document.getElementById('student-name').textContent = currentUser.name;
            studentFullname.value = currentUser.name;
            studentEmail.value = currentUser.email;
            studentId.value = currentUser.id;
            studentCourse.value = currentUser.course;
            
            // Update profile avatar
            const profileAvatar = document.getElementById('profile-avatar');
            if (currentUser.photo) {
                profileAvatar.innerHTML = `<img src="${currentUser.photo}" alt="Profile Photo">`;
            } else {
                profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
            }
            
            // Start countdown timer
            startTimer();
            
            // Load the exam PDF if available
            const examPdf = localStorage.getItem('examPdf');
            if (examPdf) {
                pdfViewer.src = examPdf;
            }
            
            // Check if answers were already submitted
            const submission = studentSubmissions.find(s => s.id === currentUser.id);
            if (submission) {
                submissionStatus.textContent = `Answers submitted on ${new Date(submission.time).toLocaleString()}`;
                submissionStatus.className = 'submission-status submitted';
            } else {
                submissionStatus.textContent = 'Answers not submitted yet';
                submissionStatus.className = 'submission-status not-submitted';
            }
            
            // Check certificate availability
            checkCertificateAvailability();
        }
        
        // Show admin dashboard
        function showAdminDashboard() {
            authSection.style.display = 'none';
            examSection.style.display = 'none';
            adminSection.style.display = 'block';
            expiredCard.style.display = 'none';
            
            // Clear any existing timer
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        }
        
        // Show expired card
        function showExpiredCard() {
            authSection.style.display = 'none';
            examSection.style.display = 'none';
            adminSection.style.display = 'none';
            expiredCard.style.display = 'block';
            userInfo.style.display = 'none';
            
            // Clear stored login data
            localStorage.removeItem('loginTime');
        }
        
        // Start countdown timer
        function startTimer() {
            updateTimer();
            
            timerInterval = setInterval(() => {
                updateTimer();
            }, 1000);
        }
        
        // Update timer display
        function updateTimer() {
            const now = new Date().getTime();
            const timeLeft = endTime - now;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showExpiredCard();
                return;
            }
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.textContent = `Time Remaining: ${timeString}`;
            profileTimerElement.textContent = timeString;
        }
        
        // Handle PDF upload
        function handlePdfUpload() {
            const file = pdfUpload.files[0];
            
            if (file && file.type === 'application/pdf') {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Store the PDF data URL
                    localStorage.setItem('examPdf', e.target.result);
                    
                    // Update status
                    uploadStatus.innerHTML = `<p style="color: green;">PDF uploaded successfully!</p>`;
                    
                    // Update the PDF viewer if exam is active
                    if (examSection.style.display === 'block') {
                        pdfViewer.src = e.target.result;
                    }
                };
                
                reader.readAsDataURL(file);
            } else {
                uploadStatus.innerHTML = `<p style="color: red;">Please select a valid PDF file.</p>`;
            }
        }
        
        // Handle photo upload
        function handlePhotoUpload() {
            const file = studentPhoto.files[0];
            
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Store the photo data URL in the user account
                    currentUser.photo = e.target.result;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Update profile avatar
                    const profileAvatar = document.getElementById('profile-avatar');
                    profileAvatar.innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
                };
                
                reader.readAsDataURL(file);
            }
        }
        
        // Handle answer file upload
        function handleAnswerUpload() {
            const files = Array.from(answerUpload.files);
            
            files.forEach(file => {
                // Check if file is already in the list
                if (!uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    uploadedFiles.push(file);
                    displayUploadedFile(file);
                }
            });
            
            // Reset the file input
            answerUpload.value = '';
        }
        
        // Display uploaded file in the list
        function displayUploadedFile(file) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileIcon = document.createElement('div');
            fileIcon.className = 'file-icon';
            
            // Set appropriate icon based on file type
            if (file.type.startsWith('image/')) {
                fileIcon.innerHTML = '🖼️';
            } else if (file.type === 'application/pdf') {
                fileIcon.innerHTML = '📄';
            } else if (file.type.includes('word') || file.type.includes('document')) {
                fileIcon.innerHTML = '📝';
            } else {
                fileIcon.innerHTML = '📎';
            }
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.innerHTML = `
                <div><strong>${file.name}</strong></div>
                <div>${(file.size / 1024).toFixed(2)} KB</div>
            `;
            
            const fileActions = document.createElement('div');
            fileActions.className = 'file-actions';
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'btn-secondary';
            removeBtn.addEventListener('click', () => {
                uploadedFiles = uploadedFiles.filter(f => f !== file);
                fileItem.remove();
            });
            
            fileActions.appendChild(removeBtn);
            
            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(fileActions);
            
            uploadedAnswers.appendChild(fileItem);
        }
        
        // Handle answer submission
        function handleSubmitAnswers() {
            // Validate student information form
            if (!studentFullname.value || !studentEmail.value || !studentId.value || !studentCourse.value) {
                alert('Please fill in all required student information fields.');
                return;
            }
            
            if (uploadedFiles.length === 0) {
                alert('Please upload at least one file before submitting.');
                return;
            }
            
            // In a real application, this would upload to a server
            // For demo purposes, we'll simulate the upload process
            
            const submissionTime = new Date().getTime();
            
            // Check if student already has a submission
            const existingIndex = studentSubmissions.findIndex(s => s.id === currentUser.id);
            
            if (existingIndex !== -1) {
                // Update existing submission
                studentSubmissions[existingIndex] = {
                    id: currentUser.id,
                    name: studentFullname.value,
                    email: studentEmail.value,
                    course: studentCourse.value,
                    job: studentJob.value,
                    photo: currentUser.photo,
                    notes: studentNotes.value,
                    time: submissionTime,
                    files: uploadedFiles,
                    assessed: false
                };
            } else {
                // Add new submission
                studentSubmissions.push({
                    id: currentUser.id,
                    name: studentFullname.value,
                    email: studentEmail.value,
                    course: studentCourse.value,
                    job: studentJob.value,
                    photo: currentUser.photo,
                    notes: studentNotes.value,
                    time: submissionTime,
                    files: uploadedFiles,
                    assessed: false
                });
            }
            
            // Update UI
            submissionStatus.textContent = `Answers submitted on ${new Date(submissionTime).toLocaleString()}`;
            submissionStatus.className = 'submission-status submitted';
            
            // Update admin tables
            updateSubmissionsTable();
            updateAssessmentList();
            
            // Show success message
            showNotification('Answers submitted successfully!', 'success');
            
            // Clear uploaded files
            clearUploadedAnswers();
        }
        
        // Clear uploaded answers
        function clearUploadedAnswers() {
            uploadedFiles = [];
            uploadedAnswers.innerHTML = '';
        }
        
        // Check certificate availability
        function checkCertificateAvailability() {
            const userResult = studentResults.find(r => r.id === currentUser.id);
            
            if (userResult && userResult.certificate) {
                // Certificate is available
                certificateSection.style.display = 'block';
                
                // Update certificate details
                certificateName.textContent = userResult.name;
                certificateScore.textContent = `${userResult.score}%`;
                certificateGrade.textContent = userResult.grade;
                certificateDate.textContent = new Date().toLocaleDateString();
                
                // Update certificate photo
                if (currentUser.photo) {
                    certificatePhoto.innerHTML = `<img src="${currentUser.photo}" alt="Student Photo">`;
                } else {
                    certificatePhoto.textContent = userResult.name.charAt(0).toUpperCase();
                }
            } else {
                // Certificate is not available
                certificateSection.style.display = 'none';
            }
        }
        
        // Download certificate
        function downloadCertificate() {
            alert('This is how your certificate looks like. You are not allowed to downlaod it before making full payments');

        }
        
        // Show screenshot attempt notification
        function showScreenshotNotification() {
            screenshotNotification.textContent = 'KPS disabled taking Screenshots for a mean time';
            screenshotNotification.className = 'notification';
            screenshotNotification.style.display = 'block';
            
            setTimeout(() => {
                screenshotNotification.style.display = 'none';
            }, 3000);
        }
        
        // Show notification
        function showNotification(message, type) {
            screenshotNotification.textContent = message;
            screenshotNotification.className = `notification ${type}`;
            screenshotNotification.style.display = 'block';
            
            setTimeout(() => {
                screenshotNotification.style.display = 'none';
            }, 3000);
        }
        
        // Update student results table
        function updateResultsTable() {
            resultsBody.innerHTML = '';
            
            // In a real application, this would fetch data from a server
            // For demo purposes, we'll use sample data
            const userResult = studentResults.find(r => r.id === currentUser.id);
            
            if (userResult) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>General Examination</td>
                    <td>${userResult.score}%</td>
                    <td>${userResult.grade}</td>
                    <td>${userResult.remarks}</td>
                    <td>${userResult.status}</td>
                `;
                resultsBody.appendChild(row);
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="5" style="text-align: center;">No results available yet</td>
                `;
                resultsBody.appendChild(row);
            }
        }
        
        // Update admin results table
        function updateAdminResultsTable() {
            adminResultsBody.innerHTML = '';
            
            studentResults.forEach(result => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${result.id}</td>
                    <td>${result.name}</td>
                    <td>${result.score}%</td>
                    <td>${result.grade}</td>
                    <td>${result.status}</td>
                    <td>
                        <button class="edit-result" data-id="${result.id}">Edit</button>
                        <button class="delete-result" data-id="${result.id}">Delete</button>
                    </td>
                `;
                adminResultsBody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-result').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const result = studentResults.find(r => r.id === id);
                    
                    if (result) {
                        document.getElementById('admin-student-id').value = result.id;
                        document.getElementById('student-score').value = result.score;
                        document.getElementById('student-remarks').value = result.remarks;
                    }
                });
            });
            
            document.querySelectorAll('.delete-result').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    studentResults = studentResults.filter(r => r.id !== id);
                    updateAdminResultsTable();
                    updateResultsTable();
                    updateCertificatesTable();
                });
            });
        }
        
        // Update submissions table
        function updateSubmissionsTable() {
            submissionsBody.innerHTML = '';
            
            studentSubmissions.forEach(submission => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${submission.id}</td>
                    <td>${submission.name}</td>
                    <td>${submission.email}</td>
                    <td>${submission.course}</td>
                    <td>${new Date(submission.time).toLocaleString()}</td>
                    <td>${submission.files.length} file(s)</td>
                    <td>${submission.assessed ? 'Assessed' : 'Pending'}</td>
                    <td>
                        <button class="view-submission" data-id="${submission.id}">View</button>
                        <button class="assess-submission" data-id="${submission.id}">Assess</button>
                    </td>
                `;
                submissionsBody.appendChild(row);
            });
            
            // Add event listeners to view and assess buttons
            document.querySelectorAll('.view-submission').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const submission = studentSubmissions.find(s => s.id === id);
                    
                    if (submission) {
                        alert(`Viewing submission from ${submission.name} (${submission.id}) with ${submission.files.length} file(s)`);
                        // In a real app, this would open a modal to view the files
                    }
                });
            });
            
            document.querySelectorAll('.assess-submission').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    // Switch to assess tab and load the submission
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    document.querySelector('.tab[data-tab="assess"]').classList.add('active');
                    document.getElementById('assess-tab').classList.add('active');
                    
                    // Load the submission for assessment
                    loadSubmissionForAssessment(id);
                });
            });
        }
        
        // Update assessment list
        function updateAssessmentList() {
            assessmentList.innerHTML = '';
            
            const pendingSubmissions = studentSubmissions.filter(s => !s.assessed);
            
            if (pendingSubmissions.length === 0) {
                assessmentList.innerHTML = '<p>No pending submissions to assess.</p>';
                return;
            }
            
            pendingSubmissions.forEach(submission => {
                const assessmentItem = document.createElement('div');
                assessmentItem.className = 'assessment-form';
                assessmentItem.innerHTML = `
                    <h4>Assess Submission: ${submission.name} (${submission.id})</h4>
                    <div class="student-info">
                        <p><strong>Course:</strong> ${submission.course}</p>
                        <p><strong>Submitted:</strong> ${new Date(submission.time).toLocaleString()}</p>
                        <p><strong>Files:</strong> ${submission.files.length}</p>
                    </div>
                    <div class="assessment-criteria">
                        <h5>Assessment Criteria</h5>
                        <div class="criteria-item">
                            <span>Content Knowledge</span>
                            <input type="number" min="0" max="25" value="0" class="criteria-score" data-criteria="knowledge">
                        </div>
                        <div class="criteria-item">
                            <span>Problem Solving</span>
                            <input type="number" min="0" max="25" value="0" class="criteria-score" data-criteria="problem-solving">
                        </div>
                        <div class="criteria-item">
                            <span>Clarity of Expression</span>
                            <input type="number" min="0" max="25" value="0" class="criteria-score" data-criteria="clarity">
                        </div>
                        <div class="criteria-item">
                            <span>Originality</span>
                            <input type="number" min="0" max="25" value="0" class="criteria-score" data-criteria="originality">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="remarks-${submission.id}">Remarks</label>
                        <textarea id="remarks-${submission.id}" placeholder="Enter your remarks"></textarea>
                    </div>
                    <button class="submit-assessment" data-id="${submission.id}">Submit Assessment</button>
                `;
                assessmentList.appendChild(assessmentItem);
            });
            
            // Add event listeners to submit assessment buttons
            document.querySelectorAll('.submit-assessment').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    submitAssessment(id);
                });
            });
        }
        
        // Load submission for assessment
        function loadSubmissionForAssessment(id) {
            const submission = studentSubmissions.find(s => s.id === id);
            if (!submission) return;
            
            // Create assessment form for this submission
            const assessmentForm = document.createElement('div');
            assessmentForm.className = 'assessment-form';
            assessmentForm.innerHTML = `
                <h4>Assess Submission: ${submission.name} (${submission.id})</h4>
                <div class="student-info">
                    <p><strong>Course:</strong> ${submission.course}</p>
                    <p><strong>Job/Position:</strong> ${submission.job || 'Not specified'}</p>
                    <p><strong>Submitted:</strong> ${new Date(submission.time).toLocaleString()}</p>
                    <p><strong>Files:</strong> ${submission.files.length}</p>
                    <p><strong>Notes:</strong> ${submission.notes || 'None'}</p>
                </div>
                <div class="assessment-criteria">
                    <h5>Assessment Criteria</h5>
                    <div class="criteria-item">
                        <span>Content Knowledge (25 points)</span>
                        <input type="number" min="0" max="25" value="0" class="criteria-score" data-criteria="knowledge">
                    </div>
                    <div class="criteria-item">
                        <span>Problem Solving (25 points)</span>
                        <input type="number" min="0" max="25" value="0" class="criteria-score" data-criteria="problem-solving">
                    </div>
                    <div class="criteria-item">
                        <span>Clarity of Expression (25 points)</span>
                        <input type="number" min="0" max="25" value="0" class="criteria-score" data-criteria="clarity">
                    </div>
                    <div class="criteria-item">
                        <span>Originality (25 points)</span>
                        <input type="number" min="0" max="25" value="0" class="criteria-score" data-criteria="originality">
                    </div>
                </div>
                <div class="form-group">
                    <label for="remarks-${submission.id}">Remarks</label>
                    <textarea id="remarks-${submission.id}" placeholder="Enter your remarks"></textarea>
                </div>
                <button class="submit-assessment" data-id="${submission.id}">Submit Assessment</button>
            `;
            
            assessmentList.innerHTML = '';
            assessmentList.appendChild(assessmentForm);
            
            // Add event listener to submit assessment button
            document.querySelector('.submit-assessment').addEventListener('click', () => {
                submitAssessment(id);
            });
        }
        
        // Submit assessment
        function submitAssessment(id) {
            const submission = studentSubmissions.find(s => s.id === id);
            if (!submission) return;
            
            // Calculate total score
            const knowledgeScore = parseInt(document.querySelector('input[data-criteria="knowledge"]').value) || 0;
            const problemSolvingScore = parseInt(document.querySelector('input[data-criteria="problem-solving"]').value) || 0;
            const clarityScore = parseInt(document.querySelector('input[data-criteria="clarity"]').value) || 0;
            const originalityScore = parseInt(document.querySelector('input[data-criteria="originality"]').value) || 0;
            
            const totalScore = knowledgeScore + problemSolvingScore + clarityScore + originalityScore;
            const remarks = document.getElementById(`remarks-${id}`).value;
            
            // Calculate grade
            let grade, status;
            if (totalScore >= 90) {
                grade = 'A';
                status = 'Excellent';
            } else if (totalScore >= 80) {
                grade = 'B';
                status = 'Very Good';
            } else if (totalScore >= 70) {
                grade = 'C';
                status = 'Good';
            } else if (totalScore >= 60) {
                grade = 'D';
                status = 'Average';
            } else {
                grade = 'F';
                status = 'Failed';
            }
            
            // Check if student already has a result
            const existingIndex = studentResults.findIndex(r => r.id === id);
            
            if (existingIndex !== -1) {
                // Update existing result
                studentResults[existingIndex] = {
                    id: id,
                    name: submission.name,
                    score: totalScore,
                    grade: grade,
                    remarks: remarks || status,
                    status: 'Completed',
                    certificate: totalScore >= passingScore
                };
            } else {
                // Add new result
                studentResults.push({
                    id: id,
                    name: submission.name,
                    score: totalScore,
                    grade: grade,
                    remarks: remarks || status,
                    status: 'Completed',
                    certificate: totalScore >= passingScore
                });
            }
            
            // Mark submission as assessed
            submission.assessed = true;
            
            // Update tables
            updateAdminResultsTable();
            updateSubmissionsTable();
            updateAssessmentList();
            updateCertificatesTable();
            
            // Show success message
            showNotification(`Assessment submitted for ${submission.name}. Score: ${totalScore}%`, 'success');
        }
        
        // Update certificates table
        function updateCertificatesTable() {
            certificatesBody.innerHTML = '';
            
            studentResults.forEach(result => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${result.id}</td>
                    <td>${result.name}</td>
                    <td>${result.score}%</td>
                    <td>${result.grade}</td>
                    <td>${result.certificate ? 'Issued' : 'Not Eligible'}</td>
                    <td>
                        ${result.certificate ? 
                            '<button class="view-certificate" data-id="' + result.id + '">View</button>' : 
                            '<button class="issue-certificate" data-id="' + result.id + '">Issue</button>'
                        }
                    </td>
                `;
                certificatesBody.appendChild(row);
            });
            
            // Add event listeners to certificate buttons
            document.querySelectorAll('.view-certificate').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const result = studentResults.find(r => r.id === id);
                    
                    if (result) {
                        alert(`Viewing certificate for ${result.name}`);
                        // In a real app, this would open a modal to view the certificate
                    }
                });
            });
            
            document.querySelectorAll('.issue-certificate').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const result = studentResults.find(r => r.id === id);
                    
                    if (result && confirm(`Issue certificate to ${result.name}?`)) {
                        result.certificate = true;
                        updateCertificatesTable();
                        showNotification(`Certificate issued to ${result.name}`, 'success');
                    }
                });
            });
        }
        
        // Handle adding/updating results
        function handleAddResult() {
            const studentId = document.getElementById('admin-student-id').value;
            const score = parseInt(document.getElementById('student-score').value);
            const remarks = document.getElementById('student-remarks').value;
            
            if (!studentId || isNaN(score)) {
                alert('Please enter valid student ID and score');
                return;
            }
            
            // Calculate grade based on score
            let grade, status;
            if (score >= 90) {
                grade = 'A';
                status = 'Excellent';
            } else if (score >= 80) {
                grade = 'B';
                status = 'Very Good';
            } else if (score >= 70) {
                grade = 'C';
                status = 'Good';
            } else if (score >= 60) {
                grade = 'D';
                status = 'Average';
            } else {
                grade = 'F';
                status = 'Failed';
            }
            
            // Find student name from submissions
            const submission = studentSubmissions.find(s => s.id === studentId);
            const studentName = submission ? submission.name : 'Unknown Student';
            
            // Check if student already exists
            const existingIndex = studentResults.findIndex(r => r.id === studentId);
            
            if (existingIndex !== -1) {
                // Update existing result
                studentResults[existingIndex] = {
                    id: studentId,
                    name: studentName,
                    score: score,
                    grade: grade,
                    remarks: remarks || status,
                    status: 'Completed',
                    certificate: score >= passingScore
                };
            } else {
                // Add new result
                studentResults.push({
                    id: studentId,
                    name: studentName,
                    score: score,
                    grade: grade,
                    remarks: remarks || status,
                    status: 'Completed',
                    certificate: score >= passingScore
                });
            }
            
            // Update tables
            updateAdminResultsTable();
            updateResultsTable();
            updateCertificatesTable();
            
            // Clear form
            document.getElementById('admin-student-id').value = '';
            document.getElementById('student-score').value = '';
            document.getElementById('student-remarks').value = '';
            
            alert('Result saved successfully!');
        }
        
        // Handle saving settings
        function handleSaveSettings() {
            const duration = parseInt(document.getElementById('exam-duration').value);
            const passing = parseInt(document.getElementById('passing-score').value);
            
            if (duration && passing) {
                examDuration = duration;
                passingScore = passing;
                alert('Settings saved successfully!');
            } else {
                alert('Please enter valid values for all settings.');
            }
        }
        
        // Initialize the application when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
    