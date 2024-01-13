package com.example.prescriptive.ui.initial
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Button
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.databinding.DataBindingUtil
import com.example.prescriptive.R
import com.example.prescriptive.databinding.ActivityMainBinding
import com.example.prescriptive.ui.auth.AuthActivity
import com.example.prescriptive.ui.base.BaseActivity


class MainActivity : BaseActivity() {
    private lateinit var binding: ActivityMainBinding
    @RequiresApi(Build.VERSION_CODES.R)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_main)

            Handler(Looper.getMainLooper()).postDelayed({
                startActivity(Intent(this, AuthActivity::class.java))
                finish()
            }, 1000)
    }
}