import {useForm} from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import {Link, useNavigate} from "react-router-dom"
import { useEffect } from "react";


function LoginPage() {

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm()
  const { signin, errors: signinErrors, isAuthenticated} = useAuth();
  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    signin(data)
  });

  useEffect(() => {
          if (isAuthenticated) navigate("/");
      }, [isAuthenticated]);


  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center ">
      <div className="max-w-md w-full p-10 rounded-md bg-gradient-to-b from-[#E0E7DF] to-[#96A999] shadow-lg ">
        <h1 className="text-2xl font-bold text-[#007BFF] text-center mb-6 hover:text-white">Welcome back!</h1>

        {signinErrors.map((error, i) => (
                <div key={i} className="bg-red-500 p-2 text-white rounded mb-2 text-center">
                {error}
                </div>
            ))}

        <form onSubmit={onSubmit}>
        <input
          type="email"
          {...register("email", { required: true })}
          className="w-full bg-white text-black px-4 py-2 rounded-md my-2 hover:bg-[#007BFF] hover:text-white border border-[#007BFF] hover:border-white"
          placeholder="Email"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">
            Email is required
          </span>
        )}

        <input
          type="password"
          {...register("password", { required: true })}
          className="w-full bg-white text-black px-4 py-2 rounded-md my-2 hover:bg-[#007BFF] hover:text-white border border-[#007BFF] hover:border-white"
          placeholder="Password"
          />
          {errors.password && (
          <span className="text-red-500 text-sm">
            Password is required
          </span>
          )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-4 py-2 rounded-md my-2">Login</button>
      </form>
      <p className="flex gap-x-2 justify-between">
        Don't have an account? <Link to="/register" className="text-blue-600 hover:text-orange-500 font-bold">Sign up</Link>
      </p>
      </div>
    </div>
  )
}

export default LoginPage