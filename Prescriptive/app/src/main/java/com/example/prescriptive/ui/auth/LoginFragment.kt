package com.example.prescriptive.ui.auth

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.example.prescriptive.data.ErrorResponse
import com.example.prescriptive.databinding.FragmentLoginBinding
import com.example.prescriptive.interfaces.FragmentNavigationListener
import com.example.prescriptive.repository.AuthRepository
import com.example.prescriptive.ui.loading.LoadingDialogFragment
import com.example.prescriptive.utils.SharedPreference
import kotlinx.coroutines.launch
import org.json.JSONObject




// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Use the [LoginFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class LoginFragment : Fragment() {


    private lateinit var binding: FragmentLoginBinding
    private lateinit var fragmentNavigationListener : FragmentNavigationListener
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val EditEmail = binding.idLoginEmail
        val EditPassword = binding.idLoginPassword
        val ButtonLogin = binding.BtnLogin
        val ButtonSignup = binding.BtnGoToSignup
        val ViewBtnResetPass = binding.btnReset
        val sharePreference = SharedPreference(requireContext())
        ButtonLogin.setOnClickListener {
            val loadingDialog = LoadingDialogFragment()
            if (this.validateInput(EditEmail.text.toString(), EditPassword.text.toString().trim())) {
                loadingDialog.show(parentFragmentManager, "loading_dialog")
                viewLifecycleOwner.lifecycleScope.launch {
                    try {
                        val authRepo = AuthRepository()
                        val response = authRepo.SignIn(EditEmail.text.toString().trim(), EditPassword.text.toString().trim())

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
                    } catch (e: Exception) {
                        loadingDialog.dismiss()
                        Toast.makeText(requireContext(), "Something went wrong", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }


        ButtonSignup.setOnClickListener {
            fragmentNavigationListener.changeFragment(1,SignUpFragment())
        }
    }
    private fun validateInput(email: String, password: String): Boolean {
        val emailPattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+".toRegex()

        return if (!emailPattern.matches(email)) {
            binding.idLoginEmail.error = "Invalid email format"
            false
        } else if (password.isEmpty()) {
            binding.idLoginPassword.error = "Please enter password"
            false
        } else {
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