import axios from "axios";

export const registerUser = async (
  email,
  rollnumber,
  password,
  AnsiTemplate,
  s3Url
) => {
  try {
    const response = await axios.post("http://localhost:80/api/v1/users", {
      email,
      rollnumber,
      password,
      fingerprintKey: AnsiTemplate,
      fingerprintUrl: s3Url,
    });

    if (response.status === 201) {
      console.log("User registered successfully:", response.data);
    } else {
      console.error("Failed to register user:", response.data);
    }
  } catch (error) {
    console.error("Error registering user:", error);
  }
};
