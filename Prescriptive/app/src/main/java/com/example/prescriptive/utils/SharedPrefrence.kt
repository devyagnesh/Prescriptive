package com.example.prescriptive.utils

import android.content.Context
import android.content.SharedPreferences
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec

class SharedPreference(context: Context) {

    private val sharedPreferences: SharedPreferences =
        context.getSharedPreferences("PRESCRIPTIVE_REF", Context.MODE_PRIVATE)

    fun <T> put(key: String, value: T) {
        val editor = sharedPreferences.edit()
        when (value) {
            is String -> editor.putString(key, value)
            is Int -> editor.putInt(key, value)
            is Boolean -> editor.putBoolean(key, value)
            is Float -> editor.putFloat(key, value)
            is Long -> editor.putLong(key, value)
            else -> throw IllegalArgumentException("Unsupported type for SharedPreferences")
        }
        editor.apply()
    }

    fun getString(key: String, defaultValue: String? = null): String? =
        sharedPreferences.getString(key, defaultValue)

    fun getInt(key: String, defaultValue: Int = 0): Int =
        sharedPreferences.getInt(key, defaultValue)

    fun getBoolean(key: String, defaultValue: Boolean = false): Boolean =
        sharedPreferences.getBoolean(key, defaultValue)

    fun getFloat(key: String, defaultValue: Float = 0f): Float =
        sharedPreferences.getFloat(key, defaultValue)

    fun getLong(key: String, defaultValue: Long = 0L): Long =
        sharedPreferences.getLong(key, defaultValue)

    fun contains(key: String): Boolean =
        sharedPreferences.contains(key)

    fun remove(key: String) {
        sharedPreferences.edit().remove(key).apply()
    }

    fun clear() {
        sharedPreferences.edit().clear().apply()
    }

}

