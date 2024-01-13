package com.example.prescriptive.services

import com.example.prescriptive.data.SuccessResponse
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST



interface AuthService {
    @POST("auth/signin")
    suspend fun SignIn(@Body requestBody: RequestBody):Response<SuccessResponse>?
}