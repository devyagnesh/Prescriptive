package com.example.prescriptive.repository

import android.util.Log
import com.example.prescriptive.data.SignInRequestBody
import com.example.prescriptive.data.SuccessResponse
import com.example.prescriptive.services.AuthService
import com.example.prescriptive.singleton.RetrofitClient
import com.google.gson.Gson
import okhttp3.MediaType
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
import retrofit2.create

class AuthRepository {
    private val apiService = RetrofitClient.client?.create(AuthService::class.java)

    suspend fun SignIn(email:String,password:String): Response<SuccessResponse>? {

        val requestBody = RequestBody.create(
            MediaType.parse("application/json"), // Specify JSON format
            Gson().toJson(SignInRequestBody(email,password))
        )
        return apiService?.SignIn(requestBody)
    }
}