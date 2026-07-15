const brokerModel = require("../../models/broker.model");

async function logout(req, res) {

  try {
    
    const brokerId = req.user.brokerId;


    const broker = await brokerModel.findById(brokerId);

    let {accessToken} = req.cookies;

    accessToken = "deleted";
    broker.refreshToken = "deleted";
    await broker.save();

    const refreshToken = broker.refreshToken;
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

