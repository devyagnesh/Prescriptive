package com.example.prescriptive.interfaces

import androidx.fragment.app.Fragment

interface FragmentNavigationListener {
    fun changeFragment(position:Int,fragment: Fragment)
}