const { use } = require("../route");

async function check_data(username,password){
    try {
        if (!username) {
          return { success: false, error: "missing username" };

        }
        if (username.length < 3) {

          return  {success: false, error: "invalid username" };
        }
        if (!password || password.length < 8) {
          return { success: false, error: "invalid password" };
        }
        return true;
    }
    catch(err){
        console.error(err);
    }
}
module.exports={check_data}