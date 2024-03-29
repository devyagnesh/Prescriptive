package com.example.prescriptive.ui.auth

import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.addCallback
import androidx.lifecycle.lifecycleScope
import com.example.prescriptive.R
import com.example.prescriptive.databinding.FragmentLoginBinding
import com.example.prescriptive.databinding.FragmentSignUpBinding
import com.example.prescriptive.interfaces.FragmentNavigationListener
import com.example.prescriptive.repository.AuthRepository
import com.example.prescriptive.ui.loading.LoadingDialogFragment
import com.example.prescriptive.utils.SharedPreference
import kotlinx.coroutines.launch
import org.json.JSONObject


class SignUpFragment : Fragment() {
    private val countBacks = 0
    private lateinit var binding: FragmentSignUpBinding
    private lateinit var fragmentNavigationListener : FragmentNavigationListener

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentSignUpBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val EditFullname :EditText = binding.idFullname
        val EditEmail:EditText = binding.idSignupEmail
        val EditPassword:EditText = binding.idSignupPassword
        val EditConfirmPassword : EditText = binding.idSignupConfirmPassword
        val BtnSignup:Button = binding.BtnSignup
        val BtnGoToLogin: Button = binding.BtnGoToLogin
        val sharePreference = SharedPreference(requireContext())

        BtnSignup.setOnClickListener {
            val loadingDialog = LoadingDialogFragment()

            if(this.validateInput(EditFullname.text.toString().trim().lowercase(),EditEmail.text.toString().trim().lowercase(), EditPassword.text.toString().trim(),EditConfirmPassword.text.toString().trim())){
                loadingDialog.show(parentFragmentManager, "loading_dialog")

                viewLifecycleOwner.lifecycleScope.launch{
                    try {
                        val authRepo = AuthRepository()
                        val response = authRepo.SignUp(EditFullname.text.toString(),EditEmail.text.toString(),EditPassword.text.toString(),EditConfirmPassword.text.toString())
                        loadingDialog.dismiss()

                        if (response != null) {
                            if (response.isSuccessful) {
                                val body = response.body()
                                if (body != null) {
                                    sharePreference.put("authToken", body.token)
                                    Toast.makeText(requireContext(), body.message, Toast.LENGTH_SHORT).show()
                                } else {
                                    Toast.makeText(requireContext(), "Unexpected response from server", Toast.LENGTH_SHORT).show()
                                }
                            } else {
                                val errorBody = response.errorBody()?.string()
                                val errorMessage = if (errorBody != null) {
                                    JSONObject(errorBody).getString("message")
                                } else {
                                    "An error occurred"
                                }
                                Toast.makeText(requireContext(), errorMessage, Toast.LENGTH_SHORT).show()
                            }
                        }
                    }catch (e:Exception){
                        Log.d("HETO", e.message.toString())
                        loadingDialog.dismiss()
                        Toast.makeText(requireContext(), "Something went wrong", Toast.LENGTH_SHORT).show()
                    }
                }
            }


        }

        BtnGoToLogin.setOnClickListener {
            EditFullname.setText("")
            EditEmail.setText("")
            EditPassword.setText("")
            EditConfirmPassword.setText("")
            fragmentNavigationListener.changeFragment(0,LoginFragment())
        }
    }

    private fun validateInput(fullName:String, email: String, password: String, confirmPassword:String): Boolean {
        val namePattern = "^[a-zA-Z ]{3,}\$".toRegex()
        val emailPattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+".toRegex()

        return if (!namePattern.matches(fullName)) {
            binding.idFullname.error = "only alphabets and spaces are allowed"
            false
        } else if(email.isEmpty()){
            binding.idSignupEmail.error = "Please enter  email"
            false
        } else if (!emailPattern.matches(email)) {
            binding.idSignupEmail.error = "Please enter valid email"
            false
        }else if(password.isEmpty()){
            binding.idSignupPassword.error = "Please enter password"
            false
        }
        else if(password.length < 7){
            binding.idSignupPassword.error = "Password must contain 7 characters or more"
            false
        }
        else if(confirmPassword.isEmpty()){
            binding.idSignupConfirmPassword.error = "Please enter Confirm Password"
            false
        }
        else if(!confirmPassword.equals(password)){
            binding.idSignupConfirmPassword.error = "Password and Confirm Password does not matched"
            false
        }
        else {
            true
        }
    }
    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is FragmentNavigationListener) {
            fragmentNavigationListener = context
        } else {
            throw RuntimeException("Activity must implement FragmentNavigationListener")
        }
    }


}