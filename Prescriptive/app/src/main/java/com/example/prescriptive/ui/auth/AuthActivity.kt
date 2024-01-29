package com.example.prescriptive.ui.auth
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import android.window.OnBackInvokedDispatcher
import androidx.activity.OnBackPressedCallback
import androidx.annotation.RequiresApi
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.Lifecycle
import androidx.viewpager2.adapter.FragmentStateAdapter
import androidx.viewpager2.widget.ViewPager2
import com.example.prescriptive.R
import com.example.prescriptive.databinding.ActivityAuthBinding
import com.example.prescriptive.interfaces.FragmentNavigationListener
import com.example.prescriptive.ui.base.BaseActivity


class AuthActivity : BaseActivity(), FragmentNavigationListener {
    private lateinit var binding: ActivityAuthBinding
    private lateinit var fragmentPager: ViewPager2
    private lateinit var pagerAdapter: AuthenticationPagerAdapter
    @RequiresApi(Build.VERSION_CODES.R)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this,R.layout.activity_auth)
        binding.authView.isUserInputEnabled = false
        fragmentPager = binding.authView
        pagerAdapter = AuthenticationPagerAdapter(supportFragmentManager,lifecycle)
        pagerAdapter.addFragment(LoginFragment())
        pagerAdapter.addFragment(SignUpFragment())
        fragmentPager.adapter = pagerAdapter
    }


    internal class AuthenticationPagerAdapter(fm: FragmentManager?,lifecycle: Lifecycle) : FragmentStateAdapter(fm!!,lifecycle) {
        private val fragmentList = ArrayList<Fragment>()

        override fun getItemViewType(position: Int): Int {
            return super.getItemViewType(position)
        }

        override fun getItemId(position: Int): Long {
            return super.getItemId(position)
        }

        override fun getItemCount(): Int {
            return fragmentList.count()
        }

        override fun createFragment(position: Int): Fragment {
            return fragmentList[position]
        }

        fun addFragment(fragment: Fragment){
            fragmentList.add(fragment)
        }

    }

    override fun changeFragment(position:Int,fragment: Fragment) {
        pagerAdapter.createFragment(position)
        binding.authView.setCurrentItem(position,true)
    }

}