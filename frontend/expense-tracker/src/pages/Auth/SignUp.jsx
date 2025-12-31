import React, { useState, useContext } from 'react'
import AuthLayout from "../../components/layouts/AuthLayout"
import Input from '../../components/inputs/Input'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
import { validateEmail } from '../../utils/helper'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!fullName) {
      setError("Please enter your name"); 
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      let profileImageUrl = "";
      
      // Upload image if exists
      if (profilePic) {
        try {
          console.log("Uploading profile picture...");
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
          console.log("Image uploaded:", profileImageUrl);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          // Continue without image if upload fails
        }
      }

      console.log("Sending registration request...", { fullName, email, profileImageUrl });

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl: profileImageUrl || undefined
      });
      
      console.log("Registration response:", response.data);

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
        
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(`Registration failed (${error.response.status})`);
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from server. Check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">Enter your details below</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />
            <Input 
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label="Email Address"
              placeholder='xxxx@example.com'
              type="email"
            /> 

            <Input 
              value={password}
              onChange={({target}) => setPassword(target.value)}
              label="Password"
              placeholder='Min 8 characters'
              type="password"
            />
          </div>
        
          {error && <p className='text-red-500 text-xs pb-2.5 mt-2'>{error}</p>}
        
          <button 
            type='submit' 
            className='btn-primary mt-4'
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        
          <p className="text-[13px] text-slate-800 mt-3 ">
            Already have an account?!{" "}
            <Link className='font-medium text-primary underline' to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;