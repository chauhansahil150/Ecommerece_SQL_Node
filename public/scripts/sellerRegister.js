function validateFirstName(){
    const fName=document.getElementById('fName').value.trim();
    const fnameError=document.getElementById('fnameError');
    const message=document.getElementById('message');
    fnameError.textContent='';
    if(fName===''){
        fnameError.textContent='First Name is required';
        return false;
    }else{
        message.textContent='';
    }
}
function validateLastName(){
    const lName=document.getElementById('lName').value.trim();
    const lnameError=document.getElementById('lnameError');
    const message=document.getElementById('message');
    lnameError.textContent='';
    if(lName===''){
        lnameError.textContent='Last Name is required';
    }else{
        message.textContent='';
    }
}
function validateEmail(){
    const email=document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailError=document.getElementById('emailError');
    const message=document.getElementById('message');
    emailError.textContent='';
    if(!emailRegex.test(email)){
        emailError.textContent='Invalid email';
    }else{
        message.textContent='';
    }
}
function validatePassword() {
    // Implement validation logic for the new password field
    const password = document.getElementById('password').value.trim();
    const passwordError = document.getElementById('passwordError');
    passwordError.textContent = '';

    // Add your validation logic here
    if (password.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters long';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        passwordError.textContent = 'Password must contain at least one special character';
    } else if (!/[0-9]/.test(password)) {
        passwordError.textContent = 'Password must contain at least one number';
    } else if (!/[A-Z]/.test(password)) {
        passwordError.textContent = 'Password must contain at least one uppercase letter';
    }
}

