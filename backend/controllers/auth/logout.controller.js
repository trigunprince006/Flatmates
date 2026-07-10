const userModel = require("../../models/user.model");

async function logout(req, res) {

  try {
    
    const userId = req.user.userId;

    const user = await userModel.findById(userId);

    let {accessToken} = req.cookies;

    accessToken = "deleted";
    user.refreshToken = "deleted";
    
    await user.save();
    const refreshToken = user.refreshToken;
    res.cookie("accessToken",accessToken,{
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 0,
    })
    res.cookie("refreshToken",refreshToken,{
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 0,
    })

    return res.status(200).json({
      success:true,
      message:"You Logout successfully"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
    success:false,
    message:"internal server Error!!"
    })
  }

}

module.exports = logout;

