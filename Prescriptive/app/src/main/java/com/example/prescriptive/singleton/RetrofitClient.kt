package com.example.prescriptive.singleton

import android.util.Log
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


object RetrofitClient {
    private var retrofit: Retrofit? = null
    private const val BASE_URL =
        "http://192.168.76.164:5000/api/v1/"
    val client: Retrofit?
        get() {

               if (retrofit == null) {
                   retrofit = Retrofit.Builder()
                       .baseUrl(BASE_URL)
                       .addConverterFactory(GsonConverterFactory.create())
                       .build()
               }
               return retrofit
           }
}