function validateConfirmPassword() {
    // Implement validation logic for the confirm password field
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value;
    const confirmPasswordError = document.getElementById('confirm-password-error');
    confirmPasswordError.textContent = '';

    // Add your validation logic here, e.g., check if it matches the  password
    if(confirmPassword.trim()===''){
        confirmPasswordError.textContent='Confirm password can not be empty';
    }
    else if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
    }
}
function validateMobile(){
    const mobile=document.getElementById('mobile').value.trim();
    const mobileError=document.getElementById('mobileError');
    const mobileRegex =  /^[0-9]+$/;
    const message=document.getElementById('message');
    mobileError.textContent='';
    if(!mobileRegex.test(mobile)){
        mobileError.textContent='Mob no can only contains number';
    }
    else if(mobile.length <10){
        mobileError.textContent='Mob no should be 10 digit long';
    }else{
        message.textContent='';
    }
}
function validateDOB(){
     const dob=document.getElementById('dob').value.trim();
    const dobError=document.getElementById('dobError');
    const message=document.getElementById('message');
    dobError.textContent='';
    if(dob===''){
        dobError.textContent='DOB is required';
    }else{
        message.textContent='';
    }
}
function validateBusinessName(){
    const buisnessName=document.getElementById('buisnessName').value.trim();
    const buisnessNameError=document.getElementById('buisnessNameError');
    const message=document.getElementById('message');
    buisnessNameError.textContent='';
    if(buisnessName===''){
        buisnessNameError.textContent='Buisness Name is required';
    }else{
        message.textContent='';
    }
}
function validateBusinessAddress(){
    const buisnessAddress=document.getElementById('buisnessAddress').value.trim();
    const buisnessAddressError=document.getElementById('buisnessAddressError');
    const message=document.getElementById('message');
    buisnessAddressError.textContent='';
    if(buisnessAddress===''){
        buisnessAddressError.textContent='Buisness Address is required';
    }else{
        message.textContent='';
    }
}
function validateaadharNumber(){
    const aadharNumber=document.getElementById('aadharNumber').value.trim();
    const aadharNumberError=document.getElementById('aadharNumberError');
    const message=document.getElementById('message');
    const numberRegex =  /^[0-9]+$/;
    aadharNumberError.textContent='';
    if(!numberRegex.test(aadharNumber)){
        aadharNumberError.textContent='Aadhar Number can only contains number';
    }else if(aadharNumber.length <12){
        aadharNumberError.textContent='Aadhar Number can not be less than 12 digit';
    }
    else if(aadharNumber===''){
        aadharNumberError.textContent='Aadhar Number is required';
    }else{
        message.textContent='';
    }
}
function validatePanNumber(){
    const panNumber=document.getElementById('panNumber').value.trim();
    const panNumberError=document.getElementById('panNumberError');
    const message=document.getElementById('message');
    const numberRegex =  /^[0-9,a-z,A-Z]+$/;
    panNumberError.textContent='';
    if(!numberRegex.test(panNumber)){
        panNumberError.textContent='Pan Number can only contains number and letters';
    }else if(panNumber.length <10){
        panNumberError.textContent='Pan Number can not be less than 10 digit';
    }
    else if(panNumber===''){
        panNumberError.textContent='Pan Number is required';
    }else{
        message.textContent='';
    }
}
function validateGSTNumber(){
    const gstNumber=document.getElementById('gstNumber').value.trim();
    const gstNumberError=document.getElementById('gstNumberError');
    const message=document.getElementById('message');
    const numberRegex =  /^[0-9,a-z,A-Z]+$/;
    gstNumberError.textContent='';
    if(!numberRegex.test(gstNumber)){
        gstNumberError.textContent='gst Number can only contains number and letters';
    }else if(gstNumber.length <15){
        gstNumberError.textContent='gst Number can not be less than 15 digit';
    }
    else if(gstNumber===''){
        gstNumberError.textContent='gst Number is required';
    }else{
        message.textContent='';
    }
}
function validateAadharImage(event) {
    const aadharImageInput = document.getElementById("aadharImage");
    const aadharImageError = document.getElementById('aadharImageError');
    if (aadharImageInput.value.trim() === "") {
        aadharImageError.textContent = "Aadhar Image is required!";
        aadharImageError.style.color = "red";
        return false; // Prevent form submission
    }
    const fileSize = event.target.files[0]?.size;
    const fileType = event.target.files[0]?.type.split('/')[1];
    
    aadharImageError.textContent = ''; // Clear any previous error messages

    if (event.target.files.length < 1) {
        aadharImageError.textContent = 'Image can not be empty';
        return false; // Prevent form submission
    }

    const validImageTypes = ['jpeg', 'jpg', 'png'];
    
    if (!validImageTypes.includes(fileType)) {
        aadharImageError.textContent = 'Invalid image type. Please choose a JPEG or PNG image.';
        return false; // Prevent form submission
    }

    if (fileSize > 250 * 1024) {
        aadharImageError.textContent = 'Image size exceeds the allowed limit (250KB). Please choose a smaller image';
        return false; // Prevent form submission
    }

    return true; // Allow form submission if there are no errors
}
function validatePanImage(event){
    const panImageInput = document.getElementById("panImage");
    const panImageError = document.getElementById('panImageError');
    if (panImageInput.value.trim() === "") {
        panImageError.textContent = "pan Image is required!";
        panImageError.style.color = "red";
        return false; // Prevent form submission
    }    const fileSize=event.files[0]?.size;
    // const fileType=event.target.files[0].type.split('/')[1].toLowerCase(); // image/png
    // const fileType=event.target.files[0].name.split('.').pop().toLowerCase();  // image/png
    const fileType=event.target.files[0]?.type.split('/')[1] // image/png

    console.log(event.target.files.length);
    // console.log(fileType);
    const validImageTypes=['jpeg','jpg','png']
    if(!validImageTypes.includes(fileType)){
        event.preventDefault();
        panImageError.innerText='Invalid image type. Please choose a JPEG or PNG image.';
        
    }else{
        panImageError.innerText="";
    }``
    if(fileSize> 250*1024){
        event.preventDefault();
        panImageError.innerText='Image size exceeds the allowed limit (250KB). Please choose a smaller image';
        
    }
    else
        panImageError.innerHTML = ''
}
function validateStoreImage(event){
    const storeImageInput = document.getElementById("storeImage");
    const storeImageError = document.getElementById('storeImageError');
    if (storeImageInput.value.trim() === "") {
        storeImageError.textContent = "store Image is required!";
        aadharImageError.style.color = "red";
        return false; // Prevent form submission
    }    const fileSize=event.files[0]?.size;
    // const fileType=event.target.files[0].type.split('/')[1].toLowerCase(); // image/png
    // const fileType=event.target.files[0].name.split('.').pop().toLowerCase();  // image/png
    const fileType=event.target.files[0]?.type.split('/')[1] // image/png

    // console.log(event.target.files);
    // console.log(fileType);
    const validImageTypes=['jpeg','jpg','png']
    if(!validImageTypes.includes(fileType)){
        event.preventDefault();
        storeImageError.innerText='Invalid image type. Please choose a JPEG or PNG image.';
        return;
    }else{
        storeImageError.innerText="";
    }``
    if(fileSize> 250*1024){
        event.preventDefault();
        storeImageError.innerText='Image size exceeds the allowed limit (250KB). Please choose a smaller image';
        return;
    }
    else
        storeImageError.innerHTML = ''
}
function validateProfileImage(event){
    const profileImageInput = document.getElementById("profileImage");
    const profileImageError = document.getElementById('profileImageError');
    if (profileImageInput.value.trim() === "") {
        profileImageError.textContent = "profile Image is required!";
        return false; // Prevent form submission
    }
    const fileSize=event.files[0]?.size;
    // const fileType=event.target.files[0].type.split('/')[1].toLowerCase(); // image/png
    // const fileType=event.target.files[0].name.split('.').pop().toLowerCase();  // image/png
    const fileType=event.target.files[0]?.type.split('/')[1] // image/png

    // console.log(event.target.files);
    // console.log(fileType);
    const validImageTypes=['jpeg','jpg','png']
    if(!validImageTypes.includes(fileType)){
        event.preventDefault();
        profileImageError.innerText='Invalid image type. Please choose a JPEG or PNG image.';
        return;
    }else{
        profileImageError.innerText="";
    }``
    if(fileSize> 250*1024){
        event.preventDefault();
        profileImageError.innerText='Image size exceeds the allowed limit (250KB). Please choose a smaller image';
        return;
    }
    else
        profileImageError.innerHTML = ''
}

