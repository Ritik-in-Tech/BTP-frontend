import axios from "axios";

export const registerUser = async (
  email,
  rollnumber,
  password,
  AnsiTemplate,
  s3Url
) => {
  try {
    const response = await axios.post("http://localhost/api/v1/users", {
      email,
      rollnumber,
      password,
      fingerprintKey: AnsiTemplate,
      fingerprintUrl: s3Url,
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
