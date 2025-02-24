(function (userService) {
  var Q = require('q');
  let { userModel } = require("../schema/userSchema")

  userService.getAllUser = async () => {
    var deferred = Q.defer();
    await userModel.find({})
      .then(result => {
        deferred.resolve(result)
      })

    return deferred.promise;
  }

  userService.addUser = async () => {
    var deferred = Q.defer();
    const userResult = new userModel({
      "name": "Vedant",
      "role": "Developer",
      "email": "Vedant@gmail.com",
      "password": "aabb"
    })
    await userResult.save()
    deferred.resolve(userResult)
    deferred.promise;
  }
})(module.exports)