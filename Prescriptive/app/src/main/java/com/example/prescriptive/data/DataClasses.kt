package com.example.prescriptive.data

data class ErrorResponse(
    val code: Int,
    val name: String,
    val message: String,
    val extra: Extra?
)
data class Extra(
    val possibilities: Map<String, Any>?
)

data class SuccessResponse(
    val code: Int,
    val name: String,
    val message: String,
    val token: String
)

data class SignInRequestBody(
    val email: String,
    val password: String
)

data class SignupRequestBody(
    val fullname : String,
    val email:String,
    val password: String,
    val confirmPassword:String
)