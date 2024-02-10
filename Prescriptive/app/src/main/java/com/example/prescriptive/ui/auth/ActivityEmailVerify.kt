package com.example.prescriptive

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.databinding.DataBindingUtil
import com.example.prescriptive.databinding.ActivityEmailVerifyBinding

class ActivityEmailVerify : AppCompatActivity() {
    private lateinit var binding: ActivityEmailVerifyBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this,R.layout.activity_email_verify)
    }
}