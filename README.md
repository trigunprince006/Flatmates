# Flatmates
MOTO : A fullstack self made  project for renting out a listed property by broker .

## Day 1 - 29/5/2026
 ### Goals
  1. Create a backend folder and code a user register route where you take a input from user fullname,phone number and verify it by creating a OTP verification system and store it in database. 
  2. Now after registering a user create a login route where user can login himself by providing credentials like phoneNumber and Otp then genrate jwt token and store it on browser
 ### What i learned while solving the Goal 
  1. For registering a user with otp is required to Models one is for User and second one for TempUser and we have to create 3 route and 3 controllers and after saving user In tempModel while verifying there phone number then store it on User model and then delete temp user (This is best architecture of OTP verification for Production level app)

  2. For sending otp on user phone number i use Twilio and work with individual folder Services/sendOtp.js and connect with my controllers.

  3. I also learn some new thing like :-
   - .gitignore
   - findByIdAndDElete()
   -git add -p filename ->For making specific folder to ready to commit




## Day 2 - 30/5/2026
  
  ### Goals
  1. Add some functionalists  on our OTP system , add features like otp expiration time and number of attempt means a user enter how many times otp incorrect and add a limitation of generating otp like user only can genrate 3 otp at time if it reached then user will have to wait for some time and also add a feature when user genrate a otp then generating next otp user should wait for some time (60s or 120s).

  2. Now create a login route and controller for logging a user ,only take phoneNumber and otp,after logging the user genrate and save cookie in browser(Previous day task)

  ### What i learned while solving the Goal 
    1. When you save otp in Db then convert it in hash format then save it(bcrypt)
    2. Indexes in database and why it is very important
  
## Day 3 - 31/5/2026
  ## Sunday 

## Day 4 - 01/06/2026
  
  ### Goals
  1.  Create a login route and controller for logging a user ,only take phoneNumber and otp,after logging the user genrate and save cookie in browser(Previous day task)
  2. Learn about refresh token , why, when,and how we use it ?
  3. Wrap codes in try And catch for better error handling

  ### What i learned while solving the Goal 
  1. 
  2.
 
    
