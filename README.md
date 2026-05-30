# Flatmates
MOTO : A fullstack self made  project for renting out a listed property by broker .

## Day 1 - 29/5/2026
 ### Goals
  1. Create a backend folder and code a user register route where you take a input from user fullname,phone number and verify it by creating a OTP verification system and store it in database. 
  2. Now after registring a user create a login route where user can login himself by provideing credentils like phoneNumber and Otp then genrate jwt token and store it on browser
 ### What i learned while solving the Goal 
  1. For registring a user with otp is required to Models one is for User and second one for TempUser and we have to create 3 route and 3 controlletrs and after saving user In tempModel while verifying there phone number then strore it on User model and then delete temp user (This is best architecure of OTP verification for Production level app)

  2. For sending otp on user phone number i use Twilio and work with individul folder Services/sendOtp.js and connect with my controllres.

  3. I also learn some new thig like :-
   - .gitignore
   - findByIdAndDElete()
   -git add -p filename ->For making specific folder to ready to commit