document.getElementById('fName').addEventListener('input', validateFirstName);
document.getElementById('lName').addEventListener('input', validateLastName);
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('mobile').addEventListener('input', validateMobile);
document.getElementById('dob').addEventListener('change', validateDOB);
document.getElementById('buisnessName').addEventListener('input', validateBusinessName);
document.getElementById('buisnessAddress').addEventListener('input', validateBusinessAddress);
document.getElementById('aadharNumber').addEventListener('input', validateaadharNumber);
document.getElementById('panNumber').addEventListener('input', validatePanNumber);
document.getElementById('gstNumber').addEventListener('input', validateGSTNumber);
document.getElementById('aadharImage').addEventListener('input', validateAadharImage);
document.getElementById('panImage').addEventListener('input', validatePanImage);
document.getElementById('storeImage').addEventListener('input', validateStoreImage);
document.getElementById('profileImage').addEventListener('input', validateProfileImage);
document.getElementById('password').addEventListener('input', validatePassword);
document.getElementById('confirm-password').addEventListener('input', validateConfirmPassword);

function validateForm() {
   
    validateFirstName();
    validateLastName();
    validateEmail();
    validateMobile();
    validateDOB();
    validateBusinessName();
    validateBusinessAddress();
    validateaadharNumber();
    validatePanNumber();
    validateGSTNumber();
    validateAadharImage();
    validatePanImage();
    validateStoreImage();
    validateProfileImage();
    validatePassword();
    validateConfirmPassword();

    const errors = document.querySelectorAll('.error');
    console.log(errors)
    for (const error of errors) {
        if (error.textContent !== '') {
            return false; // Prevent form submission if there are errors
        }
    }

    return true; //
}

